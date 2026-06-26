import { IAgentTask } from "../../../types/deep-analysis/index";
import path from "path";
import { fileURLToPath } from "url";
import { ChildProcess, fork } from "child_process";
import { IRunContext } from "../../../types/context";
import EventEmitter from "events";
import { cloneDeepWith } from "lodash-es";
import { s3 } from "../../../lib/memory-s3/index.js";
import { logger } from "../../../lib/log/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In dev mode (tsx), use the .ts file; in production, use the .js file in /dist/
const isDev = process.env.NODE_ENV === "local" || !process.env.NODE_ENV;
const workerPath = isDev
  ? path.resolve(__dirname, "../agent-worker.ts")
  : path
      .resolve(__dirname, "../agent-worker.js")
      .replace("/src/", "/dist/");
console.log(`Main thread: Starting worker from ${workerPath}`);

export class AgentTaskRunner extends EventEmitter {
  private task: IAgentTask;
  private ctx: IRunContext;
  private worker: ChildProcess;

  get stage() {
    return this.task.stage;
  }

  constructor(task: IAgentTask, ctx: IRunContext) {
    super();
    this.task = cloneDeepWith(task, (val) => {
      if (typeof val === "function") {
        return val.toString();
      }
    });
    this.ctx = ctx;
  }

  run() {
    try {
      this.emit("start", { taskId: this.task.id });
      this.worker = fork(workerPath, [], {
        execArgv: isDev ? ["--import", "tsx"] : undefined,
      });
      this.worker.on("message", (msg: any) => {
        if (msg.type === "ready") {
          this.worker.send({
            type: "start",
            payload: this.task,
            ctx: JSON.parse(JSON.stringify(this.ctx)),
          });
        } else if (msg.type === "onChunk") {
          this.emit("progress", {
            taskId: this.task.id,
            payload: msg.payload,
          });
        } else if (msg.type === "onFinish") {
          this.emit("complete", {
            taskId: this.task.id,
            payload: msg.payload,
          });
          this.worker.send({ type: "terminate" });
          this.worker.kill();
        } else if (msg.type === "onError") {
          this.emit("error", {
            taskId: this.task.id,
            payload: msg.payload,
          });
          this.worker.send({ type: "terminate" });
          this.worker.kill();
        } else if (msg.type === "log") {
          this.emit("log", {
            stage: this.stage,
            taskId: this.task.id,
            log: msg.payload,
          });
        } else if (msg.type === "s3") {
          console.log("s3", msg.payload.data);
          s3.putObject(msg.payload.key, msg.payload.data);
        }
      });

      this.worker.on("error", (err: Error) => {
        console.error("Main thread: Worker error:", err);
        this.emit("error", {
          taskId: this.task.id,
          payload: err.message,
        });
        this.worker.send({ type: "terminate" });
        this.worker.kill();
        this.emit("log", {
          stage: this.stage,
          taskId: this.task.id,
          log: `Worker error: ${err.message}`,
        });
      });

      this.worker.on("exit", (code: number) => {
        if (code !== 0) {
          console.error(`Main thread: Worker stopped with exit code ${code}`);
        } else {
          console.log("Main thread: Worker terminated successfully.");
        }
      });
    } catch (e: any) {
      logger.info("run-worker-error", e);
      this.emit("log", {
        intro: "run-worker-error",
        error: e.message,
        task: this.task,
      });
    }
  }

  stop() {
    this.worker.send({ type: "terminate" });
    this.worker.kill();
  }

  on(event: "start", listener: (payload: { taskId: string }) => void): this;
  on(
    event: "progress",
    listener: (payload: { taskId: string; payload: string }) => void
  ): this;
  on(
    event: "complete",
    listener: (payload: { taskId: string; payload: any }) => void
  ): this;
  on(
    event: "error",
    listener: (payload: { taskId: string; payload: string }) => void
  ): this;
  on(event: "log", listener: (log: any) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    super.on(event, listener);
    return this;
  }
}
