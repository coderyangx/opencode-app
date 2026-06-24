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

  const { messages, setMessages, sendMessage, stop, regenerate, status } = useChat({
    id: conversation.id ?? undefined,
    // 历史加载完成后设置，historyStatus === 'loading' 时 initialMessages 是空数组，不影响
    messages: initialMessages ?? [],
    // TODO 流恢复  Enable automatic stream resumption
    resume: true,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // headers 支持传函数（AI SDK 内部用 resolve() 调用），每次请求动态读取最新 token
      headers: getAuthHeaders,
      // TODO 随着聊天记录变长，每次请求都把所有历史记录从客户端发给服务端会浪费带宽。
      // 我们可以优化为：客户端只发新消息，服务端负责拼接历史记录
      // 服务端：处理时先加载历史messages，再拼接新消息
      prepareSendMessagesRequest: ({ messages, id }) => ({ body: { messages, id } })
    }),
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

  // 封装 stop：先通知后端 abort，再断开前端 SSE 读取
  // 原因：CF Workers 的 request.signal 不随客户端断开而触发，
  // 必须主动发 DELETE 请求让后端手动 abort AbortController
  const stopWithNotify = useCallback(() => {
    // fire-and-forget，不阻塞前端 UI 响应
    // getAuthHeaders() 是同步的，直接拿头部发 DELETE 请求通知后端 abort
    fetch(`/api/chat/${conversation.id}/stop`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).catch(() => {
      /* 网络问题忽略，后端流最终会自然结束 */
    });
    stop();
  }, [conversation.id, stop]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // 切换会话时先终止当前流，防止旧会话的流继续写入
    stopWithNotify();

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
    bottomRef.current?.scrollIntoView({ behavior: messages.length <= 2 ? 'instant' : 'smooth' });
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
                onRegenerate={
                  i === messages.length - 1 && !isStreaming
                    ? () => {
                        resetAbort();
                        regenerate();
                      }
                    : undefined
                }
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
