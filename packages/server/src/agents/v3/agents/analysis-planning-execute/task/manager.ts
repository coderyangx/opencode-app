import { nanoid } from "nanoid";
import { AgentTaskRunner } from "./runner.js";
import { EventEmitter } from "events";
import { IAgentTask } from "./type.js";
import { IRunContext } from "../../../types/context.js";
import { AnalysisAgentState } from "../state.js";

export type IPlanningAgentTask = IAgentTask<{ round: number }>;
export type IAnalysisAgentTask = IAgentTask<{
  round: number;
  analysisIndex: number;
  artifactType: "answer" | "report";
}>;
export type IEvaluationAgentTask = IAgentTask<{ round: number }>;
export type ISummarizingAgentTask = IAgentTask<{
  artifactType: "answer" | "report";
}>;

export class AgentTaskManager extends EventEmitter {
  private ctx: IRunContext;
  private messageId: string;
  private maxConcurrency: number;
  private state: AnalysisAgentState;

  constructor(ctx: IRunContext, state: AnalysisAgentState) {
    super();
    this.maxConcurrency = 1;
    this.ctx = ctx;
    this.messageId = nanoid(16);
    this.state = state;
  }

  private taskMap: Map<string, IAgentTask> = new Map();

  private runnerMap: Map<string, AgentTaskRunner> = new Map();

  get tasks() {
    return Array.from(this.taskMap.values());
  }

  addTask = (
    stage: IAgentTask["stage"],
    meta?:
      | IPlanningAgentTask["meta"]
      | IAnalysisAgentTask["meta"]
      | IEvaluationAgentTask["meta"]
      | ISummarizingAgentTask["meta"],
    allowFailure?: boolean
  ) => {
    const task = {
      id: nanoid(10),
      stage,
      status: "PENDING",
      meta,
      dependencies: [],
      dependents: [],
      allowFailure: allowFailure ?? false,
    } as IAgentTask;
    this.taskMap.set(task.id, task);

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

    this.emit("task:log", {
      intro: "task-start",
      data: task,
    });

    const runner = new AgentTaskRunner(task, this.ctx, this.state);
    this.runnerMap.set(task.id, runner);
    this.listeningRunner(runner);
    runner.run();
  };

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

    if (!dependentTask.dependencies.includes(dependencyTaskId)) {
      dependentTask.dependencies.push(dependencyTaskId);
    }

    if (!dependencyTask.dependents.includes(dependentTaskId)) {
      dependencyTask.dependents.push(dependentTaskId);
    }
  }

  canExecute(taskId: string): boolean {
    const task = this.getTask(taskId);
    if (!task || task.status !== "PENDING") {
      return false;
    }

    if (
      this.tasks.filter((item) => ["RUNNING"].includes(item.status)).length >=
      this.maxConcurrency
    ) {
      return false;
    }

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

  proceedExecution() {
    const executableTasks: string[] = [];
    this.taskMap.forEach((task) => {
      if (this.canExecute(task.id)) {
        executableTasks.push(task.id);
      }
    });
    executableTasks.forEach((id) => {
      this.runTask(id);
    });

    this.checkRootState();
  }

  private checkRootState() {
    const tasks = Array.from(this.taskMap.values());

    if (tasks.length === 0) {
      return;
    }

    if (tasks.some((item) => ["PENDING", "RUNNING"].includes(item.status))) {
      return;
    }

    this.emit("task:log", {
      intro: "workflow-end",
      data: this.tasks,
    });

    this.emit("end");
  }

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

      this.emit("task:complete", { taskId, payload });
      this.proceedExecution();
    });

    runner.once("error", ({ taskId, error }) => {
      const task = this.taskMap.get(taskId);
      if (!task) {
        return;
      }
      task.status = "FAILED";
      task.error = error;

      this.emit("task:fail", { taskId, error });

      this.proceedExecution();
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
}
