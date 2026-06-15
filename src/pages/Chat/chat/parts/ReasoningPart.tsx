import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  reasoning: string;
  /** 推理内容是否仍在流式输出中 */
  isStreaming?: boolean;
}

export default function ReasoningPart({ reasoning, isStreaming }: Props) {
  // 流式输出时默认展开，完成后保持用户的折叠状态
  const [open, setOpen] = useState(!!isStreaming);

  useEffect(() => {
    if (isStreaming) setOpen(true);
  }, [isStreaming]);

  return (
    <div className='border border-gray-200 rounded-xl overflow-hidden mb-2 bg-gray-50'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex items-center justify-between w-full px-3.5 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-100 transition-colors'
      >
        {isStreaming ? (
          <span className='flex items-center gap-1.5'>
            思考中
            <span className='flex gap-0.5'>
              <span className='w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]' />
              <span className='w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]' />
              <span className='w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]' />
            </span>
          </span>
        ) : (
          <span>思考过程</span>
        )}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div
          className='px-3.5 py-3 border-t border-gray-200 prose prose-sm max-w-none
          [&_p]:text-[13.5px] [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:my-1.5
          [&_strong]:text-gray-700 [&_strong]:font-semibold
          [&_ul]:my-1.5 [&_ul]:pl-4 [&_ol]:my-1.5 [&_ol]:pl-4
          [&_li]:text-[13.5px] [&_li]:text-gray-600
          [&_code]:text-[12px] [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-gray-700
          [&_pre]:bg-gray-100 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:my-2 [&_pre]:overflow-x-auto'
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{reasoning}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
