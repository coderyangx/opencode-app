# 流式断连与恢复设计方案

## 一、背景与问题场景

AI 流式输出（SSE）是长连接，在真实网络环境下极易中断。常见场景：

| 场景                    | 触发方式        | 影响             |
| ----------------------- | --------------- | ---------------- |
| 网络波动 / WiFi 切换    | 底层 TCP 断开   | 流中断，内容丢失 |
| 用户主动切换会话        | 前端调 `stop()` | 本次生成不完整   |
| 用户刷新页面 / 关闭标签 | 浏览器销毁连接  | 内容丢失         |
| 服务端负载扩容重启      | Worker 被终止   | 流中断           |
| Token 超限 / 服务器超时 | 后端主动断流    | 生成不完整       |

目标：**让用户感知中断，并提供恢复入口，而不是静默丢失内容。**

---

## 二、现状分析

### 2.1 已实现（L0）

**数据库 (`schema.sql`)**

- `messages` 表 `status` 字段：`done | streaming | error | interrupted`

**后端 (`worker/routes/chat.ts`)**

- `abortSignal` 已传入 `createAgentUIStreamResponse`
- `onFinish` 中 `saveAssistantMessage` 正常写入，`status = 'done'`
- `onError` 回调已实现：若 `assistantMsgId` 不为 null，调 `markMessageStatus('error')`
- `isContinuation` 逻辑已完整：`originalMessages` 传 DB history，SDK 自动判断是否为续写，`onFinish` 中切割旧 parts，只写新增部分

**后端 (`worker/lib/chat-store.ts`)**

- `markMessageStatus(env, msgId, 'interrupted' | 'error')` 已实现
- `saveAssistantMessage(isContinuation=true)` 走 UPDATE，保留原 id 和 created_at，覆盖 parts

**前端 (`src/services/chatApi.ts`)**

- `ChatMessage.status` 类型已声明

### 2.2 缺口（待实现）

| 缺口                                      | 说明                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `onError` 中 `assistantMsgId` 可能为 null | 流刚开始、第一个 chunk 还没到时断连，无法标记                             |
| 用户主动中断未标记 `interrupted`          | `abortSignal.onabort` 在 `createAgentUIStreamResponse` 返回后无法可靠捕获 |
| 前端未消费 `status` 字段                  | `getMessages` 返回的 `status` 没有驱动任何 UI 状态                        |
| 无"继续生成"入口                          | `interrupted` 消息只有"重试"按钮，没有续写入口                            |
| 切换会话未停流                            | `ChatWindow` unmount 时没有调用 `stop()` 终止当前 SSE                     |

---

## 三、分级方案

### L0 — 已完成（0PD）

- DB `status` 四态
- `onError` 写 `error`
- `isContinuation` 续写合并逻辑

### L1 — 语义续写（MVP 推荐，1-2PD）

**目标**：中断后消息标记正确，前端提供"继续生成"入口，用户点击后后端语义续写。

#### 后端改动

**`worker/routes/chat.ts`**

1. **`onError` 补充 `interrupted` 区分**

   ```typescript
   onError: (err: string) => {
     if (assistantMsgId) {
       // 区分用户主动中断 vs 真实错误
       const isAbort = abortSignal?.aborted;
       markMessageStatus(c.env, assistantMsgId, isAbort ? 'interrupted' : 'error').catch(…);
     }
     return err;
   }
   ```

2. **`abortSignal.onabort` 监听用户主动中断**

   在 `createAgentUIStreamResponse` 调用之前注册，确保 `assistantMsgId` 被更新后能标记：

   ```typescript
   // 在 return createAgentUIStreamResponse(...) 之前
   abortSignal?.addEventListener('abort', () => {
     if (assistantMsgId) {
       markMessageStatus(c.env, assistantMsgId, 'interrupted').catch(…);
     }
   });
   ```

   > 注意：`assistantMsgId` 在 `onFinish` 中才被赋值，`abort` 事件触发时可能已有值（已生成部分内容）或仍为 null（刚发出请求即中断）。null 时不标记，由前端超时检测兜底（见 L1 前端）。

3. **（可选）流开始时预写 `streaming` 状态**

   在 `onStepFinish` 或首个 chunk 回调中写入一条 `status=streaming` 的占位记录，获取 `assistantMsgId`，使 `onError` 时总能标记。

#### 前端改动

**`src/pages/Chat/` (ChatWindow 或 useChat hook)**

4. **切换会话时停流**

   ```typescript
   useEffect(() => {
     return () => {
       stop(); // useChat 的 stop 方法，unmount 时中止 SSE
     };
   }, [conversationId]);
   ```

5. **加载历史时检测 `interrupted` 消息**

   `getMessages` 已返回 `status` 字段，需将其透传到 `MessageBubble`：

   ```typescript
   // 在渲染消息列表时
   const lastMsg = messages[messages.length - 1];
   const isInterrupted = lastMsg?.role === 'assistant' && lastMsg?.status === 'interrupted';
   ```

**`src/pages/Chat/chat/MessageBubble.tsx`**

6. **新增 `status` prop 和"继续生成"按钮**

   ```typescript
   interface Props {
     message: UIMessage;
     status?: 'done' | 'streaming' | 'error' | 'interrupted'; // 新增
     isStreaming?: boolean;
     onRegenerate?: () => void;
     onContinue?: () => void; // 新增：续写回调
   }
   ```

   在 `interrupted` 时在气泡底部渲染续写按钮（参考现有"重试"按钮样式）：

   ```tsx
   {
     status === 'interrupted' && onContinue && (
       <div className='flex items-center gap-2 text-[13.5px] text-amber-500 py-0.5'>
         <span>生成被中断</span>
         <button onClick={onContinue} className='…'>
           继续生成
         </button>
       </div>
     );
   }
   ```

7. **续写触发逻辑**

   点击"继续生成"时，前端发送：
   - `role: 'user'`，`parts: [{ type: 'text', text: '请继续' }]`
   - 后端 `originalMessages` 中末尾为 `assistant` 消息 → SDK 自动识别 `isContinuation: true`
   - `onFinish` 中的 `newParts` 切割逻辑已正确处理续写合并

   > 无需传特殊字段，`isContinuation` 完全由 `originalMessages` 末尾角色推断，当前后端已实现。

### L2 — KV 字节级断点续传（3-5PD，生产可选）

> MVP 不建议实现，优先完成 L1。

**架构思路**：

```
生成过程
  ↓ 每个 chunk → 追加写入 Cloudflare KV
      key: `stream:${conversationId}:${assistantMsgId}`
      value: 已生成的完整文本（append 或 chunk index）

断连
  ↓ 前端 EventSource onerror 触发
  ↓ 记录 lastEventId（SSE 标准字段）

重连请求
  GET /api/chat/resume?conversationId=xxx&lastEventId=yyy
  ↓ 后端从 KV 读取 buffer[lastEventId 之后的部分]
  ↓ 重新开启 SSE，先 flush 已有内容，再继续生成（or 仅续写剩余）
```

**边界问题**：

| 问题                         | 对策                                                                    |
| ---------------------------- | ----------------------------------------------------------------------- |
| 续写风格不一致（LLM 随机性） | 恢复 Prompt 注入 style anchor：`请保持前文风格继续`；复用原 temperature |
| 模型版本升级导致 KV 不兼容   | KV value 中记录 `model_version`，不兼容时降级为 L1 语义续写             |
| KV 写入开销                  | 每 N 个 chunk 写一次（批量追加），而非每 chunk 写一次                   |
| Worker 超时（CPU limit）     | 考虑 Durable Objects 替代 KV，支持长连接维持                            |

### L3 — 智能摘要续写（可选增强）

适用于超长生成（>4K tokens）恢复时上下文窗口溢出的场景：

1. 续写前，对已生成内容调用 `generateText` 做摘要压缩
2. 续写 Prompt 注入 `history_summary` 字段而非全文
3. 告知模型："以下是前文摘要，请基于它继续完成原始任务"

---

## 四、各文件改动一览

| 文件                                    | L1 改动内容                                                                         |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `worker/routes/chat.ts`                 | `onError` 区分 `interrupted/error`；补充 `abortSignal.addEventListener('abort', …)` |
| `worker/lib/chat-store.ts`              | 无需改动（`markMessageStatus` 已实现）                                              |
| `src/pages/Chat/chat/MessageBubble.tsx` | 新增 `status` + `onContinue` prop；渲染"继续生成"按钮                               |
| `src/pages/Chat/chat/ActionToolbar.tsx` | 视重构决策，可选：把续写按钮移到此处统一管理                                        |
| `src/pages/Chat/` (ChatWindow)          | `useEffect` cleanup 调 `stop()`；将 `status` 从历史消息传给 `MessageBubble`         |
| `src/services/chatApi.ts`               | `ChatMessage.status` 字段已声明，无需改动                                           |

---

## 五、边界情况对策

| 边界情况                             | 对策                                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `assistantMsgId` 为 null 时断连      | 不标记 DB；可在下次加载时检测 `status='streaming'` 超过阈值时间的消息，批量更新为 `interrupted` |
| 用户快速连续点"继续生成"             | 前端 loading 状态防重复提交                                                                     |
| 续写与新消息并发（多端）             | 后端以 `originalMessages` 末尾 role 为准，只有末尾为 assistant 时才触发 `isContinuation`        |
| 续写后内容仍为空                     | `onError` 标记 `error`，UI 降级显示"生成失败 / 重试"                                            |
| 刷新页面后 `status` 仍为 `streaming` | 前端加载时，`streaming` 且超过 5min 的消息视为 `interrupted` 展示                               |

---

## 六、MVP 范围说明

| 功能                                   | 是否在 MVP      |
| -------------------------------------- | --------------- |
| DB status 四态                         | ✅ 已完成       |
| `onError` 标记 error                   | ✅ 已完成       |
| `isContinuation` 续写合并              | ✅ 已完成       |
| `onError` 区分 interrupted/error       | ✅ L1，建议实现 |
| `abortSignal.onabort` 标记 interrupted | ✅ L1，建议实现 |
| 切换会话调 `stop()`                    | ✅ L1，建议实现 |
| 前端"继续生成"按钮                     | ✅ L1，建议实现 |
| KV 实时写入 + 字节级恢复               | ❌ L2，生产可选 |
| 智能摘要续写                           | ❌ L3，生产可选 |

---

## 七、参考资料

- [稀土掘金 - SSE 断流恢复方案](https://juejin.cn/post/7643469288817508390#heading-5)
- [稀土掘金 - Agent 六层架构](https://juejin.cn/post/7633624091766161418#heading-0)
- [Vercel AI SDK - createAgentUIStreamResponse](https://sdk.vercel.ai/docs)
- [Cloudflare KV / Durable Objects](https://developers.cloudflare.com/kv/)
