export interface IAgentTask<T = never, O = never, M = never> {
  id: string;
  stage: "start" | "planning" | "analysis" | "summarizing";
  status: TaskStatus;
  input?: T;
  output?: O;
  meta?: M;
  error?: string;
  dependencies: string[];
  dependents: string[];
  allowFailure?: boolean;
}

type TaskStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
