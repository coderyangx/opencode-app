import { Hono } from 'hono';
import { ToolLoopAgent, createAgentUIStreamResponse, isLoopFinished, stepCountIs } from 'ai';
import type { UIMessage } from 'ai';
import { User } from '@supabase/supabase-js';
import { getModel } from '../lib/model';
import { loadChat, saveUserMessage, saveAssistantMessage, generateTitle } from '../lib/chat-store';
import { createSupabaseAdmin } from '../lib/supabase';
import { NotFoundError } from '../util/errors';
import { compactMessages } from '../util/context-manager';
import type { Env, Variables } from '../index';

const chat = new Hono<{ Bindings: Env; Variables: Variables }>();

type Attachment = {
  url: string;
  mimeType: string;
  name: string;
  size?: string;
};

// POST /api/chat
// Body: { message: UIMessage, id: string, modelId?: string, attachments?: Attachment[] }
chat.post('/', async (c) => {
  const user = c.get('user');
  const { message, id, attachments } = await c.req.json();
  const abortSignal = c.req.raw.signal; // 用户取消请求时中止 ToolLoopAgent

  // 1. 验证 conversation 归属
  const supabase = createSupabaseAdmin(c.env);
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, model')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!conv) throw new NotFoundError('conversation not found');

  // 2. 立即持久化 user 消息（流开始前写入，防流中断丢消息）
  const attachmentParts = buildAttachmentParts(attachments ?? []);
  const incomingMessage: UIMessage = {
    ...message,
    parts: [...(message.parts ?? []), ...attachmentParts]
  };
  await saveUserMessage(c.env, id, incomingMessage);

  // 3. 加载历史（含刚写入的 user 消息）
  const history = await loadChat(c.env, id);
  const isFirstTurn = history.length === 1;

  // 4. 上下文压缩（L1 + L2）
  const compactedMsgs = compactMessages(history);

  // 5. 创建 ToolLoopAgent
  const agent = new ToolLoopAgent({
    model: getModel(c.env, conv.model),
    tools: {
      // 扩展点：memory、web_search、code_exec 等 tool 加在此处
    },
    stopWhen: [stepCountIs(20), isLoopFinished()],
    maxOutputTokens: 8000,
    onFinish: async (messages) => {
      const assistantMsg = messages.content;
      console.log('服务端onFInish', messages);
      // if (assistantMsg?.role === 'assistant') {
      //   await saveAssistantMessage(c.env, id, assistantMsg);
      // }
      // if (isFirstTurn) {
      //   const firstText = (message.parts?.[0] as { text?: string })?.text ?? '';
      //   generateTitle(c.env, id, firstText).catch(console.error);
      // }
    }
    // 扩展点：guardrails 在 prepareCall hook 里注入
  });

  // 6. 流式执行
  // const result = await agent.stream({ messages: allMessages });

  // 7. onFinish：只写 assistant 消息（user 已在步骤 2 写入）
  return createAgentUIStreamResponse({
    agent,
    uiMessages: compactedMsgs,
    ...(abortSignal ? { abortSignal } : {})
  });

  // result.response
  //   .then(async ({ messages: fullMessages }) => {
  //     const assistantMsg = fullMessages.at(-1);
  //     if (assistantMsg?.role === 'assistant') {
  //       await saveAssistantMessage(c.env, id, assistantMsg);
  //     }
  //     if (isFirstTurn) {
  //       const firstText = (message.parts?.[0] as { text?: string })?.text ?? '';
  //       generateTitle(c.env, id, firstText).catch(console.error);
  //     }
  //   })
  //   .catch(console.error);

  // return result.toUIMessageStreamResponse();
});

function buildAttachmentParts(attachments: Attachment[]) {
  return attachments.map(({ url, mimeType, name }) => {
    if (mimeType.startsWith('image/')) {
      return { type: 'image' as const, image: url };
    }
    return { type: 'text' as const, text: `[附件: ${name}]` };
  });
}

export default chat;
