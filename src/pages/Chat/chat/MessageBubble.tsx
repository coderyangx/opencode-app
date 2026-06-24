import { useCallback, useEffect, useState } from 'react';
import {
  isFileUIPart,
  isToolUIPart,
  type ReasoningUIPart,
  type ToolUIPart,
  type UIMessage
} from 'ai';
import { AlertCircle, RefreshCw } from 'lucide-react';
import TextPart from './parts/TextPart';
import ReasoningPart from './parts/ReasoningPart';
import ToolInvocationPart from './parts/ToolInvocationPart';
import ActionToolbar from './ActionToolbar';
import { fileTypeConfig } from '@/utils/file';

interface Props {
  message: UIMessage;
  /** 流式输出中（仅对 assistant 消息最后一条有意义） */
  isStreaming?: boolean;
  isAbort: boolean;
  /** 最后一条 assistant 消息才传，触发重新生成 */
  onRegenerate?: () => void;
}

function extractText(msg: UIMessage) {
  return (msg.parts ?? [])
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function MessageBubble({ message, isStreaming, isAbort, onRegenerate }: Props) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState<string | undefined>(undefined);
  const closeLightbox = useCallback(() => setLightboxUrl(null), []);

  const isUser = message.role === 'user';
  // Assistant messages 可能有 text, reasoning, tool invocation, and file parts
  const parts = message.parts ?? [];
  const text = extractText(message);
  console.log('消息展示', message.role, 'parts', parts, 'text', text);

  // ── 用户消息：右对齐气泡
  if (isUser) {
    // console.log('消息展示', message.parts, 'text', text);

    // 用户消息的图片附件 parts（type=file + image/* mediaType）
    const imageParts = parts.filter(
      (p) => isFileUIPart(p) && p.mediaType.startsWith('image/')
    ) as Array<{ type: 'file'; url: string; mediaType: string; filename?: string }>;

    // 非图片文件 parts（type=file，非图片）
    const otherFileParts = parts.filter(
      (p) => isFileUIPart(p) && !p.mediaType.startsWith('image/')
    ) as Array<{ type: 'file'; url: string; mediaType: string; filename?: string }>;

    const displayText = text.replace(/\n\n\[用户上传的文件[^\]]*\][^\n]*/g, '').trim();
    // 从系统注解中解析文件名 → 渲染为文件卡片
    const uploadedFileNames: string[] = [];
    const match = text.match(/\[用户上传的文件[^：]*：([^\]]+)\]/);
    if (match) {
      uploadedFileNames.push(...match[1].split('、').map((s) => s.trim()));
    }

    const hasContent =
      imageParts.length > 0 ||
      otherFileParts.length > 0 ||
      uploadedFileNames.length > 0 ||
      displayText;
    if (!hasContent) return null;

    return (
      //  py-3
      <div className='group px-[max(24px,calc(50%-380px))] pt-3'>
        <div className='flex justify-end'>
          <div className='relative max-w-[70%]'>
            {/* 气泡主体 chatgpt 16px */}
            <div className='bg-[#f4f4f4] rounded-[22px] px-[16px] py-[10px] text-[15px] text-gray-800 leading-relaxed'>
              {/* 图片：正方形缩略图，点击放大 */}
              {imageParts.length > 0 && (
                <div className='flex flex-wrap gap-1.5 justify-end'>
                  {imageParts.map((p, i) => (
                    <img
                      key={i}
                      src={p.url}
                      alt={p.filename ?? '图片'}
                      className='w-[72px] h-[72px] rounded-xl object-cover cursor-zoom-in'
                      onClick={() => {
                        setLightboxUrl(p.url);
                        setLightboxName(p.filename);
                      }}
                    />
                  ))}
                </div>
              )}
              {/* 非图片文件卡片（来自 FileUIPart） */}
              {otherFileParts.map((p, i) => (
                <FileCard key={i} name={p.filename ?? '文件'} />
              ))}
              {/* 非图片文件卡片（来自文本注解解析） */}
              {uploadedFileNames.map((name, i) => (
                <FileCard key={i} name={name} />
              ))}

              {displayText && (
                <span className='whitespace-pre-wrap wrap-break-word'>{displayText}</span>
              )}
            </div>
            {/* ActionToolbar：hover 淡入，右对齐 */}
            <div className='flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
              <ActionToolbar text={displayText} isUser />
            </div>
          </div>
        </div>

        {lightboxUrl && (
          <ImageLightbox url={lightboxUrl} name={lightboxName} onClose={closeLightbox} />
        )}
      </div>
    );
  }

  // ── AI 消息：左对齐，小圆点模型标识
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
              return (
                <ReasoningPart
                  key={i}
                  reasoning={part.text}
                  isStreaming={isStreaming && (part as ReasoningUIPart).state === 'streaming'}
                />
              );
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
          {parts.length === 0 && isStreaming && (
            // 跳动圆点
            <div className='flex items-center gap-1.5 h-5 mt-0.5'>
              {[0, 200, 400].map((delay) => (
                <span
                  key={delay}
                  className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-[typing-bounce_1.2s_ease-in-out_infinite]'
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          )}
          {/* {parts.length === 0 && isStreaming && <span className='typing-cursor' />} */}

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
              {isAbort && (
                <span className='text-[#11192573] text-[13px]'>已终止生成，可重新生成</span>
              )}
              <ActionToolbar text={text} isUser={false} onRegenerate={onRegenerate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── FileCard
interface FileCardProps {
  name: string;
  size?: string; // 格式化后的大小字符串，如 "12.3 KB"
  uploading?: boolean; // 上传中状态
  error?: boolean; // 上传失败状态
  onRemove?: () => void; // 有值时显示移除按钮（右上角 ×）
}

/**
 * 通用文件卡片（纵向布局）：
 * - 左上角：带文件类型主题色的 Logo（XLSX / PDF / DOCX 等）
 * - 下方：文件名（截断）+ 文件大小
 * - 右上角（可选）：移除按钮
 * - uploading：Logo 区域显示 spinner
 * - error：Logo 区域显示红色 !
 */
export function FileCard({ name, size, uploading, error, onRemove }: FileCardProps) {
  const cfg = fileTypeConfig(name);
  // JS 黄色背景用深色文字
  const isDarkText = cfg.color === '#f1e05a' || cfg.color === '#61dafb';

  return (
    <div className='relative w-[112px] bg-[#2a2a2a] rounded-xl overflow-hidden'>
      {/* 移除按钮（右上角，hover 显示） */}
      {onRemove && !uploading && (
        <button
          onClick={onRemove}
          className='absolute top-1.5 right-1.5 z-10 w-4 h-4 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-[10px] transition-colors'
          title='移除'
        >
          ×
        </button>
      )}

      {/* 上半部分：文件类型 Logo 区域 */}
      <div
        className='flex items-center justify-center h-14 w-full'
        style={{ backgroundColor: cfg.color }}
      >
        {uploading ? (
          <span className='w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin' />
        ) : error ? (
          <span className='text-white text-base font-bold'>!</span>
        ) : (
          <span
            className='text-[13px] font-extrabold tracking-wide'
            style={{ color: isDarkText ? '#1a1a1a' : 'rgba(255,255,255,0.95)' }}
          >
            {cfg.label}
          </span>
        )}
      </div>

      {/* 下半部分：文件名 + 大小 */}
      <div className='px-2.5 py-2'>
        <div className='text-[11px] text-[#ececec] truncate leading-tight font-medium' title={name}>
          {name}
        </div>
        {size && <div className='text-[10px] text-[#666] leading-tight mt-0.5'>{size}</div>}
      </div>
    </div>
  );
}

/** ImageLightbox 图片灯箱：全屏预览，点击背景或 ESC 关闭 */
export function ImageLightbox({
  url,
  name,
  onClose
}: {
  url: string;
  name?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
      onClick={onClose}
    >
      <img
        src={url}
        alt={name}
        className='max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl object-contain'
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className='absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2a2a2a]/80 hover:bg-[#3f3f3f] text-[#ececec] flex items-center justify-center text-lg transition-colors'
        onClick={onClose}
        title='关闭'
      >
        ×
      </button>
    </div>
  );
}
