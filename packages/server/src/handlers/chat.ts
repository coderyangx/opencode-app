import type { Handler } from 'hono';
import type { IRunContext } from '../types/context.js';
import { getCookie, setCookie } from 'hono/cookie';
import { nanoid } from 'nanoid';
import { sessionMemoryManager } from '../lib/cache/session.js';
import { s3 } from '../lib/memory-s3/index.js';
import { NL2SQLDataService } from '../data/service.js';
import { MainAgent } from '../agents/main.js';

export const Chat: Handler = async (c) => {
  const { messages, fileKey } = await c.req.json();

  const runContext: IRunContext = {
    cookie: c.req.header('Cookie'),
    view: c.req.header('X-FORM-VIEW') || '',
    env: c.req.header('X-ENV') || '',
    origin: c.req.header('Origin') || '',
    history: messages.slice(-10),
    s3,
    presetId: c.req.header('X-DATA-PRESET') || 'mock',
  };

  if (fileKey) {
    runContext.presetOptions = {
      fileKey,
    };
  }

  runContext.dataSvc = new NL2SQLDataService(runContext);

  const agent = new MainAgent(runContext);
  const result = await agent.run();

  let sessionId = getCookie(c, 'chatSessionId');
  if (!sessionId) {
    sessionId = nanoid(16);
    setCookie(c, 'chatSessionId', sessionId, {
      httpOnly: true,
      maxAge: 3600,
    });
  }
  runContext.memory = sessionMemoryManager.get(sessionId);

  // V1 chat handler：通过 HTTP SSE 流式返回 MainAgent 的输出
  // 深度分析流程仍走 WebSocket（DeepAnalysisChat handler）
  c.header('X-Vercel-AI-Data-Stream', 'v1');
  c.header('Content-Type', 'text/plain; charset=utf-8');
  c.header('X-Accel-Buffering', 'no');

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      console.error('[Chat Handler] error:', error);
      if (error instanceof Error) return error.message;
      return String(error);
    },
  });
};
