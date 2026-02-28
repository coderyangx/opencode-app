import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './App.css';

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Fasting = lazy(() => import('./pages/Fasting'));

// 加载状态组件
const LoadingFallback = () => (
  <div className='loading-container'>
    <div className='loading-spinner'></div>
    <p className='loading-text'>加载中...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className='app'>
        {/* <nav>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
        </nav> */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/' element={<Fasting />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
