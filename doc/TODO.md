## 回复超时（断网、token超限）、重试、成本、人要确认（HITL）、运行时、可观测性（出了事故怎么查和改）、评测 Eval

[稀土掘金](https://juejin.cn/post/7633624091766161418#heading-0)

真要拆职责，可以收成六层：

- 交互层：用户看得见、点得着的界面，负责步骤展示、审批、中断、重试和结果反馈
- 编排层：用 LangChain、LangGraph 等把 Prompt、模型、工具、记忆和状态流转组织成可维护的流程
- 运行时 Harness：管理步数、超时、预算、快照、重试、取消和收尾，决定任务如何真正跑完或安全停下
- 安全与检测层：在输入、工具执行前、输出和轨迹上做规则与模型检测，拦住不该发生的行为
- 可观测层：用 `Trace`、`Metrics`、日志把每一步变成可查询、可对比、可回放的事实
- 评测层：通过离线集、回归闸门和线上灰度，用数据判断一次改动到底有没有变好

## SSE 断流

[稀土掘金](https://juejin.cn/post/7643469288817508390#heading-5)

- 如果用户切换页面，或者网络断开，再切回来能实现自动续上吗？
- 用户网络波动（比如断网，网速时慢时快），WiFi 自动降级导致AI项目的流式输出中断
- 浏览器标签页被误关，重新打开后对话记录还在，但刚才那轮生成的内容丢失了
- 长任务生成到一半，服务端负载过高触发自动扩容，连接被重置
- 用户主动刷新页面，想保存刚才的内容，数据却丢失了

1. 面试官："如果让你用一句话概括你的“AI中断恢复”的实现思路，你会怎么做？"
   答："我会让生成过程像视频播放一样**支持断点续传**——核心是在生成过程中持续'落盘'状态，而不是等到结束才保存。"
   面试官："具体怎么落盘？"
   答："我设计了一个三层状态恢复模型

2. AI生成到一半，突然断了，服务端的状态该怎么处理？
   面试官："连接断开的那一时刻，LLM 可能还在推理，这个时候是直接停止生成，还是有其他更好的方案呢？"
   答："不用停止生成，这正是最容易踩坑的地方。我设计了一个六状态生成状态机，(Redis缓存)

3. 面试官："用户刷新页面，浏览器内存全清空了，你凭什么让用户立即看到之前的内容？"
   答："靠客户端双保险缓存， 具体的实现代码如下，恢复时的优先级顺序是：内存 > IndexedDB > 服务端冷存储。

4. 面试官："我问几个边界情况。第一，AI生成恢复时，已生成的内容过长，重新组装 Prompt 再发给模型，上下文窗口溢出了怎么办？"
   答："可以对已生成内容，做智能摘要压缩，只保留关键结论作为上下文，而不是全文重传。我们可以在 Prompt 里区分 `history_summary` 和 `continuing_context`，让模型知道'这是前文摘要，请基于它继续完成'。"
   这是一个非常实用且高频的解决方案，建议大家在AI项目中都采用。
5. 面试官："第二个问题，LLM 有随机性，恢复后续写时，风格变了、人称变了，前后不一致怎么办？"
   答："在恢复 Prompt 里注入风格锚点（style anchor），明确告知模型'请保持前文的第一人称叙述风格'。同时，`checkpoint` 里记录了生成时的 `temperature` 和 `top_p`，恢复时严格复用，最大程度保证一致性。"
6. 面试官："第三个问题，如果模型版本升级了，旧版 KV Cache 新版加载不了，如何解决呢？"
   答："可以通过序列化时加入模型版本标识和序列化协议版本。恢复时严格校验兼容性，不兼容时自动降级为'文本级恢复'——从文本断点重新生成，而不是推理状态断点。虽然会多花一点算力，但至少不会崩溃。"

## 观测 Langfuse

[langfuse doc](https://langfuse.com/docs/observability/get-started)

- secret-key：sk-lf-3f651909-870f-45d1-83bd-eedabd230365
- public-key：pk-lf-42c12906-b498-4853-abd5-320260532821
- .env
  > LANGFUSE_SECRET_KEY = "sk-lf-3f651909-870f-45d1-83bd-eedabd230365"
  > LANGFUSE_PUBLIC_KEY = "pk-lf-42c12906-b498-4853-abd5-320260532821"
  > LANGFUSE_BASE_URL = "https://langfuse.sankuai.com"

## 评测 Eval

## React

### useState、useEffect、useCallback、useMemo、useRef 实现原理

每个 hook 对应一个链表节点，按调用顺序存储，所以不能条件调用，否则状态对应错误，更新错乱

| Hook          | Hook                        | 更新策略     | 典型场景       |
| ------------- | --------------------------- | ------------ | -------------- |
| useRef        | { current } 对象            | 永不更新引⽤ | DOM引⽤/定时器 |
| useMemo       | 计算结果                    | deps变化时   | 昂贵计算缓存   |
| useCallback   | 函数引⽤                    | deps变化时   | 传递给⼦组件   |
| useMemoizedFn | 函数引用，useCallback升级版 | -            | -              |

#### setState 是同步还是异步？

- React 18 之前（16/17）只在合成事件和生命周期中批量更新，异步的；原生事件或setTimeout、Promise 中是同步的。（同步代码中异步批量更新，异步代码中，同步更新）
- React18后，所有情况下都是自动批量更新，可以使用 `flushSync` 或 `setState` 回调函数实现立即更新
- React 16/17 的批处理依赖内部标志 `isBatchingUpdates`
  - 在合成事件/⽣命周期执⾏前，React 会把这个标志设为 `true`
  - setTimeout 代码执⾏时，React 没有机会设置这个标志，所以每次 setState 都直接触发渲染
  - setState 异步的原因是将更新放入队列，批处理后统一渲染，减少 re-render，提高性能
- React18后，优化了**自动批处理和并发更新**，引入了新的调度器，使用微任务收集更新，setState不再依赖`isBatchingUpdates`标志，而是：每次state更新 -> 把更新推入队列 -> 调度一个微任务来 `flush`

#### useRef 的用法

`useRef` 创建一个可变的 ref 对象，可⽤来存储任何类型的数据，在组件整个生命周期都有效，数据修改不会出发组件的 re-render。可用来：保存上⼀次的 props 或 state：有时你可能需要在组件内部访问上⼀次的 props 或 state，可以使⽤ `useRef` 保存这些值

### 对 React Hook 的理解？解决了什么问题？

- Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使⽤ state 以及其他的 React 特性。
- 在以前，函数组件也被称为⽆状态的组件，只负责渲染的⼀些⼯作。因此，现在的函数组件也可以是有状态的组件，内部也可以维护⾃身的状态以及做⼀些逻辑⽅⾯的处理。
- Hooks让我们的函数组件拥有了类组件的特性，例如组件内的状态、⽣命周期。

### Hooks 为什么有闭包陷阱？

useEffect 的调用里面使用的变量都是当时函数创建时候的，后续更新会再次调用

### React 类组件和函数组件有什么区别？如何理解？

### React Router 原理

hash 路由 VS history 路由，参考 [pages/ReactStudy/Router.tsx]('../src/pages/ReactStudy/Router.tsx')

### Context 和 zustand、mobx 状态管理库有何区别？

- `Context` 会产生多层嵌套，状态更新，所有的消费组件都会更新，无法像状态库那样实现定向细粒度的更新
- 比如 `AppContext` 包含 user、theme，即使只有 theme 改变，使用到 user 的组件也会重新渲染，适合简单低频数据更新场景，比如 主题、多语言、用户信息
- 高频更新，需要派生状态，性能敏感场景，建议用状态库 `zustand`，体积仅 `1kb`

### ErrorBoundary 错误捕获 和 全局错误上报

1. 只能捕获 React 组件生命周期内的渲染出现的问题，无法捕获异步错误、事件回调
2. 全局错误上报： `window.onerror` 和 `window.addEventListener('error')`
   - onerror 是赋值操作，在全局只能存在一个，后面的覆盖前面的
   - addEventListener 是标准监听模式，可以绑定多个回调函数，不干扰第三方 SDK
   - 共同点：两者都只能捕获同步代码和 setTimeout / setInterval 等宏任务中的运行时错误，对于未处理的 Promise 拒绝报错，必须用 `window.addEventListener('unhandledrejection')`

   ```ts
   window.onerror = function (message, source, lineno, colno, error) {
     // 包含详细的行列信息和错误对象
     console.log('捕获到错误:', message);
     return true; // 返回 true，控制台就不会再显示红色的报错信息
   };

   window.addEventListener(
     'error',
     (event) => {
       console.log('捕获到错误:', event.error);
       event.preventDefault(); // 阻止浏览器控制台报错
     },
     true
   );
   ```

### React 组件间过渡动画如何实现？

在React中实现组件间过渡动画可以使⽤ `React Transition Group` 库。该库提供了⼀组组件，可以在组件进⼊或离开 DOM 时添加或删除 CSS 类名，从⽽实现过渡动画效果。CSSTransition（单组件动画）；多组件切换动画：SwitchTransition；列表动画：TransitionGroup。

### 为什么 file 输入框不能受控？

因为⽂件是⽤户本地隐私数据，React 不能通过 state 赋值 value 控制，只能由⽤户⼿动选择，所以天⽣⾮受控

### React 奇技淫巧

```ts
// 1.使用 ref 回调函数初始化 ref，避免使用 useEffect
const FocusInput = () => {
  const ref = useCallback((node) => node?.focus(), []);
  return <input ref={ref} type="text" />;
};
// 2.可取消的接口请求
const createCancelTask = (asyncTask) => {
   let cancel = () => {};
   return (...args) => {
      return new Promise((resolve, reject) => {
         cancel();
         cancel = () => {
            resolve = reject = () => {};
         };

         asyncTask(...args)
            .then(resolve)
            .catch(reject);
      });
   };
};

// const createTask = (name, delay) => () => {
//   console.log(`${name} 开始执行`);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log(`${name} 执行完成`);
//       resolve(`${name} 的结果`);
//     }, delay);
//   });
// };
// const cancelableTask = this.createCancelTask(createTask);
// cancelableTask('任务1', 2000).then((res) => console.log('收到结果:', res));

// setTimeout(() => {
//   const cancelableTask2 = this.createCancelTask(createTask);
//   cancelableTask2('任务2', 1000).then((res) =>
//     console.log('收到结果:', res)
//   );
// }, 800);

// 3.检测是否有modal弹窗，detectMaskShow，负责嵌套iframe的通信
/**
 * iframe模式下向父级发送消息
 * @param type
 * @param message
 */
export const postMessage = (type, message, isToTop?: boolean) => {
  if (window.parent === window) {
    return;
  }
  if (isToTop) {
    window.top.postMessage(
      JSON.stringify({
        channel: 'FRAME_APP',
        type,
        data: message
      }),
      deployEnv === 'development' ? '*' : undefined
    );
    return;
  }
  window.parent.postMessage(
    JSON.stringify({
      channel: 'FRAME_APP',
      type,
      data: message
    }),
    deployEnv === 'development' ? '*' : undefined
  );
};

/**
 * 检测是否有modal弹窗，通知iframe的父级隐藏弹窗的关闭按钮
 * @returns
 */
export const detectMaskShow = () => {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (mutation.addedNodes) {
          const hasModal = Array.from(mutation.addedNodes).some((item: any) =>
            item.classList?.contains('mtd-modal-wrapper')
          );
          if (hasModal) {
            // 当iframe内部还存在modal框，modal的mask的背景色需要变浅
            const modal = Array.from(mutation.addedNodes).find((item: any) =>
              item.classList?.contains('mtd-modal-wrapper')
            );
            // console.log('--modal', modal, modal.childNodes)
            let mask;
            for (const node of modal.childNodes) {
              if (node.classList?.contains('mtd-modal-mask')) {
                mask = node;
              }
              break;
            }
            mask.style.background = 'rgba(0, 0, 0, 0.2)';
            postMessage('HIDE_MODAL_CLOSE', '');
            break;
          }
        }
        if (mutation.removedNodes) {
          const hasModal = Array.from(mutation.removedNodes).some((item: any) =>
            item.classList?.contains('mtd-modal-wrapper')
          );
          if (hasModal) {
            postMessage('SHOW_MODAL_CLOSE', '');
            break;
          }
        }
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  return () => {
    observer.disconnect();
  };
};
```
