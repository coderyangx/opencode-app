import { type LanguageModelV1, generateObject } from "ai";
import type { IRunContext } from "../../types/context.js";
import { getLanguageModel } from "../../model/llm.js";
import { z } from "zod";
import { IExtendedTool } from "../../types/tool.js";
import { IAgent } from "../type.js";
import Cat from "@dp/cat-client";
import { getSharedMetadata } from "../../trace/metadata.js";
import { getSystemInfo } from "../../prompts/system-info.js";
import { getTracer } from "../../trace/langfuse.js";

const dataInsightGoalSchema = z.object({
  goal_id: z.string().describe("洞察目标唯一标识符"),
  goal_title: z.string().describe("一个以洞察为导向的、简洁的标题"),
  goal_description: z
    .string()
    .describe("阐述此目标旨在回答的业务问题或其潜在的业务价值"),
  tasks: z
    .array(
      z
        .object({
          task_id: z.string().describe("任务的唯一标识符"),
          task_description: z
            .string()
            .describe("对该查询或分析任务的具体、无歧义的描述"),
          task_type: z.enum(["query", "analysis"]).describe("任务类型"),
          query_logic: z
            .string()
            .describe("实现该任务所需的核心 SQL 逻辑的文字描述")
            .optional(),
          required_tables_and_fields: z
            .array(z.string())
            .describe("执行此任务所必需的表和字段列表")
            .optional(),
          overall_constraints_or_filters: z
            .string()
            .describe(
              "适用于此查询任务的宏观时间范围、筛选条件、分组条件或返回记录数限制，用自然语言描述;当处理时间戳（timestamp）或日期（date）字段时，务必使用日期字符串作为比较值"
            )
            .optional(),
          expected_query_output: z
            .enum(["raw_data", "dataset_id"])
            .describe(
              "查询任务完成后，预期的结果返回形式，如果数据用于后续 Python 分析，请必须选择dataset_id"
            )
            .optional(),
          analysis_logic: z
            .string()
            .describe("实现该任务所需的核心逻辑的文字描述")
            .optional(),
          expected_analysis_output: z
            .string()
            .describe(
              "分析任务完成后，数据结果的形式和核心内容，以及其直接的业务应用或价值"
            )
            .optional(),
          dependent_task_ids: z
            .array(z.string())
            .describe("依赖此任务的下游任务ID列表")
            .optional(),
          dependency_task_ids: z
            .array(z.string())
            .describe("依赖的上游任务ID列表")
            .optional(),
        })
        .describe("任务详情，其中query_task和analysis_task 二选一")
    )
    .describe("一个查询或分析任务对象的列表，这些任务共同服务于此目标"),
});

const outputSchema = z.object({
  goals: z.array(dataInsightGoalSchema).describe("规划的数据洞察任务列表"),
  artifact_type: z
    .enum(["answer", "report"])
    .describe(
      "最终回复用户的产物类型，默认 answer - 简单回答，其他可选项 report - 数据可视化报告，仅当用户明确要求生成报告时才选择 report 模式"
    ),
});

export type IPlanningAgentOutput = z.infer<typeof outputSchema>;

const inputSchema = z.object({
  user_query: z.string().describe("用户提出的数据分析需求描述"),
  tasks_history: z
    .array(dataInsightGoalSchema)
    .describe("历史数据洞察目标列表")
    .optional(),
  issues: z
    .array(
      z.object({
        original_objective: z.string().describe("问题出自的原始目标"),
        issue_description: z.string().describe("问题描述"),
        severity: z
          .enum(["CRITICAL", "MAJOR", "MINOR"])
          .describe("问题严重程度"),
        recommended_action: z.string().describe("推荐行动"),
      })
    )
    .optional()
    .describe("上一轮评估获得的问题列表"),
});

export type IPlanningAgentInput = z.infer<typeof inputSchema>;

export class PlanningAgent<TOOLS extends Record<string, IExtendedTool>>
  implements IAgent<null, IPlanningAgentOutput>
{
  name: string;
  description: string;

  private dbSchema: string = "";

  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    const tableInfo = await ctx.dataSvc?.getDataSchema();
    this.dbSchema = JSON.stringify(tableInfo, null, 2);

    return `
-----

## **角色和目标**

你是一个经验丰富且细致入微的数据分析师。你的核心职责是根据用户的自然语言请求，深入理解业务问题，设计富有洞察力的业务分析计划，并确保每个分析任务是切实可被 SQL 查询 或 Python 代码执行且高效的。

-----

## **系统信息**

${getSystemInfo(ctx)}
-----

## **数据源信息**

**可用数据资产**: 当前的数据表结构定义如下。

\`\`\`json
${this.dbSchema}
\`\`\`

**请注意：列结构描述中\`name\` 字段是数据库列的编程名称和唯一标识符，它应该用于所有查询、筛选和条件语句中。\`description\` 字段仅用于人类可读的解释。**
**在设计查询相关信息前先彻底理解数据表结构的定义，列引用要用\`column.name\`，请严格遵守**

**数据源的查询能力**

当前数据源的查询能力 **只能处理常见的 SQL 查询**，其中**以下复杂操作是明确不支持的：**

  * **任何形式的 JOIN 操作 (包括 INNER JOIN, LEFT JOIN, CROSS JOIN 等)**
  * **WITH 子句语法和 JSON_TABLE**
  * **中位数、标准差、分位数、窗口函数等高级数据分析方法**
  * **单次查询返回的数据量有最大行数限制（例如，不超过100,000行）** - *请在规划时考虑，避免生成可能返回巨量数据的任务。*

因此，你需要将宏观的分析目标拆解成基于当前数据源能够执行的具体步骤，并且必须确保每个查询任务都只涉及单一表。

-----

## **核心任务**

基于用户的业务问题和可用数据，设计一个结构化的数据分析计划。这个计划应包含若干个**洞察目标 (Analysis Goals)**。每个目标都应该：

1.  **以业务为导向**：聚焦于一个能产生业务价值的洞察点或问题。
2.  **分解为具体任务**：在每个目标下，列出 1 个或多个具体的、可执行的**任务 (Tasks)**，这些任务可以是 SQL 查询任务 (Query Tasks) 或 Python 分析任务 (Analysis Tasks)。
3.  **确保任务可行**：
    - **查询任务(SQL)**：仅用于基础的数据筛选和聚合，其能力严格限制在以下范围内:
      - **SELECT**: 仅用于选择需要返回的列
      - **FROM**: 指定数据来源表
      - **WHERE**: 用于基于简单的比较或逻辑操作进行的筛选，例如\`> < = != AND OR LIKE IN\`
      - **GROUP BY**: 结合聚合函数（COUNT, SUM, AVG, MAX, MIN）进行简单分组汇总
      - **ORDER BY**: 对结果集进行排序
    - **分析任务(Python)**：负责所有复杂的数据格式处理、转换、高级统计分析。在分析任务前必须添加一~多个个依赖的查询任务来获取数据集 ID 列表，以缩减数据行、列范围，保证数据传输高效。
4.  **考虑数据粒度和维度**：根据用户需求，识别需要分析的数据粒度（例如，按天、按月、按产品ID、按用户ID等），并将这些维度作为拆解洞察任务的依据。

-----

## **输出要求**

请以 JSON 格式输出一个分析计划。这是一个包含多个"洞察目标"对象的列表。

  - 每个**洞察目标 (Analysis Goal)** 对象应包含以下键：

      - \`goal_id\`: 目标的唯一标识符，例如 "G01"。
      - \`goal_title\`: 一个以洞察为导向的、简洁的标题（例如："探究核心用户的购买行为"）。此标题也是对该洞察任务所要达成的具体商业或分析目标的简明描述。
      - \`goal_description\`: 阐述此目标旨在回答的业务问题或其潜在的业务价值。
      - \`tasks\`: 一个查询/分析任务对象的列表，这些任务共同服务于此目标。

  - 每个**任务 (Task)** 对象应包含以下键：

      - \`task_id\`: 任务的唯一标识符，例如 "T01.1"。
      - \`task_type\`: 任务类型，可以是 "query" (查询任务) 或 "analysis" (分析任务)。
      - 如果\`task_type\`为 "query" (查询任务)，则额外包含以下键：
          - \`task_description\`: 对该查询任务的具体、无歧义的描述（例如："计算近30天内，\`orders\`表中按用户ID分组的订单总金额和订单数量"）。
          - \`query_logic\`: 实现该任务所需的核心 SQL 逻辑的文字描述。
          - \`required_tables_and_fields\`: 执行此任务所必需的表和字段列表，格式为\`表名.列名\`（**注意：每个任务只能涉及一个表**）。
          - \`overall_constraints_or_filters\`: 适用于此查询任务的宏观时间范围、筛选条件、分组条件或返回记录数限制，用自然语言描述；当处理时间戳（timestamp）或日期（date）字段时，务必使用日期字符串作为比较值。
          - \`expected_query_output\`: 任务执行完成后，期望返回的类型。当该任务作为下游分析任务的前置依赖时，固定为\`dataset_id\`
          - \`dependent_task_ids\`: 依赖此查询任务获取数据集的分析任务 ID 列表
      - 如果\`task_type\`为 "analysis" (分析任务)，则额外包含以下键：
          - \`task_description\`: 对该分析任务的具体、无歧义的描述（例如："基于订单数据集，识别高价值用户群体的特征"）。
          - \`analysis_logic\`: 实现该任务所需的核心 Python 分析逻辑的摘要性文字描述，**并确保这些步骤仅依赖 \`numpy\`、 \`pandas\`、\`jieba\`、\`scikit-learn\` 的能力**。
          - \`expected_analysis_output\`: 分析任务完成后，数据结果的形式和核心内容，以及其直接的业务应用或价值。
          - \`dependency_task_ids\`: 依赖的查询任务 ID 列表

-----

## **约束与限制**

  - **顶层目标求洞察，底层任务求可行**。
  - \`goal_title\` 应使用业务语言，\`task_description\` 应使用技术和操作语言。
  - 一个目标下的多个任务可以存在逻辑上的依赖关系。对于分析任务，这种依赖应通过\`dependency_task_ids\`明确指出其依赖的查询任务的 ID 列表。
  - 整个计划应逻辑连贯，从宏观概览逐步深入到具体的诊断分析。
  - **在规划上下游相互依赖的多个查询和分析任务时，请必须确保时序合理、步骤不丢失，最终能够串联成有效的数据分析工作流**
  - **在规划 \`query_logic\` 时，必须严格遵守上述数据库能力局限性，特别是每个任务只能查询一个单一表。**
  - **在规划 \`analysis_logic\` 时，请务必注意 Python 分析能力仅限于 numpy、pandas、jieba、scikit-learn 的操作。**
  - 你**绝不会**在这里执行任何数据查询或分析操作，你的核心职责是规划。
  - 如果用户请求无法被合理拆解为独立的洞察任务，或者存在明显矛盾，你应该指出问题并请求进一步澄清。

-----
`;
  };

  model: LanguageModelV1;
  tools: TOOLS;
  ctx: IRunContext;

  constructor(ctx: IRunContext) {
    this.name = "planning";
    this.description = "";
    this.ctx = ctx;
    this.model = getLanguageModel("gpt-4.1");
    this.tools = {} as TOOLS;
  }

  async run(input: z.infer<typeof inputSchema>): Promise<Object> {
    const system = await this.instructions(this.ctx);
    let prompt = "";
    if (input.issues && input.issues.length > 0) {
      input.tasks_history;
      prompt = `用户原始需求如下：
-----

${input.user_query}

-----

目前已经执行了之前规划的目标任务：

-----

\`\`\`json
${JSON.stringify(input.tasks_history)}
\`\`\`

-----

根据已执行任务的评估结果，请重新规划并按需增加新的目标任务。

-----

\`\`\`json
${JSON.stringify(input.issues)}
\`\`\`

-----

`;
    } else {
      prompt = `需求如下：\n\n-----\n${input.user_query}\n-----\n`;
    }

    let t1 = Cat.newTransaction("Agent.planning", this.model.modelId);

    try {
      const start = Date.now();
      const { object } = await generateObject({
        model: this.model,
        system,
        prompt,
        temperature: 0.3,
        schema: outputSchema,
        maxRetries: 2,
        maxTokens: 10000,
        experimental_telemetry: {
          isEnabled: true,
          functionId: "agent.analysis_planning",
          tracer: getTracer(this.ctx),
          metadata: getSharedMetadata(this.ctx, {
            oa_evaluation_step: "planning",
            oa_evaluation_input: input.user_query,
            oa_evaluation_context: `当前数据表信息: \n-----\n${this.dbSchema}\n-----\n`,
          }),
        },
      });

      t1.complete();

      console.log("goals", JSON.stringify(object, null, 2));
      this.ctx.memory?.set("goals", object.goals || []);

      console.log("planning cost", Date.now() - start);

      return object;
    } catch (e) {
      t1.setStatus(Cat.STATUS.FAIL);
      t1.complete();
      console.log("planning error", e);
      Cat.logError(this.name, e);
      throw new Error("任务规划异常");
    }
  }
}
