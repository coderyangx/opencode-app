import { Hono } from 'hono';
import {
  ToolLoopAgent,
  createAgentUIStreamResponse,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isLoopFinished,
  stepCountIs,
  generateId,
  type UIMessage,
  type TextUIPart,
  createAgentUIStream,
  streamText,
  convertToModelMessages
} from 'ai';
import { getModel } from '../lib/model';
import { buildSystemPrompt } from '../lib/system-prompt';
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

/**
 * TODO：流式断连和恢复、网络关闭和切会话重连、真正的流式恢复(比较复杂，需实时写入 KV，MVP不建议做)
  前后端 status: 'done'正常完成 | 'streaming'流式中 | 'error'出错 | 'interrupted'用户中断/断联
  断连发生
      ↓
  onError 回调触发
      ↓
  后端将 assistantMsgId 标记为 status='interrupted'（已实现）
      ↓
  前端 toast 提示"生成被中断"
      ↓
  消息气泡底部显示[继续生成]按钮（而不是重新生成）
      ↓
  用户点击 → 发送特殊指令 → 后端检测到 isContinuation 场景进行续写

KV / Durable Objects：真正的流式恢复(3-5PD)
  生成中的内容 → 实时写入 KV / Durable Objects
      ↓
  断连 → 客户端记录 lastEventId
      ↓
  重连 → 携带 lastEventId 请求
      ↓
  后端从 KV 读取已生成内容，从断点处继续 stream
 */
const LANGFUSE_SECRET_KEY = 'sk-lf-3f651909-870f-45d1-83bd-eedabd230365';
const LANGFUSE_PUBLIC_KEY = 'pk-lf-42c12906-b498-4853-abd5-320260532821';
const LANGFUSE_BASE_URL = 'https://langfuse.sankuai.com';

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
    instructions: buildSystemPrompt(),
    tools: {
      // 扩展点：memory、web_search、code_exec 等 tool 加在此处
    },
    stopWhen: [stepCountIs(20), isLoopFinished()],
    maxOutputTokens: 10000
    // onFinish: (options) => {options}
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

  // 2. 关键：消费流以防止客户端断开导致处理中断
  // 即使客户端关闭页面，服务端也会继续执行直到流结束并触发 onFinish
  // result.consumeStream();

  // 3. 返回 UI 友好的流响应，并在结束时保存
  const result = createAgentUIStreamResponse({
    agent,
    uiMessages: messages, // LLM 上下文用前端传来的（含完整附件信息等）
    originalMessages: history, // 持久化基准用 DB 里的（id 准确，避免主键冲突）
    generateMessageId: generateId, // 必传！否则 responseMessage.id 为 undefined，多条消息会覆盖
    // ...(abortSignal ? { abortSignal } : {}),
    abortSignal,
    consumeSseStream(options) {},
    // headers: {
    //   'X-Response-Origin': 'cloudflare-worker'
    // },
    // status: 200,
    // consumeSseStream: async (options) => {
    //   console.log('consumeSseStream', await options.stream.getReader().read());
    // },
    // onStepFinish: (stepResult) => {},
    onFinish: async (opts) => {
      const { responseMessage, messages, isAborted, isContinuation, finishReason } = opts;
      // isContinuation 处理续写场景
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
          const rawParts = oldAssistantMsg
            ? responseMessage.parts.slice(oldAssistantMsg.parts.length)
            : responseMessage.parts;
          // 解析 <thinking>...</thinking> 标签，拆分为 reasoning + text parts
          const parsedMsg = parseThinkingParts({ ...responseMessage, parts: rawParts });

          if (isAborted) {
            // 用户主动终止：先保存已生成的部分内容，再标记为 interrupted
            await saveAssistantMessage(c.env, id, parsedMsg, isContinuation);
            await markMessageStatus(c.env, assistantMsgId, 'interrupted');
          } else {
            await saveAssistantMessage(c.env, id, parsedMsg, isContinuation);
          }
        }
        // stream 是否被终止
        // if (isAborted) {}
        // 首轮生成标题
        // 首轮生成标题（仅正常完成时）
        if (isFirstTurn && !isAborted) {
          const firstText = (lastUserMsg.parts?.[0] as { text?: string })?.text ?? '';
          generateTitle(c.env, id, firstText);
        }
      } catch (error) {
        logger.error('[server] onFinish', error);
      }
    },
    onError: (err: string) => {
      // TODO 网络断连 / 服务端异常：标记为 error（区别于用户主动 abort 的 interrupted）
      if (assistantMsgId) {
        markMessageStatus(c.env, assistantMsgId, 'error').catch((e) => {
          logger.error('[server] onError', e);
        });
      }
      return err as string;
    }
  });

  return result;
  // TODO 用户中断（abortSignal）时标记 user 消息为 interrupted
  // （abortSignal.onabort 在 createAgentUIStreamResponse 返回后已无法可靠捕获，
  //  依赖前端 stop() 时自行感知；此处仅做 onError 兜底）
});

/**
 * 解析模型输出中的 <thinking>...</thinking> 标签，
 * 将 responseMessage 的 text parts 拆分为 reasoning + text 两种 parts。
 * 用于在没有原生推理 token 时，通过提示词模拟推理展示。
 */
function parseThinkingParts(msg: UIMessage): UIMessage {
  const newParts: UIMessage['parts'] = [];
  for (const part of msg.parts ?? []) {
    if (part.type !== 'text') {
      newParts.push(part);
      continue;
    }
    const text = (part as TextUIPart).text ?? '';
    // 匹配 <thinking>...</thinking>，支持多段、跨行
    const thinkingRe = /<thinking>([\s\S]*?)<\/thinking>/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = thinkingRe.exec(text)) !== null) {
      // thinking 前面的普通文本
      if (match.index > lastIndex) {
        const before = text.slice(lastIndex, match.index).trim();
        if (before) newParts.push({ type: 'text', text: before });
      }
      // reasoning part
      const reasoning = match[1].trim();
      if (reasoning)
        newParts.push({ type: 'reasoning', text: reasoning } as UIMessage['parts'][number]);
      lastIndex = match.index + match[0].length;
    }
    // thinking 后面的普通文本
    const after = text.slice(lastIndex).trim();
    if (after) newParts.push({ type: 'text', text: after });
  }
  return { ...msg, parts: newParts };
}

export default chat;
