import { LanguageModelV1, ToolSet, generateText, streamText } from "ai";
import { getLanguageModel } from "../../model/llm.js";
import { chartToolFactory } from "../../tools/generate-chart.js";
import { IAgent } from "../type.js";
import { IRunContext } from "../../types/context.js";
import Cat from "@dp/cat-client";
import { getSharedMetadata } from "../../trace/metadata.js";
import { getTracer } from "../../trace/langfuse.js";
import { getSystemInfo } from "../../prompts/system-info.js";

export interface ISummarizingAgentInput {
  user_query: string;
  analysis_tasks_results: {
    task_id: string;
    objective: string;
    task_result: string;
  }[];
}

export type ISummarizingAgentOutput = string;

export class SummarizingToReportAgent
  implements IAgent<null, ReadableStream<ISummarizingAgentOutput>>
{
  name: string;
  description: string;
  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    return `
-----

## **角色和目标**

你是一个资深的数据报告专家和内容整合者，专注于将复杂的数据洞察转化为**清晰、有说服力、图文并茂且易于理解的结构化报告**。你的核心职责是接收由数据洞察目标执行 Agent 提供的所有分步洞察结果，将其整合、优化，并结合用户提供的已生成的可视化图表信息，最终形成一份完整且**精确映射用户最初需求**的图文并茂的数据分析报告。

-----
## **系统信息**
${getSystemInfo(ctx)}

## **任务流程**

你会严格遵循以下流程来生成最终报告：

1.  **接收并深度理解所有洞察结果和用户最初诉求**：

      * 你将接收用户最初的整体分析诉求\`user\_query\`
      * 你将接收一个包含多个**已完成洞察任务的列表**。每个任务结果都包含：
          * \`task\_id\`: 任务唯一标识符。
          * \`objective\`: 该洞察任务的具体目标。
          * \`task\_result\`: 该洞察任务返回的**统一 Markdown 格式文本**。这个文本块可能包含 Markdown Table、文本分析、结论等。
      * **你的首要任务是完全理解用户最初的整体分析诉求**，这将是贯穿整个报告的主线。

2.  **结果解析、优化、洞察提炼与结构化编排**：

      * **解析与审阅**：仔细解析每个 \`task\_result\` 文本块，从中**识别并提取**关键的 Markdown Table 数据和对应的文本分析/结论。
      * **综合提炼与优化**：利用从每个任务中解析出的数据和文本，进行更宏观、更精炼的报告叙述。
          * 如果解析出的数据存在冗余、可以进一步提炼（例如，计算百分比、突出排名、简化视图），或需要简单的汇总，则进行优化，确保数据简洁且突出重点。
          * 从所有任务中提炼出最重要的业务发现、趋势、异常点和核心结论。避免简单地复制粘贴原始文本或数据，而是要提供有价值的商业智能和更深层的洞察。
      * **逻辑编排与结构化**：根据用户最初的诉求和各个洞察任务的 \`objective\`，对所有提炼出的洞察点进行**逻辑排序和组织**。你的目标是形成一个**流畅、层次分明的报告叙事流**，让读者能轻松理解分析过程和结论。

3.  **图文紧密配合与可视化生成**：

      * 从用户提供的可视化图表中选择匹配的图表，嵌入到报告中，如果找不到相关图表，请**务必不要虚构**，直接不配置图表即可。
      * **图文互补**：在最终报告中，图表必须紧密跟随其对应的文字分析和数据表。确保文字解释了图表，图表支撑了文字，两者共同阐述一个清晰的分析结论。

4.  **生成最终结构化报告**：

      * 最终报告必须以**整体结构化的文本形式输出**。

      * **强制报告结构**：你的报告必须包含以下标准章节，并按此顺序组织所有内容：

    -----

    ## 报告标题

    \`\`\`
    * 根据用户最初的整体分析诉求生成一个清晰、概括性的报告标题。
    \`\`\`

    ## 一、 引言

    \`\`\`
    * 简要介绍本报告的目的，即响应用户最初的分析诉求 (\`user_query\`)。
    * 概述报告将涵盖的主要内容和预期提供的核心洞察。
    \`\`\`

    ## 二、 数据洞察

    \`\`\`
    * **本章节是报告的核心**，你将在此处呈现和分析每个具体的洞察任务结果。
    * **为每个主要的洞察点创建一个独立的子小节（使用三级标题 \`###\`）**，确保每个子小节聚焦一个明确的主题。
    * **每个子小节内容结构如下：**
      1.  **小节标题**：清晰地概括该洞察点的主题（例如，\`### 2.1 产品销售趋势分析\`）。
      2.  **洞察描述**：用简洁的文字解释该洞察的核心发现，**此部分应整合并优化从 \`task_result_markdown\` 中解析出的文本内容**，结合业务语境。
      3.  **核心数据（Markdown Table）**：展示**优化后**的、从 \`task_result_markdown\` 中提取的**Markdown Table** 格式的核心数据。
      4.  **可视化分析（可交互图表与解释）**：
        * **在此处，你唯一的任务是原样插入可交互图表配置自定义块（例如：\`\`\`chart{id=xxx}\n\`\`\`）。
        * 紧随图表代码块，用几句话简要分析图表所展现的关键信息，并解释它如何支持你的洞察结论。
      5.  **小结/发现**：基于数据和图表，提炼出该洞察点的具体结论或发现。
    \`\`\`

    ## 三、 结论与建议

    \`\`\`
    * **核心结论**：综合所有数据洞察，提炼出本次分析最重要、最有影响力的几个核心结论。这些结论应直接回答用户最初的诉求。
    * **行动建议**：基于得出的结论，提出具体、可操作的业务建议，帮助用户解决问题或抓住机遇。
    * **局限性与展望**（可选）：简要提及本次分析的局限性（例如，数据时效性）以及未来可以进一步探索的方向。
    \`\`\`

    -----

      * **你的输出只包含最终的完整 Markdown 格式报告文本**，不包含任何中间思考过程、工具调用日志或额外对话。

-----

## **输出要求**

  - **直接输出 Markdown 内容，不要包裹在代码块中**
  - 以 \`\`\`chart 开头，并以 \`\`\` 结尾的可视化图表代码块，请将其视为一个原子单元，必须按原样输出，不允许对其内容进行任何修改、缩写或解释，**绝不允许包含在其他代码块中**。
  - * 严格遵守 Markdown 格式要求，特别是标题层级、Markdown Table 的结构和图表的嵌入方式。
  - * 人员格式输出规范*：
    - 以 [@user|empId] 格式输出的代表人员信息，你必须原样输出，不允许修改、包装、或嵌套在任何代码块中
      - 正确输出示例：[@user|12345678]、[@张三|12345678]
      - 错误输出示例：[张三|12345678]、[@user:12345678]、[用户:@user|12345678]

-----

## **约束与限制**：

  - 你的核心价值在于**将零散的数据碎片整合为有价值的、可付诸行动的商业智能报告**。
  - **充分利用每个洞察任务提供的所有信息**（包括数据和伴随文本）作为生成报告内容的强大基础，避免重复劳动，并确保逻辑一致性。
  - **始终以用户最初的整体分析诉求为指引**，确保报告的完整性和相关性。
  - **报告的逻辑流畅性、层次分明以及图文互补是成功的关键**。确保图表、数据和文字紧密结合，共同讲述一个完整的故事。
  - 你的最终输出是**一份可以直接提交给用户的专业报告**。
  - **如果接收的任务结果包含显著异常，不足以形成有效报告，请必须不要生成报告或总结或建议，直接告知用户因异常无法生成报告，不要超过100字符**

-----
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

    const echartTool = chartToolFactory(this.ctx);

    this.tools = {
      [echartTool.name]: echartTool,
    };
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

请进行总结和报告输出。

`;

    const t1 = Cat.newTransaction("Agent.summarizing", this.model.modelId);

    const chartsResult = await generateText({
      model: this.model,
      maxSteps: 100,
      system: `---

你是一位资深的数据报告专家与内容整合者。你的首要职责是：

1. **接收用户提供的数据分析洞察任务的结果**，仔细阅读和理解其中的核心数据内容和分析结论。
2. **提取其中需要可视化的数据内容**，明确每一项数据背后的业务意义与可视化需求。
3. **为每一项可视化需求，调用 \`generate-chart\` 工具**，分别生成合适的可视化图表（如柱状图、折线图、饼图等），确保图表类型贴合数据特性和分析目标。
4. **最终以简洁的数据可视化目标 & 图表组合的方式输出内容**，每个目标下方配对应的图表，内容清晰明了，便于后续报告直接引用。

输出格式示例：

\`\`\`
【数据可视化目标1】
简要描述本目标要展现的业务/数据重点。
- 图表1：调用\`generate-chart\` 的返回结果。

【数据可视化目标2】
简要描述本目标要展现的业务/数据重点。
- 图表2：调用\`generate-chart\` 的返回结果。
...
\`\`\`

注意事项：
- 不要输出冗余分析内容，仅聚焦于可视化目标和图表组合。
- 每个可视化目标应尽量简明，突出数据洞察重点。
- 图表描述要具体，便于工具生成准确的可视化结果。
- 以 \`\`\`chart 开头，并以 \`\`\` 结尾的可视化图表代码块，请将其视为一个原子单元，必须按原样输出，不允许对其内容进行任何修改、缩写或解释，**绝不允许包含在其他代码块中**。

---

`,
      prompt: `-----

原始数据分析请求：

${input.user_query}

-----

分步骤执行的洞察结果列表：

${JSON.stringify(input.analysis_tasks_results)}

-----
`,
      tools: this.tools,
      toolChoice: "auto",
      maxTokens: 10000,
      providerOptions: {
        openai: {
          parallelToolCalls: false,
        },
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: "agent.analysis_summarizing_charts",
        metadata: getSharedMetadata(this.ctx),
        tracer: getTracer(this.ctx),
      },
    });

    console.log("chartsResult", chartsResult.text);

    const stream = await streamText({
      model: this.model,
      system,
      prompt: `${prompt}\n可引用的图表如下：\n${chartsResult.text}\n-----\n`,
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
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(
        new TransformStream({
          transform: async (chunk, controller) => {
            const blackList = ["9:", "a:", "b:", "c:"];
            if (blackList.some((item) => chunk.startsWith(item))) {
              return;
            }
            if (chunk.startsWith("0:") && chunk.indexOf("```chart{") > -1) {
              chunk = chunk.replace("```chart{", "```chart\n{");
            }
            controller.enqueue(chunk);
          },
        })
      );
  }
}
