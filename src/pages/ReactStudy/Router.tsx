import { createContext, useContext, useLayoutEffect, useState } from 'react';

// ─── 路由表配置：path → 渲染函数 ───────────────────────────────────────────────
const routeMap: Record<string, () => void> = {
  '/': () => console.log('渲染 <Home />'),
  '/about': () => console.log('渲染 <About />'),
  '/user': () => console.log('渲染 <User />')
};

/**
 * render：拿到 path，查路由表，调用对应的渲染函数
 * 在真实 React Router 里，这一步是 <Routes> 做的：
 *   用正则匹配 path → 找到对应 <Route> → React 重渲染对应组件
 */
const render = (path: string) => {
  const handler = routeMap[path] ?? (() => console.log('渲染 404'));
  handler();
};

// ─── 订阅者列表（手动广播用）────────────────────────────────────────────────
const listeners: Array<(path: string) => void> = [];
/**
 * notify：遍历所有订阅者，把新 path 告诉它们
 * 等价于 React Router 内部的 history.listen 回调链
 * 每个订阅者收到通知后，会调用 setLocation → 触发 React 重渲染
 */
const notify = (path: string) => {
  listeners.forEach((fn) => fn(path));
};

/**
 * React 路由实现原理
    Hash 路由：URL # 后面的内容永远不会发送给服务器，浏览器自己处理
    History 路由：完整 URL 发给服务器，服务器必须配合返回同一个 index.html
 */

/**
 * hash 路由
 * hash 变化时触发，天然支持前进/后退
 * 特点：
    ✅ 不需要服务器任何配置，刷新页面永远正常（服务器只看到 example.com/）
    ✅ 兼容性极好（IE8+）
    ❌ URL 不优雅，有 #
    ❌ # 后的内容不计入 SEO
 */
window.addEventListener('hashchange', () => {
  const path = location.hash.slice(1); // '#/about' → '/about'
  // 拿到路径，正则匹配，开始渲染对应组件
  render(path);
});
// 跳转：直接修改 hash，自动触发 hashchange
location.hash = '#/about';

/* ------------------------------- History 路由 ------------------------------- */
/**
 * History 路由实现原理
 * 核心就一句话：用 History API 改 URL，用 Context 把 location 广播给组件树，用正则匹配决定渲染哪个组件
 * 特点：
    ✅ URL 干净好看，利于 SEO
    ✅ 体验与传统多页应用一致
    ❌ 刷新页面会 404，因为服务器找不到 /about 这个文件
    ❌ 需要服务器配置：所有路径都返回 index.html（Nginx try_files）
 */

/*
history.push('/about')
        │
        ├─ 调用 window.history.pushState(state, '', '/about')
        │    └─ URL 变了，但页面不刷新，也不触发 popstate
        │
        └─ 主动调用所有 listener({ location: { pathname: '/about' } })
             └─ Router 的 setLocation 被调用 → React 重渲染

用户点击 <Link to="/about">
        │
        ▼
  handleClick → e.preventDefault()
        │
        ▼
  history.push('/about')
        │
        ├──► window.history.pushState → URL 变为 /about
        │
        └──► 触发所有 listener
                    │
                    ▼
             Router.setLocation({ pathname: '/about' })
                    │
                    ▼
             LocationContext 更新 → 触发重渲染
                    │
                    ▼
             <Routes> 重新匹配路径
                    │
                    ▼
             渲染 <About /> 组件  ✅
 */

// History 路由最大的暗坑是：pushState 后URL变了，但页面不刷新，也不触发 popstate 等任何事件，
// 只有浏览器前进/后退才触发 popstate，所以必须在 push 时手动广播，而 Hash 路由赋值 location.hash 会自动触发 hashchange，天然省事。
window.addEventListener('popstate', () => {
  // 监听到 popstate 事件，拿到路径，正则匹配，开始渲染对应组件
  render(location.pathname);
});
// 手动跳转需额外实现：pushState 广播，因为 pushState 不触发 popstate 需要手动通知
function push(path) {
  window.history.pushState({}, '', path); // 此时 URL 变了，但不触发 popstate
  // 必须手动通知所有监听者（这是 React Router 内部做的）
  notify(path);

  // 为什么不直接render：可能不是整个页面切换，而是有多个地方依赖 path 的改变，
  // 如 Tab 高亮，Nav 切换，页面渲染等，都要更新
  // render(path); // 直接调，没问题
}

// 简化实现
const NavigationContext = createContext(null);
const LocationContext = createContext(null);

// 关键点：history.listen 是订阅者模式，URL 一变，setLocation 触发整棵路由树重渲染。
function Router({ history, children }) {
  const [location, setLocation] = useState(history.location);

  useLayoutEffect(() => {
    // 监听路由变化，更新 location state → 触发重渲染
    const unlisten = history.listen(({ location }) => {
      setLocation(location);
    });
    return unlisten; // 卸载时取消监听
  }, [history]);

  return (
    <NavigationContext.Provider value={{ history }}>
      <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
    </NavigationContext.Provider>
  );
}

function Routes({ children }) {
  const location = useContext(LocationContext);

  // 把 <Route path="/user/:id"> 的 children 收集成 [{ path, element }]
  const routes = flattenRoutes(children);

  // 按顺序匹配，第一个命中的胜出（类似 switch-case）
  const match = matchRoutes(routes, location.pathname);

  return match ? match.element : null;
}

function Link({ to, children, ...props }) {
  const { history } = useContext(NavigationContext);

  function handleClick(e) {
    e.preventDefault(); // 阻止浏览器默认跳转（会刷新页面）
    history.push(to); // 用 history API 更新 URL，不刷新页面
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
