import { X, AlertTriangle } from 'lucide-react';
import { fileTypeConfig, formatSize } from '@/utils/file';
import { useEffect } from 'react';

export type AttStatus = 'uploading' | 'done' | 'error';

export interface AttachmentFile {
  id: string;
  file: File;
  status: AttStatus;
  previewUrl?: string;
  uploadedUrl?: string;
  error?: string;
}

function Spinner({ light }: { light?: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 animate-spin ${light ? 'border-white/30 border-t-white' : 'border-gray-200 border-t-gray-500'}`}
    />
  );
}

export default function AttachmentPreview({
  files,
  onRemove
}: {
  files: AttachmentFile[];
  onRemove: (id: string) => void;
}) {
  if (!files.length) return null;

  return (
    <div className='flex flex-wrap gap-2.5 pb-2.5'>
      {files.map((f) => {
        const isImage = f.file.type.startsWith('image/');
        const meta = fileTypeConfig(f.file.type);

        return (
          <div
            key={f.id}
            className='relative w-[100px] h-[100px] rounded-xl overflow-hidden shrink-0 group/card'
          >
            {/* 删除按钮 */}
            <button
              onClick={() => onRemove(f.id)}
              title='移除'
              className='absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-black/75'
            >
              <X size={12} />
            </button>

            {isImage ? (
              /* 图片卡片 */
              <div className='w-full h-full bg-gray-900 relative'>
                {f.previewUrl && (
                  <img
                    src={f.previewUrl}
                    alt={f.file.name}
                    className='w-full h-full object-cover'
                    draggable={false}
                  />
                )}
                {f.status === 'uploading' && (
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                    <Spinner light />
                  </div>
                )}
                {f.status === 'error' && (
                  <div className='absolute inset-0 bg-red-500/30 flex items-center justify-center text-red-200'>
                    <AlertTriangle size={16} />
                  </div>
                )}
              </div>
            ) : (
              /* 文件卡片 */
              <div className='w-full h-full flex flex-col border-[1.5px] border-gray-200 rounded-xl overflow-hidden'>
                <div
                  className='h-14 flex items-center justify-center shrink-0'
                  style={{ background: meta.color }}
                >
                  {f.status === 'uploading' ? (
                    <Spinner light />
                  ) : f.status === 'error' ? (
                    <AlertTriangle size={16} style={{ color: '#fff' }} />
                  ) : (
                    <span className='text-[12px] font-bold text-white tracking-wide'>
                      {meta.label}
                    </span>
                  )}
                </div>
                <div className='flex-1 px-2 py-1.5 flex flex-col gap-0.5 bg-white overflow-hidden'>
                  <span className='text-[11px] font-medium text-gray-700 truncate'>
                    {f.file.name}
                  </span>
                  <span className='text-[10px] text-gray-400'>{formatSize(f.file.size)}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** 图片灯箱：全屏预览，点击背景或 ESC 关闭 */
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
