# 智能数据分析 Agent 平台 — 项目总结

## 一、项目概述

基于 **多 Agent 协作** 的智能数据分析平台，用户用自然语言提问，系统自动完成 **意图理解 → 任务规划 → NL2SQL 查询 → 数据分析 → 可视化图表 → HTML 报告** 的端到端流程。支持快搭表单、XTable 多维表格、Excel 上传等多种数据源。

**技术栈**：
**后端**：TypeScript / Hono / Vercel AI SDK / Zod / alasql / ECharts SSR / lru-cache / OpenTelemetry / Langfuse / MCP
**前端**：React / @ai-sdk/react / TailwindCSS / remark-directive / ECharts (Canvas) / lucide-react
**LLM**：GPT-4.1（主推理）/ gpt-oss-120b（代码生成）/ LongCat-Large-32K（美团自研）
**协议**：HTTP SSE（轻量对话）/ WebSocket（深度分析）/ Vercel AI Data Stream v1

---

## 二、核心技术亮点

### 1. 三代 Agent 架构演进与生产实践

项目经历了三代架构迭代，体现了对 LLM Agent 工程化的深度理解：

| 版本   | 架构模式                  | 核心特征                                                                                                                                                                                |
| ------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **V1** | 单体协调 Agent            | `MainAgent` 通过 `asToolMap()` 将子 Agent 暴露为 `handoff.*` 工具，LLM 自主调度                                                                                                         |
| **V2** | Orchestrator + DAG 流水线 | `ChatAgent → PlanningAgent → AnalysisAgent×N → SummarizingAgent`，基于 DAG 依赖调度，Node.js Worker Thread 隔离执行，WebSocket 实时推送                                                 |
| **V3** | 模块化路由 + 状态机       | `ChatAndClarifyAgent` 通过 `TransformStream` 拦截 tool-call chunk 动态路由，支持 ReAct 模式（简单查询）与 Planning-Execute 模式（复杂分析）双通道，引入 Evaluation→Re-planning 质量循环 |

**重难点**：

- 多 Agent 间的 **上下文传递与状态同步**：通过 `SessionMemory`（LRU Cache）实现跨 Agent 的 DSL/数据集/图表配置共享
- **流式输出与工具调用的交织处理**：V3 用 `TransformStream` 在流中拦截 `9:` 前缀的 tool-call chunk 实现动态路由，不破坏 SSE 流式协议
- **并发任务依赖管理**：自研 `AgentTaskManager` DAG 调度器，声明式 `addDependency()` 让 SummarizingAgent 自动等待所有并行 AnalysisAgent 完成

### 2. NL2DSL2SQL 双层翻译引擎

设计了一套 **类型安全的 DSL 中间层**，将自然语言到 SQL 的转换拆为两步：

```
用户自然语言
  → LLM (generateObject + Zod schema) → 结构化 DSL
  → DSLTranslator (Builder 模式) → 标准 SQL
  → LocalQueryEngine (alasql 内存执行) → 查询结果
```

**重难点**：

- **DSL Schema 设计**：用 Zod 定义 `from/select/where/groupBy/orderBy/limit` 完整查询语义，内置 `validateQuery()` 跨字段约束校验（groupBy 必须在 select 中、orderBy 字段合法性等）
- **SQL 注入防护**：`escapeId()` 反引号包裹标识符 + `escapeValue()` 单引号转义
- **时间戳归一化**：TIMESTAMP 字段的日期字符串比较值自动转为毫秒时间戳（考虑 UTC+8 时区偏移）
- **自定义 SQL 函数**：在 alasql 中注册 `DATE_FORMAT`（MySQL 格式 → date-fns 格式映射）和 `RAND()` 函数

**为什么选择 alasql 内存引擎**：数据已全量分页拉取到本地（快搭表单上限 10 万条），避免每次查询都打远程 API，同时支持灵活的聚合/分组/排序。

### 3. 多数据源 Strategy 模式抽象

通过 **Preset + Executor 双注册表** 实现数据源解耦：

```
Preset（定义"数据在哪"）     Executor（定义"怎么查"）
├── mock       ← 本地模拟     ├── mock       ← LocalQueryEngine
├── kuaida     ← 快搭表单API  ├── kuaida     ← 分页拉取 + alasql
├── xtable-v2  ← XTable      ├── xtable-v2  ← Mock SDK
└── file       ← Excel上传    └── file       ← XLSX解析
```

**重难点**：快搭表单的 **字段名前缀语义推断**——原始字段 ID 如 `select_dd4c38eb`、`date_264f174a`、`people_b9e25f8f` 无业务语义，通过正则前缀匹配自动推断类型（`number_`→INTEGER/metric, `select_`→ENUM/dimension, `date_`→TIMESTAMP 等 7 种规则），再配合 `formatDataRow` 将嵌套对象（`{label, value}` / `{name, mis}`）扁平化为可查询的标准格式。

### 4. 服务端 ECharts SSR + 前端交互式图表双通道

`generate-chart` 工具实现 **一图两用**：

```
LLM 生成 ECharts option
  ├─ 服务端: echarts.init({renderer:'svg', ssr:true}) → renderToSVGString() → S3 存储 → 静态 URL
  └─ 前端: :::echarts directive → fetch config → echarts.init({renderer:'canvas'}) → 交互式图表
```

**重难点**：

- **无 DOM 环境的服务端 SVG 渲染**：ECharts SSR 模式初始化时 `null` 代替 DOM 节点，需确保服务端有 PingFang SC 等中文字体
- **Markdown Directive 系统**：基于 `remark-directive` + `remark-directive-rehype` 自定义 `:::echarts{id=xxx}` / `:::hidden` 块指令，前端按需引入 ECharts 模块（tree-shaking）
- **配置内嵌优化**：将 chart 配置 base64 编码后直接嵌入 directive 属性，避免前端二次 fetch，解决 cookie 丢失导致的空白问题

### 5. 全链路可观测性：OpenTelemetry → Langfuse

自研 **LangfuseExporter**（470 行），将 Vercel AI SDK 的 OpenTelemetry Span 转换为 Langfuse 的 Trace/Generation/Span 三层模型：

```
AI SDK experimental_telemetry
  → NodeSDK (auto-instrumentations)
  → LangfuseExporter (自定义 SpanExporter)
  → Langfuse Client API
```

**重难点**：

- **Span → Generation 识别**：名称含 `doGenerate/doStream/doEmbed` 的 span 需提取 model/usage/parameters 等详细信息
- **业务上下文注入**：通过 `ai.telemetry.metadata.*` 属性提取 sessionId/userId/langfuseTraceId/tags，实现业务 traceId 与 LLM trace 的关联
- **双 Tracer 模式**（V3）：普通 trace 发送默认 Langfuse 项目，E2E 评估 trace 发送独立项目，支持自动化质量评估

### 6. NL-Python-Analysis ReAct 循环（640+ 行，最复杂工具）

实现 **自然语言 → Python 代码生成 → MCP 沙箱执行 → 结果评估 → 自动修复** 的完整 ReAct 循环：

```
用户分析需求
  → LLM (gpt-oss-120b) 生成 Python 分析代码
  → MCP Code Interpreter 执行 (本地 uv 沙箱 / 生产 mcphub-server SSE)
  → 结果评估: stdout/stderr 是否符合预期
  ├─ 符合 → LLM 总结润色 → 返回
  └─ 不符合 → Observation 反馈 → 重新生成（最多 4 轮）
```

**重难点**：

- **MCP (Model Context Protocol) 集成**：本地用 `Experimental_StdioMCPTransport`，生产用 SSE transport，需处理两种传输层差异
- **代码模板注入**：`CODE_TEMPLATE_FACTORY` 将 LLM 生成的分析逻辑注入到含数据获取脚手的模板中，上游 query-data 结果存为 JSON 供 Python 下载
- **去重导入处理**：LLM 可能生成重复 import 语句，`removeDuplicatedImports()` 自动清理

### 7. 流式协议双通道：HTTP SSE + WebSocket

| 通道     | 协议      | 场景           | 技术                                                |
| -------- | --------- | -------------- | --------------------------------------------------- |
| 轻量对话 | HTTP SSE  | datasheet-chat | `@ai-sdk/react` useChat + `streamProtocol: 'data'`  |
| 深度分析 | WebSocket | deep-analysis  | 自研 `useDeepAnalysisState` + Orchestrator 消息协议 |

**WS 协议设计**：心跳（PING/PONG）、断线重连（`orchestrator.reconnect()` 重放消息队列）、延迟清理（关闭 1h 后才销毁 orchestrator，容忍短暂断网）

---

## 三、重难点总结

### 工程难点

1. **多 Agent 上下文传递**：不同 Agent 需共享 DSL、数据集、图表配置，通过 `SessionMemory`（LRU Cache）+ `query_id` 引用传递解决，而非在 prompt 中传递大量数据
2. **流式输出中工具调用的时序问题**：`maxSteps` 设置过低导致 LLM 编造 `query_id`；`memory` 赋值在 `agent.run()` 之后导致 DSL 未存储——需要精确控制初始化时序
3. **Cookie 在 SSE 响应中丢失**：`toDataStreamResponse()` 返回全新 Response 对象，Hono 的 `setCookie` 头不会自动携带，需手动复制
4. **服务端中文字体渲染**：ECharts SSR 生成 SVG 需确保服务端安装 PingFang SC / microsoft yahei 字体

### 架构决策

1. **DSL 中间层 vs 直接 NL2SQL**：V1/V2 用 DSL 中间层（类型安全 + 可校验），V3 简化为直接 NL2SQL（减少一次 LLM 调用，依赖 LLM 准确性）
2. **alasql 内存引擎 vs 远程数据库**：数据已全量拉取到本地，内存 SQL 避免多次网络请求，牺牲了大数据量性能换取灵活性
3. **Worker Thread 隔离**：V2 中每个 Agent 在独立 Worker 中运行，避免 CPU 密集型分析阻塞主线程

---

## 四、设计模式汇总

| 模式                      | 应用位置                                        |
| ------------------------- | ----------------------------------------------- |
| **Orchestrator-Worker**   | V2/V3 的多 Agent 协调                           |
| **Strategy Pattern**      | Preset/Executor 数据源抽象                      |
| **Builder Pattern**       | DSL-to-SQL 翻译器                               |
| **Factory Pattern**       | Tool Factory (`IToolFactory`)                   |
| **DAG 调度**              | AgentTaskManager 任务依赖                       |
| **Router/Dispatcher**     | ChatAndClarifyAgent 的子 Agent 路由             |
| **Observer/EventEmitter** | Orchestrator 任务事件驱动                       |
| **Adapter Pattern**       | LangfuseExporter (OTel Span → Langfuse API)     |
| **Template Method**       | BaseAgent.asToolMap() / code template injection |
| **LRU Cache**             | MemoryS3, SessionMemory, ToolCacheManager       |

---

## 五、简历一句话版本

> 基于 Vercel AI SDK + Hono 构建多 Agent 智能数据分析平台，设计三代 Agent 架构演进（单体协调 → DAG 流水线 → 模块化路由状态机），实现 NL2DSL2SQL 双层翻译引擎、多数据源 Strategy 抽象、ECharts SSR 双通道图表、OpenTelemetry→Langfuse 全链路追踪、MCP Python 代码生成 ReAct 循环，支持快搭表单/XTable/Excel 多种数据源的自然语言查询、分析与可视化报告生成
