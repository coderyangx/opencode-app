import type { Handler } from 'hono';
import type { IRunContext } from '../types/context.js';
import { getCookie, setCookie } from 'hono/cookie';
import { nanoid } from 'nanoid';
import { sessionMemoryManager } from '../lib/cache/session.js';
import { s3 } from '../lib/memory-s3/index.js';
import { NL2SQLDataService } from '../data/service.js';
import { MainAgent } from '../agents/main.js';
import { HISTORY_KEY } from './chat-history.js';

export const Chat: Handler = async (c) => {
  const { messages, fileKey } = await c.req.json();

  const runContext: IRunContext = {
    cookie: c.req.header('Cookie'),
    view: c.req.header('X-FORM-VIEW') || '',
    env: c.req.header('X-ENV') || '',
    origin: c.req.header('Origin') || '',
    history: messages.slice(-10),
    s3,
    presetId: c.req.header('X-DATA-PRESET') || 'kuaida-mock' || 'mock',
  };

  if (fileKey) {
    runContext.presetOptions = {
      fileKey,
    };
  }

  runContext.dataSvc = new NL2SQLDataService(runContext);

  let sessionId = getCookie(c, 'chatSessionId');
  if (!sessionId) {
    sessionId = nanoid(16);
    setCookie(c, 'chatSessionId', sessionId, {
      httpOnly: true,
      maxAge: 3600,
    });
  }
  // 获取缓存内容
  runContext.memory = sessionMemoryManager.get(sessionId);

  // 保存用户消息到对话历史（方便调试）
  const history = (runContext.memory.get(HISTORY_KEY) as any[]) || [];
  const lastMsg = messages[messages.length - 1];
  if (lastMsg && lastMsg.role === 'user') {
    history.push({
      role: 'user',
      content:
        typeof lastMsg.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg.content),
      timestamp: Date.now(),
    });
    runContext.memory.set(HISTORY_KEY, history);
  }

  const agent = new MainAgent(runContext);
  const result = await agent.run();

  // 流结束后异步保存 assistant 回复（不阻塞流式响应）
  result.text
    .then((assistantText) => {
      const latestHistory = (runContext.memory!.get(HISTORY_KEY) as any[]) || [];
      latestHistory.push({
        role: 'assistant',
        content: assistantText,
        timestamp: Date.now(),
      });
      runContext.memory!.set(HISTORY_KEY, latestHistory);
    })
    .catch((e) => console.error('[Chat Handler] save assistant text failed:', e));

  // V1 chat handler：通过 HTTP SSE 流式返回 MainAgent 的输出
  // 深度分析流程仍走 WebSocket（DeepAnalysisChat handler）
  c.header('X-Vercel-AI-Data-Stream', 'v1');
  c.header('Content-Type', 'text/plain; charset=utf-8');
  c.header('X-Accel-Buffering', 'no');

  const response = result.toDataStreamResponse({
    getErrorMessage: (error) => {
      console.error('[Chat Handler] error:', error);
      if (error instanceof Error) return error.message;
      return String(error);
    },
  });

  // toDataStreamResponse 返回全新 Response，Hono context 上 setCookie 的头不会自动带过去，
  // 需要手动复制 Set-Cookie（chat-history、chart-citation 等接口依赖 session cookie）
  const setCookieHeader = c.res.headers.get('Set-Cookie');
  if (setCookieHeader) {
    response.headers.set('Set-Cookie', setCookieHeader);
  }

  return response;
};
