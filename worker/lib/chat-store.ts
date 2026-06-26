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

/**
 * 过滤掉 parts 为空的消息（「空壳消息」）。
 *
 * 场景：模型报错 / abort 在内容生成前 / regenerate 产生 0 个新 part 时，
 * onFinish 里的 responseMessage.parts 可能为 []，如果照存进 DB，
 * 下次请求 SDK 的 schema 校验要求每条消息至少 1 个 part → 整个请求 400。
 *
 * 在 loadChat、getMessages、两个 chat 路由入口统一调用此函数做防御。
 */
export function sanitizeUIMessages(messages: UIMessage[]): UIMessage[] {
  return messages.filter((m) => Array.isArray(m.parts) && m.parts.length > 0);
}

// 读取会话历史（按 created_at 升序）
export async function loadChat(env: Env, id: string): Promise<UIMessage[]> {
  const supabase = createSupabaseAdmin(env);
  const { data } = await supabase
    .from('messages')
    .select('id, role, parts, metadata, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  // 过滤空壳消息（历史脏数据），避免后续请求 schema 校验失败
  return sanitizeUIMessages(
    (data ?? []).map((row) => ({
      id: row.id,
      role: row.role as 'user' | 'assistant',
      parts: row.parts,
      metadata: row.metadata ?? {},
      createdAt: new Date(row.created_at)
    }))
  );
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
  // 防止空 parts 写入：模型报错 / abort 在内容生成前 / regenerate 产生 0 个新 part 时
  // parts 可能为 []，照存会导致下次请求 schema 校验失败（Message must contain at least one part）
  if (!msg.parts || msg.parts.length === 0) {
    logger.warn('[chat] saveAssistantMessage: parts is empty, skipping', { msgId: msg.id });
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

// 重新生成场景：删除 conversation 中最后一条 assistant 消息
export async function deleteLastAssistantMessage(env: Env, conversationId: string): Promise<void> {
  const supabase = createSupabaseAdmin(env);
  // 取最后一条 assistant 消息的 id
  const { data } = await supabase
    .from('messages')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('role', 'assistant')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (!data?.id) return;
  await supabase.from('messages').delete().eq('id', data.id);
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
