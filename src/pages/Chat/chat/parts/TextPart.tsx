import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';
import { copy } from '@/utils';
import { IconButton } from '@/components/ui/Button';
import 'highlight.js/styles/github-dark.css';

interface Props {
  text: string;
  isUser?: boolean;
  showCursor?: boolean;
}

/** 递归提取 hast AST 节点的纯文本，绕过 rehype-highlight 生成的 React 节点树 */
function extractNodeText(node: any): string {
  if (!node) return '';
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (n.type === 'text') return n.value ?? '';
  if (Array.isArray(n.children)) return n.children.map(extractNodeText).join('');
  return '';
}

export default function TextPart({ text, isUser, showCursor }: Props) {
  const [copied, setCopied] = useState(false);

  if (isUser) {
    return (
      <span className='text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap break-words'>
        {text}
      </span>
    );
  }

  return (
    <div className='markdown-text flex-1 min-w-0'>
      <div className='prose prose-invert max-w-none text-sm text-[#ececec] typing-cursor-wrap'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code(props) {
              const { className, children, node } = props;
              const isBlock = !!className?.includes('language-');
              // 从 AST 节点提取原始纯文本，避免 rehype-highlight 处理后 children 变成 React 节点导致 [object Object]
              const code = (node ? extractNodeText(node) : String(children)).replace(/\n$/, '');
              if (!isBlock)
                return (
                  <code className='bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-[0.87em] text-red-600 font-mono'>
                    {children}
                  </code>
                );
              return (
                <div
                  className='rounded-xl overflow-hidden my-3 border border-white/10 group/code'
                  style={{ background: '#0d1117' }}
                >
                  <div
                    className='flex items-center justify-between px-4 py-2 border-b border-white/10'
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <span className='text-[12px] font-mono text-gray-500'>
                      {className?.replace('language-', '') ?? 'code'}
                    </span>
                    {/* 复制 code */}
                    <IconButton
                      variant='ghost'
                      title='复制代码'
                      className='flex items-center w-fit gap-1 px-2 py-1 rounded text-[12px] text-gray-400 bg-white/10 border border-white/10 hover:bg-white/20 hover:text-white transition-colors opacity-0 group-hover/code:opacity-100'
                      onClick={() => {
                        copy(code, () => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        });
                      }}
                    >
                      {copied ? <Check size={12} className='text-[#10b981]' /> : <Copy size={12} />}
                      <span>复制</span>
                    </IconButton>
                  </div>
                  <code
                    className={`${className} block p-4 text-[13.5px] leading-relaxed overflow-x-auto font-mono`}
                  >
                    {children}
                  </code>
                </div>
              );
            },
            table: ({ children }) => (
              <div className='overflow-x-auto my-3 rounded-xl border border-gray-200'>
                <table className='w-full text-sm border-collapse'>{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className='px-4 py-2.5 text-left font-semibold text-gray-700 bg-gray-50 border-b border-gray-200 text-[13px] uppercase tracking-wide'>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className='px-4 py-2.5 text-gray-600 border-b border-gray-100 last:border-b-0'>
                {children}
              </td>
            ),
            tr: ({ children }) => (
              <tr className='hover:bg-gray-50 transition-colors'>{children}</tr>
            ),
            blockquote: ({ children }) => (
              <blockquote className='border-l-[3px] border-[#10b981] pl-4 ml-0 my-3 text-gray-600 italic bg-emerald-50/50 py-1 rounded-r-lg'>
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target='_blank'
                rel='noreferrer'
                className='text-[#10b981] hover:underline decoration-[#10b981]/50'
              >
                {children}
              </a>
            ),
            p: ({ children }) => (
              <p className='my-3 first:mt-0 last:mb-0 text-[15px] leading-[1.72] text-gray-800'>
                {children}
              </p>
            ),
            h1: ({ children }) => (
              <h1 className='text-xl font-bold text-gray-900 mt-5 mb-2.5 tracking-tight'>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-lg font-bold text-gray-900 mt-4 mb-2 tracking-tight'>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-base font-semibold text-gray-900 mt-3 mb-1.5'>{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className='my-3 pl-5 space-y-1 list-disc marker:text-gray-400'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='my-3 pl-5 space-y-1 list-decimal marker:text-gray-400'>{children}</ol>
            ),
            li: ({ children }) => (
              <li className='text-[15px] leading-relaxed text-gray-800'>{children}</li>
            ),
            hr: () => <hr className='my-4 border-gray-200' />,
            strong: ({ children }) => (
              <strong className='font-semibold text-gray-900'>{children}</strong>
            )
          }}
        >
          {text}
        </ReactMarkdown>
        {showCursor && <span className='typing-cursor' aria-hidden='true' />}
      </div>
    </div>
  );
}
