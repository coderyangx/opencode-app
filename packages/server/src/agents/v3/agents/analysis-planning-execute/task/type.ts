export interface IAgentTask<M extends {} = {}> {
  id: string;
  stage: "planning" | "analysis" | "summarizing" | "evaluation";
  status: TaskStatus;
  meta?: M & {
    stepIndex: number;
    stepName: string;
  };
  error?: string;
  // 上游
  dependencies: string[];
  // 下游
  dependents: string[];
  allowFailure?: boolean;
}

type TaskStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
