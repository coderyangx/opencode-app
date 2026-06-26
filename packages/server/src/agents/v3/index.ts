/**
 * V3 Agent 模块入口
 *
 * 从 release/0826 分支迁移的最新 Agent 架构，用于学习目的。
 * 此模块完全自洽，不依赖现有运行代码，不影响现有系统。
 *
 * 架构概览:
 * - ChatAndClarifyAgent: 主入口/路由 Agent，负责意图识别与澄清
 *   ├── AnalysisReActAgent: ReAct 模式 Agent，处理简单 SQL 取数
 *   └── AnalysisPlanningExecuteAgent: 规划-执行-总结流水线 Agent
 *       ├── PlanningAgent: 将用户需求拆解为结构化分析计划
 *       ├── AnalysisAgent: 执行单个洞察目标（SQL 查询 + Python 分析）
 *       ├── EvaluationAgent: 评估执行结果（暂未启用）
 *       └── SummarizingAgent / SummarizingToReportAgent: 总结/报告生成
 *
 * 核心配套模块:
 * - model/llm: LLM 多模型提供商（美团 AIGC 平台）
 * - tools/nl-query-data: 自然语言 → SQL 查询工具
 * - tools/nl-python-analysis: 自然语言 → Python 代码分析工具（MCP）
 * - tools/generate-chart: ECharts 可视化图表生成工具
 * - trace/: Langfuse 链路追踪
 * - lib/job/pool: Agent 并发任务池
 * - datasource/service: 数据源服务接口（stub）
 */

// 核心 Agent
export { ChatAndClarifyAgent } from "./agents/clarify.js";
export { AnalysisReActAgent } from "./agents/analysis-react/index.js";
export { AnalysisPlanningExecuteAgent } from "./agents/analysis-planning-execute/index.js";

// Agent 接口类型
export type { IAgent, IAgentOptions } from "./agents/type.js";

// 规划-执行流水线子 Agent
export { PlanningAgent } from "./agents/analysis-planning-execute/planning.js";
export type { IPlanningAgentInput, IPlanningAgentOutput } from "./agents/analysis-planning-execute/planning.js";
export { AnalysisAgent } from "./agents/analysis-planning-execute/analysis.js";
export { EvaluationAgent } from "./agents/analysis-planning-execute/evaluate.js";
export type { IEvaluationAgentInput, IEvaluationAgentOutput } from "./agents/analysis-planning-execute/evaluate.js";
export { SummarizingToReportAgent } from "./agents/analysis-planning-execute/summarizing.js";
export { SummarizingAgent } from "./agents/analysis-planning-execute/summarizing-short.js";
export { AnalysisOrchestrator } from "./agents/analysis-planning-execute/orchestrator.js";

// 状态管理
export { QueryAgentState } from "./agents/analysis-react/state.js";
export { AnalysisAgentState } from "./agents/analysis-planning-execute/state.js";

// 任务管理
export { AgentTaskManager } from "./agents/analysis-planning-execute/task/manager.js";
export { AgentTaskRunner } from "./agents/analysis-planning-execute/task/runner.js";
export type { IAgentTask } from "./agents/analysis-planning-execute/task/type.js";

// 运行上下文
export type { IRunContext } from "./types/context.js";
export type { IToolFactory, IExtendedTool } from "./types/tool.js";

// LLM 模型
export { getLanguageModel } from "./model/llm.js";

// 工具工厂
export { nlDataQueryToolFactory } from "./tools/nl-query-data.js";
export { nlPythonAnalysisToolFactory } from "./tools/nl-python-analysis.js";
export { chartToolFactory } from "./tools/generate-chart.js";
export { searchToolsServerFactory } from "./tools/mcp/web-search.js";
