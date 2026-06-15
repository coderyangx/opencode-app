import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowUp, Square, Paperclip } from 'lucide-react';
import AutoResizeTextarea, { type TextareaHandle } from './AutoResizeTextarea';
import AttachmentPreview, { type AttachmentFile } from './AttachmentPreview';
import { chatApi } from '../../../services/chatApi';
import { IconButton } from '../../../components/ui/Button';

const ACCEPTED =
  'image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,text/markdown';
const MAX_IMAGE = 20 * 1024 * 1024;
const MAX_DOC = 50 * 1024 * 1024;

interface Props {
  onSend: (text: string, files: AttachmentFile[]) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  initialText?: string;
  onInitialTextConsumed?: () => void;
}

export default function InputBar({
  onSend,
  onStop,
  isStreaming,
  disabled,
  initialText,
  onInitialTextConsumed
}: Props) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const taRef = useRef<TextareaHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      taRef.current?.focus();
      onInitialTextConsumed?.();
    }
  }, [initialText]); // eslint-disable-line

  function updateFile(id: string, patch: Partial<AttachmentFile>) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  async function addFile(raw: File) {
    const isImg = raw.type.startsWith('image/');
    if (raw.size > (isImg ? MAX_IMAGE : MAX_DOC)) {
      toast.error(`文件过大：${raw.name}（限 ${isImg ? '20MB' : '50MB'}）`);
      return;
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setFiles((prev) => [
      ...prev,
      {
        id,
        file: raw,
        status: 'uploading',
        previewUrl: isImg ? URL.createObjectURL(raw) : undefined
      }
    ]);
    chatApi
      .uploadFile(raw)
      .then((r) => updateFile(id, { status: 'done', uploadedUrl: r.url }))
      .catch(() => updateFile(id, { status: 'error' }));
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach(addFile);
    e.target.value = '';
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  }

  function handleSend() {
    const t = text.trim();
    if (!t && !files.length) return;
    if (isStreaming) return;
    if (files.some((f) => f.status === 'uploading')) {
      toast.warning('文件上传中，请稍候…');
      return;
    }
    onSend(t, files);
    setText('');
    setFiles([]);
    taRef.current?.reset();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend =
    (text.trim() || files.length) &&
    !isStreaming &&
    !disabled &&
    !files.some((f) => f.status === 'uploading');

  return (
    // border-t border-gray-100
    <div className='px-[max(24px,calc(50%-370px))] pt-7 pb-2.5 bg-white '>
      <AttachmentPreview files={files} onRemove={removeFile} />

      {/* 输入框主体 */}
      <div className='flex items-center gap-2.5 bg-white border-[1.5px] border-gray-200 rounded-2xl px-3.5 py-2.5 transition-all focus-within:border-[#10b981] focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]'>
        {/* 附件按钮 */}
        <IconButton
          size='md'
          variant='ghost'
          title='上传文件'
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming || disabled}
        >
          <Paperclip size={18} />
        </IconButton>
        {/* 上传文件 */}
        <input
          ref={fileInputRef}
          type='file'
          accept={ACCEPTED}
          multiple
          hidden
          onChange={handleFileInput}
        />

        <AutoResizeTextarea
          ref={taRef}
          value={text}
          onChange={setText}
          onKeyDown={onKeyDown}
          placeholder='有问题，尽管问'
          disabled={isStreaming || disabled}
        />

        {/* 发送 / 停止按钮 */}
        {isStreaming ? (
          <IconButton size='md' variant='danger' title='停止' onClick={onStop}>
            <Square size={16} />
          </IconButton>
        ) : (
          <IconButton
            size='md'
            variant='primary'
            title='发送'
            onClick={handleSend}
            disabled={!canSend}
          >
            <ArrowUp size={16} />
          </IconButton>
        )}
      </div>

      <p className='text-center text-[11.5px] text-gray-400 mt-1.5'>
        AI 可能会犯错，请核实重要信息
      </p>
    </div>
  );
}
