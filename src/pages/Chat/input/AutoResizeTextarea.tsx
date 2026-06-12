import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxRows?: number;
}

export interface TextareaHandle {
  focus: () => void;
  reset: () => void;
}

const AutoResizeTextarea = forwardRef<TextareaHandle, Props>(
  ({ value, onChange, onKeyDown, placeholder, disabled, maxRows = 8 }, ref) => {
    const taRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => taRef.current?.focus(),
      reset: () => {
        if (taRef.current) taRef.current.style.height = 'auto';
      }
    }));

    useEffect(() => {
      const el = taRef.current;
      if (!el) return;
      el.style.height = 'auto';
      const lh = parseInt(getComputedStyle(el).lineHeight) || 22;
      el.style.height = Math.min(el.scrollHeight, lh * maxRows) + 'px';
    }, [value, maxRows]);

    return (
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className='flex-1 resize-none bg-transparent outline-none text-[15px] leading-[1.55] text-gray-800 placeholder-gray-400 min-h-[25px] max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed font-[inherit]'
      />
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';
export default AutoResizeTextarea;
