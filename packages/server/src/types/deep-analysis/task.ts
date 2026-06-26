export interface IAgentTask<T = never, O = never, M = never> {
  id: string;
  stage: "start" | "planning" | "analysis" | "summarizing";
  status: TaskStatus;
  input?: T;
  output?: O;
  meta?: M; // 包括 stepIndex
  error?: string;
  // 上游
  dependencies: string[];
  // 下游
  dependents: string[];
  allowFailure?: boolean;
  beforeExecute?: (task: IAgentTask, tasks: IAgentTask[]) => void;
}

type TaskStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
