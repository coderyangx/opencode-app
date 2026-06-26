import { nanoid } from "nanoid";
import { IAgent } from "../../types/agent";
import { IRunContext } from "../../types/context";
import {
  EAssistantMessageType,
  IAgentTask,
} from "../../types/deep-analysis/index.js";
import { ChatAgent } from "./chat.js";
import {
  AgentTaskManager,
  IAnalysisAgentTask,
  IPlanningAgentTask,
  ISummarizingAgentTask,
} from "./task/manager.js";
import { EventEmitter } from "events";
import { WSContext } from "hono/ws";
import { IPlanningAgentOutput } from "./planning.js";
import { ISummarizingAgentInput } from "./summarizing.js";
import { StreamTextResult, TextStreamPart } from "ai";

// 协调器，绑定主对话 Agent 及任务管理器
export class Orchestrator extends EventEmitter {
  private readonly ctx: IRunContext;
  private readonly messageId: string;
  private readonly mainAgent: IAgent;
  private readonly taskManager: AgentTaskManager;
  private wsConnection?: WSContext<unknown>;

  // 自然对话消息回复或者 Deep Analysis 特殊消息回复
  // 两种消息类型前台 UI 展示也不一样
  private responseType: EAssistantMessageType;

  private messageQueue: string[] = [];

  constructor(ctx: IRunContext) {
    super();
    this.ctx = ctx;
    this.messageId = nanoid(16);
    this.mainAgent = new ChatAgent(ctx);
    this.taskManager = new AgentTaskManager(ctx);
    this.responseType = EAssistantMessageType.NORMAL;

    this.on("message", (msg) => {
      try {
        if (this.wsConnection?.readyState === 1) {
          this.wsConnection?.send(msg);
        } else {
          this.messageQueue.push(msg);
        }
      } catch {
        // ignore
      }
    });

    this.taskManager.on("task:added", this.onAgentTaskAdded);
    this.taskManager.on("task:start", this.onAgentTaskStart);
    this.taskManager.on("task:progress", this.onAgentTaskProgress);
    this.taskManager.on("task:complete", this.onAgentTaskComplete);
    this.taskManager.on("task:fail", this.onAgentTaskFail);
    this.taskManager.on("task:cancel", this.onAgentTaskCancel);
    this.taskManager.on("end", this.endWorkFlow);
    this.taskManager.on("task:log", (info) => {
      const text = JSON.stringify({ type: "LOG", ...info });
      this.wsConnection?.send(text);
    });
  }

  async start() {
    try {
      // 启动主对话 Agent，负责意图识别，可能会触发 Planning Agent 调用
      this.taskManager.updateTaskStatus(this.taskManager.rootTask.id, "RUNNING");
      const result = await this.mainAgent.run({
        onProgress: (chunk) => {
          console.log("main agent onProgress", JSON.stringify(chunk));
          if (
            chunk.type === "tool-call" &&
            chunk.toolName === "handoff.planning"
          ) {
            // 命中了数据分析任务规划，不再是自然对话回复了
            this.responseType = EAssistantMessageType.ANALYSIS;
            const task = this.taskManager.addTask("planning", chunk.args);
            this.taskManager.runTask(task.id);
          } else if (chunk.type === "text-delta") {
            this.taskManager.rootTask.output += chunk.textDelta;
            const eventMsg = this.generateWsDialogResponseMessage(
              chunk.textDelta,
              false
            );
            this.emit("message", eventMsg);
          }
        },
        onComplete: (result) => {
          console.log("main agent on complete", result);
          // 如果是普通对话回复模式
          if (this.responseType === EAssistantMessageType.NORMAL) {
            this.taskManager.updateTaskStatus(
              this.taskManager.rootTask.id,
              "COMPLETED"
            );

            const eventMsg = this.generateWsDialogResponseMessage("", true);
            this.emit("message", eventMsg);
          } else if (this.responseType === EAssistantMessageType.ANALYSIS) {
            // 如果是触发了 Planning Agent 调用，那么根任务不能标记结束
            // 也不需要派发 ws 消息，由后续 Planning Agent 的事件来更新
          }
        },
        onFail: (error) => {
          console.log("main agent on fail", error);
          this.taskManager.updateTaskStatus(
            this.taskManager.rootTask.id,
            "FAILED"
          );
          const eventMsg = this.generateWsErrorResponseMessage(error);
          this.emit("message", eventMsg);
        },
      });
      const stream = (result as StreamTextResult<any, any>).toDataStream();

      const reader = stream.getReader();

      while (true) {
        const { done } = await reader.read();
        if (done) {
          break;
        }
      }
    } catch (e: any) {
      console.error("Orchestrator start error:", e);
      this.taskManager.updateTaskStatus(
        this.taskManager.rootTask.id,
        "FAILED"
      );
      const eventMsg = this.generateWsErrorResponseMessage(
        e instanceof Error ? e : new Error(String(e))
      );
      this.emit("message", eventMsg);
    }
  }

  async stop() {
    this.taskManager.stopAll();
  }

  bindSocket(ws: WSContext<unknown>) {
    this.wsConnection = ws;
    return this;
  }

  reconnect(ws: WSContext<unknown>) {
    this.wsConnection = ws;
    const messageQueue = this.messageQueue.slice(0);
    this.messageQueue = [];
    messageQueue.forEach((message) => {
      this.emit("message", message);
    });
    return this;
  }

  // listeners
  private onAgentTaskAdded = ({ taskId }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    if (task.stage === "analysis") {
      const currentTask = task as IAnalysisAgentTask;
      // 发送一个单个数据分析任务节点 开始的 ws 消息
      const message = this.generateWsDataAnalysisResponseMessage(
        currentTask.input?.current_task?.objective_in_short ?? "",
        false,
        "header",
        currentTask?.meta.stepIndex
      );
      this.emit("message", message);
    }
  };

  private onAgentTaskStart = ({ taskId }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    if (task.stage === "planning") {
      const currentTask = task as IPlanningAgentTask;
      // 发送一个 planning 开始的 ws 消息
      let text =
        this.taskManager.rootTask.output || currentTask.input.user_query;
      text += `\n\n`;
      const message = this.generateWsDataAnalysisResponseMessage(
        text,
        false,
        "start"
      );
      this.emit("message", message);
    } else if (task.stage === "analysis") {
      const currentTask = task as IAnalysisAgentTask;
      // 发送一个单个数据分析任务节点 开始的 ws 消息
      const message = this.generateWsDataAnalysisResponseMessage(
        "",
        false,
        "summary",
        currentTask?.meta.stepIndex
      );
      this.emit("message", message);
    } else if (task.stage === "summarizing") {
      // 发送一个最终总结阶段开始的 ws 消息
      const message = this.generateWsDataAnalysisResponseMessage(
        "",
        false,
        "final"
      );
      this.emit("message", message);
    }
  };

  private onAgentTaskProgress = ({ taskId, payload }) => {
    const task = this.taskManager.getTask(taskId) as IAgentTask<any, string>;
    if (!task) {
      return;
    }

    if (task.stage === "planning") {
      // planning 阶段直接由最终 finish 事件触发 ws 消息，没有中间过程的更新
    } else if (task.stage === "analysis") {
      const task = this.taskManager.getTask(taskId) as IAnalysisAgentTask;
      const eventMsg = this.generateWsDataAnalysisResponseMessage(
        payload,
        false,
        "summary",
        task?.meta.stepIndex
      );
      this.emit("message", eventMsg);
    } else if (task.stage === "summarizing") {
      const eventMsg = this.generateWsDataAnalysisResponseMessage(
        payload,
        false,
        "final"
      );
      this.emit("message", eventMsg);
    }
  };

  private onAgentTaskComplete = ({ taskId, payload }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    if (task.stage === "planning") {
      const planningTask = task as IPlanningAgentTask;
      const eventMsg = this.generateWsDataAnalysisResponseMessage(
        "",
        true,
        "start"
      );
      this.emit("message", eventMsg);
      const output = payload as IPlanningAgentOutput;
      if (!output.tasks || output.tasks.length === 0) {
        return;
      }
      const analysisTasks: IAgentTask[] = [];
      // 添加分析任务
      for (const item of output.tasks) {
        const runTask = this.taskManager.addTask(
          "analysis",
          {
            current_task: item,
            tasks: output.tasks,
          },
          {
            stepIndex: this.taskManager.tasks.length,
          },
          true // 允许失败
        );
        this.taskManager.runTask(runTask.id);
        analysisTasks.push(runTask);
      }

      // 添加最终总结任务
      const summarizingTask = this.taskManager.addTask(
        "summarizing",
        {
          user_query: planningTask.input?.user_query,
          analysis_tasks_results: [],
        } as ISummarizingAgentInput,
        null,
        false,
        (t: ISummarizingAgentTask, ts) => {
          const upstreamTasks = ts.filter((t) => t.stage === "analysis");
          t.input.analysis_tasks_results = upstreamTasks.map(
            (t: IAnalysisAgentTask) => {
              return {
                task_id: t.input.current_task.task_id,
                objective: t.input.current_task.objective,
                task_result: t.output,
              };
            }
          );
        }
      );

      // 依赖添加
      for (const task of analysisTasks) {
        this.taskManager.addDependency(summarizingTask.id, task.id);
      }
    } else if (task.stage === "analysis") {
      const task = this.taskManager.getTask(taskId) as IAnalysisAgentTask;
      const eventMsg = this.generateWsDataAnalysisResponseMessage(
        "",
        true,
        "summary",
        (task as IAnalysisAgentTask)?.meta.stepIndex
      );
      this.emit("message", eventMsg);
    } else if (task.stage === "summarizing") {
      const eventMsg = this.generateWsDataAnalysisResponseMessage(
        "",
        true,
        "final"
      );
      this.emit("message", eventMsg);
    }
  };

  private onAgentTaskFail = ({ taskId, error }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    const stageToTagMap = {
      planning: "start",
      analysis: "summary",
      summarizing: "final",
    };

    this.emit(
      "message",
      this.generateWsDataAnalysisResponseMessage(
        "",
        true,
        stageToTagMap[task.stage],
        undefined,
        error
      )
    );
  };

  private onAgentTaskCancel = ({ taskId, reason }) => {
    const task = this.taskManager.getTask(taskId);
    if (!task) {
      return;
    }

    const stageToTagMap = {
      planning: "start",
      analysis: "summary",
      summarizing: "final",
    };

    this.emit(
      "message",
      this.generateWsDataAnalysisResponseMessage(
        "",
        true,
        stageToTagMap[task.stage],
        undefined,
        reason
      )
    );
  };

  // helpers
  private generateWsDialogResponseMessage(token: string, stop?: boolean) {
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

  private generateWsDataAnalysisResponseMessage(
    token: string | TextStreamPart<any>,
    stop?: boolean,
    messageTag?: "start" | "header" | "summary" | "final" | "end",
    stepIndex?: number,
    error?: string
  ) {
    return JSON.stringify({
      conversationId: this.ctx.sessionId,
      messageId: this.messageId,
      timestamp: Date.now(),
      type: EAssistantMessageType.ANALYSIS,
      payload: {
        token:
          typeof token === "string"
            ? {
                type: "text-delta",
                textDelta: token,
              }
            : token,
        stop: stop ?? false,
        messageTag,
        stepIndex,
        error,
      },
    });
  }

  private generateWsErrorResponseMessage(error: Error | string) {
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

  // 标记整体结束
  private endWorkFlow = () => {
    console.log("endWorkFlow");
    this.emit(
      "message",
      this.generateWsDataAnalysisResponseMessage("", true, "end")
    );
    this.dispose();
  };

  // TODO dispose event listeners
  private dispose() {
    this.taskManager.removeAllListeners();
    this.removeAllListeners();
  }

  // TODO 进入 summarizing 前增加评估环节任务
}
