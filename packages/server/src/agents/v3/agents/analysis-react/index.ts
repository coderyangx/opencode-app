import { formatDataStreamPart, LanguageModelV1, streamText, ToolSet } from "ai";
import { IAgent, IAgentOptions } from "../type";
import { IRunContext } from "../../types/context";
import { getLanguageModel } from "../../model/llm.js";
import { z } from "zod";
import { nlDataQueryToolFactory } from "../../tools/nl-query-data.js";
import { IToolFactory } from "../../types/tool";
import { getSharedMetadata } from "../../trace/metadata.js";
import { agentWorkerPool } from "../../lib/job/pool.js";
import { QueryAgentState } from "./state.js";
import { getSystemInfo } from "../../prompts/system-info.js";
import { getTracer } from "../../trace/langfuse.js";
import { v4 as uuidV4 } from "uuid";

const inputSchema = z.object({
  thinking: z.string().describe("思考过程").optional(),
  user_query: z
    .string()
    .describe(
      "请精确总结用户提出的数据分析需求，严格禁止添加任何联想、推断或额外信息。确保涵盖所有细节，只提取和重述用户明确提及的内容。",
    ),
  language: z
    .string()
    .describe(
      "请根据用户的输入判断用户期望的语言类型, 比如'中文','英文','阿拉伯语','葡萄牙语' 等",
    ),
});

export class AnalysisReActAgent implements IAgent<typeof inputSchema> {
  name = "AnalysisReActAgent";
  description =
    "用于处理简单、直接的数据查询请求（仅可用于SQL数据查询、简单聚合COUNT/MIN/MAX/AVG等，不可用于任何分析，如中位数、标准差、百分位数、趋势分析、相关性分析等），并仅展示取数结果。适用于用户意图清晰、无需复杂规划或深度报告的任务。";
  model: LanguageModelV1;
  tools: ToolSet;
  inputSchema = inputSchema;

  private dbSchema: string = "";

  private ctx: IRunContext;

  private registerTool = (
    factory: IToolFactory,
    options?: Record<string, any>,
  ): void => {
    const tool = factory(this.ctx, options);
    this.tools = {
      ...this.tools,
      [tool.name]: tool,
    };
  };

  constructor(options: IAgentOptions) {
    this.ctx = options.ctx;
    this.model = getLanguageModel("LongCat-Large-32K-Chat-0626");

    this.tools = {};
    this.registerTool(nlDataQueryToolFactory, { argsFilter: args => {
      return {
        ...args,
        expected_query_output: 'raw_data'
      };
    } });
  }

  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    const tableInfo = await ctx.dataSvc?.getDataSchema();
    this.dbSchema = JSON.stringify(tableInfo, null, 2);

    return `
-----

## **角色和定位**

你是一位**专业的 SQL 取数助手**，专注于从结构化数据中**快速、准确地提取和展示信息**。你的核心职责是**理解用户的取数意图**，并在**安全只读的前提下，最大限度地进行合理推断和默认执行**，以便即时给出结果。

-----

## **系统信息**

${getSystemInfo(ctx)}

-----

## **数据源信息**

**可用数据资产**: 当前的数据表结构定义如下。

\`\`\`json
${this.dbSchema}
\`\`\`

-----

## **任务流程**

你将严格遵循以下流程与用户互动：

### 1. 评估用户取数意图

  * **识别相关性**：
      * 如果用户的提问与**数据查询、数据提取、基础筛选、简单聚合、数值统计**等直接取数操作**无关**，你必须立即回复，明确告知用户你的服务范围，并请他们提出相关问题。
  * **判断信息完备性与可推断性 (高容错性)**：
      * 如果用户的问题与数据取数相关，你将**首先尝试根据你的专业知识和所掌握的数据表结构信息进行合理推断**。
      * **推断与默认执行的原则**：
          * **安全只读**：由于取数是只读场景，相对安全，你应**尽可能地自行给出默认的取数条件并立即执行**。
          * **常识与约定俗成**：充分利用数据分析领域的**行业常识**和**普遍约定俗成**的业务逻辑进行推断。例如，如果用户仅说"查询销售额"，你可以默认是总销售额。
          * **默认值填充**：对于筛选条件、时间范围、具体字段选择等**非关键缺失但有合理默认值**的信息，你可以默认使用最宽泛或最常用的值（例如，若未指定筛选条件，则默认为**无筛选条件**；若未指定时间范围，则默认为**所有可用数据**；若未指定具体字段，则默认选择与用户意图最相关的**核心指标**），并直接尝试执行。
          * **【强制规则】列引用：在所有数据操作和查询设计中，你必须且只能使用\`可用的数据表结构定义\`中每个列对象的\`name\`属性值来引用列。严禁将\`description\`或其他任何描述性文本作为列的标识符。**

-----

### 2. 执行取数并展示结果
  * **在调用查询相关工具前先询问自己彻底理解了数据表结构的定义了吗，列引用要用\`column.name\`，请**严格遵守**
  * 在执行任务前先必须仔细思考并向用户澄清此次取数需求会拆解为几个实际的查询执行步骤，**必须确保每个步骤是可单次实现的查询**，请**严格遵守**
  * 对每步查询任务请：
    * 向用户澄清本次步骤的目的
    * 调用\`query-data\`工具来进行自然语言数据查询，传递如下关键信息：
      * \`task_description\`: 对数据查询步骤的具体、无歧义的描述（例如："计算近30天内，\`orders\`表中按用户ID分组的订单总金额和订单数量"）
      * \`query_logic\`: 实现该步骤所需的核心 SQL 逻辑的文字描述。
      * \`required_tables_and_fields\`: 执行此步骤所必需的表和字段列表，格式为\`表名.列名\`（**注意：每个步骤只能涉及一个表**）。
      * \`overall_constraints_or_filters\`: 适用于此查询任务的宏观时间范围、筛选条件、分组条件或返回记录数限制，用自然语言描述;当处理时间戳（timestamp）或日期（date）字段时，务必使用日期字符串作为比较值。
      * \`expected_query_output\`: 固定为\`raw_data\`，总是直接返回查询结果
  * **严格处理工具的返回结果并进行最终汇总和总结**
    - *返回结果中人员格式约束*：
    - 以 [@user|empId] 格式输出的代表人员信息，你必须原样输出，不允许修改、包装、或嵌套在任何代码块中
      - 正确输出示例：[@user|12345678]、[@张三|12345678]
      - 错误输出示例：[张三|12345678]、[@user:12345678]、[用户:@user|12345678]

-----

## **重要原则**

  * 你的核心价值在于**高效、准确地提取数据并即时展示结果**。
  * 始终保持专业、耐心和清晰的沟通风格，**并信任你的推断能力和用户在常识层面的理解能力**。

-----
`;
  };

  async run(input: z.infer<typeof inputSchema>) {
    console.log("AnalysisReActAgent run", input.user_query);
    this.ctx.language = input.language;

    const system = await this.instructions(this.ctx);
    const state = new QueryAgentState();

    const jobId = uuidV4();
    const jobStream = new TransformStream<[string, string], [string, string]>();

    const token = await agentWorkerPool.getBucket({
      jobId,
      stream: jobStream.readable,
      ctx: this.ctx,
    });

    const result = await streamText({
      model: this.model,
      system,
      prompt: input.user_query,
      tools: this.tools,
      temperature: 0.3,
      maxSteps: 100,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "agent.analysis_react",
        tracer: getTracer(this.ctx),
        metadata: getSharedMetadata(this.ctx, {
          oa_evaluation_step: "analysis_react",
          oa_evaluation_input: input.user_query,
          oa_evaluation_context: `当前数据表信息: \n-----\n${this.dbSchema}\n-----\n`,
        }),
      },
    });

    const self = this;

    return result
      .toDataStream({
        experimental_sendFinish: true,
        sendUsage: false,
      })
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(
        new TransformStream({
          start(controller) {
            const annotations = [
              {
                type: "jobId",
                value: jobId,
              },
              {
                type: "agent",
                value: self.name,
              },
            ];

            controller.enqueue(
              formatDataStreamPart("message_annotations", annotations),
            );
          },
          transform(chunk, controller) {
            state.push(chunk);
            if (/^8:/.test(chunk)) {
              controller.enqueue(chunk);
            } else {
              controller.enqueue(
                formatDataStreamPart("message_annotations", [
                  {
                    type: "job",
                    value: JSON.stringify({
                      name: "深度思考",
                      token: chunk,
                      stop: false,
                      stage: "analysis",
                      index: 0,
                      error: "",
                    }),
                  },
                ]),
              );
            }
          },
          async flush(controller) {
            controller.enqueue(
              formatDataStreamPart("message_annotations", [
                {
                  type: "job",
                  value: JSON.stringify({
                    name: "",
                    token: "",
                    stop: true,
                    stage: "analysis",
                    index: 0,
                    error: "",
                  }),
                },
              ]),
            );

            controller.enqueue(formatDataStreamPart("text", state.result));

            // snapshot
            const writer = jobStream.writable.getWriter();

            await writer.write(["snapshot", JSON.stringify(state.snapshot())]);
            await writer.close();
            writer.releaseLock();

            agentWorkerPool.returnBucket(token);
          },
        }),
      );
  }
}
