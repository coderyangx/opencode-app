/**
 * worker/lib/stream-cache.ts
 *
 * 生产级 Resume（断线续传）基础设施。
 *
 * 核心思路：
 *   POST 发起生成时，将 UIMessageStream tee() 成两份：
 *     - stream1：给本次请求前端消费（正常流式输出）
 *     - stream2：后台 reader 消费，每个 UIMessageChunk 序列化后缓存到 ActiveStream.chunks
 *
 *   GET /:id/stream（resume 端点）收到请求时：
 *     - 从 ActiveStream.chunks 拿已缓存的内容立即发出
 *     - 之后挂起等待新 chunks（通过 waitNext Promise 通知）
 *     - 后台 reader 完成后（done=true）客户端流关闭
 *
 * 关键：
 *   1. 必须后台消费 stream2，否则 tee() 的背压机制会卡住 stream1
 *   2. CF Workers 的后台消费必须放在 waitUntil 中，否则响应返回后进程被 kill
 *   3. CF Workers 的 request.signal 不随客户端断开而触发，需手动 AbortController + stop 端点
 */

import type { UIMessageChunk } from 'ai';
import { createUIMessageStreamResponse } from 'ai';
import { logger } from '../util/logger';

export interface ActiveStream {
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

/** conversationId → ActiveStream 的内存映射 */
const activeStreams = new Map<string, ActiveStream>();

/** conversationId → AbortController 的内存映射 */
const abortControllers = new Map<string, AbortController>();

// ── ActiveStream 生命周期 ──────────────────────────────────────────────────

/** 创建空的 ActiveStream 状态槽 */
function createActiveStream(): ActiveStream {
  let notifyNext!: () => void;
  const waitNext = new Promise<void>((res) => {
    notifyNext = res;
  });
  return { chunks: [], done: false, aborted: false, waitNext, notifyNext };
}

/** 追加一个 chunk（JSON 序列化后存储）并通知等待方 */
function pushChunk(active: ActiveStream, chunk: UIMessageChunk): void {
  active.chunks.push(JSON.stringify(chunk));
  const oldNotify = active.notifyNext;
  let notifyNext!: () => void;
  active.waitNext = new Promise<void>((res) => {
    notifyNext = res;
  });
  active.notifyNext = notifyNext;
  oldNotify();
}

/** 标记流结束，唤醒所有等待方 */
function closeActiveStream(active: ActiveStream): void {
  if (active.done) return; // 幂等
  active.done = true;
  active.notifyNext();
}

// ── 公开 API ───────────────────────────────────────────────────────────────

/** 注册一个新流（覆盖旧流，通常不应发生） */
export function registerStream(id: string): ActiveStream {
  const active = createActiveStream();
  activeStreams.set(id, active);
  return active;
}

/** 获取活跃流（可能不存在） */
export function getActiveStream(id: string): ActiveStream | undefined {
  return activeStreams.get(id);
}

/** 删除活跃流 */
export function deleteActiveStream(id: string): void {
  activeStreams.delete(id);
}

/** 注册 AbortController */
export function registerAbortController(id: string): AbortController {
  const ctrl = new AbortController();
  abortControllers.set(id, ctrl);
  return ctrl;
}

/** 获取 AbortController */
export function getAbortController(id: string): AbortController | undefined {
  return abortControllers.get(id);
}

/** 删除 AbortController */
export function deleteAbortController(id: string): void {
  abortControllers.delete(id);
}

/**
 * 后台消费 tee 出的 stream2，将每个 chunk 缓存到 ActiveStream。
 * 必须放在 waitUntil 中调用，防止 CF Workers 提前 kill 进程。
 */
export async function consumeStreamForResume(
  id: string,
  active: ActiveStream,
  stream: ReadableStream<UIMessageChunk>
): Promise<void> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      pushChunk(active, value);
    }
  } catch (err) {
    logger.error('[stream-cache] consume error', err);
  } finally {
    reader.releaseLock();
    closeActiveStream(active);
  }
}

/**
 * 创建 resume 端点的 ReadableStream：
 * 先回放缓存 chunks，再实时追加新 chunks。
 *
 * 背压契约：每次 pull 只 enqueue 一个 chunk 然后返回，
 * 下游 ready 时 runtime 会再次调用 pull。
 */
export function createResumeReadableStream(active: ActiveStream): ReadableStream<UIMessageChunk> {
  let cursor = 0;
  return new ReadableStream<UIMessageChunk>({
    async pull(controller) {
      // 有缓存的 chunk 直接发一个
      if (cursor < active.chunks.length) {
        controller.enqueue(JSON.parse(active.chunks[cursor]) as UIMessageChunk);
        cursor++;
        return;
      }
      // 缓存消费完且后台已结束 → 关闭流
      if (active.done) {
        controller.close();
        return;
      }
      // 暂无新 chunk：等待后台 pushChunk() 唤醒
      await active.waitNext;
      // 被唤醒后，chunks 一定有新数据或 done=true
      // 不在此处 enqueue，让 runtime 重新调用 pull 处理
    }
  });
}

/**
 * 处理 stop 请求：标记 aborted + 关闭流 + abort。
 * 供 GET /:id/stop 端点调用。
 */
export function handleStop(id: string): void {
  const active = activeStreams.get(id);
  if (active) {
    active.aborted = true;
    closeActiveStream(active);
  }
  const ctrl = abortControllers.get(id);
  if (ctrl) {
    ctrl.abort('user_stop');
    abortControllers.delete(id);
  }
}

/**
 * 创建 resume 端点的标准 Response。
 * - 有进行中的流 → 200 + SSE（回放已缓存 chunks + 实时推送新 chunks）
 * - 无进行中的流 → 204（客户端静默跳过，走正常历史加载）
 */
export function createResumeResponse(id: string): Response {
  const active = activeStreams.get(id);
  if (!active) {
    return new Response('无正在输出流', { status: 204 });
  }

  logger.info('[chat恢复流] resume stream', { id, cachedChunks: active.chunks.length });
  const chunkStream = createResumeReadableStream(active);
  return createUIMessageStreamResponse({ stream: chunkStream });
}

/**
 * 流结束后清理资源（onFinish / onError 中调用）。
 * 安全清理：即使中途出错也不会泄漏 Map 条目。
 */
export function cleanupStream(id: string): void {
  const active = activeStreams.get(id);
  if (active) closeActiveStream(active);
  activeStreams.delete(id);
  abortControllers.delete(id);
}
