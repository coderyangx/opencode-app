import { generateText } from 'ai';
import { getModel } from './model';
import { createSupabaseAdmin } from './supabase';
import type { UIMessage } from 'ai';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  OPENAI_BASE_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL_ID?: string;
};

// 读取会话历史（按 created_at 升序）
export async function loadChat(env: Env, id: string): Promise<UIMessage[]> {
  const supabase = createSupabaseAdmin(env);
  const { data } = await supabase
    .from('messages')
    .select('id, role, parts, metadata, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    role: row.role as 'user' | 'assistant',
    parts: row.parts,
    metadata: row.metadata ?? {},
    createdAt: new Date(row.created_at)
  }));
}

// 流开始前写入 user 消息（幂等，ignoreDuplicates 防重复）
export async function saveUserMessage(env: Env, id: string, msg: UIMessage): Promise<void> {
  const supabase = createSupabaseAdmin(env);
  await supabase.from('messages').upsert(
    {
      id: msg.id,
      conversation_id: id,
      role: 'user',
      parts: msg.parts ?? [],
      metadata: {}
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );
}

// onFinish 后写入 assistant 消息 + 更新会话时间
export async function saveAssistantMessage(env: Env, id: string, msg: UIMessage): Promise<void> {
  const supabase = createSupabaseAdmin(env);
  await supabase.from('messages').upsert(
    {
      id: msg.id,
      conversation_id: id,
      role: 'assistant',
      parts: msg.parts ?? [],
      metadata: (msg as unknown as Record<string, unknown>).metadata ?? {}
    },
    { onConflict: 'id' }
  );
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id);
}

// 首轮对话结束后异步生成标题
export async function generateTitle(env: Env, id: string, firstUserText: string): Promise<void> {
  const { text } = await generateText({
    model: getModel(env),
    prompt: `用 6 个字以内概括这个对话的主题，只输出标题本身，不加引号和标点：\n\n${firstUserText}`
  });
  const supabase = createSupabaseAdmin(env);
  await supabase.from('conversations').update({ title: text.trim() }).eq('id', id);
}
