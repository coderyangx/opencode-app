# NL2SQL 完整链路流转

> 以查询 **"帮我查询下项目等级是A的数量"** 为例，追踪从用户输入到结果返回的完整执行链路。

---

## 一、整体架构

```
用户输入
  │
  ▼
┌─────────────────────────────────┐
│  AnalysisReActAgent (V3)           │  ← LLM 理解意图，决定调用 query-data 工具
│  或 Planning → Analysis (V2)       │
└──────────────┬──────────────────┘
                │ 构造工具参数
                ▼
┌─────────────────────────────────┐
│  query-data 工具                   │
│  (nlDataQueryToolFactory)          │
│                                    │
│  ┌───────────────────────────┐  │
│  │ nlDataQuery()                │  │  ← 阶段1: LLM 生成 SQL
│  │  getDataSchema()             │  │
│  │  generateObject(GPT-4.1)     │  │
│  │  → { table, sql, columns }   │  │
│  └───────────┬───────────────┘   │
│               │                    │
│  ┌───────────▼───────────────┐   │
│  │ execute()                    │  │  ← 阶段2: 执行查询
│  │  dataSvc.executeQuery(       │  │
│  │    { sql, from: table })     │  │
│  │  )                           │  │
│  └───────────┬───────────────┘  │
└──────────────┼──────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  NL2SQLDataService                 │  ← 阶段3: 路由到执行器
│  → presetManager.getPreset()       │
│  → executorRegistry.getExecutor    │
└──────────────┬──────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  快搭执行器 (kuaida executor)       │  ← 阶段4: 拉数据 + 格式化 + 查询
│                                    │
│  ① 分页拉取 API 全量数据 (缓存1h)   │
│  ② formatDataRow() 对象拍平        │
│  ③ LocalQueryEngine.query()       │
│     └─ alasql 内存执行              │
└──────────────┬──────────────────┘
                │
                ▼
         返回 [{ count: N }]
                │
                ▼
┌─────────────────────────────────┐
│  Agent 总结 → 流式输出给用户         │  ← 阶段5: 结果呈现
└─────────────────────────────────┘
```

---

## 二、分阶段详解

### 阶段 0：入口路由

用户消息进入 Agent 层。简单取数走 **V3 AnalysisReActAgent**，复杂分析走 **V2 Planning → Analysis** 流水线。

Agent 拿到 dbSchema（表结构 JSON），LLM 理解用户意图后，决定调用 `query-data` 工具，并构造如下参数：

| 参数                             | 值                                                         |
| -------------------------------- | ---------------------------------------------------------- |
| `task_description`               | 统计项目等级为A的记录数量                                  |
| `query_logic`                    | 对项目等级字段进行 COUNT 聚合，WHERE 条件为 项目等级 = 'A' |
| `required_tables_and_fields`     | `["select_dd4c38eb"]`                                      |
| `overall_constraints_or_filters` | 筛选条件：项目等级 = A                                     |
| `expected_query_output`          | `raw_data`                                                 |

---

### 阶段 1：LLM 生成 SQL

**文件**: `packages/server/src/tools/v2/nl-query-data.ts`

工具的 `execute` 方法调用 `nlDataQuery()` 函数，该函数完成两件事：

#### 1.1 获取表结构

```typescript
const tableInfo = await ctx.dataSvc?.getDataSchema();
```

返回的 schema 结构示例（快搭视图 `view-xxx`）：

```json
{
  "tables": [
    {
      "name": "kuaida_projects",
      "description": "项目信息管理_仿CLC",
      "columns": [
        {
          "name": "select_dd4c38eb",
          "type": "ENUM",
          "description": "项目等级",
          "role": "dimension",
          "enum_values": ["S", "A", "B", "C"]
        },
        {
          "name": "input_ba0c62d5",
          "type": "VARCHAR",
          "description": "项目名称",
          "role": "dimension"
        },
        {
          "name": "people_b9e25f8f",
          "type": "VARCHAR",
          "description": "项目负责人",
          "role": "dimension"
        },
        {
          "name": "SYSTEM_CREATOR",
          "type": "VARCHAR",
          "description": "创建人",
          "role": "dimension"
        }
      ]
    }
  ]
}
```

> LLM 通过 `description: "项目等级"` + `enum_values: ["S","A","B","C"]` 将自然语言"项目等级是A"映射到 `select_dd4c38eb = 'A'`。这就是 **Schema Linking** 的核心。

#### 1.2 调用 generateObject 生成 SQL

```typescript
const { object } = await generateObject({
  model: getModel('gpt-4.1'),
  system, // MySQL 专家角色 + 表结构 + 约束（无JOIN/WITH/STDDEV）
  schema: z.object({
    table: z.string(), // 表 ID
    sql: z.string(), // SQL 语句
    result_columns: z.array(z.string()), // 结果列名
    error: z.string().nullable()
  }),
  temperature: 0.2,
  prompt // 任务描述 + query_logic + 字段列表 + 约束
});
```

**System Prompt 关键约束**:

- 禁止 JOIN、WITH 子句、标准差函数
- 所有列名/表名用反引号转义
- SQL 必须单行输出
- 时间戳字段以毫秒为单位

**LLM 输出**:

```json
{
  "table": "kuaida_projects",
  "sql": "SELECT COUNT(*) AS `count` FROM `kuaida_projects` WHERE `select_dd4c38eb` = 'A'",
  "result_columns": ["项目等级为A的数量"],
  "error": null
}
```

---

### 阶段 2：传递参数给执行器

**文件**: `packages/server/src/tools/v2/nl-query-data.ts`

`execute` 方法拿到 LLM 生成的 SQL 后，调用数据服务：

```typescript
const result = await ctx.dataSvc?.executeQuery({
  sql, // "SELECT COUNT(*) AS `count` FROM `kuaida_projects` WHERE `select_dd4c38eb` = 'A'"
  from: table // "kuaida_projects"
} as any); // ⚠️ as any 绕过类型检查
```

> 传入的是 `{ sql, from }` 而非 DSL 格式 `{ select, where, groupBy, ... }`。

---

### 阶段 3：数据服务路由到执行器

**文件**: `packages/server/src/data/service.ts`

```typescript
async executeQuery(dsl, presetId) {
  const preset = this.getPreset(presetId);          // 取 preset 配置
  const execute = executorRegistryManager.getExecutor(preset.query_executor); // 取执行器
  return execute(dsl, this.ctx);                    // 调用执行器
}
```

路由逻辑：

```
presetId = "kuaida"
  → presetManager.getPreset("kuaida")
  → preset.query_executor = "kuaida"
  → executorRegistryManager.getExecutor("kuaida")
  → 快搭执行器函数
```

---

### 阶段 4：快搭执行器 — 拉数据 + 格式化 + 查询

**文件**: `packages/server/src/data/executors/kuaida/index.ts`

执行器做三件事：

#### 4.1 分页拉取全量表单记录（带缓存）

```typescript
// 缓存 key = { view, maxRecords }
// 缓存 TTL = 1 小时
const firstPageResult = await getFormRecordsOfPage(ctx, 1, 100);
// → POST /api/zeroconsole/view/data/list { pageNo, pageSize, viewCode }

const maxPages = Math.ceil(totalCount / 100);
for (let i = 2; i <= maxPages; i++) {
  results.push(...(await getFormRecordsOfPage(ctx, i, 100)).pageList);
}
```

> 上限 100,000 条，超过则报错提示"建议新建视图缩小数据范围"。

#### 4.2 数据格式化 — 嵌套对象拍平

**文件**: `packages/server/src/data/executors/kuaida/formatter.ts`

原始数据是嵌套结构，需要拍平才能用 SQL 查询：

| 字段前缀      | 原始格式                                     | 格式化后                 | 说明          |
| ------------- | -------------------------------------------- | ------------------------ | ------------- |
| `select_`     | `{ label: 'A', value: 'select0ny2v3brm7s' }` | `'A'`                    | 提取 `.label` |
| `people_`     | `{ name: '周胜', mis: 'zhousheng', ... }`    | `'周胜'`                 | 提取 `.name`  |
| `department_` | `{ label: 'xxx', ... }`                      | `'xxx'`                  | 提取 `.label` |
| `date_`       | `1717084800000`                              | `1717084800000`          | 不变          |
| `input_`      | `'整合企业资源管理系统'`                     | `'整合企业资源管理系统'` | 不变          |

```typescript
const data = results.map((item) => ({
  id: item.id,
  ...item.fields, // 展开字段
  SYSTEM_CREATOR: item.submitter, // 系统字段
  SYSTEM_DATE_CREATED: item.submitTime
}));

const queryEngine = new LocalQueryEngine(data.map(formatDataRow), table.columns);
```

> 格式化后 `select_dd4c38eb` 的值从对象 `{ label: 'A' }` 变为字符串 `'A'`，SQL 的 `WHERE select_dd4c38eb = 'A'` 才能匹配。

#### 4.3 交给 LocalQueryEngine 执行

**文件**: `packages/server/src/lib/query/engine.ts`

```typescript
async query(dsl) {
  const sqlGenerator = new DSLTranslator({ ...dsl, from: '?' }, this._columns);
  const sql = sqlGenerator.toSQL();
  // 生成: SELECT COUNT(*) AS `count` FROM ? WHERE `select_dd4c38eb` = 'A'
  const result = await alasql(sql, [this._data]);
  return result;
}
```

- `alasql` 是纯 JavaScript 的内存 SQL 引擎
- `from: '?'` 是 alasql 占位符，`this._data`（格式化后的数组）作为参数注入
- 最终执行 `SELECT COUNT(*) AS count FROM ? WHERE select_dd4c38eb = 'A'`
- 返回 `[{ count: N }]`

---

### 阶段 5：结果返回与呈现

```
executeQuery 返回 [{ count: 3 }]
       │
       ▼
query-data 工具 execute() 返回 result
       │
       ▼
AnalysisReActAgent 收到工具返回值
       │
       ├─ LLM 评估结果是否满足目标 ✓
       └─ 生成自然语言总结: "项目等级为A的数据共有3条"
       │
       ▼
streamText → Data Stream 协议 → SSE → 前端渲染
```

如果 `expected_query_output` 为 `dataset_id`，结果还会写入内存缓存和 S3，返回数据集 ID 供后续分析任务引用。

---

## 三、核心数据流转一览

```
用户: "帮我查询下项目等级是A的数量"
  │
  │  [Agent] 构造工具参数
  ▼
{ task_description, query_logic, required_tables_and_fields, ... }
  │
  │  [nlDataQuery] getDataSchema() + generateObject(GPT-4.1)
  ▼
{ table: "kuaida_projects", sql: "SELECT COUNT(*) ... WHERE select_dd4c38eb='A'", result_columns }
  │
  │  [execute] dataSvc.executeQuery({ sql, from })
  ▼
{ sql: "SELECT COUNT(*) ...", from: "kuaida_projects" }
  │
  │  [快搭执行器] API 分页拉数据 + formatDataRow 拍平
  ▼
[{ id, select_dd4c38eb: 'A', input_ba0c62d5: '...', ... }, ...]  ← 格式化后的行数据
  │
  │  [LocalQueryEngine] DSLTranslator → alasql 内存执行
  ▼
[{ count: 3 }]
  │
  │  [Agent] LLM 总结
  ▼
"项目等级为A的数据共有3条" → SSE 流式输出给用户
```

---

## 四、关键设计决策与注意事项

### 4.1 为什么用 alasql 而非直连数据库？

快搭视图的数据通过 REST API 返回（非标准 SQL 数据库），无法直连 MySQL。方案是：**拉全量数据到内存 → 用 alasql 在内存中执行 SQL**。

- 优点：无需数据库连接，支持任意 SQL 语法
- 缺点：数据量受内存限制（上限 10 万条），不适合超大数据集

### 4.2 Schema Linking 如何工作？

LLM 通过表结构 JSON 中的 `description` 和 `enum_values` 字段进行语义映射：

```
自然语言 "项目等级是A"
  ↓ 匹配 description: "项目等级"
字段名 select_dd4c38eb
  ↓ 匹配 enum_values: ["S","A","B","C"]
条件值 'A'
```

### 4.3 数据格式化为什么重要？

快搭表单的字段值是对象（如 `{ label: 'A', value: 'xxx' }`），不是简单标量。如果直接用原始数据，SQL `WHERE select_dd4c38eb = 'A'` 无法匹配对象。`formatDataRow` 把对象拍平为标量，是 SQL 能正确执行的**必要前置步骤**。

### 4.4 缓存策略

| 缓存对象         | Key                    | TTL     | 位置                     |
| ---------------- | ---------------------- | ------- | ------------------------ |
| 表单记录全量数据 | `{ view, maxRecords }` | 1 小时  | ToolCacheManager（内存） |
| 表结构 schema    | `{ view }`             | 10 分钟 | ToolCacheManager（内存） |

---

## 五、涉及的文件清单

| 文件                                       | 职责                                     |
| ------------------------------------------ | ---------------------------------------- |
| `tools/v2/nl-query-data.ts`                | NL2SQL 工具：LLM 生成 SQL + 调用执行     |
| `data/service.ts`                          | 数据服务：路由到执行器                   |
| `data/manager/preset.ts`                   | Preset 管理器：注册/获取数据源配置       |
| `data/manager/executor.ts`                 | 执行器注册表：策略模式管理多种执行器     |
| `data/presets/kuaida/index.ts`             | 快搭 preset：schema 获取 + 执行器配置    |
| `data/executors/kuaida/index.ts`           | 快搭执行器：API 拉数据 + 格式化 + 查询   |
| `data/executors/kuaida/formatter.ts`       | 数据格式化：嵌套对象拍平                 |
| `lib/query/engine.ts`                      | 内存查询引擎：DSLTranslator + alasql     |
| `lib/query/dsl-to-sql.ts`                  | DSL → SQL 翻译器（Builder 模式）         |
| `lib/query/dsl-schema.ts`                  | DSL Zod schema 定义                      |
| `data/types/index.ts`                      | 类型定义：Preset / Schema / Executor     |
| `agents/v2/analysis.ts`                    | V2 Analysis Agent：组装工具 + streamText |
| `agents/v3/agents/analysis-react/index.ts` | V3 ReAct Agent：简单取数路由             |
