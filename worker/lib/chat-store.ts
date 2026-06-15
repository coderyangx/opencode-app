import { generateText } from 'ai';
import { getModel } from './model';
import { createSupabaseAdmin } from './supabase';
import { logger } from '../util/logger';
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
      metadata: {},
      status: 'done'
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );
}

// onFinish 后写入 assistant 消息 + 更新会话时间
export async function saveAssistantMessage(
  env: Env,
  id: string,
  msg: UIMessage,
  isContinuation = false
): Promise<void> {
  // 防止空 id 写入（generateMessageId 未配置时 SDK 会返回空字符串）
  if (!msg.id) {
    logger.error('[chat] saveAssistantMessage: responseMessage.id is empty, skipping');
    return;
  }
  const supabase = createSupabaseAdmin(env);
  if (isContinuation) {
    // regenerate 场景：直接 UPDATE，覆盖旧内容，保留原 created_at（顺序不变）
    await supabase
      .from('messages')
      .update({
        parts: msg.parts ?? [],
        metadata: msg.metadata ?? {},
        status: 'done'
      })
      .eq('id', msg.id);
  } else {
    // 正常回复：INSERT
    await supabase.from('messages').insert({
      id: msg.id,
      conversation_id: id,
      role: 'assistant',
      parts: msg.parts ?? [],
      metadata: msg.metadata ?? {},
      status: 'done'
    });
  }
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id);
}

// 流中断或出错时将消息标记为对应状态
export async function markMessageStatus(
  env: Env,
  msgId: string,
  status: 'interrupted' | 'error'
): Promise<void> {
  const supabase = createSupabaseAdmin(env);
  await supabase.from('messages').update({ status }).eq('id', msgId);
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
