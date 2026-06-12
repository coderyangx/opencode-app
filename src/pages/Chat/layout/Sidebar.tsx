import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pin } from 'lucide-react';
import { toast } from 'sonner';
import type { Conversation } from '../../../services/chatApi';
import ConversationAction from './ConversationAction';
import { IconButton, TextButton } from '../../../components/ui/Button';
import AppModal from '../../../components/ui/Modal';
import { useClickAway } from '../../../hooks/useClickAway';
import {
  AppLogo,
  PanelIcon,
  ComposeIcon,
  SearchIcon,
  CloseIcon,
  UserIcon,
  SettingIcon,
  LogoutIcon,
  ChevronUpDownIcon
} from '../../../components/ui/Icons';

interface Props {
  conversations: Conversation[];
  activeId?: string;
  collapsed: boolean;
  onToggle: () => void;
  onCreate: () => Promise<Conversation>;
  onRename: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPin: (id: string, pinned: boolean) => Promise<void>;
  onSignOut: () => void;
  user?: { name: string; email?: string } | null;
}

/* ─── 日期分组 ─────────────────────────────────────────────── */
function groupByDate(convs: Conversation[]) {
  if (!convs.length) return [];
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yestStart = todayStart - 86400_000;
  const weekStart = todayStart - 6 * 86400_000;
  const groups: [string, Conversation[]][] = [
    ['今天', []],
    ['昨天', []],
    ['最近 7 天', []],
    ['更早', []]
  ];
  for (const c of convs) {
    const t = new Date(c.updated_at).getTime();
    if (t >= todayStart) groups[0][1].push(c);
    else if (t >= yestStart) groups[1][1].push(c);
    else if (t >= weekStart) groups[2][1].push(c);
    else groups[3][1].push(c);
  }
  return groups.filter(([, list]) => list.length > 0);
}

/* ─── Logo 图标 ─────────────────────────────────────────────── */
function AppLogoIcon() {
  return (
    <div className='w-7 h-7 rounded-lg bg-linear-to-br from-[#10b981] to-[#059669] flex items-center justify-center shrink-0 shadow-sm text-white'>
      <AppLogo className='w-4 h-4' />
    </div>
  );
}

/* ─── 用户头像 ──────────────────────────────────────────────── */
function UserAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm';
  return (
    <div
      className={`${cls} rounded-full bg-linear-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white font-semibold shrink-0 select-none`}
    >
      {name[0].toUpperCase()}
    </div>
  );
}

export default function Sidebar(props: Props) {
  const {
    conversations,
    activeId,
    collapsed,
    onToggle,
    onCreate,
    onRename,
    onDelete,
    onPin,
    onSignOut,
    user
  } = props;
  // console.log('Sidebar渲染', 'conversations', conversations);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 关闭用户菜单浮层
  useClickAway(() => setMenuOpen(false), menuRef);

  // 关闭搜索框
  useClickAway(() => closeSearch(), searchContainerRef);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? conversations.filter((c) => c.title.toLowerCase().includes(q)) : conversations;
  }, [conversations, search]);

  // 置顶对话单独一组，其余按日期分组
  const pinnedConvs = useMemo(() => filtered.filter((c) => c.pinned), [filtered]);
  const unpinnedConvs = useMemo(() => filtered.filter((c) => !c.pinned), [filtered]);
  const groups = useMemo(() => groupByDate(unpinnedConvs), [unpinnedConvs]);

  async function handleNew() {
    try {
      const conv = await onCreate();
      navigate(`/chat/${conv.id}`);
    } catch {
      toast.error('创建失败');
    }
  }

  async function handleDelete(id: string) {
    await onDelete(id);
    if (activeId === id) {
      const rem = conversations.filter((c) => c.id !== id);
      navigate(rem.length > 0 ? `/chat/${rem[0].id}` : '/chat');
    }
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearch('');
  }

  /* 展开态 */
  if (!collapsed) {
    return (
      <aside className='flex flex-col h-full w-[260px] bg-white border-r border-[#e5e7eb] shrink-0 transition-[width] duration-200 overflow-hidden'>
        {/* ① Logo 行 */}
        <div className='flex items-center justify-between h-[54px] px-3 shrink-0'>
          <div className='flex items-center gap-2.5'>
            <AppLogoIcon />
            <span className='text-[15px] font-semibold text-[#111827] leading-none select-none'>
              AI 助手
            </span>
          </div>
          {/* 收起侧边栏 */}
          <IconButton
            onClick={onToggle}
            title='收起侧边栏'
            size='md'
            variant='ghost'
            className='text-[#9ca3af] hover:text-[#374151]'
          >
            <PanelIcon size={16} />
          </IconButton>
        </div>

        {/* ② 导航区：新建 + 搜索 */}
        <div className='px-2 space-y-0.5 pb-1 shrink-0'>
          <TextButton icon={<ComposeIcon size={16} />} onClick={handleNew}>
            新建对话
          </TextButton>

          {!searchOpen ? (
            <TextButton icon={<SearchIcon size={16} />} onClick={openSearch}>
              搜索聊天
            </TextButton>
          ) : (
            /* 搜索展开态 */
            <div className='relative' ref={searchContainerRef}>
              <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none' />
              <input
                ref={searchRef}
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                placeholder='搜索对话…'
                className='w-full h-10 pl-9 pr-8 rounded-xl text-sm bg-[#f4f4f4] border border-transparent text-[#111827] placeholder-[#9ca3af] outline-none focus:border-[#10b981] focus:bg-white focus:ring-2 focus:ring-[#10b981]/15 transition-all'
              />
              <button
                type='button'
                onClick={closeSearch}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors'
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </div>

        {/* ③ 会话列表 */}
        <nav
          className='flex-1 overflow-y-auto py-1 min-h-0
          [&::-webkit-scrollbar]:w-[3px]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-transparent
          hover:[&::-webkit-scrollbar-thumb]:bg-[#d1d5db]
          [&::-webkit-scrollbar-track]:bg-transparent'
        >
          {pinnedConvs.length > 0 || groups.length > 0 ? (
            <>
              {/* 置顶分组 */}
              {pinnedConvs.length > 0 && (
                <div>
                  <div className='px-3 pt-4 pb-1 text-[11px] font-medium text-[#8e8ea0] select-none flex items-center gap-1'>
                    <Pin size={10} />
                    置顶
                  </div>
                  {pinnedConvs.map((c) => (
                    <ConversationAction
                      key={c.id}
                      conv={c}
                      active={c.id === activeId}
                      onSelect={() => navigate(`/chat/${c.id}`)}
                      onRename={(title) => onRename(c.id, title)}
                      onDelete={() => setDeleteTarget(c)}
                      onPin={(pinned) => onPin(c.id, pinned)}
                    />
                  ))}
                </div>
              )}
              {/* 日期分组 */}
              {groups.map(([label, convs]) => (
                <div key={label}>
                  <div className='px-3 pt-4 pb-1 text-[11px] font-medium text-[#8e8ea0] select-none'>
                    {label}
                  </div>
                  {convs.map((c) => (
                    <ConversationAction
                      key={c.id}
                      conv={c}
                      active={c.id === activeId}
                      onSelect={() => navigate(`/chat/${c.id}`)}
                      onRename={(title) => onRename(c.id, title)}
                      onDelete={() => setDeleteTarget(c)}
                      onPin={(pinned) => onPin(c.id, pinned)}
                    />
                  ))}
                </div>
              ))}
            </>
          ) : (
            <div className='px-4 py-10 text-center'>
              <p className='text-xs text-[#9ca3af] leading-relaxed'>
                {search ? '未找到匹配对话' : '还没有对话'}
              </p>
            </div>
          )}
        </nav>

        {/* ④ 底部用户信息 */}
        <div className='shrink-0 p-2 border-t border-[#f0f0f0]' ref={menuRef}>
          {/* 用户菜单浮层 */}
          {menuOpen && (
            <div className='mb-1 rounded-xl border border-[#e5e7eb] bg-white shadow-lg overflow-hidden'>
              {/* 个人资料 & 设置（暂不支持） */}
              <TextButton icon={<UserIcon className='w-4 h-4 shrink-0' />} disabled>
                个人资料
              </TextButton>
              <TextButton icon={<SettingIcon className='w-4 h-4 shrink-0' />} disabled>
                设置
              </TextButton>
              {/* 分割线 */}
              <div className='border-t border-[#f0f0f0] mx-2' />
              {/* 退出登录 */}
              <TextButton
                icon={<LogoutIcon className='w-4 h-4 shrink-0' />}
                danger
                onClick={() => {
                  setMenuOpen(false);
                  setSignOutConfirm(true);
                }}
              >
                退出登录
              </TextButton>
            </div>
          )}
          <div
            onClick={() => setMenuOpen((v) => !v)}
            className='flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#f4f4f4] cursor-pointer transition-colors group select-none'
          >
            <UserAvatar name={user?.name ?? 'U'} />
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium text-[#111827] truncate leading-tight'>
                {user?.name ?? '用户'}
              </div>
              <div className='text-[11px] text-[#9ca3af] truncate leading-none mt-0.5'>免费版</div>
            </div>
            <ChevronUpDownIcon className='w-4 h-4 text-[#c4c4c4] group-hover:text-[#9ca3af] transition-colors shrink-0' />
          </div>
        </div>

        {/* 退出登录 */}
        <AppModal
          title='退出登录'
          visible={signOutConfirm}
          onCancel={() => setSignOutConfirm(false)}
          onConfirm={() => {
            setSignOutConfirm(false);
            onSignOut();
          }}
          confirmText='退出'
          confirmVariant='danger'
        >
          <p className='text-sm text-gray-600'>确定要退出当前账户吗？</p>
        </AppModal>

        {/* 删除对话 */}
        <AppModal
          title='删除对话'
          visible={!!deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) handleDelete(deleteTarget.id);
            setDeleteTarget(null);
          }}
          confirmText='删除'
          confirmVariant='danger'
        >
          <p className='text-sm text-gray-600'>
            确定要删除「{deleteTarget?.title || '新对话'}」吗？删除后不可恢复。
          </p>
        </AppModal>
      </aside>
    );
  }

  /* 侧边栏收起态 */
  return (
    <aside className='flex flex-col h-full w-[56px] bg-white border-r border-[#e5e7eb] shrink-0 transition-[width] duration-200 overflow-hidden items-center'>
      {/* Logo + 展开按钮 */}
      <div className='h-[54px] flex items-center justify-center shrink-0 w-full'>
        <IconButton
          onClick={onToggle}
          title='展开侧边栏'
          size='lg'
          variant='ghost'
          className='text-[#9ca3af] hover:text-[#374151]'
        >
          <PanelIcon size={16} />
        </IconButton>
      </div>

      {/* 图标导航 */}
      <div className='flex flex-col items-center gap-0.5 px-2 pb-2 w-full shrink-0'>
        <IconButton title='新建对话' size='lg' variant='ghost' onClick={handleNew}>
          <ComposeIcon size={16} />
        </IconButton>
        <IconButton title='搜索对话' size='lg' variant='ghost' onClick={onToggle}>
          <SearchIcon size={16} />
        </IconButton>
      </div>

      {/* 对话圆点 */}
      <nav
        className='flex-1 overflow-y-auto w-full min-h-0
        [&::-webkit-scrollbar]:hidden'
      >
        <div className='flex flex-col items-center gap-3 py-2'>
          {conversations.slice(0, 12).map((c) => {
            console.log('conversations', conversations);
            return (
              <div
                key={c.id}
                title={c.title}
                onClick={() => navigate(`/chat/${c.id}`)}
                className={[
                  'w-3 h-3 rounded-full cursor-pointer transition-all',
                  c.id === activeId ? 'bg-[#10b981] scale-125' : 'bg-[#d1d5db] hover:bg-[#9ca3af]'
                ].join(' ')}
              />
            );
          })}
        </div>
      </nav>

      {/* 头像 */}
      <div className='shrink-0 p-2 pb-3 border-t border-[#f0f0f0] w-full flex justify-center'>
        <UserAvatar name={user?.name ?? 'U'} size='sm' />
      </div>
    </aside>
  );
}
