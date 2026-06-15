import { Hono } from 'hono';
import {
  ToolLoopAgent,
  createAgentUIStreamResponse,
  isLoopFinished,
  stepCountIs,
  generateId,
  type UIMessage
} from 'ai';
import { getModel } from '../lib/model';
import {
  loadChat,
  saveUserMessage,
  saveAssistantMessage,
  markMessageStatus,
  generateTitle
} from '../lib/chat-store';
import { createSupabaseAdmin } from '../lib/supabase';
import { NotFoundError } from '../util/errors';
import { logger } from '../util/logger';
import { compactMessages } from '../util/context-manager';
import type { Env, Variables } from '../index';

const chat = new Hono<{ Bindings: Env; Variables: Variables }>();

// /api/chat  Body: { messages: UIMessage[], id: string }  (AI SDK v4 格式)
chat.post('/', async (c) => {
  const user = c.get('user');
  const { messages, id } = await c.req.json();
  const abortSignal = c.req.raw.signal;

  // 取最后一条 user 消息作为"当前轮次输入"
  const incomingMessages: UIMessage[] = Array.isArray(messages) ? messages : [];
  const lastUserMsg = [...incomingMessages].reverse().find((m) => m.role === 'user');
  if (!lastUserMsg) throw new Error('no user message');

  // 1. 验证 conversation 归属
  const supabase = createSupabaseAdmin(c.env);
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, model')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!conv) throw new NotFoundError('conversation not found');

  // 2. 立即持久化 user 消息（防流中断丢消息）
  await saveUserMessage(c.env, id, lastUserMsg);

  // 3. 从 DB 加载历史，缺确保幂等作为 originalMessages 的基准，确保 id 准确，避免续写/重试时主键冲突）
  const history = await loadChat(c.env, id);
  const isFirstTurn = history.length === 0;

  // 4. 上下文压缩（L1 + L2）
  // const compactedMsgs = compactMessages(history);

  // 5. 创建 ToolLoopAgent
  const agent = new ToolLoopAgent({
    model: getModel(c.env, conv.model),
    tools: {
      // 扩展点：memory、web_search、code_exec 等 tool 加在此处
    },
    stopWhen: [stepCountIs(20), isLoopFinished()],
    maxOutputTokens: 10000
    // onFinish
  });

  // 记录本轮 assistant 消息 id，供中断时标记
  let assistantMsgId: string | null = null;

  // 6. 流式执行
  // uiMessages（Agent 的输入上下文）
  //  传给 agent.run() 执行的历史消息，SDK 把它转换成 model messages 送给 LLM，不影响 ID 生成
  //  通常传压缩后的历史（如你的 compactedMsgs）
  // originalMessages（持久化模式的触发器）
  // 告诉 SDK "我在做持久化，这是数据库里的原始消息"，传入后 SDK 会：
  // 自动为 responseMessage 分配 ID
  // 如果最后一条是 assistant 消息（续写场景），把新内容追加到它上面（isContinuation: true）
  // 通常传从数据库读出的 history（未压缩的原始记录）
  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages, // LLM 上下文用前端传来的（含完整附件信息等）
    originalMessages: history, // 持久化基准用 DB 里的（id 准确，避免主键冲突）
    generateMessageId: generateId, // 必传！否则 responseMessage.id 为 undefined，多条消息会覆盖
    ...(abortSignal ? { abortSignal } : {}),
    // headers: {
    //   'X-Response-Origin': 'cloudflare-worker'
    // },
    // status: 200,
    // onStepFinish: (stepResult) => {},
    onFinish: async (opts) => {
      const { responseMessage, messages, isAborted, isContinuation, finishReason } = opts;
      // console.log('onFinish', isAborted, isContinuation, finishReason);
      console.log('onFinish---responseMessage', isContinuation, responseMessage);
      // console.log('onFinish---messages', messages);
      try {
        // 持久化 assistant 消息，responseMessage 是本轮生成的 assistant 消息
        // 如果重新生成，responseMessage 会包含所有的历史回复
        if (responseMessage) {
          assistantMsgId = responseMessage.id;
          // isContinuation 时 SDK 把旧 parts + 新 parts 合并在了 responseMessage 里
          // 需要截掉旧内容，只保留本次新生成的 parts
          const oldAssistantMsg = isContinuation ? history[history.length - 1] : null;
          const newParts = oldAssistantMsg
            ? responseMessage.parts.slice(oldAssistantMsg.parts.length)
            : responseMessage.parts;
          await saveAssistantMessage(
            c.env,
            id,
            { ...responseMessage, parts: newParts },
            isContinuation
          );
        }
        // stream 是否被终止
        // if (isAborted) {}
        // 首轮生成标题
        if (isFirstTurn) {
          const firstText = (lastUserMsg.parts?.[0] as { text?: string })?.text ?? '';
          generateTitle(c.env, id, firstText);
        }
      } catch (error) {
        logger.error('[server] onFinish', error);
      }
    },
    onError: (err: string) => {
      // 流出错时标记 assistant 消息（若已有 id）
      if (assistantMsgId) {
        markMessageStatus(c.env, assistantMsgId, 'error').catch((e) => {
          logger.error('[server] onError', e);
        });
      }
      return err as string;
    }
  });
  // 用户中断（abortSignal）时标记 user 消息为 interrupted
  // （abortSignal.onabort 在 createAgentUIStreamResponse 返回后已无法可靠捕获，
  //  依赖前端 stop() 时自行感知；此处仅做 onError 兜底）
});

export default chat;
