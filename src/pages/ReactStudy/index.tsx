import {
  useState,
  useEffect,
  useLayoutEffect,
  StrictMode,
  useTransition,
  useDeferredValue,
  useCallback
} from 'react';
import { flushSync } from 'react-dom';
import { Outlet, useNavigate, useOutlet } from 'react-router-dom';

const div = document.createElement('div');
const btn = document.createElement('button');
btn.textContent = 'root外点击';
btn.className = 'h-[32px] bg-blue-200 hover:bg-blue-300 rounded-md px-2 my-2';
div.id = 'custdiv';
div.style = `width: 200px;height: 100px;background: skyblue;`;
div.appendChild(btn);

function ReactStudy() {
  const navigate = useNavigate();
  // useOutlet：有子路由匹配时返回子路由元素，否则返回 null
  // 等价于 <Outlet /> 内部的实现，但可以拿到这个值做条件判断
  const outlet = useOutlet();

  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // 在浏览器绘制【之后】，异步执⾏
  // 不阻塞渲染，适合⼤多数场景，接口调用、事件订阅、日志上报等场景
  useEffect(() => {
    // React Hooks 不是"⾃动收集"依赖，与 Vue 的响应式系统（Proxy ⾃动追踪）不同，
    // React Hooks 的依赖是开发者⼿动声明，在每次渲染时对⽐ 依赖数组 判断是否需要重新执⾏。
  }, []);

  useLayoutEffect(() => {
    // DOM更新后，浏览器绘制【之前】，同步执行
    // 阻塞绘制，适合需要读取/修改 DOM 的场景
    // 如果 useLayoutEffect 内部调⽤了 setState，会触发同步重渲染，⽤户只会看到最终结果
    // 使用场景：读取 DOM 尺⼨、防⽌闪烁、第三⽅库集成
  }, []);

  btn.onclick = () => {
    // TODO React 17后的事件委托统一从 document 绑定到了根节点 root
    // 改进原因：一个⻚⾯可能存在多个 React 根容器，将事件绑定到根容器可以避免不同根容器之间的事件冲突问题，提升隔离性。
    setCount((count) => count + 1);
    console.log('测试root外的点击事件是否正常被react事件委托');
  };

  const appendBody = () => {
    if (!document.querySelector('#custdiv')) {
      document.documentElement.insertBefore(div, document.body);
    } else {
      document.documentElement.removeChild(div);
    }
  };

  // 测试 useCallback
  const handleClick = useCallback(() => {
    console.log('count', count); // 一直是 0，因为没，没添加 deps
  }, []);

  return (
    <div className='reactstudy-page'>
      <div className='flex'>
        <button
          className='bg-pink-200 rounded-md px-2 hover:bg-pink-300'
          onClick={() => {
            navigate('/home');
          }}
        >
          Home页
        </button>
        <button
          className='bg-green-200 rounded-md px-2 mx-2 hover:bg-green-300'
          onClick={() => {
            navigate('/react');
          }}
        >
          ReactStudy页
        </button>
        <button
          className='bg-green-200 rounded-md px-2 hover:bg-green-300 mx-2'
          onClick={() => {
            navigate('/react/children');
          }}
        >
          子路由-children
        </button>
      </div>
      {/* 
      <div className='card'>
        <button
          className='bg-amber-200 rounded-md px-2 hover:bg-amber-300'
          onClick={(e) => {
            // e.nativeEvent
            setCount((count) => count + 1);
            handleClick();
          }}
        >
          count
        </button>
        <p>{count}</p>
      </div> */}

      <div className='outlet card my-4 w-[200px] h-[100px] bg-pink-100'>
        {/* 子路由 */}
        {/* <Outlet /> */}
        {/* outlet 有值说明子路由匹配了，为 null 说明当前是父路由自身 */}
        {outlet ? <Outlet /> : <span className='text-sm'>子路由未渲染</span>}
      </div>
    </div>
  );
}

export default ReactStudy;
