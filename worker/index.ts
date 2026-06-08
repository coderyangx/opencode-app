import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { User } from '@supabase/supabase-js';
import { UnauthorizedError, IllegalArgumentError, NotFoundError } from './util/errors';
import { logger } from './util/logger';

import { authMiddleware } from './middleware/auth';
import chatRoute from './routes/chat';
import conversationRoute from './routes/conversation';
import modelRoute from './routes/model';

/** cloudflare worker Env */
export type Env = {
  ASSETS: Fetcher;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  OPENAI_BASE_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL_ID: string;
  FRONTEND_URL: string;
};

export type Variables = {
  user: User;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// 全局错误处理
app.onError((err, c) => {
  if (err instanceof UnauthorizedError) return c.json({ ok: false, error: err.message }, 401);
  if (err instanceof IllegalArgumentError) return c.json({ ok: false, error: err.message }, 400);
  if (err instanceof NotFoundError) return c.json({ ok: false, error: err.message }, 404);
  logger.error('unhandled error', { message: err.message });
  return c.json({ ok: false, error: 'Internal server error' }, 500);
});

app.use('*', cors({ origin: '*' }));
// 健康检查（无需鉴权）
app.get('/api/alive', (c) => c.json({ isAlive: true, ok: true, time: new Date().toISOString() }));
app.use('/api/*', authMiddleware);

app.route('/api/chat', chatRoute);
app.route('/api/conversations', conversationRoute);
app.route('/api/models', modelRoute);

// 静态资源 fallback：API 未命中时转发给 Cloudflare Assets（含 SPA index.html）
app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw));

logger.info('[server is running...]');
// worker 启动
export default app;

// hono 单独启动 npm run dev:hono
// serve(
//   {
//     fetch: app.fetch,
//     port: 3000,
//   },
//   (info) => {
//     console.log(`[==Hono Server 正在运行==] http://localhost:${info.port} `);
//   },
// );
