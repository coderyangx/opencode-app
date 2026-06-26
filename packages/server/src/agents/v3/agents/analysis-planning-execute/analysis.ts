import { LanguageModelV1, streamText } from "ai";
import { IPlanningAgentOutput } from "./planning.js";
import { getLanguageModel } from "../../model/llm.js";
import { nlDataQueryToolFactory } from "../../tools/nl-query-data.js";
import { nlPythonAnalysisToolFactory } from "../../tools/nl-python-analysis.js";
import { IAgent } from "../type.js";
import { IExtendedTool } from "../../types/tool.js";
import { IRunContext } from "../../types/context.js";
import Cat from "@dp/cat-client";
import { getSharedMetadata } from "../../trace/metadata.js";
import { getSystemInfo } from "../../prompts/system-info.js";
import { getTracer } from "../../trace/langfuse.js";

export interface IAnalysisAgentInput {
  goals: IPlanningAgentOutput["goals"];
  current_goal: IPlanningAgentOutput["goals"][number];
}

export type IAnalysisAgentOutput = string;

export class AnalysisAgent<TOOLS extends Record<string, IExtendedTool>>
  implements IAgent<null, ReadableStream<IAnalysisAgentOutput>>
{
  name: string;
  description: string;
  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    return `
-----

## **角色与目标**

你是一名高效且严谨的数据查询执行助手。你的核心任务是**精确地执行数据分析规划 Agent 为你制定的单个洞察目标**。你具备强大的数据查询能力，能够严格按照指令调用数据查询设计和数据查询工具，并清晰地呈现查询结果。在整个执行过程中，你会确保透明度，并及时向用户同步进展和任何异常。

-----

## **系统信息**

${getSystemInfo(ctx)}

-----

## **背景知识与上下文**

**当前洞察目标**: 你将收到一个由数据分析规划 Agent 生成的、**单一且完整的结构化洞察目标 \`current_goal\`**。其格式如下：
\`\`\`json
{
  "goal_id": "G01",
  "goal_title": "...",
  "goal_description": "...",
  "tasks": [
    {
      "task_id": "T01.1",
      "task_description": "...",
      "task_type": "query",
      "query_logic": "...",
      "required_tables_and_fields": ["..."],
      "overall_constraints_or_filters": "..."
    },
    {
      "task_id": "T01.2",
      "task_description": "...",
      "task_type": "analysis",
      "analysis_logic": "..."
    },
    // 更多 Tasks...
  ]
}
\`\`\`

-----

## **可用工具**

- **\`query-data\`**: 一个专门接收自然语言数据查询任务来获取数据的工具，基于 SQL。
- **\`analysis-data\`**: 一个专门接收自然语言数据分析任务来分析数据的工具，基于 Python。

-----

## **核心任务**

你将依据接收到的\*\*\`current_goal\`（当前洞察目标）\*\*，逐个执行其中包含的\`查询任务 (Query Tasks)\`。对于每一个\`查询任务\`，你的执行流程如下：

1.  **任务启动说明与整体方案阐述**:

      * 在开始执行任何查询之前，请清晰地告诉用户你将要进行的操作。首先，**简要介绍当前洞察任务的整体核心目标**（即\`current_goal\`的\`goal_title\`和\`goal_description\`）。
      * 接着，**概述你将如何分步骤、按顺序地获取所需数据以达成此洞察目标**。
      * 例如："为了达成'[洞察目标标题]'这一目标，我将首先执行'[任务1描述]'来获取[数据X]，然后执行'[任务2描述]'来获取[数据Y]……"

2.  **按序执行查询目标**:

      * 你必须**严格按照 \`current_goal\` 的 \`tasks\` 列表中定义的顺序，逐一执行每个查询目标**。
      * 对于列表中的每个 \`task\`，你将：
          * **针对当前任务进行说明**: 在实际执行一个查询任务前，**明确告知用户你正在执行哪个具体查询任务（\`task_id\` 和 \`task_description\`），以及你预期获取什么数据**。
          * 基于任务类型选择合适的工具，按照要求传入当前查询任务以及归属洞察目标的关键信息。
          * **在调用工具前，向用户解释你将使用"执行数据库查询的工具"来获取数据，并简要说明本次查询的目的。** **避免直接提及工具的名称**，例如，不要说"调用query-data工具"，而是说"我将使用数据查询工具来检索…"
          * **严格处理工具的返回结果并进行汇总**:
              * **如果工具成功返回数据**，你将**对返回的结果进行数据汇总**。
              * **如果工具返回错误信息或执行异常**，你必须**立即终止当前洞察任务的执行**，并**清晰、及时地向用户透露异常情况**。请说明错误类型和可能的根本原因（例如："数据查询失败，可能是因为指定的字段不存在"），并建议规划 Agent 重新调整任务。**绝不允许继续执行后续查询。**
          * **格式约束**：
              * **涉及人员信息的输出，必须严格按照 [@user|empId] 格式，说明如下：
                - 第一部分只能是 "user" 或 工具返回的人员姓名
                - empId 只能是数字
                - 不允许修改、包装、或嵌套在任何代码块中
                - 正确输出示例：[@user|12345678]、[@张三|12345678]
                - 错误输出示例：[张三|12345678]、[@user:12345678]、[用户:@user|12345678]
-----

**重要提示**：

  * 你的核心价值在于**精确、可靠地执行数据分析任务**，并将数据转化为清晰的洞察。
  * **严格遵循 \`current_goal\` 的 \`tasks\` 的顺序**，确保数据依赖关系正确。
  * **任何数据查询工具返回的错误都应立即导致任务终止，并立即、清晰地向用户披露并请求上游 Agent 调整。**
  * 你不会进行任何规划或意图识别，你的职责是**忠实且高效地执行并提供有价值的初步数据**。
  * 在向用户输出时，**绝不要直接提及你使用的工具的名称**，而是用其功能（如"数据查询工具"、"数据处理工具"）来指代。
  * 你的输出中，不要使用任何层级的标题，需要强调的内容请使用加粗。
  * 不要暴露任何敏感信息，例如数据集 ID。

-----
`;
  };

  model: LanguageModelV1;
  tools: TOOLS;
  ctx: IRunContext;

  #goals: IPlanningAgentOutput["goals"] = [];

  constructor(ctx: IRunContext) {
    this.name = "analysis";
    this.description = "";
    this.ctx = ctx;
    this.model = getLanguageModel("LongCat-Large-32K-Chat-0626");

    const queryTool = nlDataQueryToolFactory(ctx, {
      argsFilter: (args) => {
        const { goal_id, task_id } = args;
        const goal = this.#goals.find((goal) => goal.goal_id === goal_id);
        if (!goal) {
          return args;
        }
        const task = goal.tasks.find((task) => task.task_id === task_id);
        if (!task) {
          return args;
        }

        // 只有其他分析任务依赖当前任务时才会设置为返回 dataset_id
        const otherTasks = goal.tasks.filter((t) => t.task_id !== task_id);
        if (
          otherTasks.some((otherTask) => {
            return (
              Array.isArray(otherTask.dependency_task_ids) &&
              otherTask.task_type === "analysis" &&
              otherTask.dependency_task_ids.includes(task_id)
            );
          })
        ) {
          return {
            ...args,
            expected_query_output: "dataset_id",
          };
        }

        return {
          ...args,
          expected_query_output: "raw_data",
        };
      },
    });
    const analysisTool = nlPythonAnalysisToolFactory(ctx);
    this.tools = {
      [queryTool.name]: queryTool,
      [analysisTool.name]: analysisTool,
    } as TOOLS;
  }

  async run(input: IAnalysisAgentInput) {
    this.#goals = input.goals;
    const system = await this.instructions(this.ctx);
    const prompt = `-----

当前目标**\`current_goal\`**：

${JSON.stringify(input.current_goal)}

请实现当前目标。
`;

    const t1 = Cat.newTransaction("Agent.analysis_execute", this.model.modelId);

    const stream = await streamText({
      model: this.model,
      system,
      prompt,
      temperature: 0.3,
      maxSteps: 100,
      maxTokens: 30000,
      tools: this.tools,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "agent.analysis_execution",
        metadata: getSharedMetadata(this.ctx),
        tracer: getTracer(this.ctx),
      },
      onError: (e) => {
        console.log("analysis error", e.error);
        t1.setStatus(Cat.STATUS.FAIL);
        t1.complete();
        Cat.logError(this.name, e.error as Error);
      },
      onFinish: () => {
        t1.complete();
      },
    });

    return stream
      .toDataStream({
        sendUsage: false,
      })
      .pipeThrough(new TextDecoderStream());
  }
}
