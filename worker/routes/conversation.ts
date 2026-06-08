import { Hono } from 'hono';
import { createSupabaseAdmin } from '../lib/supabase';
import { NotFoundError } from '../util/errors';
import type { Env } from '../index';

const app = new Hono<{ Bindings: Env; Variables: { user: { id: string } } }>();

// GET /api/conversations — 获取当前用户所有会话
app.get('/', async (c) => {
  const user = c.get('user');
  const supabase = createSupabaseAdmin(c.env);
  const { data } = await supabase
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
  const supabase = createSupabaseAdmin(c.env);
  const { data } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, model: model ?? c.env.OPENAI_MODEL_ID ?? 'gpt-5.4-mini' })
    .select()
    .single();
  return c.json(data, 201);
});

// POST /api/conversations/update — 更新标题或模型
// Body: { id, title?, model? }
app.post('/update', async (c) => {
  const user = c.get('user');
  const { id, title, model } = await c.req.json();
  const patch = Object.fromEntries(
    Object.entries({ title, model }).filter(([, v]) => v !== undefined)
  );
  const supabase = createSupabaseAdmin(c.env);
  const { data } = await supabase
    .from('conversations')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  return c.json(data);
});

// POST /api/conversations/delete — 删除会话（cascade 删 messages）
// Body: { id }
app.post('/delete', async (c) => {
  const user = c.get('user');
  const { id } = await c.req.json();
  const supabase = createSupabaseAdmin(c.env);
  await supabase.from('conversations').delete().eq('id', id).eq('user_id', user.id);
  return c.json({ ok: true });
});

// GET /api/conversations/:id/messages — 加载会话历史消息
app.get('/:id/messages', async (c) => {
  const user = c.get('user');
  const convId = c.req.param('id');
  const supabase = createSupabaseAdmin(c.env);

  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', convId)
    .eq('user_id', user.id)
    .single();
  if (!conv) throw new NotFoundError('conversation not found');

  const { data } = await supabase
    .from('messages')
    .select('id, role, parts, metadata, created_at')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true });
  return c.json(data ?? []);
});

export default app;
