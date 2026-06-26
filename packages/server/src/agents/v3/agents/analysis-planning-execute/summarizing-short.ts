import { LanguageModelV1, ToolSet, streamText } from "ai";
import { getLanguageModel } from "../../model/llm.js";
import { getSystemInfo } from "../../prompts/system-info.js";
import { IAgent } from "../type.js";
import { IRunContext } from "../../types/context.js";
import Cat from "@dp/cat-client";
import { getTracer } from "../../trace/langfuse.js";
import { getSharedMetadata } from "../../trace/metadata.js";

export interface ISummarizingAgentInput {
  user_query: string;
  analysis_tasks_results: {
    task_id: string;
    objective: string;
    task_result: string;
  }[];
}

export type ISummarizingAgentOutput = string;

export class SummarizingAgent
  implements IAgent<null, ReadableStream<ISummarizingAgentOutput>>
{
  name: string;
  description: string;
  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    return `你是一个数据分析助手，你的任务是**从一份数据分析任务的洞察结果中，快速提取所有关键信息**。
**系统信息**
${getSystemInfo(ctx)}

**你的职责是：**

  * 接收原始的分析目标和多个洞察结果。
  * **从所有结果中，识别并提取所有核心数据、重要发现和结论。**
  * 你的输出应是**一份简洁的以目标-结论组合的信息陈述**，同时遵守用户原始请求中关于输出格式的要求。
  * **不要生成任何形式的报告、引言或详细分析。**
  * 只返回提炼出的信息点，不做任何解释或额外说明。

`;
  };

  model: LanguageModelV1;
  tools: ToolSet;
  ctx: IRunContext;

  constructor(ctx: IRunContext) {
    this.name = "summarizing";
    this.description = "";
    this.ctx = ctx;
    this.model = getLanguageModel("LongCat-Flash-Chat-Preview");

    this.tools = {};
  }

  async run(input: ISummarizingAgentInput) {
    const system = await this.instructions(this.ctx);
    const prompt = `-----

原始数据分析请求：

${input.user_query}

-----

分步骤执行的洞察结果列表：

${JSON.stringify(input.analysis_tasks_results)}

-----

请进行总结。

`;

    const t1 = Cat.newTransaction("Agent.summarizing", this.model.modelId);

    const stream = await streamText({
      model: this.model,
      system,
      prompt,
      temperature: 0.3,
      maxSteps: 1,
      maxTokens: 30000,
      toolChoice: "none",
      experimental_continueSteps: true,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "agent.analysis_summarizing",
        metadata: getSharedMetadata(this.ctx),
        tracer: getTracer(this.ctx),
      },
      onFinish: (r) => {
        console.log("finish reason", r.finishReason);
        const text = r.text;
        console.log("\n", Date.now(), text);
        t1.complete();
      },
      onError: (e) => {
        console.log("summarizing error", e.error);
        t1.setStatus(Cat.STATUS.FAIL);
        t1.complete();
        Cat.logError(this.name, e.error as Error);
      },
    });

    stream.consumeStream();

    return stream
      .toDataStream({
        sendUsage: false,
      })
      .pipeThrough(new TextDecoderStream());
  }
}
