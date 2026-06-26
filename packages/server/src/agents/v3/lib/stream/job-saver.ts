import { saveCopilotTask } from "../../service/chat-session.js";
import { IRunContext } from "../../types/context.js";
import { createDataStreamProcessor } from "./helper.js";

export const enum JobStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETE = "complete",
  ERROR = "error",
  STOPPED = "stopped",
}

interface StreamJobSaverOptions {
  jobId: string;
  ctx: IRunContext;
}

// 写入 job/写入消息

export class StreamJobSaver extends TransformStream<
  [string, string],
  [string, string]
> {
  private started = false;
  private jobStatus?: JobStatus;
  private snapshot?: string;

  constructor(private options: StreamJobSaverOptions) {
    super({
      transform: async (chunk, controller) => {
        if (chunk[0] !== "snapshot") {
          return;
        }
        this.snapshot = chunk[1];

        if (!this.started) {
          await this._start();
          this.started = true;
        }
        await this._transform(chunk, controller);
      },
      flush: async () => {
        await this._flush();
      },
    });
  }

  private async _start() {
    this.jobStatus = JobStatus.RUNNING;
    await this._save();
  }

  private async _transform(
    chunk: [string, string],
    controller: TransformStreamDefaultController
  ) {
    controller.enqueue(chunk);
    if (chunk[0] !== "snapshot") {
      return;
    }
    await this._save();
  }

  private async _flush() {
    if (this.jobStatus !== JobStatus.ERROR) {
      this.jobStatus = JobStatus.COMPLETE;
    }
    await this._save();
  }

  private async _save() {
    const { jobId, ctx } = this.options;
    const { agent, nodes, ...other } = JSON.parse(this.snapshot);
    for (const node of nodes) {
      const processor = createDataStreamProcessor();
      for (const chunk of node.content) {
        processor.push(chunk);
      }
      processor.end();
      await processor.task;
      node.content = processor.getResult();
    }

    const job = {
      id: jobId,
      status: this.jobStatus,
      snapshot: { nodes },
    };
    ctx.memory?.set("job", job);
    const response = await ctx.memory?.get("response");
    if (!response) {
      return;
    }

    response.job = job;

    await saveCopilotTask(
      {
        sessionId: ctx.sessionId,
        taskId: ctx.taskId,
        bizId: ctx.bizId,
        response: JSON.stringify(response),
        operator: ctx.user?.mis,
        operatorUid: ctx.user?.userId ? Number(ctx.user?.userId) : null,
      },
      {
        traceId: ctx.bizId,
        platform: ctx.presetId as any,
      }
    );
  }
}
