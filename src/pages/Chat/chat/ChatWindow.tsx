import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type UIMessage
} from 'ai';
import { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { chatApi, type Conversation } from '../../../services/chatApi';
import type { AttachmentFile } from '../input/AttachmentPreview';
import { getAuthHeaders } from '../../../lib/request';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SkeletonMessages from './SkeletonMessages';
import WelcomeScreen from '../WelcomeScreen';
import InputBar from '../input/InputBar';

interface Props {
  conversation: Conversation;
  onTitleRefresh: () => void;
}

export default function ChatWindow({ conversation, onTitleRefresh }: Props) {
  // ── 历史消息加载
  const [historyStatus, setHistoryStatus] = useState<'loading' | 'ready'>('loading');
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isFirstTurn, setIsFirstTurn] = useState(false);
  // isAbort 只标记「最近一次」是否被用户终止，用于最后一条 assistant 消息的提示
  // 重新生成 / 发送新消息时需要重置，否则旧标记会污染新消息
  const [isLastMsgAborted, setIsLastMsgAborted] = useState(false);

  // 推荐词
  const storedSuggest = sessionStorage.getItem(`suggest_${conversation.id}`) ?? '';
  if (storedSuggest) sessionStorage.removeItem(`suggest_${conversation.id}`);
  const [suggestText, setSuggestText] = useState(storedSuggest);

  // useChat
  const isFirstTurnRef = useRef(isFirstTurn);
  // ── 自动滚底
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // 用户是否主动上滚（上滚后暂停自动滚动，滚回底部后恢复）
  const isUserScrolledRef = useRef(false);

  const {
    messages,
    setMessages,
    sendMessage,
    stop,
    regenerate,
    addToolApprovalResponse,
    addToolOutput, // 用于前端增加工具调用结果（用于 服务端 tool 没有 execute 的场景）
    status,
    resumeStream
  } = useChat({
    id: conversation.id ?? undefined,
    // 历史加载完成后设置，historyStatus === 'loading' 时 initialMessages 是空数组，不影响
    messages: initialMessages ?? [],
    // TODO 流恢复  开启断点续传支持  Enable automatic stream resumption
    // 可以让前端向后端发起恢复请求，从流中断的位置继续接收剩余内容，而不是从头生成
    resume: true,
    transport: new DefaultChatTransport({
      api: '/api/chatV3',
      // headers 支持传函数（AI SDK 内部用 resolve() 调用），每次请求动态读取最新 token
      headers: getAuthHeaders,
      // TODO 随着聊天记录变长，每次请求都把所有历史记录从客户端发给服务端会浪费带宽。
      // 我们可以优化为：客户端只发新消息，服务端负责拼接历史记录
      // 服务端：处理时先加载历史messages，再拼接新消息
      prepareSendMessagesRequest: ({ messages, id, trigger, messageId }) => ({
        body: { messages, id, trigger, messageId }
      })
      // resume 机制：组件挂载时 SDK 自动发 GET 请求尝试恢复正在进行的流
      // resume: true 会让 useChat 在 mount 时自动调用 resumeStream()，
      // SDK 通过此端点发 GET 请求，后端有活跃流则回放缓存 chunks，无则返回 204
      // prepareReconnectToStreamRequest: ({ id }) => ({
      //   api: `/api/chatV3/${id}/stream`,
      //   headers: getAuthHeaders()
      // })
    }),
    // TODO HITL 关键配置
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    onFinish: (options) => {
      console.log('onFinish', options);
      // 每次完成都先重置，再根据结果设置
      setIsLastMsgAborted(options.isAbort ?? false);
      if (isFirstTurnRef.current) {
        isFirstTurnRef.current = false;
        setTimeout(() => onTitleRefresh(), 2000);
      }
    },
    onError: (err) => {
      let msg = err.message ?? '请求失败';
      try {
        const p = JSON.parse(msg) as { errorText?: { message?: string }; message?: string };
        msg = p.errorText?.message ?? p.message ?? msg;
      } catch {
        /**/
      }
      toast.error(`请求失败：${msg}`);
      stopWithNotify();
    }
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  const handleRegenerate = (index) => {
    const isLastMessage = index === messages.length - 1;
    // 只有在 ready 或 error 状态下才能重新生成
    if (isLastMessage && !isStreaming && (status === 'ready' || status === 'error')) {
      resetAbort();
      regenerate();
    }
  };

  // 封装 stop：先通知后端 abort，再断开前端 SSE 读取
  // 原因：CF Workers 的 request.signal 不随客户端断开而触发，
  // 必须主动发 DELETE 请求让后端手动 abort AbortController
  const stopWithNotify = useCallback(() => {
    stop();
    // fire-and-forget，不阻塞前端 UI 响应
    // 通知后端手动 abort：CF Workers 的 request.signal 不随客户端断开而触发，
    // 必须主动发请求让后端 abortController.abort()
    fetch(`/api/chatV3/${conversation.id}/stop`, {
      headers: getAuthHeaders()
    }).catch(() => {
      /* 网络问题忽略，后端流最终会自然结束 */
    });
  }, [conversation.id, stop]); // eslint-disable-line react-hooks/exhaustive-deps

  // resume 由 useChat 的 resume: true 自动触发：
  // 组件 mount 时 SDK 自动调用 resumeStream()，发 GET /:id/stream 请求
  // 后端有活跃流 → 回放缓存 chunks + 实时推送，前端自动拼接
  // 后端无活跃流 → 返回 204，前端静默跳过，走正常历史加载
  // 无需在此 useEffect 中手动调用 resumeStream()

  useEffect(() => {
    // 切换会话时先终止当前流，防止旧会话的流继续写入
    // stopWithNotify();

    // TODO 防止快速切换对话时竞态，组件销毁设为true，不消费返回结果
    let cancelled = false;
    setHistoryStatus('loading');

    chatApi
      .getMessages(conversation.id)
      .then((msgs) => {
        if (cancelled) return;
        // console.log('getMessages--', msgs, conversation);
        // 在本地更新 `messages` 状态。
        // 当您希望在客户端编辑消息，然后手动调用 `reload` 方法以重新生成 AI 回复时，这非常有用
        // ChatMessage → UIMessage（parts 类型收窄）
        const uiMsgs: UIMessage[] = (msgs ?? []).map((m) => ({
          id: m.id,
          role: m.role,
          parts: m.parts as UIMessage['parts'],
          metadata: m.metadata,
          createdAt: new Date(m.created_at)
        }));
        setMessages(uiMsgs);
        setInitialMessages(uiMsgs);
        setIsFirstTurn(uiMsgs.length === 0);
        setHistoryStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setIsFirstTurn(true);
        setHistoryStatus('ready');
      });

    return () => {
      cancelled = true;
    };
  }, [conversation.id]);

  // 切换对话时重置上滚标记，确保新对话自动滚到底部
  useEffect(() => {
    isUserScrolledRef.current = false;
  }, [conversation.id]);

  useEffect(() => {
    isFirstTurnRef.current = isFirstTurn;
  }, [isFirstTurn]);

  // 监听滚动容器，检测用户是否主动上滚
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      isUserScrolledRef.current = el.scrollHeight - el.scrollTop - el.clientHeight > 50;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // 消息更新时自动滚底（用户主动上滚后暂停）
  useEffect(() => {
    if (isUserScrolledRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: messages.length <= 5 ? 'instant' : 'smooth' });
  }, [messages]);

  // 发送消息 / 重新生成前重置 abort 标记，防止旧状态污染新回复
  function resetAbort() {
    setIsLastMsgAborted(false);
  }

  // 发送消息
  async function handleSend(text: string, files: AttachmentFile[]) {
    resetAbort();
    const docNames = files
      .filter((f) => !f.file.type.startsWith('image/') && f.uploadedUrl)
      .map((f) => f.file.name);
    const finalText =
      docNames.length > 0 ? `${text}\n\n[已上传文件：${docNames.join('、')}]` : text;
    await sendMessage({
      role: 'user',
      id: conversation.id,
      text: finalText || '',
      files: files
        .filter((f) => f.uploadedUrl)
        .map((f) => ({
          type: 'file',
          url: f.uploadedUrl!,
          mediaType: f.file.type,
          name: f.file.name
        }))
    });
  }

  // 历史加载中：显示骨架屏
  if (historyStatus === 'loading') {
    return (
      <div className='flex flex-col flex-1 overflow-hidden'>
        <SkeletonMessages />
        <div className='h-[84px] min-h-[84px] border-t border-gray-100 bg-white shrink-0' />
      </div>
    );
  }

  // 正常渲染
  return (
    <div className='flex flex-col flex-1 overflow-hidden'>
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full'
      >
        {messages.length === 0 && !isStreaming ? (
          <WelcomeScreen onSuggest={setSuggestText} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id ?? i}
                message={msg}
                // 只有最后一条 assistant 消息才显示「已终止」提示
                isAbort={isLastMsgAborted && i === messages.length - 1}
                isStreaming={isStreaming && i === messages.length - 1}
                // HITL：把审批回调传下去，供 ToolInvocationPart 调用
                onToolApproval={addToolApprovalResponse}
                onRegenerate={() => handleRegenerate(i)}
              />
            ))}
            {/* TODO AI 回复时的跳跃 loading */}
            {isStreaming && messages.at(-1)?.role === 'user' && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>
      <InputBar
        onSend={handleSend}
        onStop={stopWithNotify}
        isStreaming={isStreaming}
        initialText={suggestText}
        onInitialTextConsumed={() => setSuggestText('')}
      />
    </div>
  );
}
