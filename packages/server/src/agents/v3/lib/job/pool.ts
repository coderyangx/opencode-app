import { v4 as uuidV4 } from "uuid";
import { StreamJobSaver } from "../stream/job-saver.js";
import { IRunContext } from "../../types/context.js";

interface IJob {
  jobId: string;
  ctx: IRunContext;
  stream: ReadableStream<[string, any]>;
}

// TODO abort signal

class AgentJobPool {
  private concurrency: number;
  private usingTokens: Set<string> = new Set([]);
  private queue: Function[] = [];
  private jobs: Map<string, IJob> = new Map();

  constructor(concurrency: number = 100) {
    this.concurrency = concurrency;
  }

  async getBucket(job?: IJob): Promise<string> {
    if (this.usingTokens.size < this.concurrency) {
      if (job) {
        this._acceptJob(job);
      }
      return Promise.resolve(this._generateToken());
    }

    return new Promise((resolve) => {
      this.queue.push(() => {
        if (job) {
          this._acceptJob(job);
        }
        resolve(this._generateToken());
      });
    });
  }

  returnBucket(token: string) {
    this.usingTokens.delete(token);
    process.nextTick(() => {
      this._processQueue();
    });
  }

  private _generateToken() {
    const token = uuidV4();
    this.usingTokens.add(token);

    // 超时自动回收
    setTimeout(() => {
      if (!this.usingTokens.has(token)) {
        return;
      }
      this.usingTokens.delete(token);
      this._processQueue();
    }, 1000 * 60 * 10);
    return token;
  }

  private _processQueue() {
    if (this.queue.length === 0 || this.usingTokens.size >= this.concurrency) {
      return;
    }
    const fn = this.queue.shift();
    fn?.();
  }

  private _acceptJob(job: IJob) {
    const self = this;
    this.jobs.set(job.jobId, job);
    job.stream
      .pipeThrough(
        new StreamJobSaver({
          jobId: job.jobId,
          ctx: job.ctx,
        })
      )
      .pipeThrough(
        new TransformStream({
          flush() {
            self.jobs.delete(job.jobId);
          },
        })
      )
      .pipeTo(new WritableStream());
  }
}

export const agentWorkerPool = new AgentJobPool();
