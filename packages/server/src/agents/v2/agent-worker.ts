import { NL2SQLDataService } from "../../data/service.js";
import { IRunContext } from "../../types/context.js";
import { IAgentTask } from "../../types/deep-analysis/task.js";
import { ChatAgent } from "./chat.js";
import { PlanningAgent } from "./planning.js";
import { AnalysisAgent } from "./analysis.js";
import { SummarizingAgent } from "./summarizing.js";
import { IAgent } from "../../types/agent.js";
import { StreamTextResult } from "ai";

const getAgent = (stage: IAgentTask["stage"]) => {
  const workerNameMap: Record<
    IAgentTask["stage"],
    new (ctx: IRunContext) => IAgent
  > = {
    start: ChatAgent,
    planning: PlanningAgent,
    analysis: AnalysisAgent,
    summarizing: SummarizingAgent,
  };

  return workerNameMap[stage];
};

process.once(
  "message",
  async (msg: {
    type: "start" | "terminate";
    payload: IAgentTask;
    ctx: IRunContext;
  }) => {
    if (msg.type === "start") {
      const data = msg.payload;
      console.log(
        `Worker received start message with data: ${JSON.stringify(data)}`
      );

      const ctx = msg.ctx;
      ctx.dataSvc = new NL2SQLDataService(ctx);
      ctx.s3 = {
        putObject(key, data) {
          console.log("putObject", key, data);
          process.send({
            type: "s3",
            payload: {
              key,
              data,
            },
          });
        },
      } as any;

      const Agent = getAgent(data.stage);
      if (!Agent) {
        process.send({
          type: "onError",
          payload: "未找到合适的 Agent 来运行任务",
        });
        return;
      }
      const agent = new Agent(ctx);

      try {
        agent.on("log", (log) => {
          process.send({
            type: "log",
            payload: log,
          });
        });
        const result = await agent.run({
          input: data.input,
          onProgress: (chunk) => {
            process.send({
              type: "onChunk",
              payload: chunk,
            });
          },
          onComplete: (ret) => {
            console.log("onFinish");
            process.send({
              type: "onFinish",
              payload: ret,
            });
          },
          onFail: (error) => {
            console.log("onError", error);
            process.send({
              type: "onError",
              payload: error.message,
            });
          },
        });

        if (result && (result as StreamTextResult<any, any>).toDataStream) {
          const stream = (result as StreamTextResult<any, any>).toDataStream();

          const reader = stream.getReader();

          while (true) {
            const { done } = await reader.read();
            if (done) {
              break;
            }
          }
        } else {
          console.log("onFinish");
          process.send({
            type: "onFinish",
            payload: result,
          });
        }
      } catch (e) {
        process.send({
          type: "onError",
          payload: e,
        });
        agent.removeAllListeners();
      }
    } else if (msg.type === "terminate") {
      console.log("worker exit by command");
      process.exit(0);
    }
  }
);

process.send({ type: "ready" });

console.log("Child Worker process started.");
