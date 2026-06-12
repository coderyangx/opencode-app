import { useState, useRef, useEffect } from 'react';
import { Pin, PinOff, Pencil, Trash2 } from 'lucide-react';
import type { Conversation } from '../../../services/chatApi';
import { IconButton } from '../../../components/ui/Button';

interface Props {
  conv: Conversation;
  active: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onPin: (pinned: boolean) => void;
}

export default function ConversationAction({
  conv,
  active,
  onSelect,
  onRename,
  onDelete,
  onPin
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conv.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);
  useEffect(() => {
    setDraft(conv.title);
  }, [conv.title]);

  function submit() {
    const t = draft.trim();
    if (t && t !== conv.title) onRename(t);
    setEditing(false);
  }

  return (
    <div
      onClick={editing ? undefined : onSelect}
      className={[
        'group relative flex items-center gap-1.5 py-[7px] pl-3 pr-2 mx-2 rounded-xl cursor-pointer transition-colors select-none',
        active
          ? 'bg-[#f4f4f4] text-[#111827]'
          : 'text-[#374151] hover:bg-[#f4f4f4] hover:text-[#111827]'
      ].join(' ')}
    >
      {editing ? (
        <input
          ref={inputRef}
          className='flex-1 min-w-0 bg-white border border-[#10b981] rounded-md px-2 py-0.5 text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#10b981]/20'
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') {
              setDraft(conv.title);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          {/* 标题文字 */}
          <span className='flex-1 min-w-0 text-sm truncate leading-snug'>
            {conv.title || '新对话'}
          </span>

          {/* 渐变遮罩 + 操作按钮区 */}
          <div
            className='absolute right-0 top-0 bottom-0 flex items-center pr-1.5 opacity-0 group-hover:opacity-100 transition-opacity'
            onClick={(e) => e.stopPropagation()}
          >
            {/* 左侧渐变淡出 */}
            <div className='w-8 h-full pointer-events-none bg-linear-to-l from-[#f4f4f4]' />

            <div className='flex items-center gap-0.5 pl-0.5 rounded-md bg-[#f4f4f4]'>
              {/* 置顶 */}
              <IconButton
                size='sm'
                variant='ghost'
                title={conv.pinned ? '取消置顶' : '置顶'}
                onClick={() => onPin(!conv.pinned)}
                className={
                  conv.pinned ? 'text-[#10b981]' : 'hover:text-[#374151] hover:bg-[#e5e7eb]'
                }
              >
                {conv.pinned ? <PinOff size={15} /> : <Pin size={15} />}
              </IconButton>

              {/* 重命名 */}
              <IconButton
                size='sm'
                variant='ghost'
                title='重命名'
                onClick={() => setEditing(true)}
                className='hover:text-[#374151] hover:bg-[#e5e7eb]'
              >
                <Pencil size={15} />
              </IconButton>

              {/* 删除 */}
              <IconButton
                size='sm'
                variant='ghost'
                title='删除'
                onClick={onDelete}
                className='hover:text-[#dc2626] hover:bg-[#fee2e2]'
              >
                <Trash2 size={15} />
              </IconButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
