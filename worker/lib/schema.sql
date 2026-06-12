-- ============================================================
-- MVP Schema（关闭 RLS，继续用 anon key）
-- 用户隔离由 Worker 业务代码的 WHERE user_id = ? 保证
-- 对外开放时再开启 RLS + 换 service_role key
-- ============================================================

-- conversations 表
create table public.conversations (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references auth.users (id) on delete cascade,
    title text not null default '新对话',
    model text not null default 'gpt-5.4-mini',
    pinned boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 侧边栏列表查询：按 pinned 置顶、updated_at 降序
create index on conversations (
    user_id,
    pinned desc,
    updated_at desc
);

-- messages 表
-- message.id 使用 AI SDK 生成的字符串（如 "msg_abc123"），非 uuid
create table public.messages (
    id text primary key,
    conversation_id uuid not null references conversations (id) on delete cascade,
    role text not null check (role in ('user', 'assistant')),
    parts jsonb not null default '[]',
    metadata jsonb not null default '{}',
    -- status: 'done' 正常完成 | 'streaming' 流式中 | 'error' 出错 | 'interrupted' 用户中断/断联
    status text not null default 'done' check (
        status in (
            'done',
            'streaming',
            'error',
            'interrupted'
        )
    ),
    created_at timestamptz not null default now()
);

-- parts 字段存储 UIMessage.parts 完整 JSON，结构示例：
-- user:      [{ type: 'text', text: '...' }, { type: 'file', mediaType: 'image/png', url: '...' }]
-- assistant: [{ type: 'text', text: '...' }, { type: 'tool-invocation', ... }]

-- metadata 字段约定（saveAssistantMessage 写入）：
-- { "model": "gpt-5.4-mini", "inputTokens": 512, "outputTokens": 238, "durationMs": 1842 }

-- 会话历史加载：按 created_at 升序
create index on messages ( conversation_id, created_at asc );