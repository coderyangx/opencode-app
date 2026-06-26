import { formatDataStreamPart, LanguageModelV1, ToolSet } from "ai";
import { IAgent, IAgentOptions } from "../type";
import { IRunContext } from "../../types/context";
import { AnalysisOrchestrator } from "./orchestrator.js";
import { z } from "zod";
import { agentWorkerPool } from "../../lib/job/pool.js";
import { v4 as uuidV4 } from "uuid";

const inputSchema = z.object({
  user_query: z
    .string()
    .describe(
      "请精确总结用户提出的数据分析需求，严格禁止添加任何联想、推断或额外信息。确保涵盖所有细节，只提取和重述用户明确提及的内容。"
    ),
  language:z.string().describe("请根据用户的输入判断用户期望的语言类型, 比如'中文','英文','阿拉伯语','葡萄牙语' 等")
});

export class AnalysisPlanningExecuteAgent
  implements IAgent<typeof inputSchema>
{
  name = "AnalysisPlanningExecuteAgent";
  description =
    "处理用户复杂的数据分析需求，并最终出具详细的分析报告。适用于需要深度数据探索、多维度交叉分析或多步分析流程等任务，以及利用 Python (numpy, pandas, jieba, scikit-learn) 进行高级分析和算法应用的任务。当用户请求涉及复杂的数据关系、需要多步骤推理、高级算法、深度洞察，或无法通过简单 SQL 取数直接获得完整分析报告时调用此工具";
  model: LanguageModelV1;
  tools: ToolSet;
  inputSchema = inputSchema;

  private ctx: IRunContext;

  constructor(options: IAgentOptions) {
    this.ctx = options.ctx;
  }

  instructions: (ctx: IRunContext) => Promise<string> = async (ctx) => {
    return "";
  };

  async run(input: z.infer<typeof inputSchema>) {
    console.log("AnalysisPlanningExecuteAgent run", input.user_query);

    let orchestrator: AnalysisOrchestrator | null = null;
    const self = this;

    return new ReadableStream({
      async start(controller) {
        console.log("Orchestrator run");
        const jobId = uuidV4();
        orchestrator = new AnalysisOrchestrator(self.ctx, {
          jobId,
          messageId: self.ctx.bizId,
          input: input.user_query,
        });

        // 控制并发
        const token = await agentWorkerPool.getBucket(orchestrator as any);

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
          formatDataStreamPart("message_annotations", annotations)
        );

        orchestrator.once("end", () => {
          controller.close();
          agentWorkerPool.returnBucket(token);
        });

        orchestrator.on("job-update", (chunk) => {
          controller.enqueue(
            formatDataStreamPart("message_annotations", [
              {
                type: "job",
                value: chunk,
              },
            ])
          );
        });

        orchestrator.on("message", (chunk) => {
          controller.enqueue(chunk);
        });

        orchestrator.start();
      },
      async pull() {
        if (orchestrator) {
          await new Promise((resolve) => {
            orchestrator.once("end", resolve);
          });
        }
      },
      cancel() {
        orchestrator?.stop();
      },
    }).pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          if (!/^(d|e):\{/.test(chunk)) {
            controller.enqueue(chunk);
          }
        },
      })
    );
  }
}
