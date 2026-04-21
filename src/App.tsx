import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthRoute from './components/AuthRoute';
import './App.less';

// 页面组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Fasting = lazy(() => import('./pages/Fasting'));
const Supabase = lazy(() => import('./pages/supabase'));
const Login = lazy(() => import('./pages/Login'));

const LoadingFallback = () => (
  <div className='loading-container'>
    <div className='loading-spinner'></div>
    {/* <p className='loading-text'>加载中...</p> */}
  </div>
);

const routes = [
  {
    path: '/login',
    element: Login,
    auth: false // 不需要登录
  },
  {
    path: '/',
    element: Fasting,
    auth: true // 需要登录
  },
  {
    path: '/home',
    element: Home,
    auth: true
  },
  {
    path: '/about',
    element: About,
    auth: true
  },
  // 商品数据库
  {
    path: '/supabase',
    element: Supabase,
    auth: false
  }
];

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {routes.map((route) => {
            const Element = route.element;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  // route.auth ? (
                  //   <AuthRoute>
                  //     <Element />
                  //   </AuthRoute>
                  // ) : (
                  <Element />
                  // )
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
