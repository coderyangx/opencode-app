# kuaida「查询项目等级为 A 的数量」完整数据流转（**NL2Python**）

## 阶段 0：入口初始化

```
HTTP 请求
  → 构建 runtimeContext
     • tenant = "kuaida"
     • datasource.view = <当前视图 code>
     • datasource.appId
     • secrets.SSO_ID / DATA_AGENT_APP_SECRET
     • threadId, workflowMode
  → TableChatOperationWorkflow.stream(msg, { runtimeContext })
```

`TableChatOperationWorkflow.stream` 根据 `tenant` 选择路由目标 workflow：

- kuaida 不是 levi/ba → 不走 BA 转发
- kuaida 不是 xtable/doc/km → 选择 `reactWorkflow`（默认）或 `planningExecutionWorkflow`（plan 模式）

```
routes = { planning_execute_agent: reactWorkflow }
```

---

## 阶段 1：主路由 Agent 分发（tableChatAgent）

### 1.1 动态生成 system prompt

`tableChatAgent.instructions` 执行时，先拉取 kuaida 视图 schema：

```
createDataSourceService(ctx).getDataSchema({ format: "json" })
  → NL2SQLDataService.#getAllDatasources()
     • tenant=kuaida 且 config.view 存在
     → datasources = [{ type: "kuaida", kuaida: { appId, view } }]
  → kuaidaPreset.getSchema(ctx, { datasource })
     • 有 DATA_AGENT_APP_SECRET 且无 SSO_ID → openFormFetch（开放接口）
       POST /open-apis/kuaida/view/detailByApp { viewCode }
     • 否则 → formFetch（SSO Cookie）
       GET  /api/zeroconsole/view/showInfo/{view}
  → 解析返回的 schema JSON，按字段前缀映射列：
     select_  → string + enum_values（如"项目等级"单选列）
     number_  → number
     date_    → timestamp
     people_  → user
     ...
  → 返回 { tables: [{ name: viewCode, columns: [...], _source_info }] }
```

schema JSON 化后注入 system prompt，连同角色规则（"你是分发入口，只做意图判定和工具调用"）一起构成 `tableChatAgent` 的 instructions。

### 1.2 LLM 意图判定

```
tableChatAgent.stream(msg)
  → LLM 输入：system(instructions) + user("查询项目等级为A的数量")
  → LLM 判定：属于数据查询意图
  → 调用工具 planning_execute_agent
     参数：
       user_query: "查询kuaida当前视图下的项目等级为A的数量"
       intended_datasets: ["<viewCode>"]
       enableReport: false
```

### 1.3 拦截工具调用，移交 workflow

`#stream` 内的 TransformStream 拦截 `tool-input-available` chunk：

```
识别 toolName = "planning_execute_agent" ∈ routes
  → nextPayload = { user_query, intended_datasets, enableReport }
  → #handoffRoute(reactWorkflow, { inputData: nextPayload, runtimeContext })
     • ctx.set("intendedTables", intended_datasets)
     • ctx.set("language", "中文")
  → #executeWorkflow(reactWorkflow)
     → workflow.createRunAsync()
     → run.start({ inputData, runtimeContext, writableStream })
```

---

## 阶段 2：reactWorkflow 执行

```
reactWorkflow:
  .then(prepareDataStep)          ← 数据准备
  .dowhile(loopStep, condition)   ← ReAct 循环
  .then(summaryStep)              ← 总结输出
```

### 2.1 prepareDataStep：数据准备

```
① 创建沙箱
   createSandbox() → runtimeContextStorage.set("sandbox", sandbox)

② 加载历史 artifact 并降级
   ArtifactManager.fromSession(threadId)
   → 非本次 messageId 产生的旧 artifact 权重 ×0.5

③ 拉取表结构
   dataSvc.getDataSchema() → tables (单表，来自 kuaidaPreset)

④ 过滤活跃表
   activeTables = tables.filter(t => intendedTables.includes(t.name))
   （单表场景直接用该表）

⑤ 串行拉取全量数据
   for item in activeTables:
     dataSvc.getTableData(table)
       → kuaidaPreset.getData(table, ctx)
         → getFormRecords(ctx, columnNames)
           • 分页拉取：每页 100，最多 10w 条
             POST /api/zeroconsole/view/data/list { pageNo, pageSize, viewCode }
             或 POST /open-apis/kuaida/view/listByApp
           • totalCount > 100000 → 抛错引导缩小视图
           • 10 分钟缓存
           • formatDataRow 格式化每行
       → 返回 { rows: AoA, columns, size, profile }

⑥ 构建 DatasetArtifact
   artifactManager.addArtifact({
     type: "dataset/json",
     asset_key: viewCode,
     metadata: { rawSchema, columns, rowsCount, sampleData, profile },
     data: [headers, ...rows],
     scope: "workflow"
   })

⑦ Python 数据画像（沙箱内）
   getDatasetProfileByPython(artifact, ctx)
   → 更新 artifact.metadata.profile

⑧ 标记 dataPrepared = true
   → 流式输出 "数据准备完成"
   → 返回 { user_query, enableReport }
```

### 2.2 loopStep：ReAct 循环（核心）

循环条件：`reActStepType` 不以 `final_` 开头则继续。

#### 每轮结构：思考（generate）+ 行动（execute）

```
┌─────────────────────────────────────────────────┐
│  第 N 轮 loopStep                                │
│                                                  │
│  ① 构造 prompt（user message）                   │
│     • 用户原始问题                                │
│     • 历史 observations（第1轮为空）               │
│     • 相关 DatasetArtifact.describe()            │
│                                                  │
│  ② agent.generate(prompt)                        │
│     • system = analysisReActPlannerAgent         │
│       .instructions()（角色规则+输出schema+编码规范）│
│     • user  = prompt                             │
│     • output = reActPlannerOutputSchema          │
│     • maxSteps = 1（单次 LLM 调用）               │
│     • 失败重试 ≤3 次（experimentalRepairText）     │
│                                                  │
│  ③ 解析输出 output:                               │
│     { thought_process, action_type, step_name,   │
│       python_code?, dynamic_plan?, answer? }     │
│                                                  │
│  ④ 根据 action_type 分支：                        │
│     ├─ run_code → 执行 Python                    │
│     ├─ search_web → 联网搜索                      │
│     └─ final_answer → 返回结论，退出循环           │
└─────────────────────────────────────────────────┘
```

#### ReAct 循环机制说明

> **关键点**：ReAct 循环不在 Agent 内部实现，而是由 workflow 的 `dowhile(loopStep)` 在外部驱动。

- `maxSteps: 1`：`analysisReActPlannerAgent` 每次 `generate` 只做一次 LLM 调用，不内部多轮。它是一个“单步规划器”，只输出**一步**决策。
- `dowhile(loopStep, condition)`：真正的 ReAct 循环驱动器，`condition` 为 `reActStepType` 不以 `final_` 开头则继续。
- `generateWithRetry(3)`：仅修复单次 `generate` 的 JSON 解析失败，与循环无关。
- `observations[]`：ReAct 的“记忆”，每轮拼入 prompt，Agent 本身无状态。
- 终止条件：`action_type === "final_answer"`（正常）或 prompt 里“最大10轮”软约束（靠 LLM 自觉收敛）。

#### 本 query 的典型 2 轮执行

**第 1 轮：run_code**

````
prompt:
  ## 用户问题
  查询kuaida当前视图下的项目等级为A的数量

  ## 已收集的事实 (Observations)
  暂无 (当前是第一步)

  ## 相关数据集表格
  <DatasetArtifact 描述：列名、类型、样本>

agent.generate → output:
  thought_process: "需要统计项目等级列中值为A的记录数..."
  action_type: "run_code"
  step_name: "统计A等级数量"
  python_code: |
    df = read_dataset("<viewCode>")
    count_a = (df['select_xxxxx'] == 'A').sum()
    print(f"项目等级为A的数量: {count_a}")

执行：
  runCode(python_code)
    → CODE_TEMPLATE_FACTORY_PURE 包装代码
    → analysisDataTool.execute({ code })
       → sandbox 内执行
    → 流式推送：
        text-delta: ```python\n<code>\n```
        tool-input-start / tool-output-available
    → observation = stdout = "项目等级为A的数量: 42"
    → observations.push({ taskId, observation, thought })
    → runtimeContextStorage.set("observations", observations)

reActStepType = "run_code" → 不以 final_ 开头 → 继续
````

**第 2 轮：final_answer**

```
prompt:
  ## 用户问题
  查询kuaida当前视图下的项目等级为A的数量

  ## 已收集的事实 (Observations)
  【观查 1】
  项目等级为A的数量: 42

  ## 相关数据集表格
  ...

agent.generate → output:
  thought_process: "已获得A等级数量为42，信息充分，可以回答"
  action_type: "final_answer"
  answer: "当前视图下项目等级为 A 的数量为 **42** 个。"

返回 { result: answer, enableReport: false }
reActStepType = "final_answer" → 以 final_ 开头 → 退出循环
```

### 2.3 summaryStep：输出最终答案

```
loopStep 返回 { result: "当前视图下项目等级为 A 的数量为 **42** 个。" }

summaryStep:
  → writer.write(data-workflow-part-start, stage: "final")
  → writer.write(text-delta, delta: result)
  → writer.write(data-workflow-part-end, stage: "final")
  → 返回 { result }
```

---

## 阶段 3：流式回写 + 持久化

```
workflow chunk（writableStream）
  → controller.enqueue 到 routeStreamController
  → mergeStreams 合并 tableChatAgent 的 chatStream
  → tee 分流：
     ├─ s1 → TransformStream（处理 workflow-part/error/finish）
     │        → 返回前端 ReadableStream<UIMessageChunk>
     │
     └─ s2 → readUIMessageStream
              → MessageSaverWritableStream
              → 持久化到数据库（threadId/messageId）
```

workflow 结束后：

```
#executeWorkflow 收尾：
  → run.status !== "suspended"
  → controller.enqueue({ type: "data-workflow-end" })
  → 打 ai.workflowEnd trace span（status: success/fail）
  → controller.enqueue({ type: "finish" })
  → controller.close()
```

---

## 完整数据流总览图

```
用户输入
  │
  ▼
TableChatOperationWorkflow.stream
  │
  ├─ tableChatAgent（路由 Agent）
  │    │
  │    ├─ instructions: 动态拉 kuaida 视图 schema → system prompt
  │    └─ LLM 判定 → 调用 planning_execute_agent 工具
  │         │
  │         ▼  拦截 tool-input-available
  │    #handoffRoute(reactWorkflow)
  │
  ▼
reactWorkflow
  │
  ├─ prepareDataStep
  │    ├─ createSandbox
  │    ├─ getDataSchema（kuaida 视图结构）
  │    ├─ getTableData → getFormRecords（分页拉全量）
  │    ├─ 构建 DatasetArtifact + Python 画像
  │    └─ 返回 { user_query, enableReport }
  │
  ├─ loopStep × N（dowhile）
  │    │
  │    ├─ 第1轮: generate(run_code) → 沙箱执行 Python → observation="42"
  │    │
  │    └─ 第2轮: generate(final_answer) → answer="A等级数量为42"
  │              └─ reActStepType=final_answer → 退出循环
  │
  ├─ summaryStep
  │    └─ 流式输出最终答案
  │
  ▼
流式回写前端 + MessageSaver 持久化
  │
  ▼
finish
```

---

## 关键数据载体

| 载体                    | 位置                  | 作用                                                  |
| ----------------------- | --------------------- | ----------------------------------------------------- |
| `runtimeContext`        | 全程传递              | 携带 tenant/view/secrets/threadId/intendedTables      |
| `runtimeContextStorage` | workflow 内 ALS       | 存 sandbox/observations/artifactManager/reActStepType |
| `DatasetArtifact`       | ArtifactManager       | 原始数据集 AoA + schema + profile                     |
| `observations[]`        | runtimeContextStorage | ReAct 的"记忆"，每轮拼入 prompt                       |
| `reActStepType`         | runtimeContextStorage | dowhile 循环终止判断依据                              |
| `UIMessageChunk` 流     | controller/writer     | 流式推送给前端 + 持久化                               |

```

```
