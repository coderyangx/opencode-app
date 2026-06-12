import { useEffect, useRef, useState } from 'react';
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
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // headers 支持传函数（AI SDK 内部用 resolve() 调用），每次请求动态读取最新 token
      headers: getAuthHeaders,
      prepareSendMessagesRequest: ({ messages, id }) => ({ body: { messages, id } })
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    onFinish: () => {
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
      stop();
    }
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  useEffect(() => {
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

  // 发送消息
  async function handleSend(text: string, files: AttachmentFile[]) {
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
                isStreaming={isStreaming && i === messages.length - 1}
                onRegenerate={i === messages.length - 1 && !isStreaming ? regenerate : undefined}
              />
            ))}
            {isStreaming && messages.at(-1)?.role === 'user' && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>
      <InputBar
        onSend={handleSend}
        onStop={stop}
        isStreaming={isStreaming}
        initialText={suggestText}
        onInitialTextConsumed={() => setSuggestText('')}
      />
    </div>
  );
}
