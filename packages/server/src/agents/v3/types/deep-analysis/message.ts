// 数据分析 Job 流式响应消息
export interface IDataAnalysisResponseMessage {
  payload: {
    name: string;
    token: string; // 增量内容
    stop: boolean;
    stage: "planning" | "analysis" | "summarizing" | "evaluation";
    index: number;
    error?: string;
  };
}
