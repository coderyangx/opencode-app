import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

/**
 * 受保护路由守卫。
 * session 状态来自全局 AuthContext（App 根层统一订阅）
 */
export default function AuthRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#ffffff'
        }}
        className='auth-route'
      >
        <div className='loading-spinner' />
      </div>
    );
  }

  if (!session) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
