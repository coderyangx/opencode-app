import { LanguageModelV1, TextStreamPart, streamText } from "ai";
import { IAgent } from "../../types/agent.js";
import { IRunContext } from "../../types/context.js";
import { IExtendedTool } from "../../types/tool.js";
import { BaseAgent } from "../base.js";
import { IPlanningAgentOutput } from "./planning.js";
import { getModel } from "../../lib/ai/model-provider.js";
import { designQueryDslToolFactory } from "../../tools/v2/design-query.js";
import { queryDataToolFactory } from "../../tools/v2/query-data.js";

export interface IAnalysisAgentInput {
  tasks: IPlanningAgentOutput["tasks"];
  current_task: IPlanningAgentOutput["tasks"][number];
}

export type IAnalysisAgentOutput = string;

export class AnalysisAgent<TOOLS extends Record<string, IExtendedTool>>
  extends BaseAgent
  implements IAgent<TOOLS, IAnalysisAgentOutput>
{
  declare name: string;
  declare description: string;
  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    return `你是一个资深的数据分析执行专家，你的核心职责是接收由规划 Agent 拆解出的**独立数据洞察任务**，并严格按照任务要求，协调 \`design-and-query-data\` 工具来逐步获取所需数据，最终完成整个洞察目标的分析与输出。

你会严格遵循以下流程来执行数据洞察任务：

1.  **接收并理解洞察任务**：
    * 你将接收一个**完整的结构化洞察任务\`current_task\`**。该任务由 Planning Agent 精心规划，包含：
        * \`task_id\`: 任务唯一标识符。
        * \`objective\`: 洞察任务的整体目标。
        * \`query_goals\`: 一个列表，包含为达成目标所需执行的**所有具体查询或计算步骤**。
        * \`required_tables\`: 任务涉及的所有相关数据库表。
        * \`relevant_columns\`: 任务涉及的所有相关数据库列。
        * \`overall_constraints_or_filters\`: 适用于整个任务的宏观约束条件。
    * 你还会接收**全部的数据洞察任务列表\`tasks\`**，这作为你设计当前分配的洞察任务\`current_task\`时的上下文参考。

---

2.  **数据洞察执行方案与按序执行查询目标**：
    * **在开始执行任何查询之前，你将首先阐述本次数据洞察任务的整体执行方案。这包括：
        * 简要介绍当前任务的**核心目标**。
        * 概述你将如何**分步骤、按顺序**地利用 \`design-query-dsl\`和\`query-data\` 工具来逐步获取所需数据，以达成最终洞察目标。
        * 明确指出每个查询步骤在整个分析过程中的**作用和预期贡献**。
    * 你必须**严格按照 \`query_goals\` 列表中定义的顺序，逐一执行每个查询目标**。
    * 对于列表中的每个 \`query_goal\`，你将：
        * **调用你的 \`design-query-dsl\` 工具**。在调用时，你需要精确地构建工具的输入参数：
            * 将 \`task_id\`, \`overall_objective\`, \`required_tables\`, \`relevant_columns\`, \`overall_constraints_or_filters\` 直接从当前洞察任务的顶层信息中传递。
            * 将当前正在处理的 \`query_goal\` 作为 \`current_query_goal\` 参数传递。
        * **调用你的 \`query-data\` 工具**。在调用时，将上一步\`design-query-dsl\` 工具获得的数据查询 DSL 完整地传入指定参数部分
        * **严格处理 \`query-data\` 工具的返回结果**：
            * 如果工具成功返回数据（以 Markdown Table 形式），你将**对工具返回的结果进行详细的总结和初步分析**。这包括：
                * 简要描述返回数据的内容和结构。
                * 如果数据量允许，可以提取一些关键的数据点或趋势进行说明。
                * 解释这些数据如何为下一步的分析或最终目标提供支持。
                * **保存这些数据**，以供后续步骤使用。
            * 如果工具返回错误信息，你必须立即终止当前洞察任务的执行，并将错误信息传递给上游 Agent。**绝不允许继续执行后续查询。**

---

3.  **数据整合、分析**：
    * 在成功获取所有 \`query_goals\` 所需的数据后，你将负责对这些**数据进行整合、处理和必要的计算**，以达成 \`objective\` 中定义的最终洞察目标。
    * **在开始整合和分析之前，你将简要说明本次整合和分析的策略**：如何将之前获取的零散数据汇聚起来，进行哪些关键的计算或处理，以及这些操作如何直接服务于最终的洞察目标。
    * 整合过程应包括但不限于：数据合并、聚合、统计计算（如环比增长）、筛选、排序等。
    * **确保最终结果严格符合 \`objective\` 的要求**。

---

**重要提示**：

* 你的核心价值在于**精确、可靠地执行数据分析任务**，并将数据转化为清晰的洞察。
* **严格遵循 \`query_goals\` 的顺序**，确保数据依赖关系正确。
* **任何 \`design-query-dsl\`、\`query-data\` 工具返回的错误都应立即导致任务终止，并上报。**
* **在执行每个关键阶段（方案开始、工具返回后、数据整合分析后）提供清晰、富有洞察力的解释和总结，但请确保这些解释保持简洁和目的性。**
* 你不进行任何规划或意图识别，你的职责是**忠实且高效地执行并提供有价值的初步数据和洞察**。
* 你的输出中，不要使用任何层级的标题，需要强调的内容请使用加粗

---
`;
  };

  model: LanguageModelV1;
  tools: TOOLS;
  ctx: IRunContext;

  constructor(ctx: IRunContext) {
    super({
      ctx,
    });
    this.name = "analysis";
    this.description = "";
    this.ctx = ctx;
    this.model = getModel(process.env.DEFAULT_MODEL || "gpt-4.1");

    const dslTool = designQueryDslToolFactory(ctx);
    const queryTool = queryDataToolFactory(ctx);
    this.tools = {
      [dslTool.name]: dslTool,
      [queryTool.name]: queryTool,
    } as TOOLS;
  }

  async run(options: {
    input: IAnalysisAgentInput;
    onProgress: (progress: TextStreamPart<TOOLS>) => void;
    onComplete: (result: IAnalysisAgentOutput) => void;
    onFail: (error: Error) => void;
  }): Promise<Object> {
    this.emit("log", {
      intro: "analysis-start",
      data: options.input,
    });
    const system = await this.instructions(this.ctx);
    const prompt = `-----

当前任务**\`current_task\`**：

${JSON.stringify(options.input.current_task)}

-----

全部任务**\`tasks\`：

${JSON.stringify(options.input.tasks)}

---

请执行当前任务。
`;

    const stream = await streamText({
      model: this.model,
      system,
      prompt,
      temperature: 0.3,
      maxSteps: 10,
      tools: this.tools,
      onChunk: ({ chunk }) => {
        options.onProgress(chunk);
      },
      onFinish: (ret) => {
        options.onComplete(ret.text);
        this.emit("log", {
          intro: "analysis-end",
          data: ret.text,
        });
      },
      onError: ({ error }) => {
        options.onFail(
          error instanceof Error ? error : new Error(error as string)
        );
      },
    });

    return stream;
  }

  onHandOff(
    ctx: IRunContext & { toolCallId: string },
    args: string
  ): Promise<any> {
    throw new Error("Method not supported.");
  }
}
