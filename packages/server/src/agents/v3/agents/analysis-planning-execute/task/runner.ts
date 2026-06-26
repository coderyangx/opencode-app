import { IRunContext } from "../../../types/context";
import EventEmitter from "events";
import { logger } from "../../../lib/log/index.js";
import { IAgentTask } from "./type";
import { IAgent } from "../../type";
import { IPlanningAgentInput, PlanningAgent } from "../planning.js";
import { AnalysisAgent } from "../analysis.js";
import { SummarizingToReportAgent } from "../summarizing.js";
import { SummarizingAgent } from "../summarizing-short.js";
import { EvaluationAgent, IEvaluationAgentInput } from "../evaluate.js";
import { AnalysisAgentState } from "../state.js";
import type {
  IAnalysisAgentTask,
  IPlanningAgentTask,
  ISummarizingAgentTask,
} from "./manager.js";
import { parseDataStreamPart } from "ai";

const getAgent = (
  task:
    | IAgentTask
    | IPlanningAgentTask
    | IAnalysisAgentTask
    | ISummarizingAgentTask
): new (ctx: IRunContext) => IAgent<any, any> => {
  const workerNameMap: Record<
    Exclude<IAgentTask["stage"], "start">,
    new (ctx: IRunContext) => IAgent<any, any>
  > = {
    planning: PlanningAgent,
    analysis: AnalysisAgent,
    summarizing: SummarizingAgent,
    evaluation: EvaluationAgent,
  };

  if (task.stage === "summarizing") {
    return (task as ISummarizingAgentTask).meta?.artifactType === "report"
      ? SummarizingToReportAgent
      : SummarizingAgent;
  }

  return workerNameMap[task.stage];
};

export class AgentTaskRunner extends EventEmitter {
  private task: IAgentTask;
  private ctx: IRunContext;
  private state: AnalysisAgentState;

  get stage() {
    return this.task.stage;
  }

  constructor(task: IAgentTask, ctx: IRunContext, state: AnalysisAgentState) {
    super();
    this.task = task;
    this.ctx = ctx;
    this.state = state;
  }

  async run() {
    try {
      this.emit("start", { taskId: this.task.id });
      const Agent = getAgent(this.task);
      if (!Agent) {
        this.emit("error", "未找到合适的 Agent 来运行任务");
        return;
      }

      const agent = new Agent(this.ctx);
      const result = await agent.run(this.getAgentInput());
      let output = "";

      if (result && (result as ReadableStream).getReader) {
        const reader = result.getReader();

        while (true) {
          const { done, value } = await reader.read();
          try {
            const parsedChunk = parseDataStreamPart(value);
            if (parsedChunk.type === "text") {
              output += parsedChunk.value;
            }
          } catch {
            // ignore
          }
          if (done) {
            this.emit("complete", {
              taskId: this.task.id,
              payload: output,
            });
            break;
          }

          this.emit("progress", {
            taskId: this.task.id,
            payload: value,
          });
        }
      } else {
        console.log("onFinish");
        this.emit("complete", {
          taskId: this.task.id,
          payload: result,
        });
      }
    } catch (e) {
      logger.info("run-worker-error", e);
      this.emit("error", {
        taskId: this.task.id,
        payload: e.message,
      });
    }
  }

  private getAgentInput() {
    switch (this.task.stage) {
      case "planning":
        return {
          ...this.state.planningTarget,
          tasks_history:
            this.state.analysisTargets.length > 0
              ? this.state.analysisTargets.map((item) => item.current_goal)
              : undefined,
          issues: this.state.evaluationResult?.issues_found,
        } satisfies IPlanningAgentInput;
      case "analysis":
        const index = (this.task as IAnalysisAgentTask).meta?.analysisIndex;
        const currentStep = this.state.analysisTargets[index];
        return currentStep;
      case "evaluation":
        const analysisTasks = this.state.analysisTargets;
        const results = this.state.analysisResults;
        const plannedGoalAndResults = [];
        for (let i = 0; i < analysisTasks.length; i++) {
          plannedGoalAndResults.push({
            goal: analysisTasks[i].current_goal,
            result: results[i] || "",
          });
        }
        return {
          planned_goals: plannedGoalAndResults,
        } satisfies IEvaluationAgentInput;
      case "summarizing":
        const analysisResults = this.state.analysisResults;
        const inputs = [];
        for (let i = 0; i < analysisResults.length; i++) {
          const analysisStep = this.state.analysisTargets[i];
          const analysisResult = analysisResults[i];
          inputs.push({
            goal_id: analysisStep.current_goal.goal_id,
            objective: analysisStep.current_goal.goal_description,
            result: analysisResult,
          });
        }
        return {
          analysis_tasks_results: inputs,
          user_query: this.state.planningTarget.user_query,
        };
      default:
        return null;
    }
  }

  stop() {}

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
