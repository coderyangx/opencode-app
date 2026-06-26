import { Hono } from 'hono';
import { createSupabaseAdmin as getSupabase } from '../lib/supabase';
import { sanitizeUIMessages } from '../lib/chat-store';
import { NotFoundError } from '../util/errors';
import type { Env } from '../index';

const conversation = new Hono<{
  Bindings: Env;
  Variables: { user: { id: string } };
}>();

// 获取当前用户所有会话（pinned 置顶优先，再按 updated_at 降序）
conversation.get('/', async (c) => {
  const user = c.get('user');
  const { data } = await getSupabase(c.env)
    .from('conversations')
    .select('id, title, model, pinned, created_at, updated_at')
    .eq('user_id', user.id)
    .order('pinned', { ascending: false })
    .order('updated_at', { ascending: false });
  return c.json(data ?? []);
});

// 新建会话
conversation.post('/create', async (c) => {
  const user = c.get('user');
  const { model } = await c.req.json().catch(() => ({}));
  const { data } = await getSupabase(c.env)
    .from('conversations')
    .insert({ user_id: user.id, model: model ?? c.env.OPENAI_MODEL_ID ?? 'gpt-5.4-mini' })
    .select()
    .single();
  return c.json(data, 201);
});

// 更新标题或模型 Body: { id, title?, model? }
conversation.post('/update', async (c) => {
  const user = c.get('user');
  const { id, title, model } = await c.req.json();
  const patch = Object.fromEntries(
    Object.entries({ title, model }).filter(([, v]) => v !== undefined)
  );
  const { data } = await getSupabase(c.env)
    .from('conversations')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  return c.json(data);
});

// 置顶/取消置顶 Body: { id, pinned: boolean }
conversation.post('/pin', async (c) => {
  const user = c.get('user');
  const { id, pinned } = await c.req.json();
  const { data } = await getSupabase(c.env)
    .from('conversations')
    .update({ pinned: Boolean(pinned) })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  return c.json(data);
});

// 删除会话（cascade 删 messages） Body: { id }
conversation.post('/delete', async (c) => {
  const user = c.get('user');
  const { id } = await c.req.json();
  await getSupabase(c.env).from('conversations').delete().eq('id', id).eq('user_id', user.id);
  return c.json({ ok: true });
});

// 加载会话历史消息
conversation.get('/:id/messages', async (c) => {
  const user = c.get('user');
  const convId = c.req.param('id');

  // 一次查询：通过 conversations 的 user_id 做隐式鉴权
  // TODO 返回的 status 字段可以用来判断该回复是否被中断，从而实现 继续生成、恢复生成
  const { data, error } = await getSupabase(c.env)
    .from('messages')
    .select('id, role, parts, metadata, status, created_at, conversations!inner(user_id)')
    .eq('conversation_id', convId)
    .eq('conversations.user_id', user.id)
    .order('created_at', { ascending: true });
  if (error) throw new NotFoundError('conversation not found');

  // const { data: conv } = await getSupabase(c.env)
  //   .from('conversations')
  //   .select('id')
  //   .eq('id', convId)
  //   .eq('user_id', user.id)
  //   .single();
  // if (!conv) throw new NotFoundError('conversation not found');

  // const { data } = await getSupabase(c.env)
  //   .from('messages')
  //   .select('id, role, parts, metadata, status, created_at')
  //   .eq('conversation_id', convId)
  //   .order('created_at', { ascending: true });
  // 过滤空壳消息（历史脏数据），避免前端加载后再次回传导致 SDK schema 校验失败
  return c.json(sanitizeUIMessages((data ?? []) as any[]));
});

export default conversation;
