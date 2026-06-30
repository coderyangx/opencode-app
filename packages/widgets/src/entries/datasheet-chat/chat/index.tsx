import { Textarea } from '@/components/ui/textarea';
import Conversation from '../conversation';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { CircleStopIcon, PaperclipIcon, SendIcon, FileIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { shuffle } from 'lodash-es';
import clsx from 'clsx';

const API_BASE = window.location.origin;

export function Chat(props: Record<string, string | null>) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<
    Array<{ name: string; url: string; key: string; contentType: string }>
  >([]);
  const fileKey = useRef<string>('');

  const getHeaders = () => {
    return {
      'X-FORM-VIEW': props.view || '',
      'X-ENV': props.env || '',
      'X-DATA-PRESET': fileKey.current ? 'excel' : props.preset || '',
    };
  };

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      const container = document.getElementById('conversation-scroll');
      container?.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    });
  };

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit: _handleSubmit,
    addToolResult,
    status,
    setMessages,
    append,
    error,
    stop,
    reload,
  } = useChat({
    maxSteps: 100,
    api: `${API_BASE}/ai-agent/chat`,
    streamProtocol: 'data',
    headers: getHeaders(),
    onFinish: (_, { finishReason }) => {
      console.log('finishReason', finishReason);
      scrollToEnd();
    },
    onResponse: () => {
      scrollToEnd();
    },
    body: {
      fileKey: fileKey.current,
    },
  });

  const isComposing = useRef(false);

  // 页面加载时从服务端读取对话历史（依赖 session cookie）
  useEffect(() => {
    fetch(`${API_BASE}/ai-agent/chat/history`, {
      headers: getHeaders(),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.history && data.history.length > 0) {
          const restoredMessages = data.history.map(
            (item: { role: string; content: string; timestamp: number }, index: number) => ({
              id: `history-${index}`,
              role: item.role,
              content: item.content,
            }),
          );
          setMessages(restoredMessages);
        } else {
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: 'Hi👋，我是数据分析小助手，可以帮你分析和可视化数据',
            },
          ]);
        }
      })
      .catch(() => {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi👋，我是数据分析小助手，可以帮你分析和可视化数据',
          },
        ]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRecommendations = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/ai-agent/recommendations`, {
        headers: getHeaders(),
        method: 'POST',
      });

      if (resp.ok) {
        const result = await resp.json();
        Array.isArray(result) && setRecommendations(shuffle(result).slice(0, 3));
      }
    } catch {
      // ignore
    }
  }, [props.view, props.env]);

  const handleSubmit = useCallback(
    (e: React.FormEvent | React.MouseEvent) => {
      if (attachments.length) {
        e.preventDefault();
        append({
          role: 'user',
          content: input,
        });
        setAttachments([]);
        setInput('');
      } else {
        _handleSubmit(e as React.FormEvent<HTMLFormElement>);
      }
      scrollToEnd();
    },
    [_handleSubmit, attachments, append, input, setInput],
  );

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  const loading = status === 'submitted' || status === 'streaming';

  const lastMessage = messages.slice(-1)[0];

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/ai-agent/attachments/upload`, {
        method: 'POST',
        headers: getHeaders(),
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('上传成功', result);
        if (result && result.url) {
          setAttachments([
            {
              name: file.name,
              url: result.url,
              key: result.key,
              contentType: file.type,
            },
          ]);
          fileKey.current = result.key;
        }
      } else {
        console.error('上传失败');
      }
    } catch (error) {
      console.error('上传出错', error);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='w-screen h-screen overflow-hidden flex flex-col bg-white'>
      <header className='flex flex-col items-center justify-center py-5 shrink-0'>
        <span className='bg-black/10 px-4 py-2 rounded-lg text-white inline-block text-lg font-medium'>
          数据分析小助手
        </span>
        {!!props.name && (
          <p className='text-white text-xs mt-2'>当前视图: {decodeURIComponent(props.name)}</p>
        )}
      </header>
      <main className='grow overflow-hidden px-4'>
        <Conversation
          messages={messages}
          addToolResult={addToolResult}
          loading={loading}
          pending={status === 'submitted' && lastMessage?.role === 'user'}
          error={error}
        />
      </main>
      <footer className='shrink-0 px-4'>
        {recommendations.length > 0 && messages.length < 2 && (
          <section className='recommendations flex flex-wrap gap-2 py-2'>
            {recommendations.map((item) => {
              return (
                <div
                  className={clsx(
                    'question p-1 rounded-sm border border-gray-200 bg-gray-50 text-xs',
                    {
                      'cursor-not-allowed opacity-50': loading,
                      'cursor-pointer': !loading,
                    },
                  )}
                  key={item}
                  onClick={() => {
                    if (loading) {
                      return;
                    }
                    append({
                      content: item,
                      role: 'user',
                    });
                  }}
                >
                  {item}
                </div>
              );
            })}
          </section>
        )}
        <div className='border border-l-0 border-r-0 border-b-0 border-gray-100 pt-2 h-28 relative'>
          {attachments.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-2'>
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className='flex items-center bg-gray-100 rounded-md px-2 py-1 text-xs'
                >
                  <FileIcon className='w-3 h-3 mr-1' />
                  <span className='truncate max-w-[100px]'>{attachment.name}</span>
                  <button
                    className='ml-1 p-0.5 hover:bg-gray-200 rounded-full'
                    onClick={() => removeAttachment(index)}
                  >
                    <XIcon className='w-3 h-3' />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Textarea
            rows={5}
            className='h-full border-0 outline-0 shadow-none text-sm resize-none focus:ring-0 focus-visible:ring-0 px-0'
            placeholder='请输入'
            value={input}
            onChange={handleInputChange}
            disabled={loading}
            onKeyDown={(e) => {
              if (!e.ctrlKey && e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
          />
          <div
            className='absolute bottom-4 left-0 p-2 cursor-pointer rounded-md hover:bg-gray-100'
            onClick={() => {
              if (loading) {
                return;
              }
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.xlsx,.xls';
              input.onchange = async (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              };
              input.click();
            }}
          >
            <PaperclipIcon className='w-4 h-4' />
          </div>
          <Button
            className='absolute bottom-4 right-0 w-16'
            onCompositionStart={() => {
              isComposing.current = true;
            }}
            onCompositionEnd={() => {
              isComposing.current = false;
            }}
            onClick={(e) => {
              if (loading) {
                stop();
              } else {
                if (isComposing.current) return;
                handleSubmit(e);
              }
            }}
            disabled={!input && !loading}
            variant={loading ? 'destructive' : 'default'}
          >
            {loading ? <CircleStopIcon className='' /> : <SendIcon />}
          </Button>
        </div>
      </footer>
    </div>
  );
}
