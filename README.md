# 轻断食计时器

A fasting tracker app with an AI assistant powered by Vercel AI SDK.

---

## Tech Stack

| 层级          | 技术                                |
| ------------- | ----------------------------------- |
| 前端框架      | React 19 + React Router 7           |
| 构建工具      | Vite 7                              |
| UI 组件库     | Semi Design (`@douyinfe/semi-ui`)   |
| 样式          | Less                                |
| 后端 / 数据库 | Supabase（Auth + Database）         |
| AI SDK        | Vercel AI SDK (`ai` v6)             |
| AI 提供商     | OpenAI 兼容接口（`@ai-sdk/openai`） |
| 运行时        | Node.js ≥ 20                        |

---

## 部署地址

| 平台                      | 地址                                         |
| ------------------------- | -------------------------------------------- |
| Fasting Pages             | https://app.aicoder.dpdns.org                |
| Fasting Pages (备用)      | https://fasting.aicoder.dpdns.org            |
| Agent Pages               | https://agent.aicoder.dpdns.org              |
| Pinme（去中心化）         | xxx                                          |
| hono-cf-worker (后端仓库) | https://github.com/coderyangx/hono-cf-worker |

---

> 相关链接：
>
> 1. agent聊天客户端仓库地址：https://github.com/coderyangx/ai-demo，域名：https://agent.aicoder.dpdns.org，分支：feature/client
> 2. 节食app仓库地址：https://github.com/coderyangx/opencode-app

---

## 项目结构

```
src/
├── App.tsx                  # 路由配置（React Router）
├── pages/
│   ├── Fasting/             # 断食计时器主页（需登录）
│   ├── Login/               # 登录页
│   ├── Home/                # Home 页
│   ├── About/               # About 页
│   └── supabase/            # Supabase 数据展示页
├── components/
│   └── AuthRoute.tsx        # 登录态路由守卫
└── agents/                  # AI Agent 模块（Node.js，不打包进前端）
    ├── model.ts             # 模型配置（baseURL / apiKey / modelId）
    ├── session.ts           # 会话管理（待完善）
    ├── memory/              # 长期记忆模块（待完善）
    ├── guardrails.ts        # 安全护栏（待完善）
    ├── logger.ts            # 日志（待完善）
    └── fastingAgent/
        ├── agent.ts         # ToolLoopAgent 定义
        ├── simpleAgent.ts   # SimpleAgent（generateText 封装）
        ├── tool.ts          # 工具定义（文件读写、bash、BMI、时间）
        ├── utils.ts         # REPL 工具函数（startRepl、readline）
        ├── demo.ts          # 命令行交互测试入口
        └── index.ts         # 模块导出
```

---

## 页面路由

| 路径        | 页面             | 需要登录 |
| ----------- | ---------------- | -------- |
| `/`         | 断食计时器       | ✓        |
| `/login`    | 登录             | —        |
| `/home`     | Home             | ✓        |
| `/about`    | About            | ✓        |
| `/supabase` | 数据展示（商品） | —        |

---

## AI Agent 模块

基于 [Vercel AI SDK](https://sdk.vercel.ai/docs) 构建，目前包含两种 Agent 实现：

### SimpleAgent

对 `generateText` / `streamText` 的简单封装，支持单轮问答和流式输出，无工具调用。

### fastingAgent（ToolLoopAgent）

使用 `ToolLoopAgent` 管理工具调用循环，内置以下工具：

| 工具             | 功能                                 |
| ---------------- | ------------------------------------ |
| `getCurrentTime` | 获取当前时间                         |
| `calculateBMI`   | 根据身高体重计算 BMI                 |
| `readFile`       | 读取本地文件（路径相对工作目录）     |
| `writeFile`      | 写入文件，自动创建目录，支持追加模式 |
| `execBash`       | 执行 bash 命令（内置安全拦截规则）   |

#### 多轮对话原理

AI SDK 的 `stream().response.messages` 会返回本轮所有 step 的完整产出（`assistant` + `tool` 消息），需要手动 push 回 `history` 才能实现真正的多轮记忆：

```typescript
const result = await fastingAgent.stream({ messages: history });

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}

// 必须 await result.response，等待所有 step settled
const resp = await result.response;

// spread push：带工具调用时会有多条消息（assistant + tool）
history.push(...(resp.messages as ModelMessage[]));
```

#### 本地运行 Agent demo

```bash
# 安装依赖
npm install

# 启动交互式 REPL
npx tsx src/agents/fastingAgent/demo.ts
```

---

## 环境变量

复制 `.env.example`（或手动创建 `.env`）并填入：

```env
# Supabase
VITE_SUPABASE_KEY=your_supabase_publishable_key

# OpenAI 兼容接口（Agent 使用）
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

模型的 `baseURL` 和 `apiKey` 在 `src/agents/model.ts` 中配置。

---

## 开发命令

```bash
npm run dev        # 启动前端开发服务器
npm run build      # 生产构建
npm run preview    # 预览生产构建
npm run lint       # ESLint 检查
```

---

## 相关文档

- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [AI SDK Core（generateText / streamText）](https://sdk.vercel.ai/docs/ai-sdk-core)
- [ToolLoopAgent](https://sdk.vercel.ai/docs/ai-sdk-core/agents)
- [OpenAI Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
- [Supabase 文档](https://supabase.com/docs)
