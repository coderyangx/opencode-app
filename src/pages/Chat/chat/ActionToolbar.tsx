import { useState } from 'react';
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { IconButton } from '../../../components/ui/Button';
import { copy } from '@/utils';

export default function ActionToolbar({
  text,
  isUser,
  onRegenerate
}: {
  text: string;
  isUser: boolean;
  onRegenerate?: () => void;
}) {
  const [thumbs, setThumbs] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    copy(text, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className={`flex gap-0.5 ${isUser ? 'justify-end' : ''}`}>
      <IconButton
        size='sm'
        variant='ghost'
        title={copied ? '已复制' : '复制'}
        onClick={handleCopy}
        className={copied ? 'text-[#10b981]' : ''}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </IconButton>
      {!isUser && (
        <>
          <IconButton
            size='sm'
            variant='ghost'
            title='有帮助'
            active={thumbs === 'up'}
            onClick={() => setThumbs(thumbs === 'up' ? null : 'up')}
          >
            <ThumbsUp size={16} />
          </IconButton>
          <IconButton
            size='sm'
            variant='ghost'
            title='没帮助'
            className={thumbs === 'down' ? 'text-red-400 bg-red-50' : ''}
            onClick={() => setThumbs(thumbs === 'down' ? null : 'down')}
          >
            <ThumbsDown size={16} />
          </IconButton>
          {onRegenerate && (
            <IconButton size='sm' variant='ghost' title='重新生成' onClick={onRegenerate}>
              <RefreshCw size={16} />
            </IconButton>
          )}
        </>
      )}
    </div>
  );
}
