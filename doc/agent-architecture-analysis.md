# 快搭 Agent 架构分析（Master 分支 · 基于 Mastra 框架）

> 分支：`master` | 核心依赖：`@jimu/data-agents@0.9.1-alpha.20`（基于 Mastra 框架）| 对比基准：`release/0811`（v3 自研架构）

---

## 一、整体架构概览

### 1.1 架构分层

```
┌─────────────────────────────────────────────────────────┐
│                    前端 (widgets)                         │
│        useChat / useCompletion (ai SDK v5)               │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (Data Stream Protocol)
┌──────────────────────▼──────────────────────────────────┐
│              Hono Server (packages/server)               │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Chat Controller (createUIMessageStream)         │    │
│  │  ├── RuntimeContext 初始化                       │    │
│  │  ├── Memory (thread 管理)                        │    │
│  │  └── TableChatOperationWorkflow                  │    │
│  └──────────────────────┬──────────────────────────┘    │
│                         │                               │
│  ┌──────────────────────▼──────────────────────────┐    │
│  │     @jimu/data-agents (Mastra 框架封装)          │    │
│  │  ├── Mastra 实例 (agents + workflows 注册)       │    │
│  │  ├── TableChatOperationWorkflow (路由编排层)      │    │
│  │  │   ├── tableChatAgent (路由分发 Agent)          │    │
│  │  │   └── 子工作流路由                             │    │
│  │  ├── 子工作流                                     │    │
│  │  │   ├── reactWorkflow (ReAct 模式)              │    │
│  │  │   ├── planningExecutionWorkflow (规划模式)     │    │
│  │  │   ├── xtableDuplexReActWorkflow               │    │
│  │  │   ├── xtableDuplexPlanWorkflow                │    │
│  │  │   └── singleAgentWorkflow                     │    │
│  │  ├── DataSource 体系 (preset + executor)         │    │
│  │  ├── Artifact 产物管理                           │    │
│  │  └── Storage (SQL + KV)                          │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  异步任务系统 (kdflow 集成)                       │    │
│  │  ├── AgentTaskManager (任务池 + 并发控制)         │    │
│  │  ├── AgentTaskRunner (任务执行器)                 │    │
│  │  └── DataAnalysisAgentCaller (workflow 包装)      │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 1.2 核心设计理念

1. **包分离架构**：所有 Agent 逻辑封装在 `@jimu/data-agents` npm 包中，server 仅负责 HTTP 层和运行时上下文注入
2. **Mastra 框架**：使用 `@mastra/core` 的 Agent/Workflow/RuntimeContext 原语，获得框架级的状态管理、流式输出、遥测能力
3. **路由 Agent 范式**：不使用 Mastra 原生的 workflow 嵌套（有 stream 续传 bug），而是自研"主 Agent 路由 + 平行子 workflow"范式
4. **多模式适配**：通过 `tenant`（租户）+ `workflowMode`（工作流模式）二维参数路由到不同执行路径

---

## 二、执行流程详解

### 2.1 请求入口（`controllers/chat.ts`）

```typescript
// 1. 创建 UIMessageStream
const result = createUIMessageStream({
  originalMessages: uiMessages,
  async execute(dataStream) {
    // 2. 实例化主工作流
    const workflow = new presets.TableChatOperationWorkflow({
      timeoutInSeconds: 60 * 15 // 15分钟超时
    });
    // 3. 启动流式执行
    const stream = await workflow.stream(lastMessage, {
      runtimeContext: runContext,
      resumeData: confirmation
    });
    // 4. 透传 chunk 到前端
    for await (const chunk of stream) {
      dataStream.writer.write(chunk);
    }
  }
})
  .pipeThrough(/* TransformStream - Cat 监控 */)
  .pipeThrough(/* KeepAliveTransformStream - 心跳保活 */);
```

**关键上下文初始化**（`runContext`）：

| 字段           | 说明                                                        |
| -------------- | ----------------------------------------------------------- |
| `tenant`       | 租户标识：`kuaida`/`xtable`/`levi`/`ba`/`km`/`doc`/`kdflow` |
| `workflowMode` | `agent`（ReAct）或 `plan`（规划执行）                       |
| `models`       | 各 Agent 的模型映射，支持 Lion 动态配置                     |
| `datasource`   | 数据源配置（view/appId/xtables/files）                      |
| `secrets`      | SSO_ID、FRIDAY_API_KEY、SANDBOX_KEY、S3_KEYS 等             |
| `systems`      | 技能注入的自定义 system 指令                                |
| `traceId`      | Langfuse 追踪 ID                                            |

### 2.2 TableChatOperationWorkflow 路由逻辑

```typescript
async stream(msg, options) {
  const tenant = options.runtimeContext.get("tenant");

  // 1. Levi/BA 租户：直接转发到 BA 开放接口
  if (tenant === "levi") return this.#streamByBA(msg, options);
  if (tenant === "ba") return this.#streamByBA(msg, options, true);

  // 2. 根据租户 + 模式选择子工作流
  let workflow;
  if (tenant === "xtable" || tenant === "doc" || tenant === "km") {
    workflow = mode === "agent"
      ? mastra.getWorkflowById("xtableDuplexReActWorkflow")
      : mastra.getWorkflowById("xtableDuplexPlanWorkflow");
  } else {
    // kuaida / kdflow
    workflow = mode === "plan"
      ? mastra.getWorkflowById("planningExecutionWorkflow")
      : mastra.getWorkflowById("reactWorkflow");
  }

  this.#routes = { planning_execute_agent: workflow };
  return this.#stream(msg, options); // 进入路由分发
}
```

### 2.3 路由分发机制（`#stream`）

核心是 **tableChatAgent 作为路由 Agent**，通过 tool call 实现子工作流 handoff：

```
用户消息 → tableChatAgent.stream()
                │
                ├── 流式输出 text chunk → 前端
                │
                ├── 检测到 tool-input-start (planning_execute_agent)
                │     │
                │     ├── 拦截路由 tool chunk（不发给前端）
                │     ├── 收集 tool 参数（user_query, intended_datasets）
                │     └── 参数就绪 → #handoffRoute()
                │           │
                │           └── 子工作流.createRunAsync().start()
                │                 │
                │                 └── 流式 chunk → routeStreamController → 前端
                │
                └── finish → 关闭路由流
```

**关键技术点**：

- 使用 `mergeStreams` 将 Agent 流和子工作流流合并
- `readUIMessageStream` + `MessageSaverWritableStream` 实现消息自动持久化
- `CustomWorkflowExecutionEngine` 修复 Mastra resume 模式下 writableStream 丢失问题

### 2.4 ReAct 工作流（reactWorkflow · 默认模式）

```
prepareDataStep → loopStep (dowhile) → summaryStep
```

#### prepareDataStep（数据准备）

1. 创建 Python 沙箱（`@sandbox/code-interpreter`）
2. 调用 `NL2SQLDataService.getDataSchema()` 获取表结构
3. 为每个表创建 `DatasetArtifact`（原始数据集，带 rawSchema 标记）
4. 存入 `ArtifactManager`（KV 存储，7天 TTL）

#### loopStep（ReAct 循环）

每轮循环由 `analysisReActPlannerAgent` 生成 JSON 决策：

```json
{
  "thought_process": "推理过程",
  "action_type": "run_code | search_web | final_answer | final_report",
  "step_name": "步骤名",
  "python_code": "Python 代码（run_code 时）",
  "answer": "最终答案（final_answer 时）",
  "dynamic_plan": ["待办事项"]
}
```

- **Observe**：读取上一轮的 `observations`（代码执行 stdout/stderr）
- **Reason**：`analysisReActPlannerAgent.generate()` 生成决策
- **Act**：根据 `action_type` 分发到对应 Agent
  - `run_code` → `runCodeAgent` + `analysisDataTool`（MCP 沙箱执行）
  - `search_web` → `searchSpecialistAgent`
  - `final_answer` → 直接返回，进入 summaryStep
  - `final_report` → `pythonAnalysisReportAgent`

循环终止条件：`action_type` 以 `final_` 开头。

#### summaryStep（总结）

- 无 `final_answer` 时，使用 `generalSummaryAgent` 或 `pythonAnalysisReportAgent` 生成最终报告

### 2.5 规划执行工作流（planningExecutionWorkflow · 规划模式）

```
prepareDataStep → planningStep → executeStep → summaryStep
```

#### planningStep（规划）

- 使用 `PlanningManager` + `planningAgent`（支持 DeepSeek thinking 模式）
- `PlanningManager` 状态机：`idle → initial_planning → reviewing → re_planning → terminated`
- 流式解析 `NEXT_ACTION:xxx` + JSON 块，支持 `createInitialPlan`/`revisePlan`/`terminatePlan`
- 支持 **checkpoint 断点机制**：标记断点的任务执行完后暂停，基于真实结果重新规划

#### executeStep（并行执行）

- `ParallelExecutorsManager` 管理并行任务执行
- 基于 DAG 依赖关系调度：依赖全部成功后才执行
- `StrictGroupQueue` 优先级队列保证消息按任务顺序输出（虽然任务并行）
- `write_table` 类型任务会阻塞后续任务（Human-in-the-loop 安全）
- checkpoint 任务完成后触发 `#replan()`

### 2.6 xtable 双工工作流

针对学城多维表格场景，支持表格读写操作：

- **xtableDuplexReActWorkflow**：ReAct 模式，使用 `xtableDuplexReActPlannerAgent`
- **xtableDuplexPlanWorkflow**：规划模式，使用 `xtableDeepAgent`

状态通过 `workflowState.xtableDuplexReActWorkflow` 在 RuntimeContext 中传递。

---

## 三、核心组件分析

### 3.1 Agent 清单

| Agent                           | 职责                                                       | 默认模型              |
| ------------------------------- | ---------------------------------------------------------- | --------------------- |
| `tableChatAgent`                | 路由分发入口，识别意图并调用 `planning_execute_agent` 工具 | DeepSeek-V3.2-Meituan |
| `planningAgent`                 | 任务规划，支持 thinking + checkpoint                       | DeepSeek-V3.2-Meituan |
| `analysisReActPlannerAgent`     | ReAct 循环决策器                                           | LongCat-Flash-Chat    |
| `planningReviewAgent`           | 规划评审                                                   | -                     |
| `generalSummaryAgent`           | 总结生成（工具模式，调 generate-chart）                    | LongCat-Flash-Chat    |
| `generalPythonSummaryAgent`     | 总结生成（Python 模式，InterpreterAgent）                  | LongCat-Flash-Chat    |
| `analysisReportAgent`           | 深度报告生成                                               | -                     |
| `pythonAnalysisReportAgent`     | Python 深度报告（InterpreterAgent）                        | -                     |
| `structuredAnalysisAgent`       | 确定性数学统计计算                                         | -                     |
| `textAnalysisAgent`             | 文本聚类分类                                               | -                     |
| `searchSpecialistAgent`         | 联网搜索                                                   | -                     |
| `runCodeAgent`                  | 代码执行包装                                               | -                     |
| `writeTableSpecialistAgent`     | 表格读写操作                                               | -                     |
| `extractChartsAgent`            | 图表提取                                                   | -                     |
| `codeFixingAgent`               | 代码修复                                                   | -                     |
| `xtableDuplexReActPlannerAgent` | xtable ReAct 规划                                          | -                     |
| `xtableDeepAgent`               | xtable 深度规划                                            | -                     |

### 3.2 数据源体系

```typescript
// NL2SQLDataService 统一数据服务
class NL2SQLDataService {
  #getAllDatasources() {
    // 根据 tenant + config 聚合数据源
    // 支持: file（Excel）、xtable（多维表格）、kuaida（快搭视图）
    // 支持多数据源（enableMultiDatasources）
  }

  getDataSchema() {
    // 遍历所有数据源，调用 preset.getSchema()
    // 表名去重、添加 asset_key
  }

  getTableData(table) {
    // 调用 preset.getData() 获取实际数据
  }
}
```

**Preset 体系**：

- `kuaida` preset → 快搭 API 数据获取
- `xtable` preset → 学城多维表格 API
- `file` preset → Excel 文件解析

### 3.3 Artifact 产物管理

```
ArtifactManager (session 级，KV 存储 backed)
├── dataset/json  → DatasetArtifact（数据集，含 DataFrame）
├── text/summary  → SummaryArtifact（文本洞察）
└── plot/image    → PlotArtifact（图表图片）
```

**核心特性**：

- **权重机制**：`weight > 0.5` 的产物才会跨轮次持久化，避免历史产物膨胀
- **Producer/Consumer 追踪**：记录每个产物由哪个任务产生，支持依赖链回溯
- `getTaskUpstreamArtifacts(task)` 获取任务上游所有产物
- `adjustArtifactWeights` 在数据准备阶段衰减历史产物权重

### 3.4 流式输出架构

使用 **ai SDK v5 的 Data Stream Protocol**（UIMessageChunk）：

```
流式 chunk 类型：
├── start / finish            → 流开始/结束
├── start-step / finish-step  → 步骤开始/结束
├── text-start / text-delta / text-end → 文本流式
├── tool-input-start / tool-input-available / tool-output-available → 工具调用
├── data-workflow-start / data-workflow-end → 工作流开始/结束
├── data-workflow-part-start / data-workflow-part-end → 工作流阶段
├── data-conversationId       → 会话 ID
├── data-ping                 → 心跳保活
├── message-metadata          → 消息元数据（dbId, traceId）
└── error                     → 错误
```

**流处理管道**：

```
workflow.stream()
  → mergeStreams (Agent流 + 子工作流流)
  → readUIMessageStream (chunk → UIMessage)
  → MessageSaverWritableStream (持久化到 Mastra Storage)
  → WorkflowMessageTransformStream (工作流消息转换)
  → ErrorTrackerTransformStream (错误追踪)
  → KeepAliveTransformStream (10s 心跳)
  → createUIMessageStreamResponse → 前端
```

### 3.5 异步任务系统（kdflow 集成）

用于工作流编排平台（kdflow）的异步 Agent 调用场景：

```
AgentTaskManager
├── TaskPool (5 并发，20s 获取令牌超时，5分钟执行超时)
├── submitTask(request) → 创建 DB 记录 + 入队
├── #consumeNextTask() → 获取令牌 → 更新状态 → runner.start()
├── subscribeStream(taskId) → 订阅 runner 的 data 事件
└── resumeTasks() → 机器重启后恢复未完成任务

AgentTaskRunner
├── DataAnalysisAgentCaller (包装 TableChatOperationWorkflow)
├── #handleMessage() → 透传 UIMessage chunk
├── #handleResult() → 结构化输出（generateObject）
├── #finalizeResult() → JSON Schema 约束输出
└── pushNotification() → STS 签名回调 kdflow
```

---

## 四、与 V3（release/0811）版本对比

### 4.1 架构层面对比

| 维度           | V3 (release/0811)                                | Master (Mastra)                                              |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| **框架**       | 完全自研，无框架依赖                             | 基于 Mastra 框架 + `@jimu/data-agents` 包                    |
| **代码组织**   | 所有 Agent 逻辑在 server 内                      | Agent 逻辑抽取为独立 npm 包                                  |
| **入口 Agent** | `ChatAndClarifyAgent`（自研）                    | `tableChatAgent`（Mastra Agent）                             |
| **编排器**     | `AnalysisOrchestrator`（EventEmitter）           | `TableChatOperationWorkflow`（Mastra Workflow + 自定义路由） |
| **工作流引擎** | 自研任务 DAG + `AgentTaskManager`                | Mastra Workflow + `CustomWorkflowExecutionEngine`            |
| **流式协议**   | ai SDK v4 `formatDataStreamPart`（`0:"text"\n`） | ai SDK v5 UIMessageChunk（Data Stream Protocol）             |
| **消息存储**   | 自研 `StreamMessageSaver` + MySQL                | `@mastra/memory` + `MessageSaverWritableStream` + ZebraSQL   |
| **会话记忆**   | `SessionMemory`（LRU Cache）                     | `@mastra/memory`（SQL-backed，支持跨进程）                   |
| **遥测**       | 自研 Langfuse 集成                               | Mastra Telemetry + OpenTelemetry + Langfuse exporter         |

### 4.2 Agent 体系对比

| 维度                | V3                                                      | Master                                                                   |
| ------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Agent 定义**      | 手写 class，继承 EventEmitter                           | Mastra `Agent` 原语，声明式 `instructions`/`model`/`tools`               |
| **模型选择**        | 硬编码在 Agent 内                                       | `runtimeContext.get("models")` 动态映射，支持 Lion 配置热更新            |
| **Memory 处理器**   | 无                                                      | `SkillTextInjectMessageProcessor` + `DataContextControlMessageProcessor` |
| **System 指令**     | 静态字符串                                              | 动态生成（`async instructions({ runtimeContext })`），注入数据 schema    |
| **工具定义**        | 自研 tool 接口                                          | Mastra `createTool` + Zod schema                                         |
| **专业 Agent 数量** | ~5 个（planning/analysis/summarizing/evaluate/clarify） | ~20 个（含 specialist 系列）                                             |

### 4.3 工作流模式对比

| 维度               | V3                                                       | Master                                                                     |
| ------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| **执行模式**       | 单一模式（Plan → Execute → Summarize）                   | 双模式：`agent`（ReAct）/ `plan`（规划执行）                               |
| **ReAct 支持**     | `analysis-react/` 独立模块                               | `reactWorkflow` 原生集成，与规划模式共享 prepareData/summary               |
| **并行执行**       | `maxConcurrency: 1`（串行）                              | `ParallelExecutorsManager` 支持 DAG 并行 + `StrictGroupQueue` 顺序输出     |
| **重规划**         | `evaluate.ts` 评审模块（`maxEvaluationRound: 0` 未启用） | `PlanningManager` 支持 checkpoint 断点 + `revisePlan` 动态重规划           |
| **xtable 支持**    | 作为 preset 处理                                         | 专属双工工作流（`xtableDuplexReAct/PlanWorkflow`）                         |
| **Levi/BA 支持**   | 无                                                       | `#streamByBA` 直接转发 BA 开放接口                                         |
| **suspend/resume** | 无                                                       | Mastra Workflow 原生 suspend/resume + `CustomWorkflowExecutionEngine` 修复 |

### 4.4 数据查询对比

| 维度           | V3                                   | Master                                                        |
| -------------- | ------------------------------------ | ------------------------------------------------------------- |
| **查询方式**   | DSL → SQL → alasql 本地执行          | Python 沙箱 + `read_dataset()` + pandas                       |
| **NL2SQL**     | `nl-query-data.ts`（NL → DSL → SQL） | 不再使用 NL2SQL，改为 NL → Python 代码                        |
| **查询引擎**   | `LocalQueryEngine`（alasql）         | Python 沙箱（`@sandbox/code-interpreter` MCP）                |
| **数据源抽象** | `datasource/presets/` + `executors/` | `datasource/presets/` + `executors/`（迁移到 data-agents 包） |
| **多表支持**   | 单表为主                             | `enableMultiDatasources` 多表聚合                             |

### 4.5 产物管理对比

| 维度           | V3                    | Master                                              |
| -------------- | --------------------- | --------------------------------------------------- |
| **产物类型**   | answer/report（文本） | `dataset/json` + `text/summary` + `plot/image`      |
| **存储**       | S3 + 内存             | KV 存储（7天 TTL）+ S3                              |
| **权重机制**   | 无                    | `weight` 权重衰减，历史产物自动降权                 |
| **依赖链**     | 无显式追踪            | Producer/Consumer 追踪 + `getTaskUpstreamArtifacts` |
| **数据集复用** | 不支持                | `read_dataset(asset_key)` 跨步骤复用                |

### 4.6 可观测性对比

| 维度             | V3                         | Master                                               |
| ---------------- | -------------------------- | ---------------------------------------------------- |
| **Tracing**      | Langfuse（自定义 wrapper） | Mastra Telemetry + OpenTelemetry + Langfuse exporter |
| **指标**         | Cat（自定义埋点）          | Cat + Mastra 内置 Raptor Metrics                     |
| **Span 粒度**    | Agent 级别                 | Agent / Tool / Workflow / Step 多级别                |
| **Baggage 传播** | 手动                       | Mastra `getBaggageTracer()` 自动传播                 |

---

## 五、核心优化点总结

### 5.1 架构解耦

**V3 问题**：所有 Agent 逻辑耦合在 server 仓库，难以跨项目复用。

**Master 优化**：抽取 `@jimu/data-agents` 独立包，server 仅负责 HTTP 层和上下文注入。其他项目（如 levi、BA）可直接引入该包，零成本复用 Agent 能力。

### 5.2 流式输出标准化

**V3 问题**：使用 ai SDK v4 的 `formatDataStreamPart`，格式为 `0:"text"\n2:{...}\n`，非标准 SSE，前端需特殊处理。

**Master 优化**：升级到 ai SDK v5 的 `UIMessageChunk` + `createUIMessageStream`，遵循 Data Stream Protocol 标准，前端使用 `useChat` 即可消费，且支持 `data-*` 类型自定义 chunk（如 `data-workflow-part-start`）。

### 5.3 并行任务执行

**V3 问题**：`maxConcurrency: 1`，所有任务串行执行，复杂分析耗时长。

**Master 优化**：`ParallelExecutorsManager` 基于 DAG 依赖图并行执行无依赖任务，同时 `StrictGroupQueue` 保证消息按任务提交顺序输出，兼顾并行效率和前端展示有序性。

### 5.4 动态重规划

**V3 问题**：`evaluate.ts` 评审模块存在但 `maxEvaluationRound: 0` 未启用，规划一次定死。

**Master 优化**：`PlanningManager` 支持 **checkpoint 断点机制**：

- 规划阶段标记需要事实校验的任务为 checkpoint
- 该任务执行完后暂停，基于真实结果调用 `revisePlan` 动态生成后续任务
- 避免"基于假设的错误规划"传播

### 5.5 产物权重与复用

**V3 问题**：中间数据无管理，每次重新查询。

**Master 优化**：

- `ArtifactManager` 管理全生命周期产物
- `weight` 权重机制：新一轮对话自动衰减历史产物（< 0.5 不再注入上下文）
- `read_dataset(asset_key)` 支持跨步骤、跨轮次数据集复用
- Python 代码可直接 `read_dataset("xxx")` 加载前序步骤产出的 DataFrame

### 5.6 消息持久化与恢复

**V3 问题**：`SessionMemory` 基于 LRU Cache，进程重启丢失。

**Master 优化**：

- `@mastra/memory` + ZebraSQL 存储，跨进程持久化
- `MessageSaverWritableStream` 流式写入，不阻塞主流程
- Workflow suspend/resume 支持人工确认后继续执行
- `CustomWorkflowExecutionEngine` 修复 Mastra resume 的 writableStream 丢失 bug

### 5.7 多租户与多模式适配

**V3 问题**：单一执行路径，无法适配不同业务场景。

**Master 优化**：`tenant` × `workflowMode` 二维路由矩阵：

|                   | agent 模式                       | plan 模式                 |
| ----------------- | -------------------------------- | ------------------------- |
| **kuaida/kdflow** | reactWorkflow                    | planningExecutionWorkflow |
| **xtable/km/doc** | xtableDuplexReActWorkflow        | xtableDuplexPlanWorkflow  |
| **levi**          | BA 转发（full 模式）             | -                         |
| **ba**            | BA 转发（delta 模式 + 消息存储） | -                         |

### 5.8 模型动态配置

**V3 问题**：模型硬编码在 Agent 类内。

**Master 优化**：

```typescript
model: ({ runtimeContext }) => {
  const models = ctx.get('models') || {};
  const modelName = models['tableChatAgent'] || 'deepseek-v31-meituan';
  return getLanguageModel(modelName, ctx);
};
```

- 通过 Lion 配置中心动态下发模型映射
- 每个 Agent 可独立配置模型
- 支持 DeepSeek / LongCat / Qwen / Gemini 多提供商

### 5.9 异步任务与推送

**V3 问题**：无异步任务能力，仅支持同步 HTTP 流。

**Master 优化**：

- `AgentTaskManager` + `TaskPool` 支持异步任务队列
- `DataAnalysisAgentCaller` 包装 workflow 为异步任务
- STS 签名回调 kdflow 工作流平台
- 机器重启后 `resumeTasks()` 自动恢复未完成任务
- 支持结构化 JSON 输出（`generateObject` + Zod schema）

### 5.10 安全增强

**Master 新增**：

- `prompt-injection.ts` 提示词注入检测（LongCat-Flash-Chat 模型）
- `authorizationMiddleware` 横向越权校验（conversationId 归属校验）
- `seq` 范围校验 + password 注入风险修复
- Botchat LLM 提示词注入检测

---

## 六、运行时设计总结

### 6.1 运行时上下文（RuntimeContext）

使用 Mastra 的 `RuntimeContext` + `AsyncLocalStorage`（`runtimeContextStorage`）实现请求级上下文隔离：

```typescript
// context/general.ts
export type GeneralRuntimeContextValues = {
  // 环境
  env;
  appKey;
  secrets;
  tenant;
  datasource;
  // 用户
  user;
  userId;
  userMis;
  language;
  searchWeb;
  // 模型
  models;
  systems;
  // 会话
  threadId;
  messageId;
  traceId;
  customTraceMetadata;
  // 工作流
  workflowMode;
  intendedTables;
  usedTables;
  planningState;
  reActState;
  workflowState;
  cancelledTasks;
  executions;
  // 其他
  enableRaptorMetrics;
  datasetApi;
  spaceId;
};
```

### 6.2 存储层

| 存储              | 用途                     | 实现                     |
| ----------------- | ------------------------ | ------------------------ |
| ZebraSQL          | 消息/会话持久化          | `@mastra/memory` backend |
| KVStorage         | Artifact 产物 + 临时数据 | 自研（server 注入）      |
| MySQL (db-remote) | 异步任务记录             | TypeORM                  |
| SQLite (db)       | 评测任务                 | TypeORM                  |
| S3                | 数据集/图表文件          | `@dp/sts_node`           |

### 6.3 沙箱执行

- 使用 `@sandbox/code-interpreter` MCP 服务执行 Python 代码
- 无状态函数式沙箱，每次执行独立进程
- 内置全局函数：`read_dataset`、`log_dataset_artifact`、`log_plot_artifact`
- `CODE_TEMPLATE_FACTORY` 包装用户代码为完整可执行模板

---

## 七、关键文件索引

### Server 侧

| 文件                                                   | 职责                                           |
| ------------------------------------------------------ | ---------------------------------------------- |
| `packages/server/src/index.ts`                         | Hono 服务启动，Mastra storage/telemetry 初始化 |
| `packages/server/src/controllers/chat.ts`              | HTTP Chat 入口，RuntimeContext 构建            |
| `packages/server/src/lib/task/manager.ts`              | 异步任务管理器（kdflow）                       |
| `packages/server/src/lib/task/runner.ts`               | 异步任务执行器                                 |
| `packages/server/src/lib/task/agents/data-analysis.ts` | workflow 包装为异步 Caller                     |
| `packages/server/src/ai/trace/langfuse.ts`             | Langfuse + OpenTelemetry 追踪                  |
| `packages/server/src/ai/skills/index.ts`               | 技能定义                                       |
| `packages/server/src/services/kv.ts`                   | KV 存储实现                                    |

### data-agents 包侧

| 文件                                                                    | 职责                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------- |
| `src/index.ts`                                                          | 包导出（mastra/context/presets/services/storage） |
| `src/mastra/index.ts`                                                   | Mastra 实例 + Agent/Workflow 注册                 |
| `src/mastra/workflows/table-chat-workflow/index.ts`                     | TableChatOperationWorkflow 主编排器               |
| `src/mastra/workflows/table-chat-workflow/react-workflow/`              | ReAct 工作流                                      |
| `src/mastra/workflows/table-chat-workflow/planning-execution-workflow/` | 规划执行工作流                                    |
| `src/mastra/workflows/engine/index.ts`                                  | 自定义工作流引擎（修复 resume）                   |
| `src/mastra/context/general.ts`                                         | RuntimeContext 类型定义                           |
| `src/mastra/agents/chat.ts`                                             | tableChatAgent 路由 Agent                         |
| `src/mastra/agents/planning.ts`                                         | planningAgent 规划 Agent                          |
| `src/mastra/agents/analysis-react.ts`                                   | ReAct 决策 Agent                                  |
| `src/mastra/agents/summary.ts`                                          | 总结 Agent                                        |
| `src/mastra/agents/report.ts`                                           | 报告 Agent                                        |
| `src/mastra/helper/planner.ts`                                          | PlanningManager 规划管理器                        |
| `src/mastra/tools/analysis-data-tool.ts`                                | Python 代码执行工具                               |
| `src/datasource/service.ts`                                             | NL2SQLDataService 数据服务                        |
| `src/artifact/manager.ts`                                               | ArtifactManager 产物管理                          |
| `src/lib/model-provider/llm.ts`                                         | 多模型 Provider 工厂                              |
| `src/lib/stream/*.ts`                                                   | 流处理工具集                                      |

---

## 八、总结

Master 分支基于 Mastra 框架的重构，核心价值在于：

1. **工程化解耦**：Agent 逻辑抽取为独立包，支持多项目复用
2. **框架赋能**：借助 Mastra 的 Agent/Workflow/Memory/Telemetry 原语，获得框架级能力
3. **能力扩展**：新增 ReAct 模式、并行执行、动态重规划、产物管理、异步任务等核心能力
4. **多租户适配**：通过路由矩阵支持 kuaida/xtable/levi/ba/km/doc 等多业务场景
5. **可观测性**：OpenTelemetry + Langfuse 全链路追踪
6. **安全加固**：提示词注入检测、越权校验等安全增强

相比 V3 的自研架构，Mastra 框架的引入显著降低了维护成本，同时通过自定义 `CustomWorkflowExecutionEngine` 和 `TableChatOperationWorkflow` 弥补了框架在嵌套 workflow 流式输出和 resume 场景的不足，实现了框架能力与业务定制的平衡。

---

# 九、数据源抽象设计与演进专题（NL2DSL2SQL → NL2SQL → NL2Python）

本章节聚焦数据源抽象的演进路径，深入分析数据拉取、数据查询、数据分析、Python 科学分析四个环节的上下游衔接。

## 9.1 演进总览：三代数据查询范式

```
┌─────────────────────────────────────────────────────────────────┐
│  第一代：NL2DSL2SQL（V3 release/0811）                           │
│                                                                 │
│  用户自然语言                                                    │
│       │                                                         │
│       ▼                                                         │
│  LLM generateObject(QUERY_CONFIG_SCHEMA)  ← Zod 约束的 DSL      │
│       │                                                         │
│       ▼                                                         │
│  DSLTranslator.toSQL()  ← DSL → 标准 SQL                       │
│       │                                                         │
│       ▼                                                         │
│  LocalQueryEngine(alasql)  ← 本地 SQL 引擎执行                  │
│       │                                                         │
│       ▼                                                         │
│  结构化结果（JSON 行数组）                                       │
│                                                                 │
│  问题：DSL 表达力有限，复杂分析（归因/预测/文本处理）无法覆盖     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  第二代：NL2SQL（V3 release/0811 并行存在）                      │
│                                                                 │
│  用户自然语言                                                    │
│       │                                                         │
│       ▼                                                         │
│  LLM generateText  ← 直接生成 SQL 文本（无 DSL 中间层）          │
│       │                                                         │
│       ▼                                                         │
│  数据源 API（快搭/xtable 远程执行 SQL）                          │
│       │                                                         │
│       ▼                                                         │
│  结果集 → S3 存储为 JSON 文件 → Python 沙箱下载分析              │
│                                                                 │
│  问题：SQL 表达力仍有限，无法做统计分析（回归/聚类/时间序列）     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  第三代：NL2Python（Master 当前版本）                            │
│                                                                 │
│  用户自然语言                                                    │
│       │                                                         │
│       ▼                                                         │
│  LLM 生成完整 Python 代码（含 read_dataset + pandas + sklearn）  │
│       │                                                         │
│       ▼                                                         │
│  Python 沙箱（@sandbox/code-interpreter）执行                    │
│       │                                                         │
│       ├── read_dataset(asset_key) → 加载 DataFrame              │
│       ├── pandas 数据处理                                        │
│       ├── sklearn/statsmodels 科学计算                           │
│       ├── log_dataset_artifact() → 产出新数据集                  │
│       └── log_plot_artifact() → 产出图表                         │
│       │                                                         │
│       ▼                                                         │
│  ArtifactManager 管理产物 → 下游 Agent 复用                     │
│                                                                 │
│  优势：表达力无限，统计分析能力完整，产物可复用                   │
└─────────────────────────────────────────────────────────────────┘
```

## 9.2 第一代：NL2DSL2SQL 详细链路（V3）

### 9.2.1 DSL Schema 设计

V3 定义了一套受限的查询 DSL（`QUERY_SCHEMA`），通过 Zod 约束 LLM 输出：

```typescript
// dsl-schema.ts
export const QUERY_SCHEMA = z.object({
  from: z.string(), // 表名
  select: z.array(SELECT_FIELD_SCHEMA), // 字段选择（含聚合/函数）
  where: z.array(CONDITION_SCHEMA), // 筛选条件
  groupBy: z.array(z.string()), // 分组
  orderBy: z.array(SORT_SCHEMA), // 排序
  limit: z.number(), // 限制
  offset: z.number() // 偏移
});

// 支持的聚合函数
const ALLOWED_AGG_FUNCTIONS = z.enum(['SUM', 'AVG', 'COUNT', 'COUNT_DISTINCT', 'MAX', 'MIN']);

// 支持的字段函数
const ALLOWED_FIELD_FUNCTIONS = z.enum(['DATE_FORMAT']);
```

**设计意图**：用受限 DSL 收束 LLM 输出，避免直接生成 SQL 的不可控性，同时通过 Zod schema 保证输出结构化。

### 9.2.2 DSL → SQL 翻译

`DSLTranslator` 负责将 DSL 翻译为标准 SQL：

```typescript
// dsl-to-sql.ts
class DSLTranslator {
  toSQL(): string {
    const select = this.buildSelect(); // SELECT 字段 + 聚合 + 别名
    const from = `FROM ${this.escapeId(this.query.from)}`;
    const where = this.buildWhere(); // WHERE 条件
    const groupBy = this.buildGroupBy();
    const orderBy = this.buildOrderBy();
    const limit = this.buildLimit();
    return [select, from, where, groupBy, orderBy, limit].join(' ');
  }
}
```

**特殊处理**：

- 字符串列做 SUM/AVG 时自动 `CAST(col AS NUMBER)`
- 时间戳字段比较时自动格式化
- 别名在 GROUP BY/ORDER BY 中还原为原始表达式

### 9.2.3 本地查询引擎（alasql）

V3 使用 `alasql` 在 Node.js 进程内执行 SQL，**不依赖远程数据库**：

```typescript
// query-engine.ts
import alasql from "alasql";

// 扩展 alasql 支持的函数
alasql.fn["DATE_FORMAT"] = (ts, fm) => { ... };
alasql.fn["FROM_UNIXTIME"] = (ts, fm) => { ... };
alasql.fn["JSON_LENGTH"] = (jsonDoc, path) => { ... };

export class LocalQueryEngine {
  async query(dsl) {
    const translator = new DSLTranslator(dsl, this.columns);
    const sql = translator.toSQL();
    // 直接在内存数据上执行 SQL
    return alasql(sql, [this.rows]);
  }
}
```

**数据流**：

```
快搭 API / xtable API / Excel
    │
    ▼ 拉取全量数据到内存
内存数组 rows: Record<string, any>[]
    │
    ▼ DSLTranslator.toSQL()
SQL 字符串
    │
    ▼ alasql(sql, [rows])
查询结果
```

### 9.2.4 NL2DSL2SQL 完整链路

```
analysis Agent (V3)
    │
    ├── 1. 调用 nl-query-data 工具
    │      │
    │      ▼
    │   generateObject({
    │     system: "MySQL 专家...数据源信息: schema JSON",
    │     prompt: 用户任务描述,
    │     schema: parametersSchema (goal_id, query_logic, required_tables_and_fields...)
    │   })
    │      │
    │      ▼ LLM 输出结构化参数
    │   { query_logic, required_tables_and_fields, ... }
    │      │
    │      ▼
    │   generateText({
    │     system: "基于任务信息设计 SQL",
    │     prompt: 任务参数 + tableInfo
    │   })
    │      │
    │      ▼ 生成 SQL 文本
    │   SQL 字符串
    │
    ├── 2. dataSvc.executeQuery(dsl)
    │      │
    │      ▼ preset.executeQuery(dsl, ctx)
    │      │
    │      ├── kuaida executor: 全量拉取 → LocalQueryEngine(alasql)
    │      ├── xtable executor: API 拉取行 → LocalQueryEngine(alasql)
    │      └── file executor: S3 读 Excel → XLSX 解析 → LocalQueryEngine(alasql)
    │      │
    │      ▼
    │   查询结果 (Record<string, any>[])
    │
    └── 3. 结果上传 S3 → 生成 dataset_id
           │
           ▼
       后续 nl-python-analysis 工具下载 dataset_id 分析
```

**关键局限**：

1. **DSL 表达力天花板**：只支持 SELECT/WHERE/GROUP BY/ORDER BY，无法表达窗口函数、子查询、CASE WHEN
2. **数据全量拉取**：每次查询拉全量到内存，10 万条上限
3. **两层 LLM 调用**：先 `generateObject` 理解任务，再 `generateText` 生成 SQL，延迟高
4. **分析能力割裂**：SQL 只做取数，统计分析需额外调用 `nl-python-analysis` 工具

## 9.3 第二代：NL2SQL 并行链路（V3）

V3 同时存在直接 NL2SQL 的路径（`nl-query-data.ts` 中的 `generateText` 部分），跳过 DSL 中间层：

```
用户任务
    │
    ▼
generateText({
  system: "MySQL 数据库专家，直接生成 SQL（不支持 JOIN/WITH/STDDEV）",
  prompt: 任务信息 + tableInfo(含 schema JSON)
})
    │
    ▼ SQL 文本
dataSvc.executeQuery(dsl)  ← 仍走 DSL 执行器，DSL 从 SQL 反推
    │
    ▼
结果集
```

**与 NL2DSL2SQL 的区别**：直接让 LLM 生成 SQL 文本，而非受限 DSL。但执行层仍依赖 `LocalQueryEngine`，所以 SQL 方言需兼容 alasql 子集。

## 9.4 第三代：NL2Python 详细链路（Master）

### 9.4.1 数据抽象层进化

Master 版本的数据源抽象做了重大重构：

```typescript
// V3: IDataSourceAdapter 同时负责 getSchema + executeQuery + getData
interface IDataSourceAdapter {
  getSchema(): Promise<IDataSourceSchema>;
  executeQuery(dsl, client): Promise<Record<string, any>[]>; // ← DSL 查询
  getData(table, client): Promise<{ rows; size }>; // ← 原始数据
}

// Master: IDataSourceAdapter 仅负责 getSchema + getData，移除 executeQuery
interface IDataSourceAdapter {
  getSchema(): Promise<IDataSourceSchema>;
  // executeQuery 被移除 —— 不再在数据源层做查询
  getData(
    table,
    client
  ): Promise<{
    rows: any[][]; // 二维数组，第一行为表头
    size: number;
    profile?: string;
  }>;
}
```

**核心变化**：数据源层 **只负责拉取原始数据**，不再负责查询逻辑。查询和分析全部交给 Python 沙箱。

### 9.4.2 数据拉取阶段（prepareDataStep）

```
prepareDataStep 执行流程:
    │
    ├── 1. 创建/复用 Python 沙箱
    │      └── createSandbox() → @sandbox/code-interpreter
    │          ├── 挂载 S3（agent-artifacts bucket）到 /home/user/bucket
    │          ├── 会话级复用（sessionSandboxCacheKey 绑定 threadId）
    │          └── 最多 2 个实例池（MAX_INSTANCES = 2）
    │
    ├── 2. 历史 Artifact 权重衰减
    │      └── artifactManager.adjustArtifactWeights(oldKeys, w => w * 0.5)
    │          上轮对话的产物权重减半，< 0.5 后不再注入上下文
    │
    ├── 3. 获取数据 Schema
    │      └── dataSvc.getDataSchema()
    │          ├── 遍历所有数据源（file/xtable/kuaida）
    │          ├── 每个 preset.getSchema() 获取表结构
    │          └── 表名去重 + 添加 asset_key
    │
    ├── 4. 拉取原始数据 + 创建 DatasetArtifact
    │      └── for each table:
    │          ├── dataSvc.getTableData(table)
    │          │   └── preset.getData(table) → { rows, size, columns }
    │          │       ├── kuaida: 分页拉取全量表单记录 → 二维数组
    │          │       ├── xtable: API 拉取表格行 → 格式化 → 二维数组
    │          │       └── file: S3 下载 Excel → 解析 → 二维数组
    │          │
    │          ├── data.unshift(headers)  ← 第一行插入表头
    │          │
    │          └── artifactManager.addArtifact({
    │                type: "dataset/json",
    │                asset_key: table.name,
    │                producer: "prepareStep",
    │                metadata: {
    │                  rawSchema: table,         ← 原始表结构
    │                  columns: headers,
    │                  rowsCount: size,
    │                  sampleData: data[1:6],    ← 前5行预览
    │                },
    │                data: data,                 ← 二维数组
    │                scope: "workflow",
    │              })
    │
    └── 5. Python 数据画像（可选）
           └── getDatasetProfileByPython(artifact)
               └── 在沙箱中运行 profiling 代码，生成列分布/类型统计
                   → 更新 artifact.metadata.profile
```

### 9.4.3 数据查询与分析阶段（NL2Python）

Master 完全抛弃了 DSL/SQL 中间层，LLM 直接生成 Python 代码：

````
analysisReActPlannerAgent (ReAct 循环)
    │
    ├── Reason: 生成 JSON 决策
    │   {
    │     "action_type": "run_code",
    │     "python_code": "df = read_dataset('sales_data')\n...",
    │     "thought_process": "需要计算各城市销售额..."
    │   }
    │
    ├── Act: runCode (loopStep 中)
    │   │
    │   ▼
    │   CODE_TEMPLATE_FACTORY_PURE({ aiCode: python_code })
    │   │
    │   │  包装为完整可执行脚本:
    │   │  ┌──────────────────────────────────────┐
    │   │  │ import pandas as pd                  │
    │   │  │ import json                          │
    │   │  │                                      │
    │   │  │ def read_dataset(asset_key):         │  ← 全局函数注入
    │   │  │     # 从 KV 存储加载 DataFrame        │
    │   │  │     ...                              │
    │   │  │                                      │
    │   │  │ def log_dataset_artifact(df, key):   │  ← 全局函数注入
    │   │  │     # 保存新数据集                    │
    │   │  │     ...                              │
    │   │  │                                      │
    │   │  │ def log_plot_artifact(plt, title):   │  ← 全局函数注入
    │   │  │     # 上传图表到 S3                   │
    │   │  │     ...                              │
    │   │  │                                      │
    │   │  │ # === AI 生成的代码 ===               │
    │   │  │ <aiCode>                             │
    │   │  └──────────────────────────────────────┘
    │   │
    │   ▼
    │   sandbox.files.write(scriptPath, code)
    │   sandbox.commands.run(`python3 ${scriptPath}`)
    │   │
    │   │  沙箱内执行:
    │   │  ├── read_dataset("sales_data")
    │   │  │   └── 从 KV 存储/HTTP API 加载 → pandas DataFrame
    │   │  │
    │   │  ├── df.groupby('city')['sales'].sum()
    │   │  ├── sklearn.cluster.KMeans(...)        ← 科学计算
    │   │  ├── statsmodels.tsa.seasonal(...)      ← 时间序列分解
    │   │  │
    │   │  ├── log_dataset_artifact(result_df, "city_sales")
    │   │  │   └── stdout 输出 artifact 标记 → 解析存入 ArtifactManager
    │   │  │
    │   │  └── log_plot_artifact(plt, "销售趋势")
    │   │       └── 保存图片到 S3 → stdout 输出 artifact 标记
    │   │
    │   ▼
    │   analysisDataTool.execute() 解析 stdout
    │   │
    │   ├── parseArtifactsFromStdout(stdout)
    │   │   └── 提取 ```json``` 块中的 artifact 列表
    │   │
    │   ├── for each artifact:
    │   │   └── artifactManager.addArtifact({
    │   │         type: "dataset/json" | "text/summary" | "plot/image",
    │   │         producer: task.uniqueId,    ← 记录生产者
    │   │         asset_key: ...,
    │   │         data: ...,
    │   │         scope: "workflow",
    │   │       })
    │   │
    │   └── 返回 { stdout, stderr } → 作为 observation 进入下一轮 ReAct
    │
    └── 循环直到 action_type === "final_answer"
````

### 9.4.4 产物流转与上下游衔接

```
                    ┌─────────────────────────┐
                    │    ArtifactManager       │
                    │  (KV 存储, 7天 TTL)      │
                    │                         │
  prepareDataStep ──▶│ dataset/json (原始表)   │
                    │   ├── sales_data         │
                    │   ├── user_info          │
                    │   └── ...                │
                    │                         │
  run_code T1 ─────▶│ dataset/json (加工表)   │
                    │   └── city_sales        │
                    │                         │
  run_code T2 ─────▶│ text/summary (洞察)     │
                    │   └── insight_1         │
                    │                         │
  run_code T3 ─────▶│ plot/image (图表)       │
                    │   └── trend_chart       │
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │  getTaskUpstreamArtifacts│
                    │  (基于 DAG 依赖链)       │
                    └──────────┬──────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        summaryStep      reportStep       下一个 run_code
        (generalSummary  (analysisReport  (read_dataset
         Agent)           Agent)           复用前序产物)
```

**关键衔接机制**：

1. **`read_dataset(asset_key)`**：Python 沙箱内的全局函数，从 ArtifactManager 加载数据集为 DataFrame
2. **`log_dataset_artifact(df, key, desc)`**：将新产出的 DataFrame 注册为 artifact，后续步骤可 `read_dataset` 复用
3. **`log_plot_artifact(plt, title, desc, key)`**：上传图表到 S3，注册为 plot artifact
4. **`getTaskUpstreamArtifacts(task)`**：基于任务 DAG 依赖，获取所有上游任务的产出 artifact
5. **`artifact.describe()`**：将 artifact 元信息（schema + 样本 + profile）渲染为 LLM 可读的文本块

## 9.5 三代对比：数据拉取 → 查询 → 分析 → 科学计算

### 9.5.1 全链路对比

| 环节             | V3 NL2DSL2SQL                         | V3 NL2SQL                      | Master NL2Python                                               |
| ---------------- | ------------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| **数据拉取**     | preset 全量拉取到 Node 内存           | preset 全量拉取到 Node 内存    | preset 拉取到 Artifact KV 存储，Python 沙箱按需 `read_dataset` |
| **查询表达**     | LLM → 受限 DSL → DSLTranslator → SQL  | LLM → SQL 文本                 | LLM → Python 代码（pandas）                                    |
| **查询执行**     | alasql 本地执行                       | alasql 本地执行                | Python 沙箱 pandas 执行                                        |
| **分析能力**     | 无（仅取数）                          | 无（仅取数）                   | 内置于 Python 代码（groupby/merge/pivot）                      |
| **科学计算**     | 需额外 nl-python-analysis 工具        | 需额外 nl-python-analysis 工具 | 原生支持（sklearn/statsmodels）                                |
| **文本分析**     | 不支持                                | 不支持                         | 原生支持（text_analysis specialist）                           |
| **可视化**       | generate-chart 工具（ECharts 配置）   | generate-chart 工具            | `log_plot_artifact`（matplotlib）                              |
| **产物管理**     | S3 JSON 文件 + dataset_id             | S3 JSON 文件 + dataset_id      | ArtifactManager + KV + S3                                      |
| **跨步骤复用**   | 通过 dataset_id 下载                  | 通过 dataset_id 下载           | `read_dataset(asset_key)` 直接复用                             |
| **LLM 调用次数** | 2 次（generateObject + generateText） | 1 次（generateText）           | 1 次/轮（ReAct 循环）                                          |

### 9.5.2 数据抽象层对比

| 维度             | V3                                          | Master                                                      |
| ---------------- | ------------------------------------------- | ----------------------------------------------------------- |
| **Adapter 接口** | `getSchema` + `executeQuery` + `getData`    | `getSchema` + `getData`（移除 executeQuery）                |
| **查询职责**     | 数据源层承担（preset.executeQuery）         | Python 沙箱承担（pandas）                                   |
| **数据格式**     | `Record<string, any>[]`（对象数组）         | `any[][]`（二维数组，第一行表头）                           |
| **Schema 缓存**  | `ToolCacheManager`（10分钟 TTL）            | `DataCache`（10分钟 TTL）                                   |
| **多数据源**     | 单数据源为主                                | `enableMultiDatasources` 聚合多源                           |
| **语义类型**     | `dimension`/`metric`/`timestamp`            | `dimension`/`measure`/`timestamp`/`currency`/`user`/`users` |
| **系统字段**     | `SYSTEM_CREATOR`/`SYSTEM_DATE_CREATED`      | 同 V3，但描述更严谨（标注"不代表业务创建时间"）             |
| **字段格式化**   | 按 `number_`/`select_`/`date_` 前缀推断类型 | 同 V3，但新增 `money_`/`multiplepeople_`/`daterange_` 等    |

### 9.5.3 演进核心驱动力

**从 NL2DSL2SQL → NL2Python 的演进，核心驱动是"表达力天花板"问题**：

1. **DSL 表达力不足**：
   - 无法表达 CASE WHEN、窗口函数、子查询
   - 无法做文本处理、JSON 解析
   - 无法做统计建模（回归/聚类/时间序列）

2. **SQL 方言限制**：
   - alasql 不支持完整 SQL 标准
   - 远程 API（快搭/xtable）SQL 支持有限（不支持 JOIN/WITH/STDDEV）

3. **分析能力割裂**：
   - V3 需要两个工具：`nl-query-data`（取数）+ `nl-python-analysis`（分析）
   - 中间结果通过 S3 文件传递，链路长、延迟高
   - Master 统一为单一 Python 代码生成，取数和分析一体化

4. **LLM 能力提升**：
   - 现代 LLM 生成 Python 代码的可靠性已足够高
   - Python 是数据分析的"通用语言"，LLM 训练数据充分
   - 受限 DSL 反而限制了 LLM 的能力发挥

## 9.6 Master 数据源体系架构图

```
┌──────────────────────────────────────────────────────────────────┐
│                    NL2SQLDataService (统一数据服务)                │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  getDataSchema  │  │  getTableData  │  │  (无 executeQuery)  │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘              │
│         │                │                                       │
│         ▼                ▼                                       │
│  ┌─────────────────────────────────────┐                         │
│  │           presetManager              │                         │
│  │  ┌─────────┐ ┌─────────┐ ┌────────┐ │                         │
│  │  │ kuaida  │ │ xtable  │ │  file  │ │                         │
│  │  │ Preset  │ │ Preset  │ │ Preset │ │                         │
│  │  └────┬────┘ └────┬────┘ └───┬────┘ │                         │
│  └───────┼───────────┼──────────┼─────┘                         │
│          │           │          │                                 │
│          ▼           ▼          ▼                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                          │
│  │ kuaida   │ │ xtable   │ │ file     │                          │
│  │ executor │ │ executor │ │ executor │                          │
│  │          │ │          │ │          │                          │
│  │ getForm  │ │ getTable │ │ S3+XLSX  │                          │
│  │ Records  │ │ Rows     │ │ parse    │                          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘                          │
│       │            │            │                                 │
│       ▼            ▼            ▼                                 │
│  ┌──────────────────────────────────────┐                         │
│  │        原始数据 (any[][])            │                         │
│  │   第一行为表头，其余为数据行          │                         │
│  └──────────────────┬───────────────────┘                         │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────┐                         │
│  │     ArtifactManager.addArtifact       │                         │
│  │     type: "dataset/json"              │                         │
│  │     data: any[][]                     │                         │
│  │     metadata: { rawSchema, columns,   │                         │
│  │       rowsCount, sampleData, profile }│                         │
│  └──────────────────┬───────────────────┘                         │
│                     │                                             │
│                     ▼                                             │
│  ┌──────────────────────────────────────┐                         │
│  │       KV Storage (7天 TTL)           │                         │
│  │   artifactId → JSON data             │                         │
│  │   artifactId.head → metadata         │                         │
│  └──────────────────────────────────────┘                         │
└──────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │   Python Sandbox     │
                    │  (@sandbox/code-     │
                    │   interpreter)       │
                    │                      │
                    │  read_dataset(key) ──┼──▶ KV Storage 加载
                    │                      │
                    │  pandas DataFrame    │
                    │  sklearn / statsmodels│
                    │                      │
                    │  log_dataset_artifact┼──▶ KV Storage 写入
                    │  log_plot_artifact   ┼──▶ S3 上传
                    └──────────────────────┘
```

## 9.7 关键设计决策总结

### 9.7.1 为什么最终选择 NL2Python？

| 决策因素   | NL2DSL2SQL        | NL2SQL               | NL2Python                       |
| ---------- | ----------------- | -------------------- | ------------------------------- |
| 表达力     | ★★（受限 DSL）    | ★★★（SQL 子集）      | ★★★★★（图灵完备）               |
| LLM 可靠性 | ★★★★★（Zod 约束） | ★★★★（SQL 语法约束） | ★★★★（代码测试反馈）            |
| 分析能力   | ★（仅取数）       | ★★（SQL 聚合）       | ★★★★★（完整科学计算）           |
| 错误恢复   | ★★（重新生成）    | ★★（重新生成）       | ★★★★（代码执行错误可观察+修复） |
| 产物复用   | ★★（dataset_id）  | ★★（dataset_id）     | ★★★★★（asset_key 直接引用）     |
| 可观测性   | ★★（DSL 可审计）  | ★★（SQL 可审计）     | ★★★★（代码+stdout 可审计）      |

**最终选择 NL2Python 的核心原因**：数据分析场景的分析深度需求（归因/预测/文本处理）远超 SQL 表达能力，而 Python 代码的"执行→观察 stdout→修正"的 ReAct 闭环天然适配 LLM 的试错能力。

### 9.7.2 为什么保留数据源 Adapter 的 getSchema/getData？

虽然查询逻辑移到了 Python 层，但数据源 Adapter 仍有价值：

1. **Schema 统一抽象**：不同数据源（快搭 API/多维表格/Excel）的字段类型映射统一为 `IColumnSchema`
2. **语义类型标注**：`semanticType`（metric/dimension/timestamp/currency）帮助 LLM 理解字段用途
3. **原始数据拉取**：`getData` 负责分页/鉴权/格式转换，对上层屏蔽数据源差异
4. **缓存**：Schema 和数据级别的缓存避免重复拉取

### 9.7.3 为什么用 Artifact 而非直接传递数据？

1. **跨步骤解耦**：Artifact 通过 `asset_key` 引用，步骤间无需直接传参
2. **持久化**：KV 存储 + 7天 TTL，支持 suspend/resume 后恢复
3. **权重衰减**：跨轮次对话自动降权历史产物，控制上下文膨胀
4. **自描述**：`artifact.describe()` 将元信息渲染为 LLM 可读文本，自动注入 prompt
5. **多类型统一**：dataset/json、text/summary、plot/image 统一管理

### 9.7.4 Python 沙箱的设计要点

1. **会话级复用**：通过 `sessionSandboxCacheKey` 绑定 threadId，同一会话复用沙箱实例
2. **S3 挂载**：沙箱内挂载 S3 bucket 到 `/home/user/bucket`，支持大文件直接读写
3. **全局函数注入**：`read_dataset`/`log_dataset_artifact`/`log_plot_artifact` 通过 `CODE_TEMPLATE_FACTORY` 注入
4. **stdout 协议**：Python 代码通过特定格式 stdout 输出 artifact 标记，外层解析存入 ArtifactManager
5. **无状态执行**：每次代码执行独立进程，不保留前序变量，强制 LLM 生成完整代码

## 9.8 完整实例追踪：以"各等级项目数量分布情况"为例

本节用一个真实查询场景，端到端追踪 NL2Python 的完整执行链路，展示数据从拉取到分析到产出的每一步具体变化。

### 9.8.0 前提假设

假设用户在快搭系统中有一个"项目登记表"视图（viewCode: `project_list`），包含以下字段：

| 字段名           | 字段类型 | 语义类型  | 说明                |
| ---------------- | -------- | --------- | ------------------- |
| `select_level`   | 单选     | dimension | 项目等级（S/A/B/C） |
| `text_name`      | 文本     | dimension | 项目名称            |
| `number_budget`  | 数字     | metric    | 项目预算（万元）    |
| `date_start`     | 日期     | timestamp | 启动日期            |
| `SYSTEM_CREATOR` | 系统字段 | user      | 创建人              |

### 9.8.1 阶段一：prepareDataStep（数据准备）

#### Step 1.1 获取 Schema

```
NL2SQLDataService.getDataSchema()
  └── kuaidaPreset.getSchema(ctx)
      └── formFetch(ctx).get("/api/zeroconsole/view/showInfo/project_list")
          └── 返回: { name: "项目登记表", schema: "...", showFields: [...] }

  columnsFormatter 解析 schema JSON:
    select_level  → { dataType: "string", semanticType: "dimension", enum_values: ["S","A","B","C"] }
    text_name     → { dataType: "string", semanticType: "dimension" }
    number_budget → { dataType: "number", semanticType: "metric" }
    date_start    → { dataType: "number", semanticType: "timestamp" }

  最终返回 IDataSourceSchema:
    tables: [{
      name: "project_list",
      columns: [select_level, text_name, number_budget, date_start, SYSTEM_CREATOR, ...],
      _source_info: { type: "kuaida", view: "project_list" }
    }]
```

#### Step 1.2 拉取原始数据

```
dataSvc.getTableData(table)
  └── kuaidaPreset.getData(table, ctx)
      └── getFormRecords(ctx, columns)
          ├── 第1页: GET /api/zeroconsole/view/data/list (pageNo=1, pageSize=100)
          │   返回: { page: { totalCount: 350 }, pageList: [{id, fields: {select_level:"S", ...}}, ...] }
          ├── 第2-4页: 继续分页拉取（共 350 条，4 页）
          └── 组装为二维数组:
              rows: [
                ["S", "智能客服系统", 500, 1704067200000, "yangxu"],
                ["A", "数据看板升级", 200, 1706745600000, "zhangsan"],
                ...350行...
              ]
```

> **`getTableData` 获取的数据有不可替代的三重作用**（后续 Step 1.4 的 HTTP 下载只是搬运这份数据，不是重新拉取）：
>
> 1. **存入 KV Storage 持久化**（Step 1.3）：`addArtifact({ data })` 将二维数组存入 KV Storage，成为整个会话的数据资产。后续所有步骤（summaryStep、reportStep、跨轮次 ReAct）都通过 `artifact.describe()` 读取这份数据的元信息（sampleData、rowsCount、columns）
> 2. **生成 LLM 上下文预览**（Step 1.3）：`data.slice(1, 6)` → `metadata.sampleData`（前5行预览），连同 `rowsCount`、`columns` 一起注入 `analysisReActPlannerAgent` 的 system prompt，让 LLM 在生成 Python 代码前就了解数据结构
> 3. **为沙箱提供数据源**（Step 1.4）：沙箱通过 HTTP 下载的就是这份数据。因为沙箱是独立容器无法访问 Node.js 内存，数据必须先存入 KV Storage，再通过 HTTP 接口搬运到沙箱
>
> **简言之**：`getTableData` 是数据的**唯一源头**，Step 1.4 的 HTTP 下载只是跨进程传递的手段。如果没有 `getTableData`，KV Storage 里就没有数据，沙箱也就无从下载。

#### Step 1.3 创建 DatasetArtifact

```
artifactManager.addArtifact({
  type: "dataset/json",
  asset_key: "project_list",          ← 表名作为 asset_key
  producer: "prepareStep",
  data: [
    ["select_level","text_name","number_budget","date_start","SYSTEM_CREATOR"],  ← 表头
    ["S","智能客服系统",500,1704067200000,"yangxu"],
    ["A","数据看板升级",200,1706745600000,"zhangsan"],
    ...
  ],
  metadata: {
    rawSchema: { name: "project_list", columns: [...] },
    columns: ["select_level","text_name","number_budget","date_start","SYSTEM_CREATOR"],
    rowsCount: 350,
    sampleData: [前5行],
  }
})
  └── 存入 KV Storage:
      key: {artifactId}.head → JSON metadata
      key: {artifactId}     → JSON data (二维数组)
```

#### Step 1.4 Python 数据画像 + 沙箱文件落盘

> **关键疑问**：Step 1.2 的 `getTableData` 不是已经拿到数据了吗？为什么这里还要再下载一次？
>
> **原因**：沙箱（`@sandbox/code-interpreter`）是**独立容器进程**，无法直接访问 Node.js 内存中的数据。数据需要通过 HTTP API 从 server 的 artifact 下载接口搬运到沙箱内。这是跨进程数据传递的必要环节。

`prepareDataStep` 调用 `getDatasetProfileByPython`，在沙箱中执行 profiling 代码。注意：这段代码是**系统生成**的（非 LLM 生成），它通过 server 的 HTTP 接口下载已存储在 KV Storage 中的 artifact 数据：

```python
# 沙箱内执行的 profiling 代码（由系统生成，非 LLM 生成）
import requests, json, pandas as pd

# ★ 注意：这里的 data_url 不是快搭 API，而是 server 的 artifact 下载接口
# api = "https://kuaida.sankuai.com/analysis-agent/dataset/{download_id}"
# download_id = artifactId（Step 1.3 中 artifactManager 分配的 ID）
data_url = f"https://kuaida.sankuai.com/analysis-agent/dataset/{download_id}"
# 此 HTTP 请求从 server 的 KV Storage 下载 Step 1.3 存入的 artifact 数据
raw_data = fetch_json_data(data_url)
headers = raw_data[0]  # ["select_level","text_name","number_budget",...]
rows = raw_data[1:]    # 350行数据（与 Step 1.2 拉取的完全相同）
df = pd.DataFrame(rows, columns=headers)

# ★ 关键：保存到沙箱本地文件，供后续 read_dataset 读取
df.to_excel("/tmp/{threadId}/project_list.xlsx", index=False, engine='openpyxl')

# 生成数据画像
profile = generate_dataframe_profile(df)
# profile 内容示例:
# "数据集包含 350 行 5 列。
#  select_level: 低基数维度, 4个唯一值 (S:85, A:120, B:95, C:50)
#  number_budget: 数值型, 均值 285.6, 标准差 156.2, 范围 [50, 800]
#  date_start: 时间戳(毫秒), 范围 2023-12-01 ~ 2024-06-15"

print(json.dumps([profile]))
```

**数据传输路径（三段式搬运）**：

```
快搭 API ──Step 1.2 getTableData──▶ Node.js 内存（二维数组）
                                        │
                              Step 1.3 addArtifact
                                        ▼
                                   KV Storage（持久化）
                                        │
                              Step 1.4 HTTP 下载
                                        ▼
                              Python 沙箱内存（DataFrame）
                                        │
                              df.to_excel()
                                        ▼
                              沙箱文件系统 /tmp/{tid}/project_list.xlsx
                                        │
                              后续 read_dataset() 直接读文件
                                        ▼
                              ReAct 各轮 run_code 复用
```

> **设计取舍**：为什么不用 `sandbox.files.write()` 直接写入而要走 HTTP 中转？
>
> - KV Storage 中的数据是 JSON 序列化的二维数组，`sandbox.files.write` 需要全量序列化后传输
> - HTTP 接口支持流式传输，大数据量时更稳定
> - 文件数据源（Excel）有优化路径：`saveFileToSandbox = !table._source_info?.fileUrl`，当数据源是文件时跳过 `to_excel`（因为获取数据阶段已落盘）

执行后：

- 沙箱文件系统产生 `/tmp/{threadId}/project_list.xlsx`
- `artifact.metadata.profile` 更新为画像文本
- `artifact.describe()` 现在可以输出包含 profile 的完整描述

#### Step 1.5 Artifact 注入 Agent 上下文

`analysisReActPlannerAgent` 的 `instructions` 动态注入数据集描述：

```
## 四、数据上下文与背景知识

**可用的原始数据集列表**：
<dataset_asset key="project_list">
==============================
project_list
==============================
Asset Key: project_list
描述: 数据来自在线数据表格：项目登记表
数据行数: 350
数据列数: 5

select_level: string (低基数维度, 4个唯一值: S/A/B/C)
number_budget: number (均值 285.6, 标准差 156.2)
date_start: number (时间戳, 2023-12 ~ 2024-06)
...

前5行数据预览:
| select_level | text_name      | number_budget | date_start      | SYSTEM_CREATOR |
|-------------|----------------|--------------|-----------------|----------------|
| S           | 智能客服系统    | 500          | 1704067200000   | yangxu         |
| A           | 数据看板升级    | 200          | 1706745600000   | zhangsan       |
| ...
</dataset_asset>
```

### 9.8.2 阶段二：ReAct 循环（Loop Step）

#### 第 1 轮 ReAct：Reason + Act

`loopStep` 构建 prompt 调用 `analysisReActPlannerAgent`：

```
## 用户问题
各等级项目数量分布情况

## 已收集的事实 (Observations)
暂无 (当前是第一步)

## 相关数据集表格
(注入 project_list 的 describe 输出，含 profile + 前3行预览)

请进行下一步决策。
```

LLM 输出（`reActPlannerOutputSchema` 约束的 JSON）：

```json
{
  "thought_process": "用户需要按项目等级(select_level)统计项目数量分布。select_level 是低基数维度(4个值:S/A/B/C)，适合直接 groupby 计数。需要读取 project_list 数据集，按等级分组统计数量，并计算占比。",
  "action_type": "run_code",
  "step_name": "统计各等级项目数量",
  "python_code": "import pandas as pd\n\ndf = read_dataset('project_list')\ndf['select_level'] = df['select_level'].astype(str).str.strip()\ncount_by_level = df.groupby('select_level', observed=True).size().reset_index(name='count')\ntotal = count_by_level['count'].sum()\ncount_by_level['percentage'] = (count_by_level['count'] / total * 100).round(2)\ncount_by_level = count_by_level.sort_values('count', ascending=False).reset_index(drop=True)\nprint(f'总项目数: {total}')\nprint(count_by_level.to_string(index=False))\nlog_dataset_artifact(count_by_level, 'level_distribution', '各等级项目数量分布统计表')",
  "dynamic_plan": ["绘制分布柱状图", "输出最终分析报告"]
}
```

#### 代码包装与执行

`runCode()` 将 LLM 生成的 `python_code` 交给 `CODE_TEMPLATE_FACTORY_PURE` 包装：

```python
# ===== 系统注入的前置代码（CODE_TEMPLATE_FACTORY_PURE） =====
import requests, json, time, sys, os, math, warnings, re, uuid
from typing import List, Dict, Any, Optional, Union
import pandas as pd
import numpy as np
from datetime import datetime, date, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
from cycler import cycler
from pathlib import Path

warnings.filterwarnings('ignore')
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams.update({
    'axes.prop_cycle': cycler(color=["#347BED","#3DC29D",...]),
    'font.sans-serif': ['Noto Sans CJK SC', 'Noto Sans CJK', 'sans-serif'],
    'axes.unicode_minus': False,
    'savefig.dpi': 300
})

def read_dataset(asset_key: str) -> pd.DataFrame:
    # ★ 从沙箱本地文件读取
    base_path = f"/tmp/{threadId}/{asset_key}"
    csv_path = f"{base_path}.csv"
    xlsx_path = f"{base_path}.xlsx"
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path, encoding="utf-8", engine="pyarrow")
    if os.path.exists(xlsx_path):
        return pd.read_excel(xlsx_path, engine="calamine")
    raise KeyError(f"数据集文件{asset_key}.xlsx不存在")

def log_dataset_artifact(df, asset_key, description, showLink=True):
    # 打印元数据 + 保存到沙箱+S3 + 输出 [ARTIFACT_INFO] 标记
    print("\n\n" + "="*30)
    print(f"数据表: {description}")
    print("="*30)
    print(f"[Shape]: {df.shape}")
    print("\n--- Data Preview (Head 5 rows)---")
    print(better_preview(df.head(5), 5))
    df.to_excel(f"/tmp/{threadId}/{asset_key}.xlsx", index=False)
    save_path = Path(f"/home/user/bucket/{threadId}/generated_files/{asset_key}.xlsx")
    save_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_excel(save_path, index=False)
    print(f"[Success] DataFrame dataset saved to excel file")
    print(f"PATH: /generated_files/{asset_key}.xlsx")
    print(f"MARKDOWN LINK: [{description}](artifact:///generated_files/{asset_key}.xlsx)")
    print("\n[ARTIFACT_INFO]")
    print(json.dumps({
        "artifact_type": "dataset",
        "name": description,
        "description": description,
        "asset_key": asset_key,
        "rows_count": df.shape[0],
        "file_path": f"/generated_files/{asset_key}.xlsx",
        "preview": f"--- Data Preview (Head 5 rows)---\n\n{better_preview(df.head(5), 5)}"
    }, ensure_ascii=False))
    print("[/ARTIFACT_INFO]\n")

def log_plot_artifact(plt_instance, title, description, asset_key):
    # 保存图片到 S3 + 输出 [ARTIFACT_INFO] 标记
    s3_key = f"generated_files/{asset_key}.png"
    save_path = Path(f"/home/user/bucket/{threadId}/{s3_key}")
    save_path.parent.mkdir(parents=True, exist_ok=True)
    plt_instance.savefig(save_path, dpi=200, format='png', bbox_inches='tight')
    print(f"Plot save to image success, MARKDOWN LINK: ![{title}](artifact:///{s3_key})")
    print("\n[ARTIFACT_INFO]")
    print(json.dumps({"artifact_type": "plot", "name": title, "description": description, "asset_key": asset_key, "file_path": f"/{s3_key}"}, ensure_ascii=False))
    print("[/ARTIFACT_INFO]\n")

# ===== LLM 生成的代码（AI Code） =====
import pandas as pd

df = read_dataset('project_list')
df['select_level'] = df['select_level'].astype(str).str.strip()
count_by_level = df.groupby('select_level', observed=True).size().reset_index(name='count')
total = count_by_level['count'].sum()
count_by_level['percentage'] = (count_by_level['count'] / total * 100).round(2)
count_by_level = count_by_level.sort_values('count', ascending=False).reset_index(drop=True)
print(f'总项目数: {total}')
print(count_by_level.to_string(index=False))
log_dataset_artifact(count_by_level, 'level_distribution', '各等级项目数量分布统计表')
```

#### 沙箱执行结果

`sandbox.commands.run("python3 /tmp/{threadId}/{nanoid}.py")` 执行后 stdout：

```
总项目数: 350
select_level  count  percentage
          A    120       34.29
          B     95       27.14
          S     85       24.29
          C     50       14.29


==============================
数据表: 各等级项目数量分布统计表
==============================
[Shape]: (4, 3)

--- Data Preview (Head 5 rows)---
|    | select_level   |   count |   percentage |
|---:|:---------------|--------:|-------------:|
|  0 | A              |     120 |        34.29 |
|  1 | B              |      95 |        27.14 |
|  2 | S              |      85 |        24.29 |
|  3 | C              |      50 |        14.29 |

[Success] DataFrame dataset saved to excel file
PATH: /generated_files/level_distribution.xlsx
MARKDOWN LINK: [各等级项目数量分布统计表](artifact:///generated_files/level_distribution.xlsx)

[ARTIFACT_INFO]
{"artifact_type": "dataset", "name": "各等级项目数量分布统计表", "description": "各等级项目数量分布统计表", "asset_key": "level_distribution", "rows_count": 4, "file_path": "/generated_files/level_distribution.xlsx", "preview": "--- Data Preview (Head 5 rows)---\n\n| | select_level | count | percentage |\n..."}
[/ARTIFACT_INFO]
```

#### Artifact 解析与注册

`analysisDataTool.execute()` 解析 stdout 中的 `[ARTIFACT_INFO]` 块：

```
parseArtifactsFromStdout(stdout)
  └── 提取 [ARTIFACT_INFO]{...}[/ARTIFACT_INFO] 块
  └── JSON.parse → { artifact_type: "dataset", asset_key: "level_distribution", ... }

artifactManager.addArtifact({
  type: "dataset/json",
  asset_key: "level_distribution",
  producer: "T_1",                    ← ReAct 第1轮任务
  description: "各等级项目数量分布统计表",
  data: [["select_level","count","percentage"], ["A",120,34.29], ...],
  metadata: {
    file_path: "/generated_files/level_distribution.xlsx",
    rowsCount: 4,
    transformationLogic: "",           ← 可选：记录数据加工逻辑
  },
  scope: "workflow",
})
  └── 存入 KV Storage
```

#### Observation 回写

stdout 作为 observation 存入 `observations` 数组：

```
observations = [{
  taskId: "T_1",
  thought: "用户需要按项目等级统计...",
  observation: "总项目数: 350\nselect_level  count  percentage\nA    120  34.29\nB  95  27.14\nS  85  24.29\nC  50  14.29\n...(省略artifact标记)",
  action: "Tool: run_code;"
}]
```

### 9.8.3 阶段二（续）：第 2 轮 ReAct

```
## 用户问题
各等级项目数量分布情况

## 已收集的事实 (Observations)

【观察 1】
总项目数: 350
select_level  count  percentage
A    120  34.29
B     95  27.14
S     85  24.29
C     50  14.29

## 相关数据集表格
(注入 level_distribution 的 describe，含4行预览)

请进行下一步决策。
```

LLM 第 2 轮输出：

```json
{
  "thought_process": "已获得各等级数量分布:A级最多(120,34.29%),C级最少(50,14.29%)。分布合理，无明显异常。接下来绘制柱状图直观展示分布。",
  "action_type": "run_code",
  "step_name": "绘制分布柱状图",
  "python_code": "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = read_dataset('level_distribution')\nfig, ax = plt.subplots(figsize=(10, 6))\nbars = ax.bar(df['select_level'], df['count'])\nfor bar, pct in zip(bars, df['percentage']):\n    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f'{int(bar.get_height())} ({pct}%)', ha='center', va='bottom')\nax.set_xlabel('项目等级')\nax.set_ylabel('项目数量')\nax.set_title('各等级项目数量分布')\nplt.tight_layout()\nlog_plot_artifact(plt, '各等级项目数量分布', 'a bar chart showing project count by level, x_axis is level(S/A/B/C), y_axis is count', 'level_distribution_chart')",
  "dynamic_plan": ["输出最终分析报告"]
}
```

执行后 stdout：

```
==============================
图表: a bar chart showing project count by level...
==============================
Plot save to image success, MARKDOWN LINK: ![各等级项目数量分布](artifact:///generated_files/level_distribution_chart.png)

[ARTIFACT_INFO]
{"artifact_type": "plot", "name": "各等级项目数量分布", "description": "a bar chart...", "asset_key": "level_distribution_chart", "file_path": "/generated_files/level_distribution_chart.png"}
[/ARTIFACT_INFO]
```

`analysisDataTool` 解析后注册为 `plot/image` 类型 artifact。

### 9.8.4 阶段二（续）：第 3 轮 ReAct — 收敛

```json
{
  "thought_process": "数据分布已明确并通过图表可视化。A级项目最多占34.29%，S级高优项目85个占24.29%，分布合理。证据链已闭环，可以输出最终报告。",
  "action_type": "final_answer",
  "step_name": "输出分析结论",
  "answer": "## 各等级项目数量分布情况\n\n**核心结论**：项目登记表共350个项目，A级项目占比最高(34.29%)，C级最少(14.29%)，整体呈正态分布。\n\n### 分布明细\n\n| 等级 | 数量 | 占比 |\n|------|------|------|\n| A    | 120  | 34.29% |\n| B    | 95   | 27.14% |\n| S    | 85   | 24.29% |\n| C    | 50   | 14.29% |\n\n![各等级项目数量分布](artifact:///generated_files/level_distribution_chart.png)\n\n图表显示，A级和B级项目合计占比超过60%，是项目主体；S级高优项目占比近四分之一，资源投入合理。\n\n[点击下载：各等级项目数量分布明细](artifact:///generated_files/level_distribution.xlsx)",
  "dynamic_plan": []
}
```

`loopStep` 检测到 `action_type === "final_answer"`，将 `answer` 中的 `artifact:///` 链接替换为 HTTP URL 后返回，流式输出给用户。

### 9.8.5 全链路数据流总结

```
用户提问："各等级项目数量分布情况"
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│ prepareDataStep                                              │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ 1. kuaidaPreset.getSchema() → IDataSourceSchema        │  │
│ │    [select_level, text_name, number_budget, date_start]│  │
│ │                                                         │  │
│ │ 2. kuaidaPreset.getData() → 二维数组(350行×5列)         │  │
│ │    API 分页拉取 4 页                                    │  │
│ │                                                         │  │
│ │ 3. ArtifactManager.addArtifact("project_list")         │  │
│ │    → KV Storage 存储 (artifactId 为 key)                │  │
│ │                                                         │  │
│ │ 4. getDatasetProfileByPython()                         │  │
│ │    沙箱内: HTTP 从 server /dataset/{artifactId} 下载    │  │
│ │    （★ 非快搭API，是KV Storage的artifact下载接口）       │  │
│ │    → DataFrame → to_excel → /tmp/{tid}/project_list.xlsx│  │
│ │    → metadata.profile = "350行5列, select_level:4值..." │  │
│ └─────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ loopStep 第1轮                                               │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ analysisReActPlannerAgent.generate(prompt)              │  │
│ │ → { action_type: "run_code",                            │  │
│ │     python_code: "df=read_dataset('project_list')..." } │  │
│ │                                                         │  │
│ │ CODE_TEMPLATE_FACTORY_PURE 包装代码                     │  │
│ │ + 注入 read_dataset / log_dataset_artifact 等函数       │  │
│ │                                                         │  │
│ │ analysisDataTool.execute()                              │  │
│ │   sandbox.commands.run("python3 ...")                   │  │
│ │   ├── read_dataset("project_list")                      │  │
│ │   │   └── pd.read_excel("/tmp/{tid}/project_list.xlsx") │  │
│ │   ├── df.groupby('select_level').size()                 │  │
│ │   │   → count_by_level: A=120, B=95, S=85, C=50        │  │
│ │   └── log_dataset_artifact(count_by_level, ...)         │  │
│ │       ├── 保存 /tmp/{tid}/level_distribution.xlsx       │  │
│ │       ├── 保存 S3: bucket/{tid}/generated_files/...xlsx │  │
│ │       └── stdout 输出 [ARTIFACT_INFO]{...}              │  │
│ │                                                         │  │
│ │ 解析 stdout [ARTIFACT_INFO] → 注册 artifact             │  │
│ │ observation = stdout → observations[T_1]                │  │
│ └─────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ loopStep 第2轮                                               │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ analysisReActPlannerAgent.generate(prompt + obs[0])     │  │
│ │ → { action_type: "run_code",                            │  │
│ │     python_code: "plt.bar(...); log_plot_artifact()" }  │  │
│ │                                                         │  │
│ │ 沙箱执行:                                               │  │
│ │   ├── read_dataset("level_distribution")                │  │
│ │   │   └── 读取上轮产出的 xlsx                            │  │
│ │   ├── plt.bar() 绘制柱状图                               │  │
│ │   └── log_plot_artifact(plt, ...)                       │  │
│ │       └── 保存 S3: .../level_distribution_chart.png     │  │
│ │                                                         │  │
│ │ 注册 plot/image artifact                                │  │
│ └─────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│ loopStep 第3轮                                               │
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ analysisReActPlannerAgent.generate(prompt + obs[0,1])   │  │
│ │ → { action_type: "final_answer",                        │  │
│ │     answer: "## 各等级项目数量分布...\n![...](...)\n" } │  │
│ │                                                         │  │
│ │ artifact:/// 链接 → HTTP URL 替换                       │  │
│ │ → 流式输出给用户                                        │  │
│ └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 9.8.6 关键衔接机制详解

#### read_dataset 的文件读取机制

`read_dataset(asset_key)` 的实现核心是**从沙箱本地文件系统读取**，而非每次 HTTP 下载：

```python
def read_dataset(asset_key: str) -> pd.DataFrame:
    base_path = f"/tmp/{threadId}/{asset_key}"
    csv_path = f"{base_path}.csv"
    xlsx_path = f"{base_path}.xlsx"
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path, encoding="utf-8", engine="pyarrow")
    if os.path.exists(xlsx_path):
        return pd.read_excel(xlsx_path, engine="calamine")
    raise KeyError(f"数据集文件{asset_key}.xlsx不存在")
```

**文件落盘时机**：

1. **prepareDataStep** 阶段：`getDatasetProfileByPython` 执行时，沙箱内通过 HTTP 从 server 的 `/analysis-agent/dataset/{artifactId}` 接口下载 KV Storage 中的 artifact 数据，然后 `to_excel` 保存到 `/tmp/{threadId}/{asset_key}.xlsx`
   - 注意：此时数据已被"搬运"三次（快搭API → Node.js → KV Storage → 沙箱），因为沙箱是独立容器无法直接访问 Node.js 内存
   - 文件数据源（Excel）有优化：`saveFileToSandbox = !table._source_info?.fileUrl`，文件类型在 getData 阶段已落盘，跳过此步
2. **run_code 执行时**：`log_dataset_artifact` 会将新产出的 DataFrame 保存到 `/tmp/{threadId}/{asset_key}.xlsx`，供后续轮次 `read_dataset` 读取

**设计要点**：沙箱会话级复用（绑定 threadId），同一会话内文件持久存在，跨轮次 ReAct 可直接复用前序产物文件。

#### log_dataset_artifact 的 stdout 协议

`log_dataset_artifact` 通过**约定格式的 stdout 标记**实现程序化解析：

```
==============================
数据表: {description}
==============================
[Shape]: (4, 3)
--- Data Preview (Head 5 rows)---
{markdown表格}

[Success] DataFrame dataset saved to excel file
PATH: /generated_files/{asset_key}.xlsx
MARKDOWN LINK: [{description}](artifact:///generated_files/{asset_key}.xlsx)

[ARTIFACT_INFO]                    ← 程序解析标记开始
{json_manifest}                    ← 程序解析的 JSON 元数据
[/ARTIFACT_INFO]                   ← 程序解析标记结束
```

**双通道设计**：

- 人类可读部分（`====` 标题、预览表格、MARKDOWN LINK）→ 作为 observation 喂给 LLM
- 机器可读部分（`[ARTIFACT_INFO]` JSON 块）→ 由 `analysisDataTool` 解析存入 ArtifactManager

#### artifact 链接替换

最终 `answer` 中的 `artifact:///` 链接会被替换为可访问的 HTTP URL：

```typescript
// loopStep 中
if (output.action_type === 'final_answer') {
  return {
    result: output.answer.replaceAll(
      /artifact:\/\//g,
      `${FORM_API_SERVER_MAP[ctx.get('env')]}/analysis-agent/file/${ctx.get('threadId')}`
    )
  };
}
```

替换后：`artifact:///generated_files/level_distribution.xlsx` → `https://xxx/analysis-agent/file/{threadId}/generated_files/level_distribution.xlsx`

### 9.8.7 与 V3 NL2DSL2SQL 的同场景对比

同一问题"各等级项目数量分布情况"，V3 的执行链路：

```
V3 NL2DSL2SQL:
    │
    ├── 1. generateObject(QUERY_CONFIG_SCHEMA)
    │   → { dsl_query: { from: "project_list",
    │                      select: [{column:"select_level"}, {column:"*", aggr:"COUNT", alias:"count"}],
    │                      groupBy: ["select_level"],
    │                      orderBy: [{column:"count", sort:"DESC"}] },
    │        hint: "按等级分组计数" }
    │
    ├── 2. DSLTranslator.toSQL()
    │   → SELECT `select_level`, COUNT(*) AS `count`
    │     FROM `project_list`
    │     GROUP BY `select_level`
    │     ORDER BY `count` DESC
    │
    ├── 3. kuaida executor: 全量拉取350条 → alasql(sql, [rows])
    │   → [{select_level:"A", count:120}, {select_level:"B", count:95}, ...]
    │
    ├── 4. 结果上传 S3 → dataset_id
    │
    └── 5. 需要图表时 → 另调 generate-chart 工具生成 ECharts 配置
         （无法做占比计算、无法做统计检验、无法绘制 matplotlib 图）
```

**核心差异**：

| 维度         | V3 NL2DSL2SQL                                   | Master NL2Python                              |
| ------------ | ----------------------------------------------- | --------------------------------------------- |
| **LLM 调用** | generateObject(DSL) + generateText(SQL) = 2次   | generate(JSON with python_code) = 1次         |
| **中间表示** | DSL → SQL → alasql                              | Python 代码（无中间层）                       |
| **占比计算** | SQL 无法直接算百分比，需后续处理                | `(count/total*100).round(2)` 一行代码         |
| **可视化**   | 需额外 generate-chart 工具（ECharts JSON 配置） | `plt.bar()` + `log_plot_artifact` 原生支持    |
| **产物复用** | 结果存 S3，后续需下载                           | `read_dataset("level_distribution")` 直接复用 |
| **下钻能力** | 需重新构造 DSL 查询                             | ReAct 循环中直接 `read_dataset` + 新代码      |
| **表达力**   | 仅 SELECT/WHERE/GROUP BY/ORDER BY               | 图灵完备（可做任何 Python 计算）              |

**总结**：NL2Python 将"取数"和"分析"统一为单一 Python 代码生成，消除了 V3 中 DSL→SQL→取数→下载→分析的多段割裂，通过 `read_dataset`/`log_dataset_artifact` 的文件落盘 + stdout 协议实现了沙箱内的高效数据流转和产物复用。
