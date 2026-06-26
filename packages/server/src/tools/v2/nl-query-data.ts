import { generateObject } from "ai";
import type { IToolFactory } from "../../types/tool.js";
import { z } from "zod";
import { IRunContext } from "../../types/context.js";
// import { v4 as uuidV4 } from "uuid";
import { nanoid as uuidV4 } from "nanoid";
import { getModel } from "../../lib/ai/model-provider.js";
import { getSharedMetadata } from "../../agents/metadata.js";
import { getSystemInfo } from "../../agents/systemInfo.js";

const parametersSchema = z.object({
  goal_id: z.string().describe("当前洞察目标的唯一标识符"),
  goal_description: z.string().describe("当前洞察目标描述"),
  task_id: z.string().describe("当前任务的唯一标识符"),
  task_description: z.string().describe("当前任务的具体、无歧义的描述"),
  query_logic: z.string().describe("实现该任务所需的核心 SQL 逻辑的文字描述"),
  required_tables_and_fields: z
    .array(z.string())
    .describe("执行此任务所必需的表和字段列表"),
  overall_constraints_or_filters: z
    .string()
    .describe(
      "适用于此查询任务的宏观时间范围、筛选条件、分组条件或返回记录数限制"
    ),
  expected_query_output: z
    .enum(["raw_data", "dataset_id"])
    .describe("查询任务完成后，预期的结果返回形式"),
});

const nlDataQuery = async (
  args: z.infer<typeof parametersSchema>,
  ctx: IRunContext
) => {
  console.log("dsl design", JSON.stringify(args, null, 2));

  const tableInfo = await ctx.dataSvc?.getDataSchema();
  const system = `-----

## **角色和目标**

你是一个高度专业的 MySQL 数据库专家，你的任务是根据用户的自然语言需求，精确地将查询目标转换为一个标准的 SQL 语句。你必须严格遵守通用的 SQL 语法，同时深知以下功能是明确不支持的：

- **JOIN 连表查询**
- **WITH子句**
- **STDDEV_POP、STDDEV_SAMP 或任何其他标准差函数**

-----

## **系统信息**

${getSystemInfo(ctx)}

-----

## **数据源信息**

**数据库表结构信息:**

\`\`\`json
${JSON.stringify(tableInfo, null, 2)}
\`\`\`

**注意**:
  - 数据库中所有时间戳（timestamp）字段均以毫秒为单位

**数据查询特殊语法:**
  - **DATEDIFF**函数：API 格式为 DATEDIFF(unit, date1, date2)，其中 unit 参数支持 year、month、day、hour、minute，且该参数不能使用引号或反引号包裹

-----

## **输出格式要求**

  - **所有列名、表名以及列的别名都必须用 MySQL 的反引号（\`）进行转义**
  - **SQL 必须以单行文本形式输出**
  - **当处理时间戳（timestamp）或日期（date）字段的比较时，务必使用日期字符串作为比较值。**
  - **请避免在 GROUP BY、WHERE、HAVING 中使用 SELECT 定义的别名，而是直接重复相应的表达式。**
  - 如果由于数据库局限性或 Schema 不匹配导致无法生成有效的 SQL，请输出一个明确的错误信息，说明原因。
  - **窗口函数（如 SUM(...) OVER (...)）不能直接嵌套聚合函数（如 COUNT(*)）**。如果需要使用，请先在子查询中计算聚合结果，然后在外部查询中使用窗口函数
  - **对于 LIMIT 子句，你只能使用硬编码的数字**，不要生成任何包含数学运算、子查询或变量的 LIMIT 子句

-----

## **约束与最佳实践**

  - **主动判断并合理使用数据去重逻辑**（如 \`COUNT_DISTINCT\`、\`GROUP BY\`），确保结果唯一性和准确性。
  - **合理选择聚合函数**（如 \`COUNT()\`、\`COUNT(DISTINCT )\`、\`SUM()\`、\`AVG()\`、\`MAX()\`、\`MIN()\`），满足统计与汇总需求。
  - **精确选择所需字段**，避免冗余数据。
  - **优先考虑查询性能**，选择高效的查询方式。
  - **严格遵循 SQL 标准与最佳实践**，例如：
      - \`GROUP BY\` 字段需出现在 \`SELECT\` 或聚合中。
      - \`WHERE\` 字段必须出现在 \`SELECT\`、\`GROUP BY\` 或聚合字段中。

-----

**请严格按照上述流程与格式进行输出。** 若遇到无法确定的情况，优先保证 JSON 结构正确、字段齐全、类型准确。
`;

  // /no_think
  const prompt = `请基于下面的任务信息执行查询 SQL 设计：

---
1. **整体洞察目标**：${args.goal_description}

2. **当前查询目标和逻辑**：${args.task_description}, ${args.query_logic}
   * 你必须将这个目标精确地转换为 SQL

3.  **当前查询任务相关数据库表和列**: ${JSON.stringify(
    args.required_tables_and_fields
  )}
    * 你的查询 SQL 必须优先使用这些列。如果你认为为了达成目标需要使用不在列表中的列，请确保该列存在于“完整的数据库表结构信息”中且是必需的。

4.  **整体任务约束与过滤条件**: ${JSON.stringify(
    args.overall_constraints_or_filters
  )}
---
`;

  const { object } = await generateObject({
    model: getModel("gpt-4.1"), // LongCat-Large-32K-Chat-0626 qwen3-235b-a22b-meituan
    system,
    schema: z.object({
      table: z
        .string()
        .describe("本次查询的表 ID，和 SQL 中的 FROM 的表名一致"),
      sql: z.string().describe("数据查询的 SQL 语句"),
      result_columns: z
        .array(z.string())
        .describe(
          "查询结果的列名列表，请结合数据表结构信息填充有业务含义的名称"
        ),
      error: z
        .string()
        .nullable()
        .describe("如果无法生成有效的 SQL，请输出一个明确的错误信息"),
    }),
    temperature: 0.2,
    prompt,
    experimental_telemetry: {
      isEnabled: true,
      metadata: getSharedMetadata(ctx),
      // tracer: getTracer(ctx),
    },
  });

  console.log("object is", JSON.stringify(object));

  return object;
};

export const nlDataQueryToolFactory: IToolFactory = (ctx) => {
  return {
    name: "query-data",
    description: `接收自然语言表达的具体的数据查询目标，设计数据查询 SQL 并执行数据查询`,
    parameters: parametersSchema,
    async execute(args: z.infer<typeof parametersSchema>, options) {
      let sql;
      let table;
      let columns;
      try {
        const ret = await nlDataQuery(args, ctx);
        if (ret.error) {
          throw new Error(ret.error as string);
        }
        sql = ret.sql;
        table = ret.table;
        columns = ret.result_columns;
      } catch (e) {
        console.log(e);
        return {
          content: [
            {
              type: "text",
              text: `生成查询 SQL 过程发生了一点问题：${e.message}`,
            },
          ],
          isError: true,
        };
      }

      // TODO sql validate

      // query
      try {
        const result = await ctx.dataSvc?.executeQuery({
          sql,
          from: table,
        } as any);

        if (args.expected_query_output === "dataset_id") {
          if (result.length === 0) {
            return {
              content: [
                {
                  type: "text",
                  text: `数据查询结果为空`,
                },
              ],
              isError: true,
            };
          }

          const datasetId = uuidV4();
          const rows = result.map((item) => Object.values(item));
          ctx.memory?.set(datasetId, {
            sample_data: rows.slice(0, 5),
          });
          const dataWithHeader = [columns, ...rows];
          const mem = {
            dataset_id: datasetId,
            dataset_columns: columns,
            rows_count: result.length,
          };
          ctx.memory?.set(args.task_id, {
            ...mem,
            sample_data: rows.slice(0, 5),
          });

          // TODO 数据集需要存储到外部缓存（根据数据量分批），临时使用本机内存缓存，在多机器部署情况通过404重试来命中到原始机器缓存
          ctx.s3?.putObject(
            `${datasetId}.json`,
            {
              metadata: {
                type: "application/json",
              },
              data: Buffer.from(JSON.stringify(dataWithHeader)),
            },
            {
              expires: 60 * 10, // 10min过期
            }
          );
          return mem;
        }

        return result;
      } catch (e) {
        return {
          content: [
            {
              type: "text",
              text: `数据查询过程发生了一点问题：${e.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  };
};
