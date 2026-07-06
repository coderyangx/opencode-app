**数据分析Agent专项**
v1 -> v2 -> v3 -> Mastra架构升级

```
数据分析Agent（kuaida-agent），重点分支：
    - 初期demo版本：release/M6 【HITL-工具调用sql需要确认】
    - 支持引用人员、多步骤规划：feature/CLRXO-90917585/update-ui（8月份，0807）
    - 基础版本：release/0826
    - 升级mastra：release/0909
    - 大量问题优化：release/0916、
```

1.  数据分析Agent
    Echarts 图表问题：提示词明确提示图标结构是 :::echarts\n\n {id:xxx} :::，类似 code 结构，但输出结构仍然会出错，以及偶现的 json 格式错误问题，基于 AI SDK 的 repairJsonSchema 传入修复函数进行兜底修复，再进一步xxx，**推动自然语言转SQL查询升级为python coding+sandbox harness**，落地多场景数据分析
    - 消息持久化（页面刷新和手动终止服务端会继续生成入库）
      - **终止生成**：调用stop，但服务端继续消费流，保证onFinish后入库，刷新可恢复
      - 重新生成：调用regenerate，不传id默认最后一条，服务端判断db历史messages最后一条如果是assist，传入的messages最后一条是user，说明是重新生成
    - 断点续传：调用resume，后端通过`const uiStream = result.toUIMessageStream({}) const [stream1, stream2] = uiStream.tee();`派生出两个流，一个保存一个直接流式输出
    - ECharts 图表服务端生成与前端交互渲染双模式(难点：LLM 生成图表配置后如何安全传递给前端并实现交互渲染)
      - 图表工具将 ECharts 配置序列化为 base64 字符串，嵌入自定义 Markdown 指令块 :::echarts{id=xxx config="base64..."}，避免 JSON 在 Markdown 流中被转义破坏。
      - 前端 Markdown 渲染器识别 :::echarts 块，解码 base64 配置，使用 ECharts 客户端渲染为可交互图表，用户可 hover/zoom。
      - 同时支持将图表配置存 S3，前端通过 id 异步加载，兼顾大配置场景和历史消息恢复。
    - 生成Ecahrts配置经常出问题，后面升级Python绘图，支持更多图形细节，前端引用S3链接
    - 模型护栏 guardrails：
      - 错误边界：onError 接管 + reload 可见（model 502 干死 UI）
      - 超时重连：SSE 末尾插 keep-alive ping（市务网络中断）
      - Token 预算：maxOutputTokens + 会话摘要（思考模型烧钱快）
      - 可观测性：后端接 LangSmith（下期）（问题定位难）
      - 防重发：status 为 streaming 时禁 send（双点发送）
2.  **升级为NL2Python，通过生成Python代码沙箱内执行进行统计分析，获取数据、绘制图表，去除SQL设计和Echarts画图，**：从"只能聚合查询"升级为"能做真正的统计分析"，相关性、数据分布、数据趋势、聚类等
    - V1: NL → DSL → SQL (alasql内存执行) ← 只有SQL聚合
    - V2: NL → DSL → SQL + Orchestrator DAG流水线 ← SQL聚合 + LLM总结
    - V3: NL → SQL (直出) + NL → Python (MCP沙箱) ← SQL取数 + Python统计分析
      - 只触发一次LLM调用，直出SQL
        用户自然语言：
        → PlanningAgent (generateObject) → goals[] + tasks[] (区分 query/analysis)
        → nl-query-data 工具 (generateObject) → 直接生成 MySQL SQL
        → 数据源执行 → 结果
      - 为什么砍掉 DSL：
        DSL 限制了表达能力（无法写子查询、窗口函数等复杂 SQL）
        现代 LLM（GPT-4.1）直接生成 SQL 的准确率已经足够高
        减少一次 LLM 调用，降低延迟和成本
        DSL 的类型安全靠 Zod schema 约束 SQL 输出格式来替代

3.  数据分析能力对比（核心差异）
    - V1/V2：只有 SQL 聚合分析
    - V1/V2 的分析能力受限于 alasql 内存 SQL 引擎，只能做：
      - 聚合统计
        - ✅ COUNT/SUM/AVG/MAX/MIN/COUNT_DISTINCT "各项目等级的数量"
      - 分组占比
        - ✅ GROUP BY + COUNT "各状态占比"
      - 排序 Top N
        - ✅ ORDER BY + LIMIT "金额前10的订单"
      - 时间趋势
        - ⚠️ 只能按时间分组计数，无法计算增长率/拟合 "按月订单数趋势"
      - 相关性
        - ❌ 无法计算皮尔逊相关系数 "数量和金额的相关性"
      - 分布/异常
        - ❌ 无法计算标准差/分位数/箱线图 "金额分布和异常值"
      - 相关性
        - ❌ 不支持 "项目目标文本聚类"
    - V2 的 "分析" 本质是 LLM 拿到 SQL 结果后用自然语言总结，不是真正的统计分析
      V3：SQL 取数 + Python 统计分析双通道，可以实现：相关性分析、分布分析、趋势预测、文本聚类（jieba分词 + sklearn KMeans）、统计检验、分位数（P90/P99）
      V3 在 planning 阶段就区分了两种任务类型，AnalysisAgent 根据任务类型分发到不同工具：
      - task_type: "query" → nl-query-data 工具 (NL2SQL)
      - task_type: "analysis" → nl-python-analysis 工具 (NL2Python)
    - NL2Python 的完整 ReAct 循环
      ```
      1. PlanningAgent 产出 analysis 任务（含 analysis_logic 描述）
      2. AnalysisAgent 调用 nl-python-analysis 工具
      3. 工具内部循环（最多4轮）:
        Round 1:
          → LLM (gpt-oss-120b) 生成 Python 代码
          → CODE_TEMPLATE_FACTORY 注入到脚手架模板
          → MCP Code Interpreter 执行 (本地 uv 沙箱 / 生产 mcphub-server SSE)
          → 拿到 stdout/stderr (Observation)
          → LLM 评估结果是否符合预期
        Round 2-4 (如果不符合):
          → 把错误反馈给 LLM → 重新生成代码 → 再执行
        符合预期:
          → LLM 总结润色 → answer 代码块 → 返回
      ```

4.  数据源抽象设计与演进专题（NL2DSL2SQL → NL2SQL → NL2Python）
    表达力天花板——数据分析的归因/预测/文本处理需求远超 SQL 能力，而 Python 的"执行→观察 stdout→修正"ReAct 闭环天然适配 LLM 试错能力。同时 ArtifactManager 的权重衰减、跨步骤复用、自描述机制解决了产物管理的工程问题。
    - V1：DSL 只支持 SELECT/WHERE/GROUP BY/ORDER BY，无法表达窗口函数、子查询、CASE WHEN；每次全量拉取到内存（10万条上限）；两层 LLM 调用延迟高
    - V2：SQL 方言受限于 alasql 子集（不支持 JOIN/WITH/STDDEV），统计分析能力仍需额外 nl-python-analysis 工具
    - V3：IDataSourceAdapter 移除了 executeQuery，数据源层只负责 getSchema + getData（拉取原始二维数组），查询和分析全部交给 Python 沙箱

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
