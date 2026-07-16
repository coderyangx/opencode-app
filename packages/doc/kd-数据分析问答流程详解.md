# 快搭数据分析 Agent 问答与回复流程详解

> 本文以一个真实的用户提问为例，端到端拆解「快搭视图数据」从请求接入到流式回复的完整链路，涵盖涉及的关键代码、接口、数据结构与内部机制。

---

## 目录

- [一、示例问题](#一示例问题)
- [二、整体架构概览](#二整体架构概览)
- [三、完整流程时序图](#三完整流程时序图)
- [四、分阶段详解](#四分阶段详解)
  - [阶段 0：HTTP 请求入口](#阶段-0http-请求入口)
  - [阶段 1：MainAgent 初始化与表结构注入](#阶段-1mainagent-初始化与表结构注入)
  - [阶段 2：获取表结构（showInfo 接口）](#阶段-2获取表结构showinfo-接口)
  - [阶段 3：LLM 规划查询任务（query-planning）](#阶段-3llm-规划查询任务query-planning)
  - [阶段 4：LLM 设计查询 DSL（query-design）](#阶段-4llm-设计查询-dslquery-design)
  - [阶段 5：LLM 执行查询（query-data 工具）](#阶段-5llm-执行查询query-data-工具)
  - [阶段 6：快搭执行器拉取数据 + 本地 SQL 查询](#阶段-6快搭执行器拉取数据--本地-sql-查询)
  - [阶段 7：LLM 总结与输出](#阶段-7llm-总结与输出)
- [五、关键数据结构对照表](#五关键数据结构对照表)
- [六、关键设计要点总结](#六关键设计要点总结)
- [七、常见问题排查](#七常见问题排查)

---

## 一、示例问题

> **用户提问**：「这个视图下项目等级为 S 的数据有多少条？」

该问题对应的快搭视图结构（见 `packages/server/src/data/presets/kuaida/viewData.ts`）包含一个「项目等级」单选字段（字段 ID：`select_dd4c38eb`），枚举值为 `S / A / B / C`。视图下的数据记录（见 `packages/server/src/data/executors/kuaida/viewDataList.ts`）共 20 条，其中项目等级为 `S` 的有 4 条。

**期望回复**：「项目等级为 S 的数据共有 4 条。」

---

## 二、整体架构概览

整个流程是一个 **NL2SQL（自然语言转 SQL）+ 本地内存查询引擎** 的数据分析 Agent 系统，核心链路为：

```
HTTP 请求 → Chat Handler → MainAgent (LLM)
  → handoff.query-planning   (规划查询任务)
  → handoff.query-design      (生成查询 DSL)
  → query-data                (执行查询)
       → 获取表结构 (showInfo 接口)
       → 拉取全量数据 (data/list 接口)
       → 本地 alasql 引擎执行 SQL
  → generate-chart / 文字总结 → 流式返回
```

涉及的核心组件：

| 组件               | 文件路径                                 | 职责                       |
| ------------------ | ---------------------------------------- | -------------------------- |
| Chat Handler       | `src/handlers/chat.ts`                   | HTTP 入口，构建运行上下文  |
| MainAgent          | `src/agents/main.ts`                     | 主 Agent，LLM 调度中心     |
| QueryPlanningAgent | `src/agents/query-planning.ts`           | 拆解分析任务为查询任务列表 |
| QueryDesignAgent   | `src/agents/query-design.ts`             | 生成结构化查询 DSL         |
| query-data 工具    | `src/tools/query-data.ts`                | 执行查询 DSL               |
| NL2SQLDataService  | `src/data/service.ts`                    | 数据服务统一入口           |
| 快搭预设           | `src/data/presets/kuaida/index.ts`       | 快搭表结构获取             |
| 快搭执行器         | `src/data/executors/kuaida/index.ts`     | 快搭数据拉取 + 本地查询    |
| 数据清洗           | `src/data/executors/kuaida/formatter.ts` | 嵌套对象扁平化             |
| DSL Schema         | `src/lib/query/dsl-schema.ts`            | DSL 结构定义与校验         |
| DSL→SQL 翻译       | `src/lib/query/dsl-to-sql.ts`            | DSL 转 SQL                 |
| 本地查询引擎       | `src/lib/query/engine.ts`                | alasql 内存执行            |
| 表单请求封装       | `src/lib/request/form.ts`                | 快搭接口鉴权与请求         |

---

## 三、完整流程时序图

```
用户: "项目等级为S的数据有多少条"
  │
  ▼
[Chat Handler] 构建 ctx { view, cookie, env, presetId: 'kuaida' }
  │
  ▼
[MainAgent] instructions() → ctx.dataSvc.getDataSchema()
  │
  ├─► kuaidaPreset.getDataSchema(ctx)
  │     ├─ GET /api/zeroconsole/view/showInfo/${view}  ← 返回值参考 viewData.ts
  │     ├─ 解析 schema JSON，columnsFormatter 转换字段
  │     └─ 返回 { tables: [{ name: view, columns: [...] }] }
  │
  ▼
[MainAgent LLM] 注入表结构到 system prompt，决策调用 handoff.query-planning
  │
  ▼
[QueryPlanningAgent] generateObject → 规划任务: "统计项目等级S的记录数"
  │
  ▼
[MainAgent LLM] 调用 handoff.query-design 传入任务
  │
  ▼
[QueryDesignAgent] generateObject → 生成 DSL { select: [COUNT(*)], where: [select_dd4c38eb='S'] }
  │   存入 ctx.memory[query_id]
  │
  ▼
[MainAgent LLM] 调用 query-data { query_id }
  │
  ▼
[query-data 工具] ctx.dataSvc.executeQuery(dsl)
  │
  ▼
[kuaida 执行器]
  ├─ POST /api/zeroconsole/view/data/list (分页拉全量) ← 返回值参考 viewDataList.ts
  ├─ formatDataRow 清洗 (select_ 取 label, people_ 取 name)
  ├─ DSLTranslator: DSL → SQL "SELECT COUNT(*) FROM ? WHERE select_dd4c38eb='S'"
  └─ alasql 执行 → [{ count: 4 }]
  │
  ▼
[MainAgent LLM] 总结: "项目等级为S的数据共有 4 条"
  │
  ▼
流式返回前端 (AI SDK Data Stream v1)
```

---

## 四、分阶段详解

### 阶段 0：HTTP 请求入口

用户消息通过 `POST /ai-agent/chat` 进入 `Chat` handler。

**请求格式：**

```
POST /ai-agent/chat
Headers:
  Cookie: <用户登录态>
  X-FORM-VIEW: view-1h0aysm2v2aw6qm2b2q27
  X-ENV: test
  X-DATA-PRESET: kuaida
Body:
  { "messages": [...], "fileKey": null }
```

**Handler 逻辑：** 从请求头构建运行上下文 `IRunContext`，初始化数据服务和 MainAgent。

```10:32:packages/server/src/handlers/chat.ts
export const Chat: Handler = async (c) => {
  const { messages, fileKey } = await c.req.json();

  const runContext: IRunContext = {
    cookie: c.req.header('Cookie'),
    view: c.req.header('X-FORM-VIEW') || '',
    env: c.req.header('X-ENV') || '',
    origin: c.req.header('Origin') || '',
    history: messages.slice(-10),
    s3,
    presetId: c.req.header('X-DATA-PRESET') || 'mock',
  };

  if (fileKey) {
    runContext.presetOptions = {
      fileKey,
    };
  }

  runContext.dataSvc = new NL2SQLDataService(runContext);

  const agent = new MainAgent(runContext);
  const result = await agent.run();

  let sessionId = getCookie(c, 'chatSessionId');
  if (!sessionId) {
    sessionId = nanoid(16);
    setCookie(c, 'chatSessionId', sessionId, {
      httpOnly: true,
      maxAge: 3600,
    });
  }
  runContext.memory = sessionMemoryManager.get(sessionId);
```

**上下文字段说明：**

| 字段       | 来源               | 用途                                     |
| ---------- | ------------------ | ---------------------------------------- |
| `cookie`   | `Cookie` 头        | 调用快搭接口鉴权                         |
| `view`     | `X-FORM-VIEW` 头   | 视图 ID，如 `view-1h0aysm2v2aw6qm2b2q27` |
| `env`      | `X-ENV` 头         | 环境（development/test/staging/prod）    |
| `presetId` | `X-DATA-PRESET` 头 | 数据预设 ID，快搭场景为 `kuaida`         |
| `history`  | 请求体 messages    | 对话历史（取最近 10 条）                 |

> ⚠️ **注意**：当前代码默认 `presetId` 为 `'mock'`，不传 `X-DATA-PRESET` 头时会走本地模拟销售数据。要用快搭数据，前端必须传 `X-DATA-PRESET: kuaida`。

**响应格式：** 使用 AI SDK 的 Data Stream v1 协议流式返回。

```46:51:packages/server/src/handlers/chat.ts
  c.header('X-Vercel-AI-Data-Stream', 'v1');
  c.header('Content-Type', 'text/plain; charset=utf-8');
  c.header('X-Accel-Buffering', 'no');

  return result.toDataStreamResponse();
```

---

### 阶段 1：MainAgent 初始化与表结构注入

`MainAgent` 构造时会创建三个子 Agent（作为 handoff 工具）加上通用工具集：

```129:138:packages/server/src/agents/main.ts
    const queryDesignAgent = new QueryDesignAgent(this.ctx);
    const queryPlanningAgent = new QueryPlanningAgent(this.ctx);
    const reportAgent = new HtmlReportGenerateAgent(this.ctx);

    this.tools = {
      ...queryPlanningAgent.asToolMap(),
      ...queryDesignAgent.asToolMap(),
      ...reportAgent.asToolMap(),
      ...toolSetFactory(this.ctx),
    } as TOOLS;
```

**可用工具集：**

| 工具名                         | 类型          | 来源                    | 职责              |
| ------------------------------ | ------------- | ----------------------- | ----------------- |
| `handoff.query-planning`       | handoff Agent | QueryPlanningAgent      | 规划查询任务列表  |
| `handoff.query-design`         | handoff Agent | QueryDesignAgent        | 生成查询 DSL      |
| `handoff.generate-html-report` | handoff Agent | HtmlReportGenerateAgent | 生成 HTML 报告    |
| `query-data`                   | 普通工具      | tools/query-data.ts     | 执行 DSL 查询     |
| `generate-chart`               | 普通工具      | tools/generate-chart.ts | 生成 ECharts 图表 |
| `date_*` / `math_*`            | 普通工具      | tools/                  | 日期与数学辅助    |

`run()` 时会先调用 `instructions(ctx)` 生成系统提示词，**这一步会预先拉取表结构**注入到 prompt 中：

```142:168:packages/server/src/agents/main.ts
  async run(
    options: {
    } = {},
  ): Promise<StreamTextResult<TOOLS, never>> {
    const system = await this.instructions(this.ctx);
    const messages = this.ctx.history || [];
    return streamText({
      model: this.model,
      messages,
      system,
      maxSteps: 1,
      temperature: 0.3,
      toolCallStreaming: true,
      tools: this.tools,
      providerOptions: {
        openai: {
          parallelToolCalls: false,
        },
      },
      onError: (error) => {
        console.log(error);
      },
      ...options,
    });
  }
```

注入表结构的 system prompt 片段：

```53:56:packages/server/src/agents/main.ts
**数据库表结构信息:**
\`\`\`json
${JSON.stringify(tableInfo, null, 2)}
\`\`\`
```

---

### 阶段 2：获取表结构（showInfo 接口）

这是获取快搭视图元数据的核心接口。

**调用链：**

```
MainAgent.instructions
  → ctx.dataSvc.getDataSchema()
    → NL2SQLDataService.getDataSchema()
      → preset.database_schema(ctx)
        → kuaidaPreset.getDataSchema(ctx)
          → formFetch(ctx).get('/api/zeroconsole/view/showInfo/${view}')
```

**数据服务入口：**

```24:28:packages/server/src/data/service.ts
  async getDataSchema(presetId?: string) {
    const preset = this.getPreset(presetId);
    return preset.database_schema(this.ctx);
  }
```

**快搭预设的 getDataSchema 实现：**

```130:187:packages/server/src/data/presets/kuaida/index.ts
const getDataSchema = async (ctx: IRunContext): Promise<IDatabaseSchema> => {
  const cacheKey = {
    view: ctx.view,
  };
  const cache = cacheManager.get(cacheKey);
  let results;
  if (typeof cache !== "undefined") {
    results = cache;
  } else {
    const result = await formFetch(ctx).get<{
      name: string;
      schema: string;
      showFields: string[];
    }>(`/api/zeroconsole/view/showInfo/${ctx.view}`);
    const { name, schema, showFields } = result;
    const schemaObj = JSON.parse(schema);
    const fields = [...SYSTEM_FIELDS];
    const walk = (field: any) => {
      if (!field) {
        return;
      }
      if (field.parentInstanceKey) {
        const formatter = columnsFormatter.find((item) =>
          item.reg.test(field.id)
        );
        if (formatter) {
          fields.push(formatter.format(field));
        } else {
          fields.push({
            name: field.id,
            description: field.props?.label || "",
            type: "VARCHAR",
            role: "dimension",
          });
        }
      }
      if (field.children) {
        field.children.forEach(walk);
      }
    };

    walk(schemaObj.pages[0].layout);

    results = {
      name: ctx.view,
      description: name,
      columns: showFields
        .map((item) => fields.find((field) => field.name === item))
        .filter(Boolean),
    };

    cacheManager.set(cacheKey, results);
  }

  return {
    tables: [results],
  };
};
```

#### 接口返回值解析（参考 `viewData.ts`）

`GET /api/zeroconsole/view/showInfo/${ctx.view}` 返回结构：

| 字段           | 类型          | 说明                                                  |
| -------------- | ------------- | ----------------------------------------------------- |
| `name`         | string        | 视图名称（如 `项目信息管理_仿CLC`）                   |
| `schema`       | string (JSON) | 积木低代码 schema 协议，包含 `pages[0].layout` 字段树 |
| `showFields`   | string[]      | 视图展示的字段 ID 列表                                |
| `permissions`  | string[]      | 权限列表                                              |
| `formVersion`  | number        | 表单版本                                              |
| `submitConfig` | object        | 提交配置                                              |

**schema 字段树结构示例（来自 viewData.ts）：**

```json
{
  "pages": [
    {
      "layout": {
        "id": "jimuroot_db913271",
        "componentName": "JimuRoot",
        "children": [
          {
            "id": "select_dd4c38eb",
            "componentName": "Select",
            "props": {
              "label": "项目等级",
              "options": [
                { "label": "S", "value": "select05yp5obzmo9m", "color": "#E8F1FF" },
                { "label": "A", "value": "select0ny2v3brm7s", "color": "#FFF2F0" },
                { "label": "B", "value": "select02291l5ll2bo", "color": "#E6FAF8" },
                { "label": "C", "value": "select0zmnrxcoexqd", "color": "#FFF9DE" }
              ]
            },
            "parentInstanceKey": "jimuroot_db913271"
          },
          {
            "id": "people_b9e25f8f",
            "componentName": "People",
            "props": { "label": "项目经理" },
            "parentInstanceKey": "jimuroot_db913271"
          }
          // ... 更多字段
        ]
      }
    }
  ]
}
```

#### 字段类型转换规则（columnsFormatter）

`schema` 里的每个字段通过 `columnsFormatter` 按字段 ID 前缀转换成 `IColumnSchema`：

```30:128:packages/server/src/data/presets/kuaida/index.ts
const columnsFormatter: Array<{
  reg: RegExp;
  format: (data: { id: string; props: Record<string, any> }) => IColumnSchema;
}> = [
  {
    reg: /^number_/i,
    format: ({ id, props }) => ({
      name: id, type: "INTEGER", description: props?.label || "", role: "metric",
    }),
  },
  {
    reg: /^select_/i,
    format: ({ id, props }) => ({
      name: id, type: "ENUM",
      enum_values: (props.options || []).filter(Boolean).map((item) => item.label),
      description: props?.label || "", role: "dimension",
    }),
  },
  {
    reg: /^people_/i,
    format: ({ id, props }) => ({
      name: id, type: "VARCHAR", description: props?.label || "", role: "dimension",
    }),
  },
  {
    reg: /^date_/i,
    format: ({ id, props }) => ({
      name: id, type: "TIMESTAMP", description: props?.label || "", role: "dimension",
    }),
  },
  {
    reg: /^money_/i,
    format: ({ id, props }) => ({
      name: id, type: "DECIMAL", description: props?.label || "", role: "metric",
    }),
  },
  // ... textarea_, department_, selectdd_ 等
];
```

**前缀 → 类型映射表：**

| 字段 ID 前缀  | 组件类型    | 转换后 SQL 类型 | 角色      | 特殊处理                               |
| ------------- | ----------- | --------------- | --------- | -------------------------------------- |
| `number_`     | Number      | INTEGER         | metric    | -                                      |
| `select_`     | Select      | ENUM            | dimension | 提取 options 的 label 作为 enum_values |
| `selectdd_`   | MultiSelect | JSON            | dimension | 注释标注为 ENUM ARRAY                  |
| `people_`     | People      | VARCHAR         | dimension | -                                      |
| `date_`       | Date        | TIMESTAMP       | dimension | -                                      |
| `textarea_`   | TextArea    | TEXT            | dimension | -                                      |
| `money_`      | Money       | DECIMAL         | metric    | -                                      |
| `department_` | Department  | VARCHAR         | dimension | -                                      |
| `input_`      | Input       | VARCHAR         | dimension | 走默认兜底                             |

#### 转换后的表结构（注入给 LLM）

对于 `viewData.ts` 的示例，最终注入到 LLM system prompt 的表结构为：

```json
{
  "tables": [
    {
      "name": "view-1h0aysm2v2aw6qm2b2q27",
      "description": "项目信息管理_仿CLC",
      "columns": [
        {
          "name": "input_ba0c62d5",
          "type": "VARCHAR",
          "description": "项目名称",
          "role": "dimension"
        },
        {
          "name": "select_dd4c38eb",
          "type": "ENUM",
          "description": "项目等级",
          "role": "dimension",
          "enum_values": ["S", "A", "B", "C"]
        },
        {
          "name": "people_b9e25f8f",
          "type": "VARCHAR",
          "description": "项目经理",
          "role": "dimension"
        },
        {
          "name": "date_9e37d3a0",
          "type": "TIMESTAMP",
          "description": "项目开始日期",
          "role": "dimension"
        },
        {
          "name": "date_264f174a",
          "type": "TIMESTAMP",
          "description": "计划结项日期",
          "role": "dimension"
        },
        {
          "name": "date_082d9123",
          "type": "TIMESTAMP",
          "description": "实际结项日期",
          "role": "dimension"
        },
        {
          "name": "input_73a6744d",
          "type": "VARCHAR",
          "description": "关联目标",
          "role": "dimension"
        },
        {
          "name": "select_2a4f18cd",
          "type": "ENUM",
          "description": "项目状态",
          "role": "dimension",
          "enum_values": ["立项中", "进行中", "已完成", "已取消"]
        },
        {
          "name": "SYSTEM_CREATOR",
          "type": "VARCHAR",
          "description": "创建人",
          "role": "dimension"
        },
        {
          "name": "SYSTEM_DATE_CREATED",
          "type": "TIMESTAMP",
          "description": "创建时间",
          "role": "dimension"
        }
      ]
    }
  ]
}
```

#### 请求封装（formFetch）

```16:50:packages/server/src/lib/request/form.ts
export const formFetch = (ctx: any) => {
  const env = ctx.env && FORM_API_SERVER_MAP[ctx.env] ? ctx.env : 'development';
  const fallbackCookie = process.env.KUAIDA_COOKIE || '';
  const cookie = ctx.cookie || fallbackCookie;
  const instance = axios.create({
    baseURL: FORM_API_SERVER_MAP[env],
    headers: {
      Cookie: cookie,
      'User-Agent': 'Mozilla/5.0 ...',
    },
  });

  instance.interceptors.response.use(
    (resp) => {
      if (resp.data?.code === 200) {
        return resp.data.data;
      }
      const isHtml = typeof resp.data === 'string' && resp.data.includes('sso.auth.fe');
      if (isHtml) {
        throw new Error('快搭接口返回SSO登录页，请检查Cookie是否有效...');
      }
      throw new Error('请求异常');
    },
    (error) => { throw error; }
  );
  return instance;
};
```

**环境 → baseURL 映射：**

```1:6:packages/server/src/const/index.ts
export const FORM_API_SERVER_MAP: Record<string, string> = {
  development: "https://kuaida.it.test.sankuai.com",
  test: "https://kuaida.it.test.sankuai.com",
  staging: "https://kuaida.it.st.sankuai.com",
  prod: "https://kuaida.sankuai.com",
};
```

> 优先使用请求携带的 Cookie；本地开发若未带有效登录态，兜底使用 `.env` 中的 `KUAIDA_COOKIE`。

---

### 阶段 3：LLM 规划查询任务（query-planning）

`MainAgent`（LLM）拿到注入了表结构的 system prompt 后，针对"项目等级为 S 的数据有多少条"，会调用 `handoff.query-planning` 工具。

`QueryPlanningAgent` 用 `generateObject` 将用户需求拆解为结构化任务列表。

**任务 Schema 定义：**

```1:13:packages/server/src/types/query.ts
export const QueryTaskSchema = z.object({
  task_id: z.string().describe("任务唯一 ID"),
  goal: z.string().describe("任务的目标介绍"),
  table: z.string().describe("查询的数据表"),
  condition: z.string().describe("查询筛选条件的伪代码表示").optional(),
  dependencies: z.string().describe("依赖任务列表").optional(),
  output: z.array(z.string()).describe("任务输出的数据字段"),
});
```

**规划执行：**

```94:118:packages/server/src/agents/query-planning.ts
  async run(): Promise<{ tasks?: IQueryTask[] }> {
    const system = await this.instructions(this.ctx);
    const result = await generateObject({
      model: this.model,
      system,
      temperature: 0.3,
      schema: z.object({
        tasks: z.array(QueryTaskSchema).describe('规划的数据查询任务列表'),
      }),
      messages: this.ctx.history || [],
    });

    if (result.object.tasks) {
      result.object.tasks.forEach((item) => (item.task_id = nanoid(6)));
    }

    return result.object;
  }
```

**规划核心原则（来自 prompt）：**

- 仅支持单一查询，不支持子查询或连表
- 仅支持字段选择、字段聚合、过滤条件、数据分组、排序
- 字段聚合仅支持 `COUNT`、`COUNT_DISTINCT`、`AVG`、`MIN`、`MAX`
- 计算比例等场景需拆分为多个 COUNT 任务

**本例规划结果（示意）：**

```json
{
  "tasks": [
    {
      "task_id": "abc123",
      "goal": "统计项目等级为S的记录数量",
      "table": "view-1h0aysm2v2aw6qm2b2q27",
      "condition": "WHERE select_dd4c38eb = 'S'，对记录 COUNT(*)",
      "dependencies": null,
      "output": ["count"]
    }
  ]
}
```

---

### 阶段 4：LLM 设计查询 DSL（query-design）

`MainAgent` 拿到规划任务后，调用 `handoff.query-design` 传入任务描述。`QueryDesignAgent` 用 `generateObject` + `QUERY_CONFIG_SCHEMA` 生成 DSL。

**DSL Schema 定义：**

```42:66:packages/server/src/lib/query/dsl-schema.ts
export const QUERY_SCHEMA = z.object({
  from: z.string().describe("数据来源表名"),
  select: z
    .array(SELECT_FIELD_SCHEMA)
    .min(1, "至少包含一个 Select")
    .describe("结果选取"),
  where: z.array(CONDITION_SCHEMA).describe("数据筛选条件"),
  groupBy: z.array(z.string()).optional().describe("数据记录分组配置"),
  orderBy: z.array(SORT_SCHEMA).optional().describe("数据记录排序配置"),
  limit: z.union([
    z.number().int().positive().optional().describe("返回记录的条数限制"),
    z.null(),
  ]),
});

export const QUERY_CONFIG_SCHEMA = z.object({
  dsl_query: QUERY_SCHEMA,
  hint: z.string().describe("该 DSL Query 将执行的逻辑的含义分析"),
});
```

**DSL 设计执行：**

```249:295:packages/server/src/agents/query-design.ts
  async run(options?: {
    maxSteps?: number;
    toolChoice?: ToolChoice<ToolSet>;
    input?: string;
  }): Promise<{
    query_id: string;
    hint: string;
    query?: any;
    sql?: string;
    goal?: string;
  }> {
    const system = await this.instructions(this.ctx);
    const result1 = await generateObject({
      model: this.model,
      system,
      schema: QUERY_CONFIG_SCHEMA,
      temperature: 0.3,
      messages: options?.input
        ? [
            {
              role: 'user',
              content: `下面的任务描述包含了数据查询目标、表格名、建议的筛选条件和字段选择：\n\n---\n\n${options.input}\n\n---\n\n请基于它执行查询 DSL 设计`,
            },
          ]
        : this.ctx.history || [],
    });

    const queryId = nanoid(10);
    this.ctx.memory?.set(queryId, result1.object);

    const sql = new DSLTranslator(result1.object.dsl_query, []).toSQL();

    let goal = '';
    try {
      goal = JSON.parse(options?.input || '{}').goal;
    } catch {
      // ignore
    }

    return {
      query_id: queryId,
      goal,
      hint: result1.object.hint,
      query: result1.object,
      sql,
    };
  }
```

**本例生成的 DSL：**

```json
{
  "dsl_query": {
    "from": "view-1h0aysm2v2aw6qm2b2q27",
    "select": [{ "column": "*", "aggr": "COUNT", "alias": "count" }],
    "where": [{ "column": "select_dd4c38eb", "operator": "eq", "value": "S" }],
    "groupBy": [],
    "orderBy": [],
    "limit": null
  },
  "hint": "统计项目等级为S的记录数量，使用COUNT聚合函数对全表记录计数并筛选项目等级等于S的记录"
}
```

DSL 会被存入 `ctx.memory`，返回 `query_id` 供下一步使用。

**DSL 支持的操作符与聚合函数：**

| 类别                  | 可选值                                                |
| --------------------- | ----------------------------------------------------- |
| 聚合函数 (aggr)       | `SUM`, `AVG`, `COUNT`, `COUNT_DISTINCT`, `MAX`, `MIN` |
| 比较操作符 (operator) | `eq`, `ne`, `gt`, `lt`, `gte`, `lte`, `in`, `like`    |
| 排序方向 (direction)  | `ASC`, `DESC`                                         |
| 扩展函数              | `DATE_FORMAT`（格式化时间戳）                         |

---

### 阶段 5：LLM 执行查询（query-data 工具）

`MainAgent` 调用 `query-data` 工具，传入 `query_id`、`hint`、`goal`。

```4:62:packages/server/src/tools/query-data.ts
export const queryDataToolFactory: IToolFactory = (ctx) => {
  return {
    name: 'query-data',
    description: `解析数据查询意图 DSL，并查询数据`,
    parameters: z.object({
      hint: z.string().describe('数据查询的提示（hint），由`handoff.query-design`工具生成'),
      goal: z.string().describe('数据查询任务的目标，由`handoff.query-design`工具提供'),
      query_id: z.string().describe('数据查询意图 DSL 的存储 ID，由`handoff.query-design`工具生成'),
    }),
    async execute(args, options) {
      console.log('query', JSON.stringify(args, null, 2));
      try {
        const mem = ctx.memory?.get(args.query_id);
        console.log('dsl from memory', mem);
        if (!mem) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Error: 不存在的查询 DSL，请重新设计' }],
          };
        }
        const result = await ctx.dataSvc?.executeQuery(mem?.dsl_query);
        ctx.memory?.set(`${args.query_id}.result`, result);
        return result;
      } catch (e) {
        // ...错误处理
      }
    },
  };
};
```

`executeQuery` 根据 `preset.query_executor`（`"kuaida"`）找到对应执行器：

```30:40:packages/server/src/data/service.ts
  async executeQuery(dsl: QUERY_CONFIG["dsl_query"], presetId?: string) {
    const preset = this.getPreset(presetId);
    const execute = executorRegistryManager.getExecutor(preset.query_executor);
    if (!execute) {
      throw new Error("无可用的数据查询执行器");
    }
    return execute(dsl, this.ctx);
  }
```

---

### 阶段 6：快搭执行器拉取数据 + 本地 SQL 查询

这是核心的数据获取逻辑，对应 `viewDataList.ts` 的接口。

#### 6.1 分页拉取全量数据

```15:30:packages/server/src/data/executors/kuaida/index.ts
export const getFormRecordsOfPage = async (
  ctx: any,
  page: number,
  pageSize: number
) => {
  const result = await formFetch(ctx).post<{
    page: { pageNo: number; totalCount: number };
    pageList: { id: string; fields: Record<string, any> }[];
  }>("/api/zeroconsole/view/data/list", {
    pageNo: page,
    pageSize,
    viewCode: ctx.view,
  });

  return result;
};
```

**`POST /api/zeroconsole/view/data/list` 请求入参：**

```json
{
  "conditionSet": null,
  "pageNo": 1,
  "pageSize": 100,
  "viewCode": "view-1h0aysm2v2aw6qm2b2q27"
}
```

**返回值结构（参考 viewDataList.ts）：**

```json
{
  "page": { "pageNo": 1, "totalCount": 20 },
  "pageList": [
    {
      "id": "0865fe6453504dc3984817d2898ea2c0",
      "fields": {
        "select_dd4c38eb": { "value": "select0ny2v3brm7s", "label": "A" },
        "date_264f174a": 1764604800000,
        "input_ba0c62d5": "应急救援体系",
        "people_b9e25f8f": { "id": "2009992", "name": "周胜", "mis": "zhousheng", ... },
        "select_2a4f18cd": { "value": "select033jicbf9o42", "label": "进行中" }
      },
      "submitter": { "id": "22642321", "name": "吴伟建", "mis": "wuweijian06", ... },
      "submitTime": 1753190968004,
      "updater": { ... },
      "updateTime": 1754390740266,
      "processes": null,
      "uid": "22642321"
    }
    // ... 更多记录
  ]
}
```

**全量拉取逻辑（带缓存）：**

```32:67:packages/server/src/data/executors/kuaida/index.ts
const getFormRecords = async (
  dsl: QUERY_CONFIG["dsl_query"],
  ctx: IRunContext
) => {
  const maxRecords = 100000; // temp
  const cacheKey = {
    view: ctx.view,
    maxRecords,
  };

  const cache = cacheManager.get(cacheKey);
  let results;
  if (typeof cache !== "undefined") {
    results = cache;
  } else {
    const pageSize = 100;
    const firstPageResult = await getFormRecordsOfPage(ctx, 1, pageSize);
    const maxPages = Math.ceil(
      Math.min(maxRecords, firstPageResult.page.totalCount) / pageSize
    );

    if (firstPageResult.page.totalCount > maxRecords) {
      throw new Error(
        `记录总数已超过${maxRecords}, 建议新建视图缩小数据范围再进行分析`
      );
    }

    results = [...firstPageResult.pageList];
    for (let i = 2; i <= maxPages; i++) {
      const result = await getFormRecordsOfPage(ctx, i, pageSize);
      results.push(...result.pageList);
      await sleep(10);
    }

    cacheManager.set(cacheKey, results);
  }
```

> 一次性拉取全量数据（上限 10 万条），缓存在内存中供后续所有查询复用。

#### 6.2 数据清洗（formatDataRow）

快搭返回的数据是对象嵌套结构，需要扁平化才能用于 SQL 查询。

```1:37:packages/server/src/data/executors/kuaida/formatter.ts
const formatters = [
  {
    reg: /^(people_|SYSTEM_CREATOR)/i,
    format: (item) => item?.name ?? "",
  },
  {
    reg: /^department_/i,
    format: (item) => item?.label ?? "",
  },
  {
    reg: /^select_/i,
    format: (item) => item?.label ?? "",
  },
  {
    reg: /^(selectdd|associatedrecord)_/i,
    format: (item) => (item || []).filter(Boolean).map((row) => row.label),
  },
];

export const formatDataRow = (row) => {
  const keys = Object.keys(row);
  const result: Record<string, any> = {};

  for (const key of keys) {
    const formatter = formatters.find((item) => item.reg.test(key));
    if (formatter) {
      result[key] = formatter.format(row[key]);
    } else {
      result[key] = row[key];
    }
  }

  return result;
};
```

**清洗前后对照：**

| 字段              | 清洗前（原始）                                              | 清洗后（扁平化）         |
| ----------------- | ----------------------------------------------------------- | ------------------------ |
| `select_dd4c38eb` | `{ "label": "S", "value": "select05yp5obzmo9m" }`           | `"S"`                    |
| `people_b9e25f8f` | `{ "id": "31597", "name": "彭岗", "mis": "penggang", ... }` | `"彭岗"`                 |
| `select_2a4f18cd` | `{ "label": "进行中", "value": "select033jicbf9o42" }`      | `"进行中"`               |
| `date_9e37d3a0`   | `1707062400000`                                             | `1707062400000`（不变）  |
| `input_ba0c62d5`  | `"国际交流合作"`                                            | `"国际交流合作"`（不变） |

> 这是 DSL 中 `WHERE select_dd4c38eb = 'S'` 能正确匹配的关键——数据被清洗成标量值 `"S"`。

#### 6.3 本地 SQL 引擎执行

```69:91:packages/server/src/data/executors/kuaida/index.ts
  const data = results.map((item) => ({
    id: item.id,
    ...item.fields,
    SYSTEM_CREATOR: item.submitter,
    SYSTEM_DATE_CREATED: item.submitTime,
  }));

  const { tables } = await ctx.dataSvc?.getDataSchema();
  const table = tables.find((item) => item.name === dsl.from);
  if (!table) {
    console.log(JSON.stringify(dsl));
    console.log(JSON.stringify(tables));
  }

  const queryEngine = new LocalQueryEngine(
    data.map(formatDataRow),
    table.columns
  );

  const queryResult = await queryEngine.query(dsl);

  return queryResult;
```

`LocalQueryEngine` 用 `DSLTranslator` 把 DSL 翻译成 SQL，再用 **alasql**（纯 JS 的内存 SQL 引擎）执行：

```55:86:packages/server/src/lib/query/engine.ts
export class LocalQueryEngine {
  private _data: Record<string, any>[];
  private _columns: IColumnSchema[];

  constructor(data: Record<string, any>[], columns: IColumnSchema[]) {
    this._data = data;
    this._columns = columns;
  }

  async query(dsl: QUERY_CONFIG["dsl_query"]) {
    const sqlGenerator = new DSLTranslator(
      {
        ...dsl,
        from: "?",
      },
      this._columns
    );
    const sql = sqlGenerator.toSQL();
    console.log(`sql -> ${sql}`);
    const result = await alasql(sql, [this._data]);

    return result;
  }
}
```

**DSL → SQL 翻译（DSLTranslator）：**

```14:26:packages/server/src/lib/query/dsl-to-sql.ts
  toSQL(): string {
    const select = this.buildSelect();
    const from = `FROM ${this.escapeId(this.query.from)}`;
    const where = this.buildWhere();
    const groupBy = this.buildGroupBy();
    const orderBy = this.buildOrderBy();
    const limit = this.buildLimit();

    return [select, from, where, groupBy, orderBy, limit]
      .filter(Boolean)
      .join(" ")
      .trim();
  }
```

对于本例，生成的 SQL 为：

```sql
SELECT COUNT(*) AS `count` FROM ? WHERE `select_dd4c38eb` = 'S'
```

> 注意 `from` 被替换为 `?`，alasql 的第二个参数 `[this._data]` 作为占位符数据源传入。

**在 `viewDataList.ts` 的 20 条数据中执行结果：**

`select_dd4c38eb.label === 'S'` 的记录有 4 条：

| id            | 项目名称     | 项目经理 |
| ------------- | ------------ | -------- |
| `9c4d6d4a...` | 国际交流合作 | 彭岗     |
| `e5bebad2...` | 智慧城市规划 | 郭琳     |
| `b0d12790...` | 智慧水务管理 | 杨梅     |
| `8648330d...` | 灾害预警平台 | 周帅     |

查询返回：

```json
[{ "count": 4 }]
```

---

### 阶段 7：LLM 总结与输出

`MainAgent` 拿到 `query-data` 返回的 `[{ count: 4 }]` 后：

1. **评估结果**：确认 `count: 4` 满足"统计项目等级为 S 的记录数量"目标
2. **可选可视化**：如果用户要求图表，调用 `generate-chart` 生成 ECharts 图表
3. **文字总结**：以 Markdown 流式输出给用户

**最终回复（示意）：**

> 根据查询结果，该视图下项目等级为 S 的数据共有 **4 条**。
>
> 这些项目分别是：国际交流合作（彭岗）、智慧城市规划（郭琳）、智慧水务管理（杨梅）、灾害预警平台（周帅）。

最终通过 `result.toDataStreamResponse()` 以 AI SDK 的 Data Stream 协议返回前端。

---

## 五、关键数据结构对照表

### IRunContext（运行上下文）

```1:18:packages/server/src/types/context.ts
export interface IRunContext {
  cookie: string;
  view: string;
  env: string;
  origin: string;
  history?: CoreMessage[];
  memory?: SessionMemory;
  s3?: MemoryS3;
  dataSvc?: NL2SQLDataService;
  presetId?: string;
  presetOptions?: Record<string, any>;
  sessionId?: string;
}
```

### IDataAnalysisPreset（数据预设）

```4:11:packages/server/src/data/types/index.ts
export interface IDataAnalysisPreset {
  id: string;
  description?: string;
  prompt?: string;
  database_schema: (ctx: IRunContext) => Promise<IDatabaseSchema>;
  query_executor: string;
}
```

### IColumnSchema（列结构）

```26:34:packages/server/src/data/types/index.ts
export interface IColumnSchema {
  name: string;
  type: string;
  description: string;
  role: "dimension" | "metric";
}
```

### 已注册的预设与执行器

| 预设 ID     | 预设文件                     | 执行器 ID   | 执行器文件                     | 数据来源                         |
| ----------- | ---------------------------- | ----------- | ------------------------------ | -------------------------------- |
| `mock`      | `presets/mock/index.ts`      | `mock`      | `executors/mock/index.ts`      | 本地模拟销售数据（200条）        |
| `kuaida`    | `presets/kuaida/index.ts`    | `kuaida`    | `executors/kuaida/index.ts`    | 快搭视图（showInfo + data/list） |
| `xtable-v2` | `presets/xtable-v2/index.ts` | `xtable-v2` | `executors/xtable-v2/index.ts` | 多维表格                         |
| `file`      | `presets/file/index.ts`      | `file`      | `executors/file/index.ts`      | 上传的文件                       |

---

## 六、关键设计要点总结

### 1. 两个快搭接口

| 接口                                     | 方法 | 用途                                       | 参考文件          |
| ---------------------------------------- | ---- | ------------------------------------------ | ----------------- |
| `/api/zeroconsole/view/showInfo/${view}` | GET  | 获取视图表单结构（字段定义、类型、枚举值） | `viewData.ts`     |
| `/api/zeroconsole/view/data/list`        | POST | 分页获取视图数据记录                       | `viewDataList.ts` |

### 2. Schema 驱动

表结构是**动态从快搭接口获取**的，LLM 根据字段 ID 前缀（`select_`、`people_`、`date_` 等）理解字段类型和枚举值，从而生成正确的 DSL。不需要硬编码表结构。

### 3. 数据清洗层

快搭返回的数据是嵌套对象（如 `{ label, value }`），`formatDataRow` 会将其扁平化为 SQL 可比较的标量值（如 `"S"`）。**这是 DSL 中 `where` 能正确匹配的关键**。

### 4. 本地内存查询引擎

不依赖快搭的服务端聚合能力，而是把全量数据拉到内存用 alasql 执行 SQL，因此有 **10 万条的限制**（`maxRecords`）。好处是所有 SQL 能力（聚合、分组、排序、过滤）都在本地完成，无需快搭支持。

### 5. 两层缓存

| 缓存对象 | 位置                                          | TTL     |
| -------- | --------------------------------------------- | ------- |
| 表结构   | `presets/kuaida/index.ts` 的 `cacheManager`   | 10 分钟 |
| 数据记录 | `executors/kuaida/index.ts` 的 `cacheManager` | 1 小时  |

### 6. 多预设支持

通过 `presetId` 切换数据源（`mock`/`kuaida`/`xtable-v2`/`file`），每个预设提供自己的 `database_schema` 和 `query_executor`，系统通过注册表模式管理。

### 7. 多 Agent 协作

采用 handoff 模式，子 Agent（QueryPlanningAgent、QueryDesignAgent、HtmlReportGenerateAgent）作为工具暴露给主 Agent，由 LLM 自主调度。优点：

- 自主选择上下文，降低模型干扰
- 降低 token 限制问题
- 各 Agent 可独立设置指令，指令遵循更好

### 8. DSL 中间层

设计固定的 JSON 风格 DSL 作为 NL2SQL 的中间表示，而非直接生成 SQL。好处：

- 可校验（zod schema）
- 可跨数据源复用（同一 DSL 可翻译为 SQL 或其他查询语言）
- 避免 LLM 直接生成 SQL 的注入风险和语法错误

---

## 七、常见问题排查

### 1. 返回 SSO 登录页错误

**错误信息**：`快搭接口返回SSO登录页，请检查Cookie是否有效`

**原因**：Cookie 过期或未传

**解决**：

- 线上：确保前端请求携带有效 `Cookie` 头
- 本地开发：在 `packages/server/.env` 中配置 `KUAIDA_COOKIE`

### 2. 走了 Mock 数据而非快搭数据

**现象**：查询结果是销售订单数据，而非快搭视图数据

**原因**：`presetId` 默认为 `'mock'`

**解决**：前端请求头添加 `X-DATA-PRESET: kuaida`

### 3. 记录总数超过限制

**错误信息**：`记录总数已超过100000, 建议新建视图缩小数据范围再进行分析`

**原因**：单视图数据量超过 10 万条

**解决**：在快搭中新建一个筛选后的视图，缩小数据范围

### 4. 查询字段不匹配

**现象**：SQL 执行结果为 0 条，但实际应有数据

**原因**：可能是数据清洗未正确提取 label，或 DSL 中 value 值与清洗后的数据不一致

**排查**：查看 `formatDataRow` 的清洗规则，确认 `select_` 字段取的是 `label` 而非 `value`

### 5. 表结构未找到

**现象**：`数据查询失败，表<xxx>不存在`

**原因**：DSL 中的 `from` 字段值与 `ctx.view` 不一致

**排查**：确认 `QueryDesignAgent` 生成的 DSL 中 `from` 使用的是视图 ID（`ctx.view`）
