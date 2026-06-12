import { useState } from 'react';
import { Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { ToolUIPart } from 'ai';

export default function ToolInvocationPart({ toolInvocation }: { toolInvocation: ToolUIPart }) {
  const [open, setOpen] = useState(false);
  const { state, input, output, type: toolName, toolCallId, toolMetadata } = toolInvocation;

  // switch (part.state) {
  //   case 'input-streaming':
  //     return <div>Loading...</div>;
  //   case 'input-available':
  //     return <div>Executing...</div>;
  //   case 'output-available':
  //     return <div>Done</div>;
  // }
  // (part.state === 'input-available' || part.state === 'output-available')
  const isDone = state === 'output-available';

  return (
    <div
      className={`rounded-xl border mb-2 overflow-hidden text-[13px] ${isDone ? 'border-[#10b981] bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2 w-full px-3.5 py-2.5 text-left hover:brightness-95 transition-all'
      >
        <Code2 size={16} className={isDone ? 'text-[#10b981]' : 'text-amber-600'} />
        <span className='flex-1 font-medium text-gray-800'>{toolName}</span>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-100 text-[#059669]' : 'bg-amber-100 text-amber-700'}`}
        >
          {isDone ? '完成' : '执行中…'}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className='border-t border-current/10 px-3.5 py-3 space-y-3'>
          {input && (
            <div>
              <div className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
                输入
              </div>
              <pre className='bg-gray-900 text-gray-100 rounded-lg p-3 text-[12px] overflow-x-auto leading-relaxed font-mono'>
                {JSON.stringify(input, null, 2)}
              </pre>
            </div>
          )}
          {isDone && output !== undefined && (
            <div>
              <div className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
                输出
              </div>
              <pre className='bg-gray-900 text-gray-100 rounded-lg p-3 text-[12px] overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all'>
                {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
