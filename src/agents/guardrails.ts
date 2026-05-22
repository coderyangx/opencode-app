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
