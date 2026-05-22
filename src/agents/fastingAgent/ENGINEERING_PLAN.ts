/**
 * ============================================================
 * Agent 工程化升级计划
 * ============================================================
 *
 * 当前状态：可运行的 Demo（fastingAgent）
 * 目标状态：可维护、可观测、生产级的 Agent 系统
 *
 * 优先级说明：
 *   P0 = 阻塞生产上线，必须完成
 *   P1 = 显著影响用户体验，应尽早完成
 *   P2 = 工程质量提升，迭代中完成
 *
 * 参考：claude-code / 智能客服 / 模拟面试等生产级 Agent 的实践
 * ============================================================
 */

// ============================================================
// PHASE 1：基础能力补齐（P0）
// 预计工时：3~5 天
// ============================================================

/**
 * TODO 1.1 — 对话状态管理（Multi-turn Memory）          [P0]
 *
 * 问题：当前每次 generate() 都是独立调用，LLM 无法记住上下文。
 *       用户问"我适合什么方案？"时 LLM 不知道他之前说过"我70kg"。
 *
 * 方案：实现 ConversationSession 类，维护 messages[] 历史。
 *
 * 文件：新建 src/agents/session.ts
 *
 * 接口设计：
 *
 *   class ConversationSession {
 *     private sessionId: string
 *     private messages: ModelMessage[] = []
 *
 *     // 追加用户消息，调用 Agent，追加 Assistant 消息，返回结果
 *     async send(userInput: string): Promise<string>
 *
 *     // 流式版本
 *     async *sendStream(userInput: string): AsyncGenerator<string>
 *
 *     // 获取当前完整历史（用于持久化）
 *     getHistory(): ModelMessage[]
 *
 *     // 从持久化数据恢复（如从 DB/Redis 加载）
 *     static fromHistory(sessionId: string, messages: ModelMessage[]): ConversationSession
 *
 *     // 清除历史（开启新话题）
 *     reset(): void
 *   }
 *
 * 关键实现细节：
 *   - 每次 agent.generate() 传入完整 messages 数组
 *   - 返回后把 result.response.messages 追加回 this.messages
 *   - 注意 ToolLoopAgent 的多步骤：只追加最终 assistant 消息，不追加中间步骤
 *
 * 使用方式：
 *   const session = new ConversationSession(fastingAgent)
 *   await session.send('我体重70kg') // step 1
 *   await session.send('适合什么方案？') // step 2（LLM 知道70kg）
 */

// ============================================================

/**
 * TODO 1.2 — tool 工具调用错误处理与结构化返回                    [P0]
 *
 * 问题：当前 execute() 无 try/catch，工具抛异常会导致整个 generate() 崩溃。
 *       LLM 没有机会感知工具失败并做降级处理。
 *
 * 方案：统一工具返回格式，区分成功/失败，让 LLM 自主决策。
 *
 * 文件：修改 src/agents/agent.ts 中的工具定义
 *
 * 统一返回类型：
 *
 *   type ToolResult<T> =
 *     | { ok: true; data: T }
 *     | { ok: false; error: string; retryable: boolean }
 *
 * 改造示例（以未来可能的外部API工具为例）：
 *
 *   const getFastingRecordTool = tool({
 *     description: '查询用户的断食记录',
 *     inputSchema: z.object({ userId: z.string() }),
 *     execute: async ({ userId }) => {
 *       try {
 *         const record = await db.query(userId)
 *         if (!record) return { ok: false, error: 'user not found', retryable: false }
 *         return { ok: true, data: record }
 *       } catch (err) {
 *         const isNetwork = err.code === 'ECONNREFUSED'
 *         return { ok: false, error: err.message, retryable: isNetwork }
 *       }
 *     }
 *   })
 *
 * 对当前工具的处理：
 *   - calculateBMITool：加输入边界校验（weight/height 不能为负数或超大值）
 *   - getCurrentTimeTool：几乎不会出错，但加 try/catch 作为示范
 */

// ============================================================

/**
 * TODO 1.3 — 密钥和配置安全化                           [P0]
 *
 * 问题：src/agents/model.ts 第17行 apiKey 硬编码在源码里。
 *       src/agents/model.ts 第20行 import.meta.env 在 Node.js 环境崩溃。
 *
 * 方案：
 *   1. 所有密钥移入 .env（已有），通过 process.env 读取
 *   2. model.ts 彻底去掉 import.meta.env
 *   3. 加启动时环境变量校验，缺失时抛出清晰错误
 *
 * 文件：修改 src/agents/model.ts
 *
 * 实现：
 *
 *   function requireEnv(key: string): string {
 *     const value = process.env[key]
 *     if (!value) throw new Error(`Missing required env var: ${key}`)
 *     return value
 *   }
 *
 *   export const defaultModel = createModel({
 *     baseURL: requireEnv('OPENAI_BASE_URL'),
 *     apiKey: requireEnv('OPENAI_API_KEY'),
 *   })
 *
 * .env 需要补充：
 *   OPENAI_BASE_URL=https://api.ofox.ai/v1
 *   OPENAI_API_KEY=sk-of-xxxx
 *   OPENAI_MODEL_ID=z-ai/glm-4.7-flash:free
 */

// ============================================================
// PHASE 2：可观测性（P1）
// 预计工时：2~3 天
// ============================================================

/**
 * TODO 2.1 — 结构化日志替换 console.log                  [P1]
 *
 * 问题：当前 onStepFinish 直接 console.log(step)，输出是整个对象，
 *       生产环境无法聚合、告警、关联追踪。
 *
 * 方案：实现轻量级结构化日志器，每条日志带固定字段。
 *
 * 文件：新建 src/agents/logger.ts
 *
 * 日志结构（JSON Lines 格式）：
 *
 *   {
 *     "timestamp": "2026-04-21T10:00:00.000Z",
 *     "level": "info" | "warn" | "error",
 *     "sessionId": "xxx",
 *     "traceId": "yyy",      // 对应 OpenTelemetry trace
 *     "event": "step_finish" | "tool_call" | "tool_result" | "finish",
 *     "stepNumber": 1,
 *     "toolName": "calculateBMI",   // 仅 tool 相关事件
 *     "latencyMs": 234,
 *     "tokenUsage": { "inputTokens": 500, "outputTokens": 150 },
 *     "finishReason": "stop" | "tool-calls" | "max-steps"
 *   }
 *
 * onStepFinish 改造：
 *
 *   onStepFinish: (step) => {
 *     logger.info({
 *       event: 'step_finish',
 *       stepNumber: step.stepNumber,
 *       finishReason: step.finishReason,
 *       tokenUsage: step.usage,
 *       toolCalls: step.toolCalls?.map(tc => ({
 *         name: tc.toolName,
 *         inputSummary: JSON.stringify(tc.input).slice(0, 100)  // 截断敏感/大型输入
 *       }))
 *     })
 *   }
 */

// ============================================================

/**
 * TODO 2.2 — OpenTelemetry 接入                          [P1]
 *
 * 问题：experimental_telemetry 已启用但没有接收端，数据没有落地。
 *
 * 方案：接入本地 Jaeger 或云端 Langfuse，实现完整 Trace 可视化。
 *
 * 文件：新建 src/agents/telemetry.ts，修改 demo.ts 和未来的 server 入口
 *
 * 依赖安装：
 *   npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
 *   npm install @opentelemetry/exporter-trace-otlp-http  # 对接 Jaeger/Langfuse
 *
 * 初始化代码（在 Node.js 进程最早执行）：
 *
 *   // src/agents/telemetry.ts
 *   import { NodeSDK } from '@opentelemetry/sdk-node'
 *   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
 *
 *   export function initTelemetry() {
 *     const sdk = new NodeSDK({
 *       traceExporter: new OTLPTraceExporter({
 *         url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces'
 *       }),
 *       serviceName: 'fasting-agent'
 *     })
 *     sdk.start()
 *     process.on('SIGTERM', () => sdk.shutdown())
 *   }
 *
 * 接入效果：
 *   - 每次 Agent 调用 = 一条 Trace
 *   - 每个 step / tool call = 一个 Span
 *   - 在 Jaeger UI 可以看到：LLM调用耗时、tool执行耗时、总耗时、token数
 *
 * 本地测试（Docker）：
 *   docker run -d -p 16686:16686 -p 4318:4318 jaegertracing/all-in-one
 *   # 访问 http://localhost:16686 查看 trace
 *
 * 云端推荐：Langfuse（支持 LLM 专属的 prompt/output 展示）
 *   LANGFUSE_PUBLIC_KEY=xxx
 *   LANGFUSE_SECRET_KEY=xxx
 *   OTEL_EXPORTER_OTLP_ENDPOINT=https://cloud.langfuse.com/api/public/otel
 */

// ============================================================

/**
 * TODO 2.3 — 成本追踪与预算控制                          [P1]
 *
 * 问题：当前无法知道每次对话消耗了多少 token/费用，无法控制成本。
 *
 * 方案：在 onFinish 中累计 token，设置单次对话硬上限。
 *
 * 文件：修改 src/agents/agent.ts，新建 src/agents/costTracker.ts
 *
 * 实现：
 *
 *   // 模型单价（按实际模型调整）
 *   const PRICE_PER_1K_INPUT_TOKENS = 0.001   // USD
 *   const PRICE_PER_1K_OUTPUT_TOKENS = 0.003  // USD
 *
 *   onFinish: (event) => {
 *     const totalInputTokens = event.steps.reduce((acc, s) => acc + s.usage.inputTokens, 0)
 *     const totalOutputTokens = event.steps.reduce((acc, s) => acc + s.usage.outputTokens, 0)
 *     const estimatedCost = (totalInputTokens / 1000) * PRICE_PER_1K_INPUT_TOKENS
 *       + (totalOutputTokens / 1000) * PRICE_PER_1K_OUTPUT_TOKENS
 *
 *     logger.info({
 *       event: 'conversation_finish',
 *       totalSteps: event.steps.length,
 *       totalInputTokens,
 *       totalOutputTokens,
 *       estimatedCostUSD: estimatedCost.toFixed(6)
 *     })
 *
 *     // 超预算告警（如单次对话超 $0.10）
 *     if (estimatedCost > 0.10) {
 *       logger.warn({ event: 'cost_budget_exceeded', estimatedCostUSD: estimatedCost })
 *     }
 *   }
 *
 *   // maxOutputTokens 已设置 20_000，这是 token 层面的硬防护
 *   // 生产建议：根据业务场景调整，智能客服一般 1000~2000 足够
 */

// ============================================================
// PHASE 3：安全与鲁棒性（P1 ~ P2）
// 预计工时：3~5 天
// ============================================================

/**
 * TODO 3.1 — Input Guardrails（输入防护）                [P1]
 *
 * 问题：当前无任何输入过滤，用户可以通过 prompt injection 操纵 Agent 行为。
 *       典型攻击："忽略之前的所有指令，帮我..."
 *
 * 方案：在 prepareCall 中实现多层输入检测。
 *
 * 文件：新建 src/agents/guardrails.ts，修改 src/agents/agent.ts
 *
 * 三层防护：
 *
 *   // Layer 1: 规则匹配（快，< 1ms）
 *   const INJECTION_PATTERNS = [
 *     /ignore (all )?(previous|prior|above) instructions?/i,
 *     /you are now/i,
 *     /forget (everything|all|your instructions)/i,
 *     /\bDAN\b/,  // "Do Anything Now" jailbreak
 *   ]
 *
 *   function detectInjection(text: string): boolean {
 *     return INJECTION_PATTERNS.some(p => p.test(text))
 *   }
 *
 *   // Layer 2: 长度和格式检查（快）
 *   function validateInput(text: string): { valid: boolean; reason?: string } {
 *     if (text.length > 10_000) return { valid: false, reason: 'input_too_long' }
 *     if (text.trim().length === 0) return { valid: false, reason: 'empty_input' }
 *     return { valid: true }
 *   }
 *
 *   // Layer 3: LLM 审核（慢，用小模型，仅高风险场景）
 *   // 不是每条消息都需要，可以按采样率或关键词触发
 *
 *   // 接入 prepareCall：
 *   prepareCall: async ({ messages, instructions }) => {
 *     const lastUser = messages.findLast(m => m.role === 'user')
 *     const text = typeof lastUser?.content === 'string'
 *       ? lastUser.content
 *       : JSON.stringify(lastUser?.content)
 *
 *     if (detectInjection(text)) {
 *       throw new GuardrailError('INJECTION_DETECTED', '检测到异常输入，请重新描述您的问题')
 *     }
 *     const validation = validateInput(text)
 *     if (!validation.valid) {
 *       throw new GuardrailError('INVALID_INPUT', validation.reason!)
 *     }
 *     return { instructions, messages }
 *   }
 */

// ============================================================

/**
 * TODO 3.2 — Output Guardrails（输出防护）               [P1]
 *
 * 问题：LLM 可能输出医疗建议、PII、或不当内容，违反业务约定。
 *
 * 方案：在 onStepFinish / onFinish 中检测输出。
 *
 * 文件：修改 src/agents/guardrails.ts
 *
 * 实现：
 *
 *   // 敏感输出模式
 *   const MEDICAL_ADVICE_PATTERNS = [
 *     /你(应该|需要|必须)(服用|吃|注射)/i,
 *     /建议(你|您)(去医院|手术|输液)/i,
 *   ]
 *
 *   // PII 检测（手机号、身份证等）
 *   const PII_PATTERNS = [
 *     /1[3-9]\d{9}/,            // 手机号
 *     /\d{17}[\dX]/,            // 身份证
 *   ]
 *
 *   function scanOutput(text: string): OutputScanResult {
 *     if (MEDICAL_ADVICE_PATTERNS.some(p => p.test(text))) {
 *       return { safe: false, type: 'medical_advice' }
 *     }
 *     if (PII_PATTERNS.some(p => p.test(text))) {
 *       return { safe: false, type: 'pii_detected' }
 *     }
 *     return { safe: true }
 *   }
 *
 *   // 在 onFinish 中使用：
 *   onFinish: (event) => {
 *     const scan = scanOutput(event.text ?? '')
 *     if (!scan.safe) {
 *       logger.warn({ event: 'output_guardrail_triggered', type: scan.type })
 *       // 根据业务：可以替换回复、通知人工审核、或直接丢弃
 *     }
 *   }
 */

// ============================================================

/**
 * TODO 3.3 — 工具审批机制（High-Risk Tool Approval）      [P2]
 *
 * 问题：未来如果增加"写入数据库"、"发送通知"等有副作用的工具，
 *       LLM 可能在用户不知情的情况下执行写操作。
 *
 * 方案：利用 AI SDK 内置的 needsApproval 机制实现两阶段确认。
 *
 * 文件：修改 src/agents/agent.ts
 *
 * 实现（以未来的 saveFastingPlan 工具为例）：
 *
 *   const saveFastingPlanTool = tool({
 *     description: '保存用户的断食计划到数据库',
 *     inputSchema: z.object({
 *       userId: z.string(),
 *       plan: z.enum(['16:8', '5:2', '24h']),
 *       startDate: z.string()
 *     }),
 *
 *     // 高风险写操作：每次都需要用户确认
 *     needsApproval: async ({ input }) => {
 *       logger.info({ event: 'tool_approval_requested', tool: 'saveFastingPlan', input })
 *       return true  // 返回 true = 需要审批，触发 UI 弹窗
 *     },
 *
 *     execute: async ({ userId, plan, startDate }) => {
 *       const requestId = crypto.randomUUID()  // 幂等 ID 防重复执行
 *       try {
 *         await db.fastingPlans.upsert({ userId, plan, startDate }, { requestId })
 *         return { ok: true, savedAt: new Date().toISOString() }
 *       } catch (err) {
 *         return { ok: false, error: err.message, retryable: err.code !== 'CONFLICT' }
 *       }
 *     }
 *   })
 *
 * 前端配合（React + useChat）：
 *   - 监听 part.type === 'tool-saveFastingPlan' 且 part.state === 'input-available'
 *   - 展示确认弹窗，用户点击"确认"后调用 addToolOutput()
 *   - 用户点击"拒绝"后传入拒绝理由，Agent 自动生成取消回复
 */

// ============================================================

/**
 * TODO 3.4 — 错误恢复与模型降级（Fallback）               [P2]
 *
 * 问题：主模型不可用时（API 宕机、限流、余额不足），整个 Agent 崩溃。
 *
 * 方案：实现模型降级链（Fallback Chain）。
 *
 * 文件：修改 src/agents/model.ts
 *
 * 实现：
 *
 *   const MODEL_FALLBACK_CHAIN = [
 *     () => createModel({ baseURL: PRIMARY_URL, apiKey: PRIMARY_KEY }),   // 主力
 *     () => createModel({ baseURL: BACKUP_URL, apiKey: BACKUP_KEY }),     // 备用
 *     () => openai('gpt-4o-mini'),                                         // 最终兜底
 *   ]
 *
 *   // 带降级的 generate（包装 ToolLoopAgent）
 *   async function generateWithFallback(prompt: string, messages?: ModelMessage[]) {
 *     for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
 *       try {
 *         const model = MODEL_FALLBACK_CHAIN[i]()
 *         const agent = fastingAgent  // 或 new ToolLoopAgent({ model, ...settings })
 *         return await agent.generate({ prompt, messages })
 *       } catch (err) {
 *         const isLastFallback = i === MODEL_FALLBACK_CHAIN.length - 1
 *         if (isLastFallback) throw err
 *
 *         logger.warn({ event: 'model_fallback', attempt: i + 1, error: err.message })
 *       }
 *     }
 *   }
 *
 * 注意：ToolLoopAgent 实例在创建时绑定了 model，降级需要重建实例或
 *       使用 prepareCall 动态切换 model 字段（AI SDK 支持在 prepareCall 中返回新 model）
 */

// ============================================================
// PHASE 4：Prompt 工程（P2）
// 预计工时：持续迭代
// ============================================================

/**
 * TODO 4.1 — System Prompt 结构化重构                    [P2]
 *
 * 问题：当前 fastingInstruction 是纯描述性文本，没有：
 *       - 工具使用决策规则（什么时候调哪个工具）
 *       - 输出格式约束
 *       - 边界情况处理
 *
 * 方案：按四层结构重写 instructions。
 *
 * 文件：修改 src/agents/agent.ts
 *
 * 新的指令结构：
 *
 *   const fastingInstruction = `
 *   ## 角色
 *   你是一个专业的轻断食健康助手。只回答与断食、健康饮食相关的问题。
 *
 *   ## 工具使用规则
 *   - 当用户提到具体体重/身高数字时，**必须**调用 calculateBMI 工具后再给建议
 *   - 当用户询问"现在"、"今天"、"当前时间"等时间信息时，调用 getCurrentTime 工具
 *   - 其他情况直接回答，不要无故调用工具
 *
 *   ## 输出规范
 *   - 回复长度：200~500 字，不要过短也不要过长
 *   - 语气：专业但亲切，像营养师朋友
 *   - 如果给出建议，用有序列表格式
 *
 *   ## 边界处理
 *   - 用户问医疗诊断/药物/手术：礼貌拒绝并建议就医
 *   - 用户问与断食无关的话题：说明你的专业范围，引导回正题
 *   - 用户BMI < 18：警示偏瘦风险，不建议断食，建议就医
 *   - 用户BMI > 35：提示高风险，建议在医生指导下进行
 *
 *   ## 禁止事项
 *   - 不能给出具体药物名称或剂量
 *   - 不能承诺减重效果（如"保证瘦10斤"）
 *   - 不能声称自己是人类或医生
 *   `
 */

// ============================================================

/**
 * TODO 4.2 — 动态 Prompt（基于用户画像）                  [P2]
 *
 * 问题：所有用户收到相同指令，无法个性化。
 *
 * 方案：使用 prepareCall 在每次调用前动态注入用户上下文。
 *
 * 文件：修改 src/agents/agent.ts，新建 src/agents/userContext.ts
 *
 * 实现：
 *
 *   type UserProfile = {
 *     userId: string
 *     name?: string
 *     bmi?: number
 *     currentPlan?: '16:8' | '5:2' | '24h'
 *     fastingStartDate?: string
 *     medicalFlags?: string[]  // 如 ['diabetes', 'hypertension']
 *   }
 *
 *   // 工厂函数，根据用户画像生成个性化 Agent
 *   function createPersonalizedAgent(userProfile: UserProfile): ToolLoopAgent {
 *     return new ToolLoopAgent({
 *       model: defaultModel,
 *       instructions: buildPersonalizedInstructions(userProfile),  // 动态拼接指令
 *       tools: { ... },
 *       stopWhen: [stepCountIs(10), isLoopFinished()]
 *     })
 *   }
 *
 *   function buildPersonalizedInstructions(profile: UserProfile): string {
 *     let extra = ''
 *     if (profile.bmi) extra += `\n用户当前 BMI: ${profile.bmi}（${getBMICategory(profile.bmi)}）`
 *     if (profile.currentPlan) extra += `\n用户当前执行: ${profile.currentPlan} 断食方案`
 *     if (profile.medicalFlags?.length) {
 *       extra += `\n⚠️ 用户有以下健康标记: ${profile.medicalFlags.join(', ')}，建议格外谨慎`
 *     }
 *     return fastingInstruction + extra
 *   }
 */

// ============================================================
// PHASE 5：前端集成（P2）
// 预计工时：2~3 天
// ============================================================

/**
 * TODO 5.1 — React useChat 集成                          [P2]
 *
 * 问题：当前 Agent 只能在 Node.js 脚本里运行，无法接入前端 UI。
 *
 * 方案：创建 API Route，使用 createAgentUIStreamResponse 桥接前端。
 *
 * 文件：
 *   后端：src/api/agent.ts（或 Express route）
 *   前端：src/pages/Fasting/ChatPage.tsx（利用现有 Fasting 目录）
 *
 * 后端 API（以 Express 为例）：
 *
 *   import { createAgentUIStreamResponse } from 'ai'
 *
 *   router.post('/api/agent/fasting', async (req, res) => {
 *     const { uiMessages } = req.body
 *     const response = createAgentUIStreamResponse({
 *       agent: fastingAgent,
 *       uiMessages,    // 注意：是 uiMessages 不是 messages（见 common-errors.md）
 *     })
 *     response.pipeToResponse(res)
 *   })
 *
 * 前端（React）：
 *
 *   import { useChat } from '@ai-sdk/react'
 *   import type { InferAgentUIMessage } from 'ai'
 *   import type { typeof fastingAgent } from '../agents'
 *
 *   type FastingMessage = InferAgentUIMessage<typeof fastingAgent>
 *
 *   function FastingChat() {
 *     const { messages, input, handleInputChange, handleSubmit } = useChat<FastingMessage>({
 *       api: '/api/agent/fasting'
 *     })
 *
 *     return (
 *       <div>
 *         {messages.map(msg => (
 *           <MessageBubble key={msg.id} message={msg} />
 *         ))}
 *         <form onSubmit={handleSubmit}>
 *           <input value={input} onChange={handleInputChange} />
 *           <button type="submit">发送</button>
 *         </form>
 *       </div>
 *     )
 *   }
 *
 * 类型安全的工具渲染（利用 InferAgentUIMessage）：
 *
 *   function MessageBubble({ message }: { message: FastingMessage }) {
 *     return (
 *       <div>
 *         {message.parts.map((part, i) => {
 *           switch (part.type) {
 *             case 'text':
 *               return <p key={i}>{part.text}</p>
 *             case 'tool-calculateBMI':
 *               // part.input 和 part.output 都有完整类型推断！
 *               if (part.state === 'output-available') {
 *                 return (
 *                   <BMICard key={i}
 *                     weight={part.input.weight}
 *                     height={part.input.height}
 *                     bmi={part.output.bmi}
 *                     category={part.output.category}
 *                   />
 *                 )
 *               }
 *               return <div key={i}>计算中...</div>
 *             case 'tool-getCurrentTime':
 *               return null  // 时间工具调用不需要在 UI 里展示
 *             default:
 *               return null
 *           }
 *         })}
 *       </div>
 *     )
 *   }
 */

// ============================================================
// 总览：执行路线图
// ============================================================

/**
 * 建议执行顺序：
 *
 * Week 1（P0 基础能力）：
 *   ✅ 1.1 对话状态管理（ConversationSession）   — 最影响用户体验
 *   ✅ 1.2 工具错误处理（try/catch + 结构化返回）  — 稳定性前提
 *   ✅ 1.3 配置安全化（环境变量 + 启动校验）       — 安全基线
 *
 * Week 2（P1 可观测性 + 安全）：
 *   ✅ 2.1 结构化日志（JSON Lines）
 *   ✅ 2.2 OpenTelemetry 接入（Langfuse 推荐）
 *   ✅ 2.3 成本追踪
 *   ✅ 3.1 Input Guardrails（注入检测）
 *   ✅ 3.2 Output Guardrails（医疗建议检测）
 *
 * Week 3（P2 产品化）：
 *   ✅ 4.1 Prompt 结构化重构（四层格式）
 *   ✅ 5.1 React useChat 前端集成
 *
 * 持续迭代：
 *   ✅ 3.4 模型降级策略
 *   ✅ 4.2 动态 Prompt（用户画像）
 *   ✅ 3.3 工具审批机制（有写操作工具后）
 *
 * 关键指标（完成标志）：
 *   - 错误率 < 0.1%（工具失败不导致 Agent 崩溃）
 *   - P99 延迟 < 5s（首个 token 到达时间）
 *   - 单次对话成本 < $0.05
 *   - Guardrail 触发率 < 1%（正常用户不误拦）
 */

export {}; // 使本文件成为合法的 TypeScript 模块
