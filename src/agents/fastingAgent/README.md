# fastingAgent

## 架构

对于当前这个减肥/健康生活 agent，不建议继续只围绕 ToolLoopAgent 往上堆 TODO。真正缺的不是“再加几个 tool”，而是这些上层骨架：

- 会话 runtime
- 用户状态与长期 memory
- 任务阶段机
- 风险分级与权限边界
- eval harness
- 观测和回归机制
- 工具 tool / 技能 skill 目录与能力开关

这些如果全手写在 AI SDK 上，可以做，但会比较散；仓库里现在就已经有这种趋势：src/agents/guardrails.ts (line 1)、src/agents/logger.ts (line 1)、src/agents/session.ts (line 1) 都在往这个方向长，但还没形成统一 runtime。

## 相关文档

- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [AI SDK Core](https://sdk.vercel.ai/docs/ai-sdk-core)
- [OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
