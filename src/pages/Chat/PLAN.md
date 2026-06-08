# Chat 客户端完整实施规划

> 对标 ChatGPT / Codex，基于 AI SDK v6 + Hono + Supabase 的生产级 Chat 客户端。

---

## 项目现状

| 项目      | 状态                                              |
| --------- | ------------------------------------------------- |
| 前端框架  | React 19 + Vite SPA                               |
| UI 组件库 | Semi UI (@douyinfe/semi-ui)                       |
| AI SDK    | Vercel AI SDK v6（ai + @ai-sdk/openai）           |
| 认证      | Supabase Auth（email/password，已有登录页）       |
| 数据库    | Supabase PostgreSQL（已有 products/orders 示例）  |
| 后端      | ❌ 无（当前 AI 直接在浏览器端调用，API key 暴露） |
| Chat 页面 | ❌ `src/pages/Chat/` 目录存在但为空               |

---

## 技术选型决策

| 决策项        | 选择                                              | 理由                                                      |
| ------------- | ------------------------------------------------- | --------------------------------------------------------- |
| 后端框架      | Hono                                              | 轻量、与 AI SDK 集成最佳、支持 Node.js                    |
| 服务端 AI     | `ToolLoopAgent`（AI SDK v6）                      | 自动工具循环，便于后续扩展 memory / guardrails / 工具调用 |
| HTTP 方法     | 只用 GET + POST                                   | 简化，避免 PATCH/DELETE 的跨域/代理复杂性                 |
| 消息持久化    | Supabase DB（UIMessage JSON）                     | 与现有基础设施一致，AI SDK v6 官方推荐存 UIMessage 格式   |
| 文件存储      | Supabase Storage                                  | 与 Auth 深度集成，直传 + RLS 权限控制                     |
| 前端状态      | `useChat` (AI SDK v6) + `useChatSession` (自定义) | 官方 hook，自带流式/停止/重发                             |
| Markdown 渲染 | react-markdown + remark-gfm + rehype-highlight    | 生产级方案，支持 GFM + 代码高亮                           |

---

## 借鉴 sandbox 项目的设计精华

> 通过对比分析 `~/Desktop/sandbox` 项目（E2B + Hono + ToolLoopAgent），取以下设计：

### ✅ 采纳

| 设计点                  | sandbox 做法                                                                    | 本项目应用                                                        |
| ----------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **统一响应格式**        | `api-response.ts` 封装 `{ ok, data, error }`                                    | `server/util/response.ts` 同样封装，所有接口统一格式              |
| **自定义错误类**        | `UnauthorizedError / IllegalArgumentError / NotFoundError` + 全局 `app.onError` | 完全复用这套模式，`server/util/errors.ts`                         |
| **全局异常中间件**      | `app.onError` 统一处理，根据错误类型映射 HTTP 状态码                            | 避免每个 route 重复 try/catch                                     |
| **上下文压缩（L1+L2）** | 三层策略：L1 降级 tool result / L2 滑动窗口 / L3 摘要注入                       | 先实现 L1+L2，预留 L3 接口；放到 `server/util/context-manager.ts` |
| **Pino 结构化日志**     | `logger.ts`，每次请求记录 method/path/duration/userId                           | 引入 pino，`server/util/logger.ts`，替换 console.log              |
| **工具上下文闭包注入**  | `createTools(ctx)` 工厂函数，userId 等通过闭包传递                              | `createTools({ userId })` 同样模式，便于后续扩展权限控制          |
| **消息覆写语义**        | `POST /messages/update` 整体替换，不逐条 upsert                                 | `POST /api/conversations/messages` 覆写全量 messages              |

### ❌ 不采纳（原因）

| 设计点                      | 不采纳原因                                         |
| --------------------------- | -------------------------------------------------- |
| **Redis 缓存层**            | 无沙箱概念，对话直接存 Supabase，无需 Redis 热路径 |
| **SQLite 本地存储**         | 已有 Supabase，不引入第二个数据库                  |
| **SSO / 多租户认证**        | 项目用标准 Supabase JWT，无多租户需求              |
| **fixDeniedToolApprovals**  | 当前无人工审批工具流，不需要这个 SDK compat fix    |
| **优雅关闭**                | 开发阶段暂不需要，后续部署时再加                   |
| **Skill 安装 / Idle Pause** | 领域特定功能，不适用                               |

---

## 上下文压缩策略（L1 + L2，L3 预留）

沿用 sandbox 的分层思路，实现在 `server/util/context-manager.ts`：

```
compactMessages(messages, windowSizeChars = 800_000)
  │
  ├─ 估算总长度：JSON.stringify(messages).length
  │
  ├─ 60% 以下 → 不压缩，直接返回
  │
  ├─ 60%–80% → L1：降级旧 tool result
  │   保留最近 4 轮 assistant 的 tool-invocation 完整内容
  │   更早的 tool result：截断到前 200 字符 + "[output truncated]"
  │
  ├─ 80% 以上 → L1 + L2：滑动窗口
  │   以"对话轮次"为单位（1 user + 后续所有 assistant）
  │   保留首轮（话题锚）+ 最近 N 轮
  │   不拆散 tool_call / tool_result 配对
  │
  └─ L3（预留接口，暂不实现）
      调用外部 summarizer 生成摘要，注入为 system message
      失败时降级为激进 L2（只保最近 2 轮）
```

**触发阈值说明：**

- 模型上下文窗口按 1M chars 估算（gpt-5.4-mini 约 128K tokens ≈ 512K chars）
- L1 降级成本极低（只截字符串），优先触发
- L2 只在 L1 压缩后仍超阈值时叠加

---

## 架构总览

```
前端 (Vite SPA)                    后端 (Hono server/)
┌──────────────────────┐          ┌─────────────────────────────────┐
│  /chat      → 新建    │          │  POST /api/chat                  │
│  /chat/:id  → 对话    │ ──SSE──▶ │    ToolLoopAgent.stream()        │
│                      │          │    onFinish → saveChat           │
│  useChat()           │          │                                 │
│  useChatSession()    │ ────────▶ │  GET  /api/conversations         │
│  useFileUpload()     │          │  POST /api/conversations         │
└──────────────────────┘          │  POST /api/conversations/update  │
           │                      │  POST /api/conversations/delete  │
           │                      │                                 │
           │                      │  GET  /api/models               │
           ▼                      └────────────┬────────────────────┘
┌──────────────────────┐                       │ service_role key
│  Supabase            │◀──────────────────────┘ (API key 不暴露前端)
│  ├─ Auth（JWT）       │
│  ├─ DB               │
│  │  ├─ conversations │
│  │  ├─ messages      │
│  │  └─ attachments   │
│  └─ Storage          │
│     └─ attachments   │  ← bucket 名
└──────────────────────┘
```

---

## 数据库 Schema

### `conversations` 表

```sql
create table public.conversations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null default '新对话',
  model         text not null default 'gpt-5.4-mini',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index on conversations(user_id, updated_at desc);

alter table conversations enable row level security;
create policy "own_conversations" on conversations
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### `messages` 表

```sql
-- id 用 AI SDK 生成的 message.id（text 类型，非 uuid）
-- parts 存完整 UIMessage.parts JSON（含 tool-invocation / reasoning 等）
create table public.messages (
  id              text primary key,
  conversation_id uuid not null references conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant', 'system')),
  parts           jsonb not null default '[]',
  metadata        jsonb default '{}',
  -- metadata 结构：{ model, inputTokens, outputTokens, durationMs, thumbs }
  created_at      timestamptz not null default now()
);

create index on messages(conversation_id, created_at asc);

alter table messages enable row level security;
create policy "own_messages" on messages
  for all using (
    conversation_id in (
      select id from conversations where user_id = auth.uid()
    )
  )
  with check (
    conversation_id in (
      select id from conversations where user_id = auth.uid()
    )
  );
```

### `attachments` 表

```sql
create table public.attachments (
  id           uuid primary key default gen_random_uuid(),
  message_id   text references messages(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,   -- 格式：{userId}/{chatId}/{timestamp}-{filename}
  file_name    text not null,
  mime_type    text not null,
  file_size    int not null,
  created_at   timestamptz not null default now()
);

alter table attachments enable row level security;
create policy "own_attachments" on attachments
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

### Storage Bucket

```sql
-- 私有 bucket（不公开访问，必须通过 signed URL）
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false);

-- 只允许用户访问自己目录下的文件（路径首段为 userId）
create policy "upload_own_files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "access_own_files" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "delete_own_files" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 认证方案

### 现有代码复用

- `src/services/supabase.ts`：`signIn` / `signUp` / `logout` / `getCurrentUser` ✅ 直接复用
- `src/pages/Login/index.tsx`：登录/注册表单 ✅ 直接复用
- `src/components/AuthRoute.tsx`：路由守卫 ⚠️ 小幅改进

### AuthRoute 改进（消除 null 状态白屏）

```typescript
// 用 onAuthStateChange 替代每次 async getCurrentUser()
// null → 'loading'，避免直接跳转
useEffect(() => {
  supabase.auth
    .getSession()
    .then(({ data: { session } }) => setStatus(session ? 'auth' : 'unauth'));
  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange((_, session) => setStatus(session ? 'auth' : 'unauth'));
  return () => subscription.unsubscribe();
}, []);
```

### JWT 传递给后端

```typescript
// useChat transport 携带 JWT
transport: new DefaultChatTransport({
  api: `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
  headers: async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token ?? ''}` };
  }
});

// Hono 后端验证
const {
  data: { user }
} = await supabaseAdmin.auth.getUser(token);
```

---

## 会话存储方案

### 核心原则：Server is the source of truth

前端**只做乐观渲染，不写库**。所有持久化由服务端负责，两步原子写入：

1. **流开始前**：立即写入 user 消息（防止流中断导致消息丢失）
2. **`onFinish`**：写入 assistant 消息 + 更新 `conversations.updated_at`

**废弃的设计：**

- ~~`POST /conversations/messages` 前端覆写接口~~ — 删除，前端不应有写库权限
- ~~`onFinish` 一次性 upsert 全量 messages~~ — 改为分步写入，职责更清晰

### 数据流时序

```
用户发送消息
  │
  ├─ [前端] useChat 乐观更新（只更新 UI 状态，不写库）
  │
  ▼
POST /api/chat  { message: UIMessage, chatId }
  │
  ├─ 验证 conversation 归属
  ├─ saveUserMessage(chatId, message)   ← 立即写入 user 消息（流开始前）
  ├─ loadChat(chatId)                   ← 读历史（不含刚写入的 user，避免重复）
  ├─ compactMessages([...history, message])
  ├─ ToolLoopAgent.stream()
  │
  ├─ [流式] SSE → 前端 useChat 实时渲染
  │
  └─ onFinish({ message: assistantMsg })
       ├─ saveAssistantMessage(chatId, assistantMsg)   写入 assistant 消息
       ├─ update conversations.updated_at
       └─ history.length === 0 → generateTitle()       异步，不阻塞
```

### `chat-store.ts` 核心代码

```typescript
import { generateText } from 'ai';
import { getModel } from './model';
import { supabaseAdmin } from './supabase';
import type { UIMessage } from 'ai';

// 读取历史消息（不含最新一条 user，由调用方在发送前先写入）
export async function loadChat(chatId: string): Promise<UIMessage[]> {
  const { data } = await supabaseAdmin
    .from('messages')
    .select('id, role, parts, metadata, created_at')
    .eq('conversation_id', chatId)
    .order('created_at', { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    role: row.role as 'user' | 'assistant',
    parts: row.parts,
    metadata: row.metadata ?? {},
    createdAt: new Date(row.created_at)
  }));
}

// 流开始前写入 user 消息（幂等：同 id 的消息不会重复插入）
export async function saveUserMessage(chatId: string, msg: UIMessage): Promise<void> {
  await supabaseAdmin
    .from('messages')
    .upsert(
      { id: msg.id, conversation_id: chatId, role: 'user', parts: msg.parts ?? [], metadata: {} },
      { onConflict: 'id', ignoreDuplicates: true }
    );
}

// onFinish 后写入 assistant 消息 + 更新会话时间
export async function saveAssistantMessage(chatId: string, msg: UIMessage): Promise<void> {
  await supabaseAdmin.from('messages').upsert(
    {
      id: msg.id,
      conversation_id: chatId,
      role: 'assistant',
      parts: msg.parts ?? [],
      metadata: (msg as any).metadata ?? {}
    },
    { onConflict: 'id' }
  );
  await supabaseAdmin
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', chatId);
}

// 首轮对话结束后异步生成标题
export async function generateTitle(chatId: string, firstUserText: string): Promise<void> {
  const { text } = await generateText({
    model: getModel(process.env.OPENAI_MODEL_ID!),
    prompt: `用 6 个字以内概括这个对话的主题，只输出标题本身，不加引号和标点：\n\n${firstUserText}`
  });
  await supabaseAdmin.from('conversations').update({ title: text.trim() }).eq('id', chatId);
}
```

---

## 服务端设计（server/）

### 目录结构

```
server/
├── index.ts                  # 入口：Hono app + 全局 onError + 路由注册
├── package.json              # 后端独立依赖
├── tsconfig.json             # 独立 TS 配置（target: ES2022, module: NodeNext）
├── .env                      # 后端专用环境变量（不含 VITE_ 前缀）
├── middleware/
│   └── auth.ts               # JWT 验证：supabaseAdmin.auth.getUser → c.set('user')
├── routes/
│   ├── chat.ts               # POST /api/chat（ToolLoopAgent 流式接口）
│   ├── conversations.ts      # GET + POST /api/conversations 及 /update /delete /messages
│   └── models.ts             # GET /api/models（返回可用模型列表）
├── lib/
│   ├── supabase.ts           # service_role 客户端（supabaseAdmin 单例）
│   ├── model.ts              # getModel() 工厂
│   └── chat-store.ts         # loadChat / saveChat / generateTitle
└── util/
    ├── errors.ts             # UnauthorizedError / IllegalArgumentError / NotFoundError
    ├── response.ts           # ok() / err() 统一响应格式 { ok, data } / { ok, error }
    ├── logger.ts             # pino 实例，结构化日志
    └── context-manager.ts   # compactMessages()：L1 截断 + L2 滑动窗口，L3 接口预留
```

### `server/index.ts`

```typescript
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';
import chatRoute from './routes/chat';
import conversationsRoute from './routes/conversations';
import modelsRoute from './routes/models';
import { UnauthorizedError, IllegalArgumentError, NotFoundError } from './util/errors';
import { logger } from './util/logger';

const app = new Hono();

// 全局错误处理：自定义错误类 → 对应 HTTP 状态码，避免每个 route 重复 try/catch
app.onError((err, c) => {
  if (err instanceof UnauthorizedError) return c.json({ ok: false, error: err.message }, 401);
  if (err instanceof IllegalArgumentError) return c.json({ ok: false, error: err.message }, 400);
  if (err instanceof NotFoundError) return c.json({ ok: false, error: err.message }, 404);
  logger.error({ err }, 'unhandled error');
  return c.json({ ok: false, error: 'Internal server error' }, 500);
});

app.use('*', cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use('/api/*', authMiddleware);

app.route('/api/chat', chatRoute);
app.route('/api/conversations', conversationsRoute);
app.route('/api/models', modelsRoute);

serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 3001) }, (info) => {
  logger.info(`server listening on http://localhost:${info.port}`);
});
```

### `server/middleware/auth.ts`

```typescript
import { createMiddleware } from 'hono/factory';
import { supabaseAdmin } from '../lib/supabase';

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  const {
    data: { user },
    error
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

  c.set('user', user); // 后续路由通过 c.get('user') 拿到用户信息
  await next();
});
```

### `server/routes/chat.ts`（核心接口）

使用 `ToolLoopAgent` 而非直接调用 `streamText`。工具列表为空时行为完全一致；后续加 memory / guardrails / 工具只需扩展 `tools` 对象和 hooks，不改主流程。

```typescript
import { Hono } from 'hono';
import { ToolLoopAgent, isLoopFinished, stepCountIs } from 'ai';
import { getModel } from '../lib/model';
import { loadChat, saveUserMessage, saveAssistantMessage, generateTitle } from '../lib/chat-store';
import { supabaseAdmin } from '../lib/supabase';
import { NotFoundError } from '../util/errors';
import { compactMessages } from '../util/context-manager';

const app = new Hono();

// POST /api/chat
// Body: { message: UIMessage, chatId: string, modelId?: string, attachments?: Attachment[] }
app.post('/', async (c) => {
  const user = c.get('user');
  const { message, chatId, modelId, attachments } = await c.req.json();

  // 1. 验证 conversation 归属（抛 NotFoundError → 全局 onError 处理为 404）
  const { data: conv } = await supabaseAdmin
    .from('conversations')
    .select('id, model')
    .eq('id', chatId)
    .eq('user_id', user.id)
    .single();
  if (!conv) throw new NotFoundError('conversation not found');

  // 2. 立即持久化 user 消息（流开始前写入，防流中断丢消息）
  const attachmentParts = buildAttachmentParts(attachments ?? []);
  const incomingMessage = { ...message, parts: [...(message.parts ?? []), ...attachmentParts] };
  await saveUserMessage(chatId, incomingMessage);

  // 3. 加载历史（saveUserMessage 已写入，loadChat 用 created_at 排序，新消息自然排在末尾）
  const history = await loadChat(chatId);
  const isFirstTurn = history.length === 1; // 仅含刚写入的 user 消息

  // 4. 上下文压缩（L1 + L2，防止超出模型上下文窗口）
  const allMessages = compactMessages(history);

  // 5. 创建 ToolLoopAgent
  const agent = new ToolLoopAgent({
    model: getModel(modelId ?? conv.model ?? process.env.OPENAI_MODEL_ID!),
    tools: {
      // 扩展点：memory、web_search、code_exec 等 tool 加在此处
    },
    stopWhen: [stepCountIs(20), isLoopFinished()],
    maxOutputTokens: 8000
    // 扩展点：guardrails 在 prepareCall hook 里注入
  });

  // 6. 流式执行
  const result = await agent.stream({ messages: allMessages });

  // 7. onFinish：只写 assistant 消息（user 已在步骤 2 写入）
  result.response
    .then(async ({ messages: fullMessages }) => {
      const assistantMsg = fullMessages.at(-1);
      if (assistantMsg?.role === 'assistant') {
        await saveAssistantMessage(chatId, assistantMsg);
      }
      if (isFirstTurn) {
        generateTitle(chatId, message.parts?.[0]?.text ?? '').catch(console.error);
      }
    })
    .catch(console.error);

  return result.toUIMessageStreamResponse();
});

function buildAttachmentParts(
  attachments: { url: string; mimeType: string; name: string }[]
) {
  return attachments.map(({ url, mimeType, name }) => {
    if (mimeType.startsWith('image/')) {
      return { type: 'image' as const, image: url };
    }
    return { type: 'text' as const, text: `[附件: ${name}]` };
  });
}

export default app;
```

**后续扩展示意（只加不改主流程）：**

```typescript
// 加 memory tool
tools: { remember: memoryTool, recall: recallTool }

// 加 guardrails
prepareCall: async ({ messages }) => {
  if (containsInjection(extractLastUserText(messages))) throw new Error('Blocked')
  return { messages }
}

// 加上下文窗口管理（超长自动摘要）
prepareCall: async ({ messages }) => ({ messages: await summarizeIfNeeded(messages) })
```

### `server/routes/conversations.ts`

全部用 GET / POST，不使用 PATCH / DELETE：

```typescript
import { Hono } from 'hono';
import { supabaseAdmin } from '../lib/supabase';

const app = new Hono();

// GET /api/conversations — 获取当前用户所有会话
app.get('/', async (c) => {
  const user = c.get('user');
  const { data } = await supabaseAdmin
    .from('conversations')
    .select('id, title, model, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  return c.json(data ?? []);
});

// POST /api/conversations — 新建会话
app.post('/', async (c) => {
  const user = c.get('user');
  const { model } = await c.req.json().catch(() => ({}));
  const { data } = await supabaseAdmin
    .from('conversations')
    .insert({ user_id: user.id, model: model ?? process.env.OPENAI_MODEL_ID })
    .select()
    .single();
  return c.json(data, 201);
});

// POST /api/conversations/update — 更新标题或模型
// Body: { id: string, title?: string, model?: string }
app.post('/update', async (c) => {
  const user = c.get('user');
  const { id, title, model } = await c.req.json();
  const patch = Object.fromEntries(
    Object.entries({ title, model }).filter(([, v]) => v !== undefined)
  );
  const { data } = await supabaseAdmin
    .from('conversations')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  return c.json(data);
});

// POST /api/conversations/delete — 删除会话（cascade 删 messages）
// Body: { id: string }
app.post('/delete', async (c) => {
  const user = c.get('user');
  const { id } = await c.req.json();
  await supabaseAdmin.from('conversations').delete().eq('id', id).eq('user_id', user.id);
  return c.json({ ok: true });
});

// GET /api/conversations/:id/messages — 加载会话历史消息（前端刷新时调用）
app.get('/:id/messages', async (c) => {
  const user = c.get('user');
  const convId = c.req.param('id');
  const { data: conv } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('id', convId)
    .eq('user_id', user.id)
    .single();
  if (!conv) throw new NotFoundError('conversation not found');

  const { data } = await supabaseAdmin
    .from('messages')
    .select('id, role, parts, metadata, created_at')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true });
  return c.json(data ?? []);
});

// 注：不再提供前端覆写消息接口。持久化由服务端 chat.ts 负责：
//   - 流开始前 saveUserMessage()
//   - onFinish 后 saveAssistantMessage()

export default app;
```

### `server/lib/model.ts`

```typescript
import { createOpenAI } from '@ai-sdk/openai';

const client = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL, // https://api.codeturbo.ai/v1
  apiKey: process.env.OPENAI_API_KEY!
});

export function getModel(name: string) {
  return client.chat(name);
}
```

### `server/util/errors.ts`

```typescript
export class UnauthorizedError extends Error {
  constructor(msg = 'Unauthorized') {
    super(msg);
    this.name = 'UnauthorizedError';
  }
}
export class IllegalArgumentError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'IllegalArgumentError';
  }
}
export class NotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'NotFoundError';
  }
}
```

### `server/util/response.ts`

```typescript
// 统一响应格式：成功 { ok: true, data } / 失败 { ok: false, error }
export const ok = <T>(data: T) => ({ ok: true as const, data });
export const err = (error: string) => ({ ok: false as const, error });
```

### `server/util/logger.ts`

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined
});
```

### `server/util/context-manager.ts`

```typescript
import type { UIMessage } from 'ai';

const CONTEXT_WINDOW_CHARS = 800_000; // 约 128K tokens × 6 chars/token
const TOOL_RESULT_KEEP_RECENT = 4; // 最近 N 轮 assistant 保留完整 tool result
const TOOL_RESULT_MAX_CHARS = 200; // 旧 tool result 截断到此长度

export function compactMessages(messages: UIMessage[]): UIMessage[] {
  const size = JSON.stringify(messages).length;
  const ratio = size / CONTEXT_WINDOW_CHARS;

  if (ratio < 0.6) return messages; // 60% 以下，不压缩

  let result = applyL1(messages); // 60%+ 先做 L1

  if (JSON.stringify(result).length / CONTEXT_WINDOW_CHARS > 0.8) {
    result = applyL2(result); // 80%+ 叠加 L2
  }

  return result;
}

// L1：降级旧消息中的 tool-invocation result，只保留前 200 字符
function applyL1(messages: UIMessage[]): UIMessage[] {
  // 找出最近 TOOL_RESULT_KEEP_RECENT 条 assistant 消息的索引
  const assistantIdxs = messages
    .map((m, i) => (m.role === 'assistant' ? i : -1))
    .filter((i) => i >= 0);
  const keepFrom = assistantIdxs.slice(-TOOL_RESULT_KEEP_RECENT)[0] ?? 0;

  return messages.map((msg, i) => {
    if (i >= keepFrom || msg.role !== 'assistant') return msg;
    const compactedParts = (msg.parts ?? []).map((part: any) => {
      if (part.type !== 'tool-invocation') return part;
      const result = part.toolInvocation?.result;
      if (typeof result !== 'string' || result.length <= TOOL_RESULT_MAX_CHARS) return part;
      return {
        ...part,
        toolInvocation: {
          ...part.toolInvocation,
          result: result.slice(0, TOOL_RESULT_MAX_CHARS) + ' [output truncated]'
        }
      };
    });
    return { ...msg, parts: compactedParts };
  });
}

// L2：滑动窗口——保留首轮（话题锚）+ 最近若干轮，不拆散 tool 配对
function applyL2(messages: UIMessage[]): UIMessage[] {
  // 按 user 消息分割对话轮次
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

  if (turns.length <= 3) return messages; // 轮次太少不压缩

  // 保留首轮 + 最近 2 轮
  const kept = [turns[0], ...turns.slice(-2)];
  return kept.flat();
}

// L3 接口预留（暂不实现）
// export async function applyL3(messages: UIMessage[]): Promise<UIMessage[]>
```

### `server/package.json`

```json
{
  "name": "opencode-server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch index.ts",
    "start": "node --loader tsx index.ts"
  },
  "dependencies": {
    "@hono/node-server": "^1.13",
    "@supabase/supabase-js": "^2.x",
    "ai": "^6.x",
    "@ai-sdk/openai": "^1.x",
    "hono": "^4.x",
    "pino": "^9.x",
    "pino-pretty": "^13.x",
    "dotenv": "^16.x"
  },
  "devDependencies": {
    "tsx": "^4.x",
    "typescript": "^5.x"
  }
}
```

### 前端对接：vite.config.js 加 proxy

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

开发时只需 `npm run dev`（前端）+ `npm run dev`（server/），前端所有 `/api/*` 请求自动转发到 3001，无跨域问题。生产部署时将 `VITE_API_BASE_URL` 改为真实后端地址。

---

## 文件上传流程

```
用户点击 📎 选择文件
  │
  ├─ 前端校验
  │   ├─ 图片：jpg/png/gif/webp，< 20MB
  │   ├─ 文档：pdf/txt/md，< 50MB
  │   └─ 不支持类型 → Toast 提示拒绝
  │
  ├─ 直传 Supabase Storage（用用户 access_token）
  │   路径：{userId}/{chatId}/{Date.now()}-{filename}
  │
  ├─ 生成 signed URL（有效期 1 小时）
  │
  ├─ 前端展示附件预览（图片缩略图 / 文件卡片）
  │
  └─ 发送时随消息传给后端
     POST /api/chat { message, chatId, attachments: [{ url, mimeType, name }] }
       │
       └─ 后端按 mimeType 处理：
           ├─ image/* → 构建 image part（URL 方式，视觉模型支持）
           └─ text/pdf → 提取文本 → 作为 text part 附在消息末尾
```

---

## 文件目录结构（新增部分）

```
opencode-app/
│
├── server/                          新增：Hono 后端服务
│   ├── index.ts                     入口，监听 3001 端口
│   ├── routes/
│   │   ├── chat.ts                  POST /api/chat（核心流式接口）
│   │   ├── conversations.ts         CRUD /api/conversations
│   │   └── models.ts                GET /api/models
│   ├── middleware/
│   │   ├── auth.ts                  验证 Supabase JWT
│   │   └── cors.ts                  开发环境 CORS
│   ├── lib/
│   │   ├── supabase-server.ts       service_role 客户端
│   │   ├── model.ts                 getModel() 工厂
│   │   └── chat-store.ts            loadChat / saveChat / createChat
│   ├── package.json                 后端独立依赖
│   └── tsconfig.json
│
└── src/
    ├── pages/
    │   └── Chat/
    │       ├── index.tsx            路由 /chat → redirect /chat/:newId
    │       ├── detail.tsx           路由 /chat/:id，加载历史 + 渲染
    │       ├── layout/
    │       │   ├── ChatLayout.tsx   整体布局容器（flex row）
    │       │   ├── Sidebar.tsx      左侧会话列表（按日期分组）
    │       │   │   ├── NewChatButton.tsx
    │       │   │   ├── SearchBar.tsx
    │       │   │   └── ConversationItem.tsx
    │       │   └── TopBar.tsx       模型选择器 + 设置按钮
    │       ├── chat/
    │       │   ├── ChatWindow.tsx   消息滚动区（自动吸底）
    │       │   ├── MessageBubble.tsx  消息气泡分发器
    │       │   ├── UserMessage.tsx
    │       │   ├── AssistantMessage.tsx
    │       │   ├── parts/
    │       │   │   ├── TextPart.tsx         Markdown + 代码高亮
    │       │   │   ├── ReasoningPart.tsx    思考过程折叠面板
    │       │   │   └── ToolInvocationPart.tsx  工具调用卡片
    │       │   ├── MessageActions.tsx   复制/重发/点赞/点踩
    │       │   └── TypingIndicator.tsx  AI 思考中动画
    │       ├── input/
    │       │   ├── InputBar.tsx          主输入区域
    │       │   ├── AutoResizeTextarea.tsx 自动伸缩输入框
    │       │   ├── AttachmentPreview.tsx  已上传附件预览
    │       │   └── ModelSelector.tsx     内嵌模型选择下拉
    │       └── settings/
    │           └── SettingsPanel.tsx  系统提示词 + Token 显示开关
    │
    ├── hooks/
    │   ├── useChatSession.ts    会话 CRUD + Realtime 订阅
    │   └── useFileUpload.ts     文件上传到 Supabase Storage
    │
    └── services/
        └── chatApi.ts           封装后端 API 调用（conversations CRUD）
```

---

## 新增依赖

```json
// 后端（server/package.json）
{
  "hono": "^4.x",
  "@hono/node-server": "^1.x",
  "@supabase/supabase-js": "^2.x",
  "ai": "^6.x",
  "@ai-sdk/openai": "^3.x",
  "dotenv": "^16.x",
  "tsx": "^4.x"
}

// 前端（根 package.json 追加）
{
  "react-markdown": "^9.x",
  "remark-gfm": "^4.x",
  "rehype-highlight": "^7.x"
}
```

---

## 环境变量

```bash
# .env（前端，已有项不变，新增 VITE_API_BASE_URL）
VITE_SUPABASE_URL=https://bfwtpofxsbiiepavfjcc.supabase.co
VITE_SUPABASE_KEY=sb_publishable_Y-Ir3n8A5tWklLkb78woIA_djtLeMGX
VITE_API_BASE_URL=http://localhost:3001      # 新增：后端地址

# server/.env（后端专用，绝不放 VITE_ 前缀）
SUPABASE_URL=https://bfwtpofxsbiiepavfjcc.supabase.co
SUPABASE_KEY=eyJ...            # Dashboard > Settings > API > service_role
OPENAI_BASE_URL=https://api.codeturbo.ai/v1
OPENAI_API_KEY=sk-b037...
OPENAI_MODEL_ID=gpt-5.4-mini
PORT=3001
```

> ⚠️ **安全要点**：`SUPABASE_KEY` 和 `OPENAI_API_KEY` 只能存在 `server/.env`，永远不放到 `VITE_` 前缀变量里，否则会打包进前端 bundle 暴露给用户。

---

## 功能完整度对标

| 功能                | ChatGPT     | Codex | 本方案                     |
| ------------------- | ----------- | ----- | -------------------------- |
| 多会话 + 切换       | ✅          | ✅    | ✅                         |
| 云端历史持久化      | ✅          | ✅    | ✅ Supabase                |
| 流式打字输出        | ✅          | ✅    | ✅ AI SDK SSE              |
| 停止生成            | ✅          | ✅    | ✅ `stop()`                |
| 重新生成            | ✅          | ✅    | ✅ `regenerate()`          |
| 会话标题自动生成    | ✅          | —     | ✅ onFinish 后台生成       |
| 历史搜索            | ✅          | —     | ✅ Supabase 全文搜索       |
| Markdown + 代码高亮 | ✅          | ✅    | ✅ react-markdown          |
| 复制代码块          | ✅          | ✅    | ✅                         |
| 图片上传            | ✅          | —     | ✅ Supabase Storage        |
| 文件上传（PDF/TXT） | ✅          | ✅    | ✅ 提取文本附消息          |
| Reasoning 思考过程  | ✅（o系列） | ✅    | ✅ reasoning part 折叠展示 |
| 工具调用可视化      | ✅          | ✅    | ✅ tool-invocation part    |
| 模型切换            | ✅          | ✅    | ✅                         |
| 自定义系统提示词    | ✅          | —     | ✅ per-conversation        |
| 消息点赞/点踩       | ✅          | —     | ✅ 存 metadata.thumbs      |
| Token 用量显示      | ❌ 隐藏     | —     | ✅ 可选显示                |
| 键盘快捷键          | ✅          | ✅    | ✅ ⌘Enter 发送 / ⌘K 新建   |
| 响应式移动端        | ✅          | —     | ✅ 侧边栏抽屉              |
| API key 安全        | ✅ 服务端   | ✅    | ✅ 只存服务端 .env         |

---

## 实施阶段

| 步骤       | 内容                                                        | 预计工时 |
| ---------- | ----------------------------------------------------------- | -------- |
| **Step 1** | Supabase 建表 + RLS + Storage bucket（执行上方 DDL）        | 0.5h     |
| **Step 2** | Hono 后端搭建：入口 + JWT 中间件 + `/api/chat` 流式接口     | 2h       |
| **Step 3** | 会话 CRUD API：`/api/conversations` + `chat-store.ts`       | 1h       |
| **Step 4** | 路由注册 + `ChatLayout` 骨架 + `Sidebar` 会话列表           | 2h       |
| **Step 5** | `ChatWindow` + `MessageBubble`：基础文本流式对话可用        | 2h       |
| **Step 6** | `MessageParts` 完整渲染：Markdown + 代码高亮 + 工具调用卡片 | 2h       |
| **Step 7** | `InputBar` + 文件上传 + 附件预览                            | 2h       |
| **Step 8** | 设置面板 + 模型切换 + polish（快捷键/移动端/空状态）        | 2h       |

**总计：约 13.5 小时**

---

## 验收标准

- [ ] 用户登录后能看到历史会话列表，刷新不丢失
- [ ] 新建会话跳转到 `/chat/:id`，URL 可分享/书签
- [ ] 流式输出顺畅，支持停止 + 重新生成
- [ ] 上传图片/PDF 后，AI 能看到并回答相关内容
- [ ] 代码块有语法高亮 + 一键复制按钮
- [ ] 思考过程（reasoning）和工具调用以卡片形式展示
- [ ] 浏览器 DevTools Network 中看不到 `OPENAI_API_KEY`
- [ ] 移动端侧边栏可收起，输入框在键盘弹出时不被遮挡
