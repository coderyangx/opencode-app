import { nanoid } from "nanoid";
import { IRunContext } from "../../../types/context";
import {
  EAssistantMessageType,
  IAgentTask,
} from "../../../types/deep-analysis/index.js";
import { AgentTaskRunner } from "./runner.js";
import { EventEmitter } from "events";
import { IPlanningAgentInput, IPlanningAgentOutput } from "../planning.js";
import { IAnalysisAgentInput, IAnalysisAgentOutput } from "../analysis.js";
import {
  ISummarizingAgentInput,
  ISummarizingAgentOutput,
} from "../summarizing.js";

export type IPlanningAgentTask = IAgentTask<
  IPlanningAgentInput,
  IPlanningAgentOutput
>;
export type IAnalysisAgentTask = IAgentTask<
  IAnalysisAgentInput,
  IAnalysisAgentOutput,
  { stepIndex: number }
>;
export type ISummarizingAgentTask = IAgentTask<
  ISummarizingAgentInput,
  ISummarizingAgentOutput
>;

export class AgentTaskManager extends EventEmitter {
  private ctx: IRunContext;
  private messageId: string;
  private maxConcurrency: number;

  constructor(ctx: IRunContext) {
    super();
    this.maxConcurrency = 1;
    this.ctx = ctx;
    this.messageId = nanoid(16);
    this.rootTask = {
      id: nanoid(10),
      stage: "start",
      status: "PENDING",
      dependencies: [],
      dependents: [],
      output: "",
    };
    this.taskMap.set(this.rootTask.id, this.rootTask as IAgentTask);
  }

  rootTask: IAgentTask<never, string, never>;

  planningTasks: IPlanningAgentTask[];

  analysisTasks: IAnalysisAgentTask[];

  summarizingTask: ISummarizingAgentTask;

  private taskMap: Map<string, IAgentTask> = new Map();

  private runnerMap: Map<string, AgentTaskRunner> = new Map();

  get tasks() {
    return Array.from(this.taskMap.values());
  }

  addTask = (
    stage: IAgentTask["stage"],
    input: IPlanningAgentInput | IAnalysisAgentInput | ISummarizingAgentInput,
    meta?:
      | IPlanningAgentTask["meta"]
      | IAnalysisAgentTask["meta"]
      | ISummarizingAgentTask["meta"],
    allowFailure?: boolean,
    beforeExecute?: (task: IAgentTask, tasks: IAgentTask[]) => void
  ) => {
    const task = {
      id: nanoid(10),
      stage,
      status: "PENDING",
      input,
      meta,
      dependencies: [],
      dependents: [],
      allowFailure: allowFailure ?? false,
      beforeExecute,
    } as IAgentTask;
    this.taskMap.set(task.id, task);

    // root task 依赖每一个添加的任务完成
    this.addDependency(this.rootTask.id, task.id);

    this.emit("task:added", { taskId: task.id });

    this.emit("task:log", {
      intro: "task-add",
      data: task,
    });

    return task;
  };

  getTask(taskId: string): IAgentTask | undefined {
    return this.taskMap.get(taskId);
  }

  runTask = (id: string) => {
    const task = this.taskMap.get(id);
    if (!task) {
      return;
    }

    if (!this.canExecute(id)) {
      return;
    }
    if (task.beforeExecute) {
      task.beforeExecute(task, Array.from(this.taskMap.values()));
    }

    this.emit("task:log", {
      intro: "task-start",
      data: task,
    });

    const runner = new AgentTaskRunner(task, this.ctx);
    this.runnerMap.set(task.id, runner);
    this.listeningRunner(runner);
    runner.run();
  };

  updateTaskStatus(
    taskId: string,
    status: IAgentTask["status"],
    output?: any
  ): void {
    const task = this.getTask(taskId);
    if (task) {
      task.status = status;
      task.output = (output ?? task.output) as never;
      this.proceedExecution();
    } else {
      console.warn(`Task with ID "${taskId}" not found.`);
    }
  }

  /**
   * 添加任务依赖关系。
   * 例如：taskB 依赖 taskA，即 taskA 是 taskB 的上游。
   * @param dependentTaskId 依赖任务的ID (下游任务)。
   * @param dependencyTaskId 被依赖任务的ID (上游任务)。
   */
  addDependency(dependentTaskId: string, dependencyTaskId: string): void {
    const dependentTask = this.getTask(dependentTaskId);
    const dependencyTask = this.getTask(dependencyTaskId);

    if (!dependentTask) {
      console.error(`Dependent task with ID "${dependentTaskId}" not found.`);
      return;
    }
    if (!dependencyTask) {
      console.error(`Dependency task with ID "${dependencyTaskId}" not found.`);
      return;
    }

    // 将 dependencyTaskId 添加到 dependentTask 的 dependencies 列表中
    if (!dependentTask.dependencies.includes(dependencyTaskId)) {
      dependentTask.dependencies.push(dependencyTaskId);
    }

    // 将 dependentTaskId 添加到 dependencyTask 的 dependents 列表中
    if (!dependencyTask.dependents.includes(dependentTaskId)) {
      dependencyTask.dependents.push(dependentTaskId);
    }
  }

  /**
   * 检查任务是否可以执行（所有上游依赖都已完成）。
   * @param taskId 任务ID。
   * @returns 如果可执行则为 true，否则为 false。
   */
  canExecute(taskId: string): boolean {
    const task = this.getTask(taskId);
    if (!task || task.status !== "PENDING") {
      return false;
    }

    // 并发度检测
    if (
      this.tasks.filter(
        (item) =>
          item.id !== this.rootTask.id && ["RUNNING"].includes(item.status)
      ).length >= this.maxConcurrency
    ) {
      return false;
    }

    // 检查所有上游依赖是否都已完成
    return task.dependencies.every((depId) => {
      const depTask = this.getTask(depId);
      if (!depTask) {
        return false;
      }
      if (depTask.status === "COMPLETED") {
        return true;
      }
      return depTask.allowFailure && depTask.status === "FAILED";
    });
  }

  /**
   * 继续执行所有可执行任务
   */
  proceedExecution() {
    const executableTasks: string[] = [];
    this.taskMap.forEach((task) => {
      if (this.canExecute(task.id)) {
        executableTasks.push(task.id);
      }
    });
    // 暂时不限并发度
    executableTasks.forEach((id) => {
      this.runTask(id);
    });

    this.checkRootState();
  }

  private checkRootState() {
    const tasks = Array.from(this.taskMap.values()).filter(
      (item) => item.id !== this.rootTask.id
    );

    if (tasks.length === 0) {
      return;
    }

    if (tasks.some((item) => ["PENDING", "RUNNING"].includes(item.status))) {
      return;
    }

    if (
      tasks
        .filter((item) => !item.allowFailure)
        .some((item) => item.status === "FAILED")
    ) {
      this.rootTask.status = "FAILED";
    } else if (tasks.some((item) => item.status === "CANCELLED")) {
      this.rootTask.status = "CANCELLED";
    } else {
      this.rootTask.status = "COMPLETED";
    }

    this.emit("task:log", {
      intro: "workflow-end",
      data: this.tasks,
    });

    this.emit("end");
  }

  // 监听 agent runner 执行状态/进度更新
  private listeningRunner = (runner: AgentTaskRunner) => {
    runner.once("start", ({ taskId }) => {
      const task = this.taskMap.get(taskId);
      if (!task) {
        return;
      }
      task.status = "RUNNING";

      this.emit("task:start", { taskId });
    });

    runner.once("complete", ({ taskId, payload }) => {
      const task = this.taskMap.get(taskId);
      if (!task) {
        return;
      }
      task.status = "COMPLETED";
      task.output = payload as unknown as never;

      this.emit("task:complete", { taskId, payload });
      this.proceedExecution();
    });

    runner.once("error", ({ taskId, error }) => {
      const task = this.taskMap.get(taskId);
      if (!task) {
        return;
      }
      task.status = "FAILED";

      this.emit("task:fail", { taskId, error });

      this.proceedExecution();

      // TODO 支持重新规划新任务
    });

    runner.once("cancel", ({ taskId, reason }) => {
      const task = this.taskMap.get(taskId);
      if (!task) {
        return;
      }
      task.status = "CANCELLED";

      this.emit("task:cancel", { taskId, reason });
      this.proceedExecution();
    });

    // runner progress (chunk)
    runner.on("progress", ({ taskId, payload }) => {
      const task = this.taskMap.get(taskId);
      if (!task) {
        return;
      }

      this.emit("task:progress", { taskId, payload });
    });

    runner.on("log", (log) => {
      this.emit("task:log", log);
    });
  };

  stopAll = () => {
    this.rootTask.status = "CANCELLED";
    for (const task of this.tasks) {
      if (task.status === "RUNNING") {
        task.status = "CANCELLED";
        const runner = this.runnerMap.get(task.id);
        if (runner) {
          runner.stop();
          this.runnerMap.delete(task.id);
        }
      } else if (task.status === "PENDING") {
        task.status = "CANCELLED";
      }
    }
    this.emit("end");
  };

  // helpers
  generateWsDialogResponseMessage(token: string, stop?: boolean) {
    return JSON.stringify({
      conversationId: this.ctx.sessionId,
      messageId: this.messageId,
      timestamp: Date.now(),
      type: EAssistantMessageType.NORMAL,
      payload: {
        token,
        stop: stop ?? false,
      },
    });
  }

  generateWsDataAnalysisResponseMessage(
    token: string,
    stop?: boolean,
    messageTag?: "start" | "header" | "summary" | "final" | "end",
    stepIndex?: number
  ) {
    return JSON.stringify({
      conversationId: this.ctx.sessionId,
      messageId: this.messageId,
      timestamp: Date.now(),
      type: EAssistantMessageType.ANALYSIS,
      payload: {
        token,
        stop: stop ?? false,
        messageTag,
        stepIndex,
      },
    });
  }

  generateWsErrorResponseMessage(error: Error | string) {
    return JSON.stringify({
      conversationId: this.ctx.sessionId,
      messageId: this.messageId,
      timestamp: Date.now(),
      type: EAssistantMessageType.ERROR,
      payload: {
        message: typeof error === "string" ? error : error.message,
      },
    });
  }
}

// TODO 支持从已有 taskId 恢复状态
