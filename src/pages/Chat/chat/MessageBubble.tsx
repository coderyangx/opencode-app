import { isToolUIPart, type ReasoningUIPart, type ToolUIPart, type UIMessage } from 'ai';
import { AlertCircle, RefreshCw } from 'lucide-react';
import TextPart from './parts/TextPart';
import ReasoningPart from './parts/ReasoningPart';
import ToolInvocationPart from './parts/ToolInvocationPart';
import ActionToolbar from './ActionToolbar';

interface Props {
  message: UIMessage;
  /** 流式输出中（仅对 assistant 消息最后一条有意义） */
  isStreaming?: boolean;
  /** 最后一条 assistant 消息才传，触发重新生成 */
  onRegenerate?: () => void;
}

function extractText(msg: UIMessage) {
  return (msg.parts ?? [])
    .filter((p: unknown) => (p as { type: string }).type === 'text')
    .map((p: unknown) => (p as { text: string }).text)
    .join('');
}

export default function MessageBubble({ message, isStreaming, onRegenerate }: Props) {
  const isUser = message.role === 'user';
  // Assistant messages 可能有 text, reasoning, tool invocation, and file parts
  const parts = message.parts ?? [];
  const text = extractText(message);

  // ── 用户消息的图片附件
  const imageParts = isUser
    ? (parts.filter(
        (p: unknown) =>
          (p as { type: string }).type === 'file' &&
          ((p as { mediaType?: string }).mediaType ?? '').startsWith('image/')
      ) as { url: string }[])
    : [];

  // ── 用户消息：右对齐气泡
  if (isUser) {
    return (
      //  py-3
      <div className='group px-[max(24px,calc(50%-380px))] pt-3'>
        <div className='flex justify-end'>
          <div className='relative max-w-[70%]'>
            {/* 气泡主体 chatgpt 16px */}
            <div className='bg-[#f4f4f4] rounded-[22px] px-[16px] py-[10px] text-[15px] text-gray-800 leading-relaxed'>
              {imageParts.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-2'>
                  {imageParts.map((p, i) => (
                    <a
                      key={i}
                      href={p.url}
                      target='_blank'
                      rel='noreferrer'
                      className='block w-40 max-w-full rounded-xl overflow-hidden hover:opacity-90 transition-opacity'
                    >
                      <img
                        src={p.url}
                        alt='附件'
                        className='w-full h-28 object-cover'
                        draggable={false}
                      />
                    </a>
                  ))}
                </div>
              )}
              {text && <span className='whitespace-pre-wrap wrap-break-word'>{text}</span>}
            </div>
            {/* ActionToolbar：hover 淡入，右对齐 */}
            <div className='flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
              <ActionToolbar text={text} isUser />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── AI 消息：左对齐，小圆点模型标识 ──────────────────────────────────────
  return (
    //  py-4
    <div className='px-[max(24px,calc(50%-380px))]'>
      <div className='flex gap-3 items-start'>
        {/* 小圆点模型标识，代替大头像 */}
        <div className='w-5 h-5 mt-0.5 rounded-full bg-linear-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-[10px] shrink-0 shadow-sm'>
          ✦
        </div>

        {/* 内容区 */}
        <div className='flex-1 min-w-0'>
          {parts.map((part, i) => {
            if (part.type === 'reasoning' && (part as ReasoningUIPart).text)
              return <ReasoningPart key={i} reasoning={part.text} />;
            // if (part.type.includes('tool-') && (part as ToolUIPart).input)
            if (isToolUIPart(part))
              return (
                <ToolInvocationPart key={part.toolCallId} toolInvocation={part as ToolUIPart} />
              );
            if (part.type === 'text' && part.text)
              return (
                <TextPart
                  key={i}
                  text={part.text}
                  showCursor={isStreaming && i === parts.length - 1}
                />
              );
            return null;
          })}
          {parts.length === 0 && isStreaming && <span className='typing-cursor' />}

          {/* 内容为空且非流式 = 生成失败，显示错误占位提示 */}
          {!isStreaming && text.trim() === '' && (
            <div className='flex items-center gap-2 text-[13.5px] text-red-500 py-0.5'>
              <AlertCircle size={14} className='shrink-0' />
              <span>内容生成失败</span>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className='ml-0.5 flex items-center gap-1 text-[#10b981] hover:text-[#059669] font-medium transition-colors'
                >
                  <RefreshCw size={12} />
                  重试
                </button>
              )}
            </div>
          )}

          {/* ActionToolbar：非流式且有内容时展示，左对齐 */}
          {!isStreaming && text.trim().length > 0 && (
            <div className='mt-1'>
              <ActionToolbar text={text} isUser={false} onRegenerate={onRegenerate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
