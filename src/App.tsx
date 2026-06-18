import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import AuthRoute from './components/AuthRoute';
import './App.less';

// 页面组件
const Chat = lazy(() => import('./pages/Chat'));
const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const ReactStudy = lazy(() => import('./pages/ReactStudy'));
const Fasting = lazy(() => import('./pages/Fasting'));
const Supabase = lazy(() => import('./pages/supabase'));
const Login = lazy(() => import('./pages/Login'));

const LoadingFallback = () => (
  <div className='loading-container'>
    <div className='loading-spinner'></div>
  </div>
);

const routes = [
  {
    path: '/login',
    component: Login,
    auth: false // 不需要登录
  },
  {
    path: '/',
    component: Chat,
    auth: true
  },
  {
    path: '/chat',
    component: Chat,
    auth: true
  },
  {
    path: '/chat/:id',
    component: Chat,
    auth: true
  },
  {
    path: '/fasting',
    component: Fasting,
    auth: false
  },
  {
    path: '/home',
    component: Home,
    auth: true
  },
  {
    path: '/admin',
    component: Admin,
    auth: false
  },
  {
    path: '/react',
    component: ReactStudy,
    auth: false,
    children: [
      // ← 加这个
      { path: 'children', component: lazy(() => import('./pages/ReactStudy/Children')) }
    ]
  },
  // 商品数据库
  {
    path: '/supabase',
    component: Supabase,
    auth: false
  }
];

// 渲染时递归处理 children
function renderRoute(route) {
  const Page = route.component;
  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        route.auth ? (
          <AuthRoute>
            <Page />
          </AuthRoute>
        ) : (
          <Page />
        )
      }
    >
      {route.children?.map(renderRoute)} {/* ← 递归渲染子路由 */}
    </Route>
  );
}

function App() {
  // TODO history 路由实现原理
  useEffect(() => {
    window.addEventListener('popstate', (e) => {
      console.log('history popstate', e);
    });
  }, []);

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {routes.map(renderRoute)}
          <Route path='*' element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
