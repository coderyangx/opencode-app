import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { IconButton } from '../../../components/ui/Button';
import { ChevronDownIcon } from '../../../components/ui/Icons';

interface Props {
  title: string;
  model: string;
  models: { id: string; label: string }[];
  onModelChange: (model: string) => void;
  onOpenSettings: () => void;
}

/**
 * 完全自定义的模型选择下拉框，彻底脱离 Semi Select 的蓝色主题。
 */
function ModelSelect({
  value,
  options,
  onChange
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === value);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className='relative'>
      {/* 触发按钮 */}
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[13px] font-medium transition-all border bg-[#f9fafb]',
          open
            ? 'border-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.12)] text-[#059669]'
            : 'border-[#e5e7eb] text-[#374151] hover:border-[#10b981] hover:text-[#059669]'
        ].join(' ')}
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 下拉面板 */}
      {open && (
        <div className='absolute right-0 top-[calc(100%+6px)] z-50 min-w-[160px] bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1 overflow-hidden'>
          {options.map((opt) => (
            <button
              key={opt.id}
              type='button'
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              className={[
                'w-full flex items-center justify-between px-3.5 py-2 text-[13px] text-left transition-colors',
                opt.id === value
                  ? 'bg-emerald-50 text-[#059669] font-medium'
                  : 'text-[#374151] hover:bg-[#f4f4f4]'
              ].join(' ')}
            >
              <span>{opt.label}</span>
              {opt.id === value && (
                <Check size={14} className='text-[#10b981] shrink-0' strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopBar({ title, model, models, onModelChange, onOpenSettings }: Props) {
  return (
    <header className='flex items-center justify-between px-5 h-[54px] min-h-[54px] bg-white border-b border-gray-100 z-10'>
      <span className='text-sm font-semibold text-gray-900 truncate max-w-[40%]'>
        {title || '新对话'}
      </span>
      <div className='flex items-center gap-2'>
        {/* TODO 模型选择 */}
        {/* <ModelSelect value={model} options={models} onChange={onModelChange} /> */}
        {/* TODO 系统提示词设置面板 settingspanel  */}
        {/* <IconButton onClick={onOpenSettings} title='设置' size='md' variant='ghost'>
          <IconSetting size='small' />
        </IconButton> */}
      </div>
    </header>
  );
}
