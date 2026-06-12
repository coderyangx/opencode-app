import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthRoute from './components/AuthRoute';
import './App.less';

// 页面组件
const Chat = lazy(() => import('./pages/Chat'));
const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
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
    auth: true
  },
  // 商品数据库
  {
    path: '/supabase',
    component: Supabase,
    auth: false
  }
];

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {routes.map((route) => {
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
              />
            );
          })}
          <Route path='*' element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
