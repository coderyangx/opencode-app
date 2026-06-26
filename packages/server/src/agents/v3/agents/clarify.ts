import {
  createDataStream,
  formatDataStreamPart,
  LanguageModelV1,
  streamText,
  ToolSet,
} from "ai";
import { IAgent, IAgentOptions } from "./type";
import { IRunContext } from "../types/context";
import { getLanguageModel } from "../model/llm.js";
import { z } from "zod";
import { AnalysisPlanningExecuteAgent } from "./analysis-planning-execute/index.js";
import { AnalysisReActAgent } from "./analysis-react/index.js";
import Cat from "@dp/cat-client";
import { getSharedMetadata } from "../trace/metadata.js";
import { getSystemInfo } from "../prompts/system-info.js";
import { createMessageReadableStream } from "../lib/stream/helper.js";
import { getTracer } from "../trace/langfuse.js";
import { searchToolsServerFactory } from "../tools/mcp/web-search.js";

/**
 * 负责主对话/澄清的 agent
 */
export class ChatAndClarifyAgent implements IAgent {
  name = "ChatAndClarifyAgent";
  description: string = "";
  model: LanguageModelV1;

  tools: ToolSet;

  private ctx: IRunContext;
  private routes: Map<string, IAgent> = new Map();

  private dbSchema: string = "";

  private disposers: (() => void)[] = [];

  constructor(options: IAgentOptions) {
    this.ctx = options.ctx;
    this.model = getLanguageModel("LongCat-Large-32K-Chat-0626");
    this.tools = {};

    // route agent
    this.addRoute(
      "_analysis_planning_execute_",
      new AnalysisPlanningExecuteAgent(options)
    );
    this.addRoute("_analysis_react_", new AnalysisReActAgent(options));
  }
  inputSchema?: undefined;

  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    const tableInfo = await ctx.dataSvc?.getDataSchema();
    this.dbSchema = JSON.stringify(tableInfo);

    return `
-----

## **角色和目标**

你是一位**资深的数据查询/分析专家**，擅长执行数据查询和从结构化数据中提取洞察。你的核心职责是**精确理解用户意图**，并**在确保数据查询/分析可执行的前提下，最大限度地进行合理推断和默认执行，在信息完备时直接、无解释地执行必要的工具调用**。你会在尊重用户业界常识的基础上，仅在**关键信息缺失导致无法有效执行查询分析**时，才向用户进行澄清。

-----

## **系统信息**

${getSystemInfo(ctx)}
- 工作环境: 你集成在一个在线数据表格系统中，并已经具备直接使用相关工具获取表格结构和数据的能力，不需要向用户索要数据或数据文件。

-----

## **背景知识和上下文**

* **当前数据库表信息上下文**：
\`\`\`json
${JSON.stringify(tableInfo)}
\`\`\`

-----

## **可用的工具**

${
  this.ctx.searchWeb
    ? "- 如果分析任务需要外部信息、背景知识、最新的数据、或是不熟悉的专业概念，请主动调用网页搜索工具来获取信息。在搜索时，请使用精准的关键词"
    : ""
}

## **任务流程**

### 1. 评估用户意图

  * **识别相关性**：
      * 如果用户的提问与**数据表结构信息**相关，直接基于当前数据库表信息上下文来回答，**不要冗余调用工具**
      * 如果用户的提问与**数据查询、数据分析、报表生成、数据可视化、数据趋势预测、数据清洗、数据聚合、统计分析**等数据专业领域**无关**，你必须立即回复并基于当前上下文提供一些相关的推荐问题。
  * **判断信息完备性与可推断性 (高容错性)**：
      * 如果用户的问题与数据分析相关，你将**首先尝试根据你的专业知识和所掌握的数据表结构信息进行合理推断**。
      * **推断与默认执行的原则**：
          * **安全只读**：由于数据分析是只读场景，相对安全，你应**尽可能地自行给出默认的推断条件并执行**。
          * **常识与约定俗成**：充分利用数据分析领域的**行业常识**和**普遍约定俗成**的业务逻辑进行推断。例如，如果用户仅说"分析销售数据"，在没有其他上下文的情况下，你可以默认分析总销售额。
          * **默认值填充**：对于筛选条件、时间范围、具体字段选择等**非关键缺失但有合理默认值**的信息，你可以默认使用最宽泛或最常用的值（例如，若未指定筛选条件，则默认为**无筛选条件**；若未指定时间范围，则默认为**所有可用数据**；若未指定具体字段，则默认选择与用户意图最相关的**核心指标或所有可见字段**），并直接尝试执行分析。
      * **仅在以下情况进行澄清**：
          * **关键信息缺失导致无法执行有效查询分析**：例如，用户请求分析的数据表不存在，或用户要求分析的列名在所有表中均不存在。
          * **存在明显的语义歧义且无法通过常识或默认推断得出唯一确定结果**：例如，某个指标存在多个同名但含义完全不同的字段，且无法通过上下文判断用户意图。

### 2. 引导用户澄清信息 (精准且必要)

  * 当你**确实无法通过推断或默认值来执行有效查询分析**时，你必须**清晰、具体、礼貌地提问**，引导用户补充或澄清。
  * 如果用户的意图模糊，你应该基于当前系统的能力和上下文提供一些推荐问题来引导用户使用
  * 你的问题应基于已有的数据表结构信息，旨在帮助用户提供一个**明确、无歧义、可直接执行分析**的请求。
  * **绝不尝试猜测用户意图。** 如果关键疑问仍未消除，继续提问，直到所有必要信息都已明确。

### 3. 触发查询/分析任务

  * **只有当所有关键疑问都被彻底澄清，并且你确信当前请求已明确且可直接执行时**，你才会终止与用户的互动，并恰当地选择的工具以启动数据查询/分析任务。

-----

## **重要原则：**

  * 你的核心价值在于**精确理解意图、高效引导沟通**，并在**确保安全和准确的前提下最大限度地简化用户交互**。
  * 始终保持专业、耐心和清晰的沟通风格，**并信任你的推断能力和用户在常识层面的理解能力**。
  * **只在出现新的、明确的、尚未被满足的需求时调用工具。**
  * **如果用户提出的问题已经得到回答，并且最新消息没有提出新问题、也并非原问题的修改或深化，则绝不重复调用之前的工具。**
  * 忽略无意义的、礼貌性的（如"谢谢"）、或单纯确认性质的消息，这些不应触发工具调用。

-----
`;
  };

  private dispose() {
    const disposers = this.disposers.slice(0);
    this.disposers = [];
    disposers.forEach((dispose) => dispose());
  }

  private async getTools() {
    const tools: ToolSet = {
      ...this.tools,
    };
    this.routes.forEach((agent, route) => {
      Object.assign(tools, {
        [route]: {
          type: "function",
          description: agent.description,
          parameters: agent.inputSchema || z.object({}),
        },
      });
    });

    // 添加网页搜索工具
    if (this.ctx.searchWeb) {
      try {
        const bingSearchServer = await searchToolsServerFactory();
        await bingSearchServer.init();
        const searchTools = await bingSearchServer.tools();
        Object.assign(tools, searchTools);
        this.disposers.push(() => bingSearchServer.close());
      } catch (error) {
        console.log(error);
        Cat.logError(error);
      }
    }

    return tools;
  }

  private async callAgent(
    route: string,
    args: any,
    controller: TransformStreamDefaultController<string>
  ) {
    console.log("callAgent", route, args);
    const agent = this.routes.get(route);
    try {
      const subResp = await agent.run(args);
      const reader = subResp.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
    } catch (error) {
      console.error(error);
      controller.enqueue(formatDataStreamPart("error", error.message));
    }
  }

  addRoute(route: string, agent: IAgent<any, any>) {
    if (this.routes.has(route)) {
      throw new Error(`Route ${route} already exists`);
    }
    this.routes.set(route, agent);
  }

  async run() {
    const t1 = Cat.newTransaction("Chat", this.ctx.sessionId);
    t1.addData("traceId", this.ctx.bizId);

    let system;
    try {
      system = await this.instructions(this.ctx);
    } catch (error) {
      this.dispose();
      console.log("error", error);
      // 此时一般是 DB Schema 没有访问权限或者获取失败
      return createMessageReadableStream(
        formatDataStreamPart("text", "很抱歉，无法访问数据信息")
      );
    }
    // 主对话 agent 可以访问对话历史
    const messages = this.ctx.history || [];

    const tools = await this.getTools();

    const result = streamText({
      model: this.model,
      messages,
      system,
      maxSteps: 1,
      temperature: 0.3,
      toolCallStreaming: false,
      tools,
      providerOptions: {
        openai: {
          parallelToolCalls: false,
        },
      },
      experimental_generateMessageId: () => this.ctx.bizId,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "agent.general_chat_clarify",
        tracer: getTracer(this.ctx),
        metadata: getSharedMetadata(
          this.ctx,
          this.ctx.presetId === "xtable"
            ? {
                dbSchema: this.dbSchema,
              }
            : {}
        ),
      },
      onError: (e) => {
        console.log("chat agent error", e.error);
        Cat.logError(this.name, e.error as Error);
        this.dispose();
      },
    });

    const resp = createDataStream({
      execute: async (dataStream) => {
        dataStream.write(
          formatDataStreamPart("data", [
            { type: "conversationId", value: this.ctx.sessionId },
          ])
        );
        dataStream.write(
          formatDataStreamPart("message_annotations", [
            {
              type: "bizId",
              value: this.ctx.bizId,
            },
            {
              type: "taskId",
              value: this.ctx.taskId,
            },
          ])
        );
        result.consumeStream();
        result.mergeIntoDataStream(dataStream, {
          experimental_sendFinish: false,
          sendReasoning: true,
        });
      },
    }).pipeThrough(
      new TransformStream({
        transform: async (chunk, controller) => {
          if (/^(e:\{|d:\{)/.test(chunk)) {
            return;
          }
          if (chunk.startsWith("9:")) {
            // 找出路由的工具调用
            const call = JSON.parse(chunk.slice(2));
            if (this.routes.has(call.toolName)) {
              await this.callAgent(call.toolName, call.args, controller);
              return;
            }
          }

          if (chunk.startsWith("3:")) {
            t1.logError(chunk.slice(2));
            t1.setStatus(Cat.STATUS.FAIL);
          }

          controller.enqueue(chunk);
        },
        flush: async (controller) => {
          controller.enqueue(
            formatDataStreamPart("finish_step", {
              finishReason: "stop",
              isContinued: false,
            })
          );
          controller.enqueue(
            formatDataStreamPart("finish_message", { finishReason: "stop" })
          );

          t1.complete();
          this.dispose();
        },
      })
    );

    return resp;
  }
}
