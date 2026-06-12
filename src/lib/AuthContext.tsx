/**
 * src/lib/AuthContext.tsx
 *
 * 全局 Auth 状态管理。
 * - 在 App 根层统一订阅一次 Supabase auth 变化
 * - 所有子组件通过 useAuth() 读取 session/user/loading
 * - _currentToken 模块级变量，供 request.ts 同步读取，避免每次请求都异步 getSession
 *
 * 生产实践：
 *   supabase.auth.getSession() 读取 localStorage 缓存，不发网络请求（token 快过期时自动刷新）
 *   onAuthStateChange 在 token 刷新 / 登录 / 登出时触发，保持 _currentToken 始终最新
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import supabase from './supabaseClient';

// 模块级 token（同步可读，供 request.ts 使用）
export let _currentToken = '';

// Context 类型
export interface AuthContextValue {
  session: Session | null;
  user: {
    name: string;
    email: string;
  } | null;
  rawUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  rawUser: null,
  loading: true
});

// AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange 初始化时会立即触发 INITIAL_SESSION 事件，
    // 无需额外调用 getSession()，避免 session 状态变化两次
    // 从 localStorage 恢复缓存 session，通常不发网络请求
    // supabase.auth.getSession().then(({ data }) => {
    //   _currentToken = data.session?.access_token ?? '';
    //   setSession(data.session);
    //   setLoading(false);
    // });

    // 监听后续变化：token 自动刷新、登录、登出
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, s) => {
      _currentToken = s?.access_token ?? '';
      setSession(s);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user
    ? {
        name:
          session.user.user_metadata?.username ??
          session.user.user_metadata?.name ??
          session.user.email?.split('@')[0] ??
          '用户',
        email: session.user.email
      }
    : null;

  const authCtx = { session, rawUser: session?.user, user, loading };

  // eslint-disable-next-line
  window.ctx = authCtx;
  console.log('AuthMiddleware-获取用户信息', authCtx, user);

  return <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>;
}

// useAuth Hook
export function useAuth() {
  return useContext(AuthContext);
}
