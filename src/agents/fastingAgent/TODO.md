# fastingAgent TODO

## Summary

目标是把当前 `fastingAgent` 从一个基于 `ToolLoopAgent` 的轻断食问答 demo，逐步演进成一个能系统实践 harness engineering 的丰满 agent。

实施原则：

- 一次只做一个能力块
- 每一步都能运行和观察
- 先搭骨架，再补功能
- 先保留 AI SDK / `ToolLoopAgent`，必要时再评估迁到 Mastra 风格 runtime

## TODO

### Phase 0：现状盘点

- [ ] 明确当前 `fastingAgent` 已有能力：prompt、BMI 工具、时间工具、step loop、telemetry 开关
- [ ] 明确当前缺失能力：session、memory、权限、skills、risk、evals、服务端 API
- [ ] 输出一份“当前 demo vs 目标 harness”的差距清单

### Phase 1：Harness 骨架

- [ ] 定义固定任务类型：
  - `onboarding`
  - `planning`
  - `daily_support`
  - `checkin`
  - `review`
  - `risk_triage`
- [ ] 定义统一 `AgentResponse`
- [ ] 定义核心接口：
  - `classifyTask`
  - `buildContext`
  - `authorize`
  - `runTurn`
  - `commitMemory`
  - `evaluateRisk`

### Phase 2：上下文与会话

- [ ] 完成 `session.ts`，支持多轮会话状态
- [ ] 区分三层上下文：
  - `request context`
  - `session context`
  - `long-term context`
- [ ] 引入历史摘要机制，避免上下文无限膨胀

### Phase 3：Memory

- [ ] 定义 memory schema：
  - `conversation_history`
  - `working_memory`
  - `profile_memory`
  - `plan_memory`
  - `risk_memory`
- [ ] 定义结构化 memory patch
- [ ] 第一版先用内存/mock 持久化跑通流程

### Phase 4：Tools 与权限

- [ ] 重构所有工具返回结构：
  - `ok`
  - `data`
  - `error`
  - `retryable`
  - `safetyImpact`
- [ ] 给工具分级：
  - `L1 safe tools`
  - `L2 profile tools`
  - `L3 plan tools`
  - `L4 sensitive tools`
- [ ] 建立三层权限模型：
  - `task permission`
  - `skill permission`
  - `tool permission`

### Phase 5：Skills / Subagents

- [ ] 定义 skill registry
- [ ] 第一版 skills：
  - `profile-intake`
  - `plan-designer`
  - `daily-coach`
  - `risk-guard`
  - `review-analyst`
- [ ] 把主 orchestrator 和 skill 执行器分离

### Phase 6：Guardrails

- [ ] 落地输入防护：
  - prompt injection
  - 空输入/超长输入
  - 越权请求
- [ ] 落地过程防护：
  - 非法 tool call
  - 超预算
  - 异常循环
  - 非法 memory write
- [ ] 落地输出防护：
  - 危险减重建议
  - 医疗诊断/药物建议
  - 过度承诺

### Phase 7：Observability

- [ ] 统一结构化日志
- [ ] 接 trace / telemetry
- [ ] 统计 token、latency、estimated cost
- [ ] 定义统一事件模型：
  - `task_classified`
  - `tool_called`
  - `tool_failed`
  - `memory_written`
  - `risk_triggered`
  - `response_sent`

### Phase 8：Eval Harness

- [ ] 建立普通任务集
- [ ] 建立风险任务集
- [ ] 建立工具失败任务集
- [ ] 建立多轮上下文任务集
- [ ] 增加规则评测
- [ ] 增加 LLM 评测
- [ ] 建立回归入口

### Phase 9：产品化体验

- [ ] 把当前断食页面升级为 agent 驱动页面
- [ ] 让 agent 输出结构化 `actions`
- [ ] 支持建档、计划、打卡、复盘的 UI 展示

### Phase 10：框架演进判断

- [ ] 先在 AI SDK 上跑通一版完整 harness
- [ ] 记录自建成本最高的模块
- [ ] 再决定是否迁到 Mastra runtime

## Recommended Order

1. `task taxonomy + AgentResponse`
2. `session runtime + context layering`
3. `memory schema + memory patch`
4. `tool contract + permissions`
5. `skill registry + orchestrator`
6. `guardrails`
7. `observability`
8. `eval harness`
9. `UI integration`
10. `Mastra migration decision`

## Acceptance Checks

- [ ] 每一阶段完成后都能运行
- [ ] 每一阶段都有最小验证方式
- [ ] 新能力不会破坏上一阶段
- [ ] 变更效果可以被清楚观察和复盘

## Assumptions

- 当前 `fastingAgent` 仍然是 demo agent，而不是完整 harness。
- 这份 TODO 用于后续逐步实施，不追求一次性完成。
- 第一阶段默认继续沿用 AI SDK / `ToolLoopAgent`。
- Mastra 暂时作为后续 runtime 演进选项。
