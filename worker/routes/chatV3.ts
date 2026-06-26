import { Hono } from 'hono';
import {
  ToolLoopAgent,
  createAgentUIStreamResponse,
  generateId,
  isLoopFinished,
  stepCountIs,
  tool,
  type UIMessage,
  type TextUIPart,
  convertToModelMessages
} from 'ai';
import { z } from 'zod';
import { getModel } from '../lib/model';
import { tools as baseTools } from '../lib/tools';
import {
  loadChat,
  saveUserMessage,
  saveAssistantMessage,
  markMessageStatus,
  generateTitle,
  sanitizeUIMessages
} from '../lib/chat-store';
import { createSupabaseAdmin } from '../lib/supabase';
import { buildSystemPrompt } from '../lib/system-prompt';
import { NotFoundError } from '../util/errors';
import { logger } from '../util/logger';
import type { Env, Variables } from '../index';

const chat = new Hono<{ Bindings: Env; Variables: Variables }>();

// ════════════════════════════════════════════════════════════════════════════
// 架构总览：多 Agent 协作（Supervisor 模式）+ HITL
//
//                    ┌─────────────────┐
//                    │  Supervisor     │  ← 理解意图，委派任务，整合结果
//                    │  Agent          │
//                    └───────┬─────────┘
//                            │ delegate_to_xxx (tool)
//              ┌─────────────┼─────────────┐
//              ▼             ▼             ▼
//      ┌───────────┐ ┌───────────┐ ┌───────────┐
//      │ Research  │ │ Analysis  │ │ send_email│ ← needsApproval: true (HITL)
//      │ Agent     │ │ Agent     │ │           │   用户审批后才执行
//      └───────────┘ └───────────┘ └───────────┘
//
// HITL 流程：
//   1. Supervisor 调用 send_email → SDK 生成 approval-request（流暂停）
//   2. 前端展示审批 UI（tool state = 'input-available' + approval.id）
//   3. 用户点确认/拒绝 → 前端调 addToolResult({ approved: true/false })
//   4. sendAutomaticallyWhen 触发自动重发请求
//   5. 后端读到 approval-responded → approved=true 则 execute，false 则跳过
//   6. 继续后续 ReAct 循环

// 测试用例：
// 1. "帮我查一下北京天气，再搜一下 React 19 的新特性"
//    → Supervisor 委派给 analysis + research 两个子 Agent
// 2. "帮我发邮件给 test@example.com，主题'测试邮件'，正文'这是一封测试邮件'"
//    → Supervisor 调用 send_email → 前端弹出审批 UI → 用户确认后执行
// 3. "你好"
//    → Supervisor 直接回答，不委派
// ════════════════════════════════════════════════════════════════════════════

// ── 子 Agent 1：研究助手（负责搜索互联网）──────────────────────────────────
function createResearchAgent(env: Env) {
  return new ToolLoopAgent({
    model: getModel(env),
    instructions: `你是一个研究助手，专门负责搜索互联网获取信息。
收到任务后，使用 web_search 工具搜索，然后简洁地总结搜索结果。
不要寒暄，直接给出研究结果。`,
    tools: {
      web_search: {
        ...baseTools.web_search
        // TODO 设置子agent的输出给主Agent的结果
        // toModelOutput: (opt) => {
        //   const { output: message } = opt;
        //   // 从子代理的一大堆流式输出中，只提取最后一段文本作为总结，避免全部结果输出
        //   const lastTextPart = message.results.findLast((p) => p.type === 'text');
        //   return {
        //     type: 'text',
        //     value: lastTextPart?.text ?? '任务已完成。'
        //   };
        // }
      }
    },
    stopWhen: [stepCountIs(5), isLoopFinished()]
  });
}

// ── 子 Agent 2：数据分析助手（负责查天气/数据）─────────────────────────────
function createAnalysisAgent(env: Env) {
  return new ToolLoopAgent({
    model: getModel(env),
    instructions: `你是一个数据分析助手，负责查询数据并给出分析结论。
收到任务后，使用 get_weather 工具查询数据，然后给出简短的分析。
不要寒暄，直接给出分析结果。`,
    tools: {
      get_weather: baseTools.get_weather
    },
    stopWhen: [stepCountIs(5), isLoopFinished()]
  });
}

// ── Supervisor Agent 的工具集 ──────────────────────────────────────────────
// 包含：子 Agent 委派工具 + HITL 工具 + 基础工具
function createSupervisorTools(env: Env) {
  return {
    // ── 多 Agent 协作：把子 Agent 包装成 tool ──────────────────────────────
    // Supervisor 通过调用这些 tool 来"委派"任务给子 Agent
    // 子 Agent 独立运行自己的 ReAct 循环，完成后把结果返回给 Supervisor
    // ── 多 Agent 协作：把子 Agent 包装成 tool ──────────────────────────────
    // Supervisor 通过调用这些 tool 来「委派」任务给子 Agent
    // 子 Agent 独立运行自己的 ReAct 循环，完成后把结果返回给 Supervisor
    delegate_to_research: tool({
      description: '委派任务给研究助手。当用户需要搜索互联网、查找资料、获取最新信息时使用。',
      inputSchema: z.object({
        task: z.string().describe('要委派给研究助手的任务描述')
      }),
      execute: async ({ task }) => {
        logger.info('[v3] delegate to research agent', { task });
        const agent = createResearchAgent(env);
        // 子 Agent 独立运行 generate（非流式），结果返回给 Supervisor
        const result = await agent.generate({
          messages: [{ role: 'user', content: task }]
        });
        return {
          agent: 'research',
          task,
          result: result.text
        };
      }
    }),

    delegate_to_analysis: tool({
      description: '委派任务给数据分析助手。当用户需要查询天气、分析数据时使用。',
      inputSchema: z.object({
        task: z.string().describe('要委派给分析助手的任务描述')
      }),
      execute: async ({ task }) => {
        logger.info('[v3] delegate to analysis agent', { task });
        const agent = createAnalysisAgent(env);
        const result = await agent.generate({
          messages: [{ role: 'user', content: task }]
        });
        return {
          agent: 'analysis',
          task,
          result: result.text
        };
      }
    }),

    // ── HITL 工具：需要用户审批 ────────────────────────────────────
    // needsApproval: true → SDK 暂停流，生成 approval-request
    // 前端展示审批 UI，用户确认后 SDK 自动继续，execute 才会被调用
    send_email: tool({
      description: '发送邮件给指定收件人。⚠️ 此操作不可撤销，需要用户确认后才会执行。',
      inputSchema: z.object({
        to: z.string().describe('收件人邮箱地址'),
        subject: z.string().describe('邮件主题'),
        body: z.string().describe('邮件正文')
      }),
      // HITL 核心：设为 true 后，LLM 调用此工具时不会立即 execute
      // 而是生成 approval-request，流暂停，等前端用户审批
      needsApproval: true,
      execute: async ({ to, subject, body }) => {
        // 只有用户 approved=true 后才会走到这里
        logger.info('[v3] send_email approved & executing', { to, subject });
        // TODO 实际发邮件逻辑（此处 mock）
        return {
          success: true,
          to,
          subject,
          sentAt: new Date().toISOString()
        };
      }
    }),

    // ── 基础工具：Supervisor 也可以直接用 ──────────────────────────────────
    get_weather: baseTools.get_weather,
    web_search: baseTools.web_search
  };
}

// ── POST / 发送消息 ────────────────────────────────────────────────────────
chat.post('/', async (c) => {
  const user = c.get('user');
  const { messages, id } = await c.req.json();

  const incomingMessages: UIMessage[] = Array.isArray(messages) ? messages : [];
  // 防御：过滤空壳消息（parts 为空），避免 SDK schema 校验失败导致整个请求 400
  const safeIncoming = sanitizeUIMessages(incomingMessages);
  const lastUserMsg = [...safeIncoming].reverse().find((m) => m.role === 'user');
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

  // 2. 立即持久化 user 消息
  await saveUserMessage(c.env, id, lastUserMsg);

  // 3. 加载历史
  const history = await loadChat(c.env, id);
  const isFirstTurn = history.length === 0;

  // 4. 创建 Supervisor Agent（带多 Agent 委派 + HITL 工具）
  const supervisorTools = createSupervisorTools(c.env);
  const agent = new ToolLoopAgent({
    model: getModel(c.env, conv.model),
    instructions: `${buildSystemPrompt()}

## 多 Agent 协作
你是一个 Supervisor 助手，可以自主处理简单问题，也可以委派任务给专业子助手：
- delegate_to_research：委派给研究助手（搜索互联网、查找资料）
- delegate_to_analysis：委派给数据分析助手（查询天气、数据分析）
委派后，子助手会独立完成任务并返回结果，你需要整合结果给用户。

## 危险操作审批
发邮件等不可逆操作需要用户确认：
- 调用 send_email 时，系统会暂停等待用户审批
- 用户拒绝后，告知用户操作已取消`,
    tools: supervisorTools,
    stopWhen: [stepCountIs(30), isLoopFinished()],
    experimental_context: {
      userInfo: { role: user.role, email: user.email },
      env: c.env,
      traceId: id
    },
    prepareStep: async (opts) => {
      // if (opts.model)
      console.log('prepareStep', opts);
      return undefined;
      // return { toolCallApproval: 'always' }; // 暂停等审批
    },
    maxOutputTokens: 100_000
  });

  let assistantMsgId: string | null = null;

  // 5. 流式执行
  // HITL 关键：前端配置了 sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses
  //   → 当消息末尾有 approval-request 且都已响应时，SDK 自动重发请求继续流
  // 后端会收到带 approval-responded 的 messages，SDK 据此决定是否 execute
  return createAgentUIStreamResponse({
    agent,
    uiMessages: safeIncoming,
    originalMessages: history as any, //await convertToModelMessages(),
    generateMessageId: generateId,
    abortSignal: c.req.raw.signal,
    onFinish: async (opts) => {
      const { responseMessage, isAborted, isContinuation } = opts;
      logger.info('[v3] onFinish', {
        msgId: responseMessage?.id,
        isContinuation,
        isAborted
      });
      try {
        if (responseMessage) {
          assistantMsgId = responseMessage.id;
          const oldAssistantMsg = isContinuation ? history[history.length - 1] : null;

          // 区分 HITL 续传 vs regenerate，决定是否 slice 旧 parts：
          //
          // SDK 的 responseMessage 包含「旧 parts（从 originalMessages 克隆）+ 新 parts」。
          // - regenerate：客户端移除了旧 assistant 消息，最后一条 incoming 是 user。
          //   旧 text parts 被原样保留在 clone 中（未更新），新 text parts 被 append。
          //   → 需要 slice 掉旧 parts，否则旧文本会重复。
          //
          // - HITL 续传：客户端保留了旧 assistant 消息（带 approval-responded），最后一条
          //   incoming 是 assistant。旧 tool part 被 SDK 原地更新（approval-requested →
          //   output-available），新 text parts 被 append。
          //   → 不能 slice，否则更新后的 tool part 会被切掉，刷新后只剩文本。
          const lastIncoming = safeIncoming[safeIncoming.length - 1];
          const isHITLContinuation = isContinuation && lastIncoming?.role === 'assistant';

          const rawParts =
            isContinuation && !isHITLContinuation && oldAssistantMsg
              ? responseMessage.parts.slice(oldAssistantMsg.parts.length)
              : responseMessage.parts;
          const parsedMsg = parseThinkingParts({ ...responseMessage, parts: rawParts });

          if (isAborted) {
            await saveAssistantMessage(c.env, id, parsedMsg, isContinuation);
            await markMessageStatus(c.env, assistantMsgId, 'interrupted');
          } else {
            await saveAssistantMessage(c.env, id, parsedMsg, isContinuation);
          }
        }
        if (isFirstTurn && !isAborted) {
          const firstText = (lastUserMsg.parts?.[0] as { text?: string })?.text ?? '';
          generateTitle(c.env, id, firstText);
        }
      } catch (error) {
        logger.error('[v3] onFinish', error);
      }
    },
    onError: (err: string) => {
      if (assistantMsgId) {
        markMessageStatus(c.env, assistantMsgId, 'error').catch((e) => {
          logger.error('[v3] onError', e);
        });
      }
      return err as string;
    }
  });
});

/**
 * 解析 <thinking>...</thinking> 标签，拆分为 reasoning + text parts
 */
function parseThinkingParts(msg: UIMessage): UIMessage {
  const newParts: UIMessage['parts'] = [];
  for (const part of msg.parts ?? []) {
    if (part.type !== 'text') {
      newParts.push(part);
      continue;
    }
    const text = (part as TextUIPart).text ?? '';
    const thinkingRe = /<thinking>([\s\S]*?)<\/thinking>/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = thinkingRe.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const before = text.slice(lastIndex, match.index).trim();
        if (before) newParts.push({ type: 'text', text: before });
      }
      const reasoning = match[1].trim();
      if (reasoning)
        newParts.push({ type: 'reasoning', text: reasoning } as UIMessage['parts'][number]);
      lastIndex = match.index + match[0].length;
    }
    const after = text.slice(lastIndex).trim();
    if (after) newParts.push({ type: 'text', text: after });
  }
  return { ...msg, parts: newParts };
}

export default chat;
