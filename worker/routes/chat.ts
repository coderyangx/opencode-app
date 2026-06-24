import { Hono } from 'hono';
import {
  isLoopFinished,
  stepCountIs,
  convertToModelMessages,
  streamText,
  type UIMessage,
  type TextUIPart,
  generateId,
  consumeStream
} from 'ai';
import { getModel } from '../lib/model';
import { buildSystemPrompt } from '../lib/system-prompt';
import {
  loadChat,
  saveUserMessage,
  saveAssistantMessage,
  markMessageStatus,
  generateTitle
} from '../lib/chat-store';
import { createSupabaseAdmin } from '../lib/supabase';
import { NotFoundError } from '../util/errors';
import { logger } from '../util/logger';
import type { Env, Variables } from '../index';

/**
 * TODO：流式断连和恢复、网络关闭和切会话重连、真正的流式恢复(比较复杂，需实时写入 KV，MVP不建议做)
  前后端 status: 'done'正常完成 | 'streaming'流式中 | 'error'出错 | 'interrupted'用户中断/断联
  断连发生
      ↓
  onError 回调触发
      ↓
  后端将 assistantMsgId 标记为 status='interrupted'（已实现）
      ↓
  前端 toast 提示"生成被中断"
      ↓
  消息气泡底部显示[继续生成]按钮（而不是重新生成）
      ↓
  用户点击 → 发送特殊指令 → 后端检测到 isContinuation 场景进行续写
*/
const chat = new Hono<{ Bindings: Env; Variables: Variables }>();

// 全局 AbortController Map：conversationId → AbortController
// CF Workers 单实例内有效；前端 stop 时通过 DELETE /api/chat/:id/stop 触发
// 原因：CF Workers 的 c.req.raw.signal 不随客户端断开而触发（平台限制）
const abortControllers = new Map<string, AbortController>();

// DELETE /api/chat/:id/stop  前端 stop() 时额外调用，通知后端手动 abort
chat.delete('/:id/stop', async (c) => {
  const id = c.req.param('id');
  const ctrl = abortControllers.get(id);
  if (ctrl) {
    ctrl.abort('user_stop');
    abortControllers.delete(id);
  }
  return c.json({ ok: true });
});

// /api/chat  Body: { messages: UIMessage[], id: string }  (AI SDK v6 格式)
chat.post('/', async (c) => {
  const user = c.get('user');
  const { messages, id } = await c.req.json();

  // 自建 AbortController，供 streamText 使用
  const abortController = new AbortController();
  abortControllers.set(id, abortController);
  const abortSignal = abortController.signal;

  // 取最后一条 user 消息
  const incomingMessages: UIMessage[] = Array.isArray(messages) ? messages : [];
  const lastUserMsg = [...incomingMessages].reverse().find((m) => m.role === 'user');
  if (!lastUserMsg) throw new Error('no user message');

  // 1. 验证 conversation 归属
  const supabase = createSupabaseAdmin(c.env);
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, model')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!conv) throw new NotFoundError('conversation not found');

  // 2. 立即持久化 user 消息（防流中断丢消息）
  await saveUserMessage(c.env, id, lastUserMsg);

  // 3. 从 DB 加载历史，传给 originalMessages
  // SDK 会据此：
  //   - 若末尾是 assistant（regenerate）→ responseMessage.id 复用旧 id，isContinuation=true
  //   - 否则 → 通过 generateMessageId 生成新 id，isContinuation=false
  const history = await loadChat(c.env, id);
  const isFirstTurn = history.length === 0;

  // 记录 regenerate 场景下旧 assistant 消息的 parts 数量
  // isContinuation=true 时，SDK 把「旧 parts + 新 parts」合并进 responseMessage，
  // 需要截取只保留新生成的 parts 再持久化，否则会把历史内容重复写入 DB
  const lastHistoryMsg = history[history.length - 1];
  const oldPartsCount =
    lastHistoryMsg?.role === 'assistant' ? (lastHistoryMsg.parts?.length ?? 0) : 0;

  // 4. 将前端 UIMessage[] 转为 CoreMessage[]
  const modelMessages = await convertToModelMessages(incomingMessages, { tools: {} });

  // 5. 外部 Promise 桥接：onFinish 持久化完成后 resolve，waitUntil 等它
  // 原因：CF Workers 在 HTTP 响应结束后会 kill 进程，不等任何 pending 异步任务，
  // 必须通过 waitUntil 告知 runtime "这个 Promise 完成之前不要 kill"
  let persistResolve!: () => void;
  let persistReject!: (e: unknown) => void;
  const persistPromise = new Promise<void>((res, rej) => {
    persistResolve = res;
    persistReject = rej;
  });

  // 6. streamText 流式生成
  // 设计说明：
  // - consumeStream() 放入 waitUntil，保证前端 stop() 后后端继续跑完流并触发 onFinish
  // - toUIMessageStreamResponse() 同步返回 Response 给前端（两者共享同一底层流，SDK 内部 tee）
  // - onAbort 在 abort 时立即标记 interrupted（快速响应）
  // - onFinish 在流结束后触发持久化
  const result = streamText({
    model: getModel(c.env, conv.model),
    system: buildSystemPrompt(),
    messages: modelMessages,
    tools: {},
    stopWhen: [stepCountIs(20), isLoopFinished()],
    maxOutputTokens: 10000,
    abortSignal,
    onError: ({ error }) => {
      logger.error('[server] streamText onError', error);
      persistResolve(); // 出错时 resolve，避免 waitUntil 永远 pending
      abortControllers.delete(id);
    }
  });

  // 7. 返回流式响应，持久化逻辑放在 toUIMessageStreamResponse 的 onFinish 里
  // SDK 在 onFinish 里提供：
  //   - responseMessage：已组装好的完整 UIMessage（含所有 parts），无需手动 buildPartsFromSteps
  //   - isContinuation：是否 regenerate（SDK 通过对比 originalMessages 末尾 id 自动判断）
  //   - isAborted：是否被 abort（靠流中的 abort chunk，由 abortSignal 触发注入）
  const response = result.toUIMessageStreamResponse({
    originalMessages: history as UIMessage[],
    generateMessageId: generateId,
    // TODO CF 里不起作用，需要用下文的实现。
    // 消费完整流，保证刷新可回复内容。它不会处理或返回流中的数据，仅确保整个流被完整读取
    consumeSseStream: consumeStream,
    onFinish: async ({ responseMessage, isAborted, isContinuation }) => {
      logger.info('[server] onFinish', { msgId: responseMessage?.id, isContinuation, isAborted });
      try {
        // isContinuation=true 时 SDK 把「旧 parts + 新 parts」合并进 responseMessage，
        // 需要截掉旧内容，只保留本次新生成的 parts，否则历史内容会被重复写入
        const rawMsg = responseMessage as UIMessage;
        const newParts = isContinuation ? rawMsg.parts.slice(oldPartsCount) : rawMsg.parts;
        const parsedMsg = parseThinkingParts({ ...rawMsg, parts: newParts });
        // isContinuation=true（regenerate）→ UPDATE 旧记录；否则 INSERT
        await saveAssistantMessage(c.env, id, parsedMsg, isContinuation);
        // 用户主动终止：标记 interrupted
        if (isAborted) {
          await markMessageStatus(c.env, responseMessage.id, 'interrupted');
        }
        // 首轮生成标题（仅正常完成时）
        if (isFirstTurn && !isAborted) {
          const firstText = (lastUserMsg.parts?.[0] as { text?: string })?.text ?? '';
          generateTitle(c.env, id, firstText);
        }
        persistResolve();
      } catch (error) {
        logger.error('[server] onFinish persist error', error);
        persistReject(error);
      } finally {
        abortControllers.delete(id);
      }
    },
    onError: (err) => {
      persistResolve(); // 出错时也要 resolve，避免 waitUntil 永远 pending
      abortControllers.delete(id);
      return String(err);
    }
  });

  // 8. waitUntil 双保险：
  //   - consumeStream()：独立消费整个底层流，确保前端 stop() 断开 SSE 后流仍被消费，
  //     从而触发 toUIMessageStreamResponse 的 onFinish 持久化
  //   - persistPromise：onFinish 里 resolve，精确等待持久化 DB 操作完成
  // 两者都需要：consumeStream 保证 onFinish 能触发；persistPromise 保证入库跑完
  const ctx = c.executionCtx as { waitUntil?: (p: Promise<unknown>) => void } | undefined;
  ctx?.waitUntil(Promise.resolve(result.consumeStream()));
  ctx?.waitUntil(persistPromise);

  return response;
});

/**
 * 解析模型输出中的 <thinking>...</thinking> 标签，
 * 将 responseMessage 的 text parts 拆分为 reasoning + text 两种 parts。
 * 用于在没有原生推理 token 时，通过提示词模拟推理展示。
 */
function parseThinkingParts(msg: UIMessage): UIMessage {
  const newParts: UIMessage['parts'] = [];
  for (const part of msg.parts ?? []) {
    if (part.type !== 'text') {
      newParts.push(part);
      continue;
    }
    const text = (part as TextUIPart).text ?? '';
    // 匹配 <thinking>...</thinking>，支持多段、跨行
    const thinkingRe = /<thinking>([\s\S]*?)<\/thinking>/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = thinkingRe.exec(text)) !== null) {
      // thinking 前面的普通文本
      if (match.index > lastIndex) {
        const before = text.slice(lastIndex, match.index).trim();
        if (before) newParts.push({ type: 'text', text: before });
      }
      // reasoning part
      const reasoning = match[1].trim();
      if (reasoning)
        newParts.push({ type: 'reasoning', text: reasoning } as UIMessage['parts'][number]);
      lastIndex = match.index + match[0].length;
    }
    // thinking 后面的普通文本
    const after = text.slice(lastIndex).trim();
    if (after) newParts.push({ type: 'text', text: after });
  }
  return { ...msg, parts: newParts };
}

export default chat;
