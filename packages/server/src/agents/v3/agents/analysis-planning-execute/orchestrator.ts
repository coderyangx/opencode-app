import { IRunContext } from "../../types/context";
import {
  AgentTaskManager,
  IAnalysisAgentTask,
  IPlanningAgentTask,
  IEvaluationAgentTask,
  ISummarizingAgentTask,
} from "./task/manager.js";
import { EventEmitter } from "events";
import { IPlanningAgentOutput } from "./planning.js";
import { formatDataStreamPart } from "ai";
import { IAgentTask } from "./task/type";
import { AnalysisAgentState } from "./state.js";
import { IEvaluationAgentOutput } from "./evaluate";

// 分析 agent graph 协调器
export class AnalysisOrchestrator extends EventEmitter<
  Record<"message" | "end" | "job-update" | "snapshot", any[]>
> {
  private readonly ctx: IRunContext;
  private readonly taskManager: AgentTaskManager;
  private readonly messageId: string;
  private readonly _stream: ReadableStream<
    ["message" | "job-update" | "end" | "snapshot", string]
  >;
  private readonly state: AnalysisAgentState;
  private readonly maxEvaluationRound = 0; // 暂时不启用

  public readonly jobId: string;
  public finished = false;
  public agent = "analysis";

  public get stream() {
    return this._stream;
  }

  constructor(ctx: IRunContext, { jobId, messageId, input }) {
    super();
    this.ctx = ctx;
    this.messageId = messageId;
    this.jobId = jobId;
    this.state = new AnalysisAgentState();
    this.state.planningTarget = {
      user_query: input,
    };
    this.taskManager = new AgentTaskManager(ctx, this.state);

    this.taskManager.on("task:added", this.onAgentTaskAdded);
    this.taskManager.on("task:start", this.onAgentTaskStart);
    this.taskManager.on("task:progress", this.onAgentTaskProgress);
    this.taskManager.on("task:complete", this.onAgentTaskComplete);
    this.taskManager.on("task:fail", this.onAgentTaskFail);
    this.taskManager.on("task:cancel", this.onAgentTaskCancel);
    this.taskManager.on("end", this.endWorkFlow);
    this.taskManager.on("task:log", (info) => {
      // const text = JSON.stringify({ type: "LOG", ...info });
    });

    const self = this;
    this._stream = new ReadableStream({
      async start(controller) {
        self.on("message", (data) => {
          controller.enqueue(["message", data]);
        });
        self.on("job-update", (data) => {
          controller.enqueue(["job-update", data]);
        });
        self.once("end", () => {
          controller.enqueue(["end", ""]);
          controller.close();
        });
        self.on("snapshot", (snapshot) => {
          controller.enqueue(["snapshot", JSON.stringify(snapshot)]);
        });
      },
    });

    this.on("job-update", (chunk) => {
      this.state.push(chunk);
    });
  }

  async start() {
    const task = this.taskManager.addTask("planning", {
      round: 1,
      stepIndex: 0,
      stepName: "规划",
    });
    this.taskManager.runTask(task.id);
  }

  async stop() {
    this.taskManager.stopAll();
    this.finished = true;
  }

  private takeSnapshot() {
    const snapshot = this.state.snapshot();
    this.emit("snapshot", snapshot);
  }

  // listeners
  private onAgentTaskAdded = ({ taskId }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    this.takeSnapshot();
  };

  private onAgentTaskStart = ({ taskId }) => {
    const task = this.taskManager.getTask(taskId);
    console.log("onAgentTaskStart", task);
    if (!task) {
      return;
    }

    if (task.stage === "planning") {
      const currentTask = task as IPlanningAgentTask;
      if (currentTask.meta.round > 1) {
        return;
      }
      let text = this.state.planningTarget.user_query || "";
      text += "\n\n";
      this.emit(
        "job-update",
        this.generateJobUpdateMessage(
          formatDataStreamPart("text", text),
          false,
          currentTask
        )
      );
    } else if (task.stage === "analysis") {
      const currentTask = task as IAnalysisAgentTask;
      this.emit(
        "job-update",
        this.generateJobUpdateMessage("", false, currentTask)
      );
    } else if (task.stage === "summarizing") {
      this.emit("job-update", this.generateJobUpdateMessage("", false, task));
    }

    this.takeSnapshot();
  };

  private onAgentTaskProgress = ({ taskId, payload }) => {
    const task = this.taskManager.getTask(taskId) as IAgentTask;
    if (!task) {
      return;
    }

    if (task.stage === "planning") {
      // planning 阶段直接由最终 finish 事件触发 ws 消息，没有中间过程的更新
    } else if (task.stage === "analysis") {
      const currentTask = this.taskManager.getTask(
        taskId
      ) as IAnalysisAgentTask;
      this.emit(
        "job-update",
        this.generateJobUpdateMessage(payload, false, currentTask)
      );
    } else if (task.stage === "summarizing") {
      this.emit(
        "job-update",
        this.generateJobUpdateMessage(payload, false, task)
      );
      this.emit("message", payload); // 报告的内容需要发一份 SSE 使用的
    }
  };

  private onAgentTaskComplete = ({ taskId, payload }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    if (task.stage === "planning") {
      const currentTask = task as IPlanningAgentTask;
      if (currentTask.meta?.round === 1) {
        this.emit("job-update", this.generateJobUpdateMessage("", true, task));
      }
      const output = payload as IPlanningAgentOutput;
      if (!output.goals || output.goals.length === 0) {
        return;
      }
      const analysisTasks: IAgentTask[] = [];
      // 添加分析任务
      for (const item of output.goals) {
        const stepIndex = this.taskManager.tasks.length;
        const analysisIndex = this.state.analysisTargets.length;
        this.state.analysisTargets.push({
          current_goal: item,
          goals: output.goals,
        });
        const runTask = this.taskManager.addTask(
          "analysis",
          {
            stepIndex,
            stepName: item.goal_title,
            analysisIndex,
            round: currentTask.meta?.round || 1,
          },
          true
        );
        this.taskManager.runTask(runTask.id);
        analysisTasks.push(runTask);
      }

      if (currentTask.meta?.round <= this.maxEvaluationRound) {
        const evaluationTask = this.taskManager.addTask(
          "evaluation",
          {
            round: currentTask.meta?.round || 1,
            stepIndex: this.taskManager.tasks.length,
            stepName: "评估",
          },
          true
        );

        const summarizingTask = this.taskManager.addTask(
          "summarizing",
          {
            artifactType: output.artifact_type,
          } as ISummarizingAgentTask["meta"],
          false
        );

        for (const task of analysisTasks) {
          this.taskManager.addDependency(evaluationTask.id, task.id);
        }
        this.taskManager.addDependency(summarizingTask.id, evaluationTask.id);
      } else {
        const summarizingTask = this.taskManager.addTask(
          "summarizing",
          {
            artifactType: output.artifact_type,
          } as ISummarizingAgentTask["meta"],
          false
        );

        for (const task of analysisTasks) {
          this.taskManager.addDependency(summarizingTask.id, task.id);
        }
      }
    } else if (task.stage === "analysis") {
      const currentTask = task as IAnalysisAgentTask;
      this.state.analysisResults.push(payload);
      this.emit(
        "job-update",
        this.generateJobUpdateMessage("", true, currentTask)
      );
    } else if (task.stage === "evaluation") {
      const currentTask = task as IEvaluationAgentTask;
      const evaluationResult = payload as IEvaluationAgentOutput;
      this.state.evaluationResult = evaluationResult;

      if (evaluationResult?.status === "NEEDS_REPLANNING") {
        const newPlanningTask = this.taskManager.addTask(
          "planning",
          {
            round: currentTask.meta?.round + 1,
            stepIndex: this.taskManager.tasks.length,
            stepName: "规划",
          },
          false
        );

        const summarizingTask = this.taskManager.tasks.find(
          (task) => task.stage === "summarizing"
        );
        this.taskManager.addDependency(summarizingTask.id, newPlanningTask.id);
      }
    } else if (task.stage === "summarizing") {
      this.emit("job-update", this.generateJobUpdateMessage("", true, task));
    }

    this.takeSnapshot();
  };

  private onAgentTaskFail = ({ taskId, error }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    this.emit(
      "job-update",
      this.generateJobUpdateMessage("", true, task, error)
    );

    if (task.stage === "planning") {
      this.emit(
        "message",
        formatDataStreamPart("text", "任务规划未能完成，请重试")
      );
    }

    this.takeSnapshot();
  };

  private onAgentTaskCancel = ({ taskId, reason }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    this.emit(
      "job-update",
      this.generateJobUpdateMessage("", true, task, reason)
    );

    this.takeSnapshot();
  };

  // 标记整体结束
  private endWorkFlow = () => {
    console.log("endWorkFlow");
    if (
      !this.taskManager.tasks.find((item) => item.stage === "summarizing") &&
      this.taskManager.tasks.find((item) => item.stage === "analysis")
    ) {
      this.emit(
        "message",
        formatDataStreamPart("text", "规划执行过程出现了一些问题，请重试")
      );
    }
    this.emit(
      "message",
      formatDataStreamPart("finish_step", {
        isContinued: false,
        finishReason: "stop",
      })
    );
    this.finished = true;
    this.takeSnapshot();
    this.emit("end");

    process.nextTick(() => {
      this.dispose();
    });
  };

  // helpers
  private generateJobUpdateMessage(
    token: string,
    stop: boolean,
    task: IAgentTask,
    error?: string
  ) {
    const payload = {
      name: task.meta?.stepName,
      token,
      stop: stop ?? false,
      stage: task.stage,
      index: task.meta?.stepIndex,
      error,
    };

    return JSON.stringify(payload);
  }

  private dispose() {
    this.taskManager.removeAllListeners();
    this.removeAllListeners();
  }
}
