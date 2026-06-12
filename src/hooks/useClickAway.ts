import React, { useEffect, useRef } from 'react';

type Target = React.RefObject<Element | null> | (() => Element | null);

function getElement(target: Target): Element | null {
  return typeof target === 'function' ? target() : target.current;
}

/**
 * 点击目标区域外部时触发回调，API 与 ahooks useClickAway 兼容。
 *
 * @param onClickAway - 点击区域外部时的回调
 * @param target      - 单个或多个目标 ref / getter 函数
 * @param eventName   - 监听的事件名，默认 'mousedown'
 */
export function useClickAway<E extends MouseEvent | TouchEvent = MouseEvent>(
  onClickAway: (e: E) => void,
  target: Target | Target[],
  eventName: string = 'mousedown'
) {
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;

  useEffect(() => {
    const targets = Array.isArray(target) ? target : [target];

    function handler(e: Event) {
      const isOutside = targets.every((t) => {
        const el = getElement(t);
        return el && !el.contains(e.target as Node);
      });
      if (isOutside) onClickAwayRef.current(e as E);
    }

    document.addEventListener(eventName, handler);
    return () => document.removeEventListener(eventName, handler);
  }, [target, eventName]);
}
