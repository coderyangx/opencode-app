import type { UIMessage } from 'ai';

const CONTEXT_WINDOW_CHARS = 800_000;
const TOOL_RESULT_KEEP_RECENT = 4;
const TOOL_RESULT_MAX_CHARS = 200;

/** 压缩上下文 */
export function compactMessages(messages: UIMessage[]): UIMessage[] {
  const size = JSON.stringify(messages).length;
  const ratio = size / CONTEXT_WINDOW_CHARS;

  if (ratio < 0.6) return messages;

  let result = applyL1(messages);

  if (JSON.stringify(result).length / CONTEXT_WINDOW_CHARS > 0.8) {
    result = applyL2(result);
  }

  return result;
}

/* L1：截断旧消息中的 tool-invocation result，只保留前 200 字符 */
function applyL1(messages: UIMessage[]): UIMessage[] {
  const assistantIdxs = messages
    .map((m, i) => (m.role === 'assistant' ? i : -1))
    .filter((i) => i >= 0);
  const keepFrom = assistantIdxs.slice(-TOOL_RESULT_KEEP_RECENT)[0] ?? 0;

  return messages.map((msg, i) => {
    if (i >= keepFrom || msg.role !== 'assistant') return msg;
    const compactedParts = (msg.parts ?? []).map((part: unknown) => {
      const p = part as Record<string, unknown>;
      if (p.type !== 'tool-invocation') return part;
      const invocation = p.toolInvocation as Record<string, unknown> | undefined;
      const result = invocation?.result;
      if (typeof result !== 'string' || result.length <= TOOL_RESULT_MAX_CHARS) return part;
      return {
        ...p,
        toolInvocation: {
          ...invocation,
          result: result.slice(0, TOOL_RESULT_MAX_CHARS) + ' [output truncated]'
        }
      };
    });
    return { ...msg, parts: compactedParts as UIMessage['parts'] };
  });
}

/* L2：滑动窗口——保留首轮（话题锚）+ 最近 2 轮，不拆散 tool 配对 */
function applyL2(messages: UIMessage[]): UIMessage[] {
  const turns: UIMessage[][] = [];
  let current: UIMessage[] = [];

  for (const msg of messages) {
    if (msg.role === 'user' && current.length > 0) {
      turns.push(current);
      current = [];
    }
    current.push(msg);
  }
  if (current.length > 0) turns.push(current);

  if (turns.length <= 3) return messages;

  const kept = [turns[0], ...turns.slice(-2)];
  return kept.flat();
}

// L3 接口预留（暂不实现）
// export async function applyL3(messages: UIMessage[]): Promise<UIMessage[]>
