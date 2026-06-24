import { Hono } from 'hono';
import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateId,
  type UIMessage,
  type TextUIPart,
  type UIMessageChunk,
  stepCountIs,
  isLoopFinished
} from 'ai';
import { getModel } from '../lib/model';
import { buildSystemPrompt } from '../lib/system-prompt';
import { tools } from '../lib/tools';
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

const chat = new Hono<{ Bindings: Env; Variables: Variables }>();

// ── Resume 恢复/续写能力 机制 ──────────────────────────────────────────────────────────────
// 本质是：重建 prompt + 对齐 token 流 + continuation decoding
// 设计：
//   POST 发起生成时，将 UIMessageStream tee() 成两份：
//     - stream1：给本次请求前端消费（正常流式输出）
//     - stream2：立即在后台 reader 消费，将每个 UIMessageChunk
//               序列化后缓存到 ActiveStream.chunks 数组里
//
//   GET /:id/stream（resume 端点）收到请求时：
//     - 从 ActiveStream.chunks 拿已缓存的内容立即发出
//     - 之后挂起等待新 chunks（通过 waitNext Promise 通知）
//     - 后台 reader 完成后（done=true）客户端流关闭
//
// 关键：必须后台消费 stream2，否则 tee() 的背压机制会卡住 stream1，
// 导致前端收流不完整、onFinish 不触发、数据库无法入库。
//
// ⚠️ CF Workers 生产环境限制：
//   后台消费 stream2 的 async 循环必须放在 waitUntil 中，
//   否则响应返回后 Worker 会提前 kill 进程，stream2 消费中断。

interface ActiveStream {
  /** 已序列化的 UIMessageChunk 字符串列表（供 resume replay 使用） */
  chunks: string[];
  /** 流是否已全部产出 */
  done: boolean;
  /** 用户主动终止（abort），刷新后不应 resume */
  aborted: boolean;
  /** 每次有新 chunk 或 done=true 时 resolve，供 GET /stream 的 pull 等待 */
  waitNext: Promise<void>;
  notifyNext: () => void;
}

/** 创建空的 ActiveStream 状态槽 */
function createActiveStream(): ActiveStream {
  let notifyNext!: () => void;
  const waitNext = new Promise<void>((res) => {
    notifyNext = res;
  });
  return { chunks: [], done: false, aborted: false, waitNext, notifyNext };
}

/** 追加一个 chunk（JSON 序列化后存储）并通知等待方 */
function pushChunk(active: ActiveStream, chunk: UIMessageChunk) {
  // SDK 内部用 \n 分隔 SSE data 行，这里存原始 chunk 对象的 JSON，
  // 由 GET /stream 端点重新编码成 SSE 格式发出。
  // 注意：createUIMessageStreamResponse 接收的是 UIMessageChunk 流，
  // 不是已编码的 SSE 文本，所以直接 enqueue chunk 对象即可。
  active.chunks.push(JSON.stringify(chunk));
  const oldNotify = active.notifyNext;
  // 重新挂一个新 Promise 供下次等待
  let notifyNext!: () => void;
  active.waitNext = new Promise<void>((res) => {
    notifyNext = res;
  });
  active.notifyNext = notifyNext;
  oldNotify();
}

/** 标记流结束，唤醒所有等待方 */
function closeActiveStream(active: ActiveStream) {
  active.done = true;
  active.notifyNext();
}

const activeStreams = new Map<string, ActiveStream>();

// AbortController Map：conversationId → AbortController
const abortControllers = new Map<string, AbortController>();

// ── 路由定义 ──────────────────────────────────────────────────────────────────

// GET /:id/stream  AI SDK resume 端点
// - 有进行中的流 → 200 + SSE（回放已缓存 chunks + 实时推送新 chunks）
// - 无进行中的流 → 204（客户端静默跳过，走正常历史加载）
chat.get('/:id/stream', async (c) => {
  const id = c.req.param('id');
  const active = activeStreams.get(id);
  if (!active) {
    return c.body(null, 204);
  }
  // 用户已手动终止：不恢复流，返回 204，前端静默跳过走历史加载
  // if (active.aborted) {
  //   logger.info('[server] resume skip: stream was aborted by user', { id });
  //   return c.body(null, 204);
  // }

  logger.info('[server] resume stream', { id, cachedChunks: active.chunks.length });

  // 重建 UIMessageChunk ReadableStream，从缓存 + 实时追加
  let cursor = 0; // token position
  const chunkStream = new ReadableStream<UIMessageChunk>({
    async pull(controller) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // 发出所有已缓存的 chunks
        while (cursor < active.chunks.length) {
          controller.enqueue(JSON.parse(active.chunks[cursor]) as UIMessageChunk);
          cursor++;
        }
        // 如果后台已经消费完，关闭流
        if (active.done) {
          controller.close();
          return;
        }
        // 等待新 chunk 或 done 信号
        await active.waitNext;
      }
    }
  });

  return createUIMessageStreamResponse({ stream: chunkStream });
});

// GET /:id/stop  前端 stop() 时额外调用，通知后端手动 abort
chat.get('/:id/stop', async (c) => {
  const id = c.req.param('id');
  // 立即标记 aborted，防止刷新后 GET /stream 误触发 resume
  const active = activeStreams.get(id);
  if (active) {
    active.aborted = true;
    closeActiveStream(active); // 唤醒所有等待，让消费循环尽快结束
  }
  const ctrl = abortControllers.get(id);
  if (ctrl) {
    ctrl.abort('user_stop');
    abortControllers.delete(id);
  }
  return c.json({ ok: true });
});

// POST /  发送消息，启动流式生成
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

  // 3. 从 DB 加载历史，传给 toUIMessageStream 的 originalMessages
  // SDK 据此：
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
  const result = streamText({
    model: getModel(c.env, conv.model),
    system: buildSystemPrompt(),
    messages: modelMessages,
    tools: tools,
    stopWhen: [stepCountIs(20), isLoopFinished()],
    maxOutputTokens: 10000,
    abortSignal,
    onError: ({ error }) => {
      logger.error('[server] streamText onError', error);
      persistResolve();
      activeStreams.delete(id);
      abortControllers.delete(id);
    }
  });

  // 7. 返回流式响应，持久化逻辑放在 toUIMessageStreamResponse 的 onFinish 里
  // SDK 在 onFinish 里提供：
  //   - responseMessage：已组装好的完整 UIMessage（含所有 parts），无需手动 buildPartsFromSteps
  //   - isContinuation：是否 regenerate（SDK 通过对比 originalMessages 末尾 id 自动判断）
  //   - isAborted：是否被 abort（靠流中的 abort chunk，由 abortSignal 触发注入）
  // const response = result.toUIMessageStreamResponse({
  const uiStream = result.toUIMessageStream({
    originalMessages: history as UIMessage[],
    generateMessageId: generateId,
    // TODO CF 里不起作用，需要用下文的实现。
    // 消费完整流，保证刷新可回复内容。它不会处理或返回流中的数据，仅确保整个流被完整读取
    // consumeSseStream: consumeStream,
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
        // 流结束后清理两个 Map，防止内存泄漏
        activeStreams.delete(id);
        abortControllers.delete(id);
      }
    },
    onError: (err) => {
      persistResolve();
      const active = activeStreams.get(id);
      if (active) closeActiveStream(active);
      activeStreams.delete(id);
      abortControllers.delete(id);
      return String(err);
    }
  });

  // tee：将 UIMessageChunk 流一分为二
  //   - stream1：给本次 POST 请求前端（正常流式输出）
  //   - stream2：后台立即消费，把每个 chunk 序列化缓存到 activeStreams
  //
  // 必须后台消费 stream2，否则 tee() 背压会阻塞 stream1！
  const [stream1, stream2] = uiStream.tee();

  // TODO 创建缓存槽，立刻注册，供 GET /stream 随时查询，用来恢复 stream
  const active = createActiveStream();
  activeStreams.set(id, active);

  // 后台消费 stream2：把每个 chunk 序列化存入缓存
  // 放在 waitUntil 中，防止 CF Workers 在响应返回后 kill 进程
  const consumeStream2 = async () => {
    const reader = stream2.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pushChunk(active, value);
      }
    } catch (err) {
      logger.error('[server] consume stream2 error', err);
    } finally {
      reader.releaseLock();
      // 确保 closeActiveStream 被调用（onFinish 里也会调，加幂等判断）
      if (!active.done) closeActiveStream(active);
    }
  };

  const ctx = c.executionCtx as { waitUntil?: (p: Promise<unknown>) => void } | undefined;
  // waitUntil 同时等：后台消费 stream2 + 持久化完成
  ctx?.waitUntil(Promise.all([consumeStream2(), persistPromise]));

  // stream1 给本次请求前端
  return createUIMessageStreamResponse({ stream: stream1 });
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
