import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loginApi } from '../../services/supabase';
import { chatApi, type Model } from '../../services/chatApi';
import { useAuth } from '../../lib/AuthContext';
import { useChatSession } from '../../hooks/useChatSession';
import WelcomeScreen from './WelcomeScreen';
import ChatWindow from './chat/ChatWindow';
import TopBar from './layout/TopBar';
import Sidebar from './layout/Sidebar';
import SkeletonMessages from './chat/SkeletonMessages';
import './chat.less';

const DEFAULT_MODELS: Model[] = [{ id: 'gpt-5.4-mini', label: 'GPT-5.4-Mini' }];

export default function Chat() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, session } = useAuth();
  const { conversations, load, create, rename, changeModel, deleteConv, pin, refreshOne } =
    useChatSession();

  const [models, setModels] = useState<Model[]>(DEFAULT_MODELS);
  const [ready, setReady] = useState(false);
  // 系统设置
  // const [settingsOpen, setSettingsOpen] = useState(false);
  // 左侧边栏折叠
  const [collapsed, setCollapsed] = useState(false);

  const didInit = useRef(false);

  // session 来自 context
  useEffect(() => {
    if (didInit.current || !session) return;
    didInit.current = true;

    // 并行加载对话列表和模型列表
    // Promise.all([load(), chatApi.getModels().catch(() => [] as Model[])]).then(([convs, mods]) => {
    Promise.all([load()]).then(([convs]) => {
      // if (mods.length) setModels(mods);
      if (!id && convs.length > 0) navigate(`/chat/${convs[0].id}`, { replace: true });
      setReady(true);
    });
  }, [session]);

  const activeConv = conversations.find((c) => c.id === id) ?? null;

  const handleLogOut = useCallback(async () => {
    try {
      await loginApi.signOut();
    } catch {
      // 忽略退出错误
    }
    navigate('/login', { replace: true });
  }, [navigate]);

  const handleCreate = useCallback(async () => {
    const conv = await create(models[0]?.id);
    navigate(`/chat/${conv.id}`);
    return conv;
  }, [create, models, navigate]);

  const [pendingSuggest, setPendingSuggest] = useState('');
  useEffect(() => {
    if (!pendingSuggest || !activeConv) return;
    sessionStorage.setItem(`suggest_${activeConv.id}`, pendingSuggest);
    setPendingSuggest('');
  }, [pendingSuggest, activeConv]);

  const handleNoConvSuggest = useCallback(
    async (text: string) => {
      setPendingSuggest(text);
      await handleCreate();
    },
    [handleCreate]
  );

  // 占位 conv：URL 有 id 但 conversations 还未加载完时，用最小结构提前 mount ChatWindow
  // ChatWindow 只用 conversation.id 发 getMessages 请求，其余字段仅供 TopBar 展示
  const placeholderConv = id
    ? { id, title: '', model: DEFAULT_MODELS[0].id, pinned: false, created_at: '', updated_at: '' }
    : null;
  const conv = activeConv ?? placeholderConv;

  return (
    <div className='fixed inset-0 flex bg-white'>
      <div className='flex w-full h-full overflow-hidden'>
        <Sidebar
          conversations={conversations}
          activeId={id}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          onCreate={handleCreate}
          onRename={rename}
          onDelete={deleteConv}
          onPin={pin}
          onSignOut={handleLogOut}
          user={user}
        />
        <main className='flex-1 flex flex-col overflow-hidden'>
          {conv ? (
            <div className='flex flex-col h-full overflow-hidden'>
              {/* TopBar 等 activeConv 就绪再渲染，否则用空白占位保持布局高度 */}
              {activeConv ? (
                <TopBar
                  title={activeConv.title}
                  model={activeConv.model}
                  models={models}
                  onModelChange={(model) => changeModel(activeConv.id, model)}
                  onOpenSettings={() => {}}
                />
              ) : (
                <div className='h-[54px] shrink-0 border-b border-gray-100 bg-white' />
              )}
              {/* key={conv.id} 保证切换对话时重置，placeholder→activeConv 变化不重新 mount */}
              <ChatWindow
                key={conv.id}
                conversation={conv}
                onTitleRefresh={() => activeConv && refreshOne(activeConv.id)}
              />
            </div>
          ) : (
            <div className='flex-1 flex flex-col overflow-hidden bg-white'>
              {ready ? <WelcomeScreen onSuggest={handleNoConvSuggest} /> : <SkeletonMessages />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
