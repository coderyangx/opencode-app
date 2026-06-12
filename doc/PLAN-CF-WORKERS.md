# Chat 客户端实施规划 — Cloudflare Workers 版

> 本文是 `PLAN.md` 的 Workers 兼容变体。核心业务逻辑完全一致，差异仅在运行时适配层。
> 部署目标：前端 + 后端合并为单一 Cloudflare Worker，`wrangler deploy` 一条命令搞定。

---

## 与 PLAN.md 的差异对照

| 项目                   | PLAN.md（Node.js）                | 本文（Cloudflare Workers）                        |
| ---------------------- | --------------------------------- | ------------------------------------------------- |
| 运行时                 | Node.js 进程                      | V8 Isolate（无 Node.js API）                      |
| 入口                   | `serve({ fetch: app.fetch })`     | `export default app`                              |
| 环境变量               | `process.env.KEY`                 | `c.env.KEY`（wrangler bindings）                  |
| 日志                   | `pino`                            | `console.log`（Workers Observability）            |
| 静态资源               | Vite dev server                   | `c.env.ASSETS.fetch()`（Cloudflare Pages Assets） |
| 部署命令               | `node server/index.ts`            | `wrangler deploy`                                 |
| 本地开发               | `tsx watch` + `vite dev` 两个进程 | `vite dev`（`@cloudflare/vite-plugin` 一体化）    |
| `@hono/node-server`    | ✅ 需要                           | ❌ 删除                                           |
| `pino` / `pino-pretty` | ✅ 需要                           | ❌ 删除                                           |

**业务逻辑不变的部分：**

- 所有路由（`/api/chat`、`/api/conversations/*`、`/api/models`）
- `ToolLoopAgent` + 工具扩展点
- `saveUserMessage` / `saveAssistantMessage` 两步写入
- `compactMessages` 上下文压缩（L1 + L2）
- 自定义错误类 + 全局 `onError`
- Supabase Auth JWT 验证
- 数据库 Schema、RLS、Storage Bucket（完全一致）

---

## 项目结构调整

原 `server/` 目录合并进根目录，整体结构：

```
opencode-app/
├── wrangler.jsonc                 # ← 新增：Cloudflare Workers 配置
├── vite.config.js                 # ← 修改：加入 @cloudflare/vite-plugin
├── package.json                   # ← 修改：调整依赖和 scripts
├── tsconfig.json                  # ← 修改：target 改 ESNext，moduleResolution 改 Bundler
│
├── worker/                        # ← 新增：后端代码（原 server/，改名避免歧义）
│   ├── index.ts                   # Worker 入口：export default app
│   ├── middleware/
│   │   └── auth.ts                # JWT 验证（同 PLAN.md，无改动）
│   ├── routes/
│   │   ├── chat.ts                # POST /api/chat（同 PLAN.md）
│   │   ├── conversations.ts       # 会话 CRUD（同 PLAN.md）
│   │   └── models.ts              # GET /api/models
│   ├── lib/
│   │   ├── supabase.ts            # ← 改动：env 通过参数传入，非 process.env
│   │   ├── model.ts               # ← 改动：env 通过参数传入
│   │   └── chat-store.ts          # 同 PLAN.md，无改动
│   └── util/
│       ├── errors.ts              # 同 PLAN.md，无改动
│       ├── response.ts            # 同 PLAN.md，无改动
│       ├── logger.ts              # ← 改动：console.log 替代 pino
│       └── context-manager.ts    # 同 PLAN.md，无改动
│
└── src/                           # 前端代码（不变）
    ├── pages/Chat/
    └── ...
```

---

## wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "opencode-app",
  "compatibility_date": "2025-08-03",
  "main": "./worker/index.ts",
  "assets": {
    "directory": "./dist", // 前端构建产物目录
    "binding": "ASSETS" // c.env.ASSETS 访问静态资源
  },
  "observability": {
    "enabled": true // 替代 pino，Workers 原生日志面板
  },
  "vars": {
    "OPENAI_MODEL_ID": "gpt-5.4-mini",
    "FRONTEND_URL": "https://opencode-app.pages.dev"
  }
  // 敏感变量通过 wrangler secret 命令写入，不放这里：
  // wrangler secret put SUPABASE_URL
  // wrangler secret put SUPABASE_KEY
  // wrangler secret put OPENAI_BASE_URL
  // wrangler secret put OPENAI_API_KEY
}
```

---

## vite.config.js 修改

```js
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    cloudflare() // ← 新增：一体化处理 Worker + 静态资源
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
  // 原有 css / build / optimizeDeps 配置保持不变
  // 删除 server.proxy（前后端同 Worker，无需代理）
});
```

---

## package.json 变更

```json
{
  "scripts": {
    "dev": "vite", // 同时启动前端 + Worker（@cloudflare/vite-plugin 一体化）
    "build": "vite build", // 构建前端到 dist/
    "deploy": "npm run build && wrangler deploy", // 一条命令部署
    "cf-typegen": "wrangler types --env-interface CloudflareBindings"
  },
  "dependencies": {
    // 新增
    "@cloudflare/vite-plugin": "^1.x",
    "wrangler": "^4.x"
    // 删除（Workers 不需要）
    // "@hono/node-server": 删除
    // "pino": 删除
    // "pino-pretty": 删除
  }
}
```

---

## Worker 入口 `worker/index.ts`

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';
import chatRoute from './routes/chat';
import conversationsRoute from './routes/conversations';
import modelsRoute from './routes/models';
import { UnauthorizedError, IllegalArgumentError, NotFoundError } from './util/errors';

// Workers 通过泛型暴露 Bindings 类型（wrangler cf-typegen 自动生成）
type Env = {
  ASSETS: Fetcher;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  OPENAI_BASE_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL_ID: string;
  FRONTEND_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

// 全局错误处理（同 PLAN.md）
app.onError((err, c) => {
  if (err instanceof UnauthorizedError) return c.json({ ok: false, error: err.message }, 401);
  if (err instanceof IllegalArgumentError) return c.json({ ok: false, error: err.message }, 400);
  if (err instanceof NotFoundError) return c.json({ ok: false, error: err.message }, 404);
  console.error('[unhandled]', err);
  return c.json({ ok: false, error: 'Internal server error' }, 500);
});

app.use('*', cors({ origin: '*' }));
app.use('/api/*', authMiddleware);

app.route('/api/chat', chatRoute);
app.route('/api/conversations', conversationsRoute);
app.route('/api/models', modelsRoute);

// 静态资源：API 路由未命中时，转发给 Cloudflare Pages Assets
app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw));

// Workers 入口：export default，不使用 serve()
export default app;
```

---

## 关键适配改动（3 处）

### 1. 环境变量：`process.env` → `c.env`

Workers 没有 `process.env`，所有环境变量通过 `c.env` 访问。
需要把 `env` 从路由层透传给 `lib/` 层：

```typescript
// worker/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 接收 env 参数，而不是直接读 process.env
export function createSupabaseAdmin(env: { SUPABASE_URL: string; SUPABASE_KEY: string }) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
```

```typescript
// worker/lib/model.ts
import { createOpenAI } from '@ai-sdk/openai';

export function getModel(env: { OPENAI_BASE_URL: string; OPENAI_API_KEY: string }, name?: string) {
  const client = createOpenAI({ baseURL: env.OPENAI_BASE_URL, apiKey: env.OPENAI_API_KEY });
  return client.chat(name ?? 'gpt-5.4-mini');
}
```

```typescript
// worker/routes/chat.ts 中的调用方式
app.post('/', async (c) => {
  const supabaseAdmin = createSupabaseAdmin(c.env); // ← 每次请求创建（Workers 无全局状态）
  const model = getModel(c.env, modelId ?? conv.model);
  // ... 其余逻辑同 PLAN.md
});
```

> **为什么每次请求创建 supabaseAdmin？**
> Workers V8 Isolate 无全局持久状态，每个请求独立，单例模式不适用。
> `createClient` 本身很轻量（只是配置对象），性能影响可忽略。

### 2. 日志：`pino` → `console.log`

```typescript
// worker/util/logger.ts
// Workers 的 console.log 直接输出到 Observability 面板（wrangler tail 实时查看）
export const logger = {
  info: (msg: string, data?: object) =>
    console.log(JSON.stringify({ level: 'info', msg, ...data })),
  warn: (msg: string, data?: object) =>
    console.warn(JSON.stringify({ level: 'warn', msg, ...data })),
  error: (msg: string, data?: object) =>
    console.error(JSON.stringify({ level: 'error', msg, ...data })),
  debug: (msg: string, data?: object) =>
    console.debug(JSON.stringify({ level: 'debug', msg, ...data }))
};
```

### 3. 静态资源：前端 SPA fallback

```typescript
// worker/index.ts 末尾（API 路由注册完之后）
app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw));
```

`wrangler.jsonc` 的 `assets.directory` 指向 `./dist`（`npm run build` 的输出），
Cloudflare 自动处理 SPA fallback（所有非 API 路由返回 `index.html`）。

---

## tsconfig.json 调整

Workers 运行在 V8 Isolate，需要对齐 hono-page 的 tsconfig：

```jsonc
{
  "compilerOptions": {
    "target": "ESNext", // 改：原 ES2022
    "module": "ESNext", // 改：原 ES2022
    "moduleResolution": "Bundler", // 改：原 node，Vite 需要 Bundler
    "lib": ["ESNext"],
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react-jsx", // 前端 React JSX 保持不变
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src/**/*", "worker/**/*"] // 加入 worker/ 目录
}
```

---

## 开发工作流

```bash
# 本地开发（一条命令，@cloudflare/vite-plugin 同时启动前端 HMR + Worker 模拟）
npm run dev

# 查看实时日志（另一个终端）
wrangler tail

# 生产部署
npm run deploy
# 等价于：vite build && wrangler deploy

# 写入敏感环境变量（只需执行一次）
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler secret put OPENAI_BASE_URL
wrangler secret put OPENAI_API_KEY
```

---

## 前端 `useChat` transport 调整

因为前后端同 Worker，不再需要 `VITE_API_BASE_URL` 环境变量，路径直接用相对路径：

```typescript
// src/pages/Chat/detail.tsx
transport: new DefaultChatTransport({
  api: '/api/chat', // ← 同源，不需要 import.meta.env.VITE_API_BASE_URL
  headers: async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token ?? ''}` };
  }
});
```

---

## 部署架构图

```
Cloudflare Workers（单一部署单元）
┌─────────────────────────────────────────────────────┐
│                                                     │
│  GET /chat, /chat/:id, /assets/*                    │
│    → c.env.ASSETS.fetch()  ← dist/（Vite 构建产物） │
│                                                     │
│  POST /api/chat                                     │
│    → ToolLoopAgent → CodeTurbo API（出站 fetch）     │
│    → Supabase DB（出站 fetch）                       │
│                                                     │
│  GET/POST /api/conversations/*                      │
│    → Supabase DB（出站 fetch）                       │
│                                                     │
└─────────────────────────────────────────────────────┘
         ↑ wrangler deploy
         │
    本地 npm run build（vite build → dist/）
```

---

## 验收标准（在 PLAN.md 基础上追加）

- [ ] `npm run dev` 一条命令启动，前端 HMR + `/api/*` 均可访问
- [ ] `wrangler tail` 能看到结构化日志
- [ ] `npm run deploy` 部署成功，Worker URL 可访问
- [ ] 浏览器 DevTools → Network 中看不到 `OPENAI_API_KEY`
- [ ] Cloudflare Dashboard → Workers → 日志面板能看到请求记录
- [ ] 其余同 PLAN.md 验收标准
