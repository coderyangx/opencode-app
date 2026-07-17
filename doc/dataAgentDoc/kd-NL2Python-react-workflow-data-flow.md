# kuaida「查询项目等级为 A 的数量」完整数据流转（**NL2Python**）

// 会话
threadId; // 会话唯一标识
messageId; // 当前消息标识
traceId; // 链路追踪 ID
assert_key; // 视图id，view-xxx

threadId 是数据分析会话的唯一标识，它将沙箱实例、S3 存储路径、文件系统命名空间、Artifact 管理器全部绑定到同一个会话上，实现了「同一对话内状态复用 + 不同对话间数据隔离」

```ts
用户发起新对话
  │
  │  HTTP 入口生成 threadId（如 "conv-abc123"）
  ▼
runtimeContext.threadId = "conv-abc123"
  │
  ├──→ createSandbox()
  │      ├── sessionSandboxCacheKey = "conv-abc123"
  │      ├── S3 挂载: agent-artifacts/conv-abc123 → /home/user/bucket
  │      └── 沙箱内目录: /tmp/conv-abc123/
  │
  ├──→ ArtifactManager.fromSession("conv-abc123")
  │      └── 产物存储作用域 = conv-abc123
  │
  ├──→ prepareDataStep
  │      └── 数据落盘: /tmp/conv-abc123/{asset_key}.xlsx
  │
  ├──→ ReAct 循环（多轮）
  │      ├── 第1轮: read_dataset("view-xxx") → 读 /tmp/conv-abc123/view-xxx.xlsx
  │      ├── 第2轮: read_dataset("view-xxx") → 同一文件（沙箱复用）
  │      └── log_dataset_artifact → 保存到 /tmp/conv-abc123/{新asset_key}.xlsx
  │
  └──→ 文件服务
         └── /analysis-agent/file/conv-abc123/generated_files/chart.png
              → 从 S3 的 agent-artifacts/conv-abc123/ 读取并返回
```

## 0 数据获取和流转

```
原始数据（kuaida 视图记录）
  ↓ prepareDataStep 拉取 + 格式化
DatasetArtifact（AoA + metadata）
  ↓ 存入沙箱文件 + describe() 渲染
  ├─ 沙箱文件（.xlsx/.csv）→ Python read_dataset() 读取
  └─ 文本描述（profile + sample）→ 拼入 LLM prompt
```

1. 数据获取：获取视图结构（schema）
   发生在两个地方：tableChatAgent.instructions 和 prepareDataStep，都调用 getDataSchema：
   ```
   NL2SQLDataService.getDataSchema()
    → #getAllDatasources()
      tenant=kuaida + config.view 存在
      → datasources = [{ type: "kuaida", kuaida: { appId, view } }]
    → kuaidaPreset.getSchema(ctx, { datasource })
      → 两条路径：
        ① 有 APP_SECRET 无 SSO_ID → openFormFetch（开放接口）
            POST /open-apis/kuaida/view/detailByApp { viewCode }
            （用 AuthSDK 换 token，Bearer 认证）
        ② 否则 → formFetch（SSO Cookie 认证）
            GET /api/zeroconsole/view/showInfo/{view}
      → 返回 { name, schema, showFields }
      → JSON.parse(schema) 得到视图布局树
      → walk(layout) 递归遍历字段，按 id 前缀映射：
          select_  → string + enum_values（"项目等级"列的枚举值 A/B/C...）
          number_  → number
          date_    → timestamp
          people_  → user
          ...
      → 补上 SYSTEM_FIELDS（SYSTEM_CREATOR / SYSTEM_DATE_CREATED）
      → 按 showFields 过滤出视图实际展示的列
      → 返回 { tables: [{ name: viewCode, columns: [...], _source_info }] }
      → 10 分钟缓存（cacheManager）
   ```
2. 获取全量数据记录（rows）
   发生在 prepareDataStep.getTableData：
   ```
   dataSvc.getTableData(table)
    → kuaidaPreset.getData(table, ctx)
      → getFormRecords(ctx, columnNames)
        ① 分页拉取（每页 100 条）：
            POST /api/zeroconsole/view/data/list { pageNo, pageSize, viewCode }
            或 POST /open-apis/kuaida/view/listByApp
        ② 第一页拿到 totalCount：
            - totalCount > 100000 → 抛错"建议新建视图缩小数据范围"
            - 否则 maxPages = ceil(totalCount / 100)
        ③ 串行拉取剩余页（每页间 sleep 50ms 防限流）
        ④ 10 分钟缓存
        ⑤ 每行用 formatDataRow 格式化：
            - 字段值按列类型转换
            - 补 SYSTEM_CREATOR = submitter, SYSTEM_DATE_CREATED = submitTime
        ⑥ 返回 { rows: AoA, total, cacheHit }
   ```
3. 构建 DatasetArtifact
   ```
    data = [headers, ...rows]   // AoA，第一行是表头
    artifactManager.addArtifact({
      type: "dataset/json",
      asset_key: viewCode,        // 后续 read_dataset(asset_key) 的 key
      metadata: {
        rawSchema: table,          // 原始表结构（列名/类型/枚举值/描述）
        columns: headers,
        rowsCount: size,
        sampleData: 前几行预览,
        profile: "",               // 待 Python 画像填充
        rules: table.rules,
      },
      data,
      scope: "workflow",
    })
   ```
4. Python 数据画像（profile）
   在沙箱里跑 `generate_dataframe_profile` 生成列的统计信息（数据类型、缺失率、唯一值数、低基数列枚举值分布等），回填到 `artifact.metadata.profile`：
   ```
   getDatasetProfileByPython(artifact, ctx)
    → 沙箱内拉取数据 → generate_dataframe_profile(df)
    → 返回 markdown 表格格式的 profile 文本
    → artifact.update({ metadata: { profile } })
   ```
5. 数据注入沙箱：注入沙箱 → Python read_dataset()
   这是 LLM 生成的 Python 代码能读到数据的关键。链路是：
   ```
   prepareDataStep 或 getDatasetProfileByPython
    → 在沙箱内把 AoA 写成文件：
      /tmp/{threadId}/{asset_key}.xlsx   （或 .csv）
    → （S3 挂载目录 /home/user/bucket/{threadId}/generated_files/ 用于持久化产物）
   ```
   沙箱创建时会挂载 S3 bucket（agent-artifacts/{threadId}）到 /home/user/bucket：
   ```
   createSandbox()
    → Sandbox.create("python-interpreter", { apiKey: SANDBOX_KEY })
    → s3fs 挂载 agent-artifacts/{threadId} → /home/user/bucket
    → mkdir -p /home/user/bucket/generated_files
    → 会话级缓存（同 threadId 复用同一 sandbox）
   ```
   然后 CODE_TEMPLATE_FACTORY_PURE 在 AI 代码前面注入了 read_dataset 函数：
   ```py
   def read_dataset(asset_key: str) -> pd.DataFrame:
    base_path = f"/tmp/{threadId}/{asset_key}"
    csv_path = f"{base_path}.csv"
    xlsx_path = f"{base_path}.xlsx"
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path, encoding="utf-8", engine="pyarrow")
    if os.path.exists(xlsx_path):
        return pd.read_excel(xlsx_path, engine="calamine")
    raise KeyError(f"数据集文件{asset_key}.xlsx不存在")
   ```
   所以 LLM 写的代码 df = read_dataset("<viewCode>") 就能直接拿到 DataFrame。整个数据注入沙箱的机制是"写文件 + 注入 read_dataset 函数"。
   同时注入的还有辅助函数：
   log_dataset_artifact(df, asset_key, description)：保存中间数据集到 xlsx + S3，并打印 [ARTIFACT_INFO] 清单供程序解析
   log_plot_artifact(plt, title, description, asset_key)：保存图表到 S3，打印图片链接
6. 完整数据流图
   ```ts
   kuaida 视图
    │
    │ ① getSchema: GET /showInfo/{view}
    ▼
   ITableSchema { columns: [select_xxx: 项目等级, ...] }
    │
    │ ② getTableData: POST /view/data/list（分页）
    ▼
   AoA: [[headers], [row1], [row2], ...]
    │
    │ ③ addArtifact + getDatasetProfileByPython
    ▼
   DatasetArtifact {
    data: AoA,
    metadata: { rawSchema, columns, rowsCount, sampleData, profile }
   }
    │
    ├──→ 沙箱文件: /tmp/{threadId}/{asset_key}.xlsx
    │      ↓
    │    read_dataset(asset_key) → DataFrame  ← LLM 生成的 Python 代码调用
    │
    └──→ describe() → 文本描述
          ↓
        拼入 LLM prompt（instructions 的"原始数据集" + loopStep 的"相关数据集"）
          ↓
        analysisReActPlannerAgent.generate(prompt)
          ↓
        output.python_code → run_code → 沙箱执行
          ↓
        stdout → parseArtifactsFromStdout → 新 Artifact
          ↓
        下一轮 describe() 注入 ← 闭环
   ```
