import { useRef, useCallback } from 'react';

type Fn = (...args: unknown[]) => unknown;

/**
 * useMemoizedFn - useCallback 的升级版
 *
 * 核心特性：
 *  - 返回的函数引用**永远稳定**（不需要 deps），不会因为闭包问题引用旧值
 *  - 内部逻辑**始终是最新的**，每次渲染都能读到最新的 state/props
 *
 * 实现原理：
 *  1. fnRef：每次渲染都把最新的 fn 存进去，保证函数逻辑最新
 *  2. memoizedRef：只创建一次的稳定函数，内部通过 fnRef 调用最新逻辑
 *
 * 对比 useCallback：
 *  - useCallback 需要手动声明 deps，deps 变化时引用才更新
 *  - useMemoizedFn 不需要任何 deps，引用永远不变且内部永远是最新值
 */
export function useMemoizedFn<T extends Fn>(fn: T): T {
  // 1. 用 ref 存储最新的函数，每次渲染都更新，保证拿到的是最新闭包
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  // 2. 稳定的函数引用，内部调用最新的 fnRef.current，始终指向最新版本的函数
  // 只在 mount 时创建一次，后续渲染不会重新创建
  const memoizedFn = useRef((...args) => {
    return fnRef.current(...args);
  });

  return memoizedFn.current as T; // 引⽤永远是同⼀个
}
