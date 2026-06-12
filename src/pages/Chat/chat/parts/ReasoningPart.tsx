import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ReasoningPart({ reasoning }: { reasoning: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='border border-gray-200 rounded-xl overflow-hidden mb-2 bg-gray-50'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex items-center justify-between w-full px-3.5 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-gray-100 transition-colors'
      >
        <span>思考过程</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className='px-3.5 py-3 text-[13.5px] text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-200'>
          {/* TODO 推理过程流式输出 */}
          {reasoning}
        </div>
      )}
    </div>
  );
}
