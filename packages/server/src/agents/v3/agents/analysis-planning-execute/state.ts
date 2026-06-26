import { IAnalysisAgentInput, IAnalysisAgentOutput } from "./analysis.js";
import { IPlanningAgentInput } from "./planning.js";
import { IEvaluationAgentOutput } from "./evaluate.js";
import { IDataAnalysisResponseMessage } from "../../types/deep-analysis/index.js";
import { createDataStreamProcessor } from "../../lib/stream/helper.js";

interface INodeState {
  stage: "planning" | "analysis" | "summarizing";
  name: string;
  content: string[];
  stop: boolean;
  metadata?: {
    stepIndex?: number;
  };
  error?: string;
}

export class AnalysisAgentState {
  private planning: INodeState;
  private analysis: INodeState[] = [];
  private summarizing: INodeState;
  private _chunkBuffer: string[] = [];

  planningTarget: IPlanningAgentInput;

  analysisTargets: IAnalysisAgentInput[] = [];

  analysisResults: IAnalysisAgentOutput[] = [];

  evaluationResult: IEvaluationAgentOutput;

  private processStageContent = (chunks: string[]) => {
    const processor = createDataStreamProcessor();
    for (const chunk of chunks) {
      processor.push(chunk);
    }
    return processor.end();
  };

  push(chunk) {
    this._chunkBuffer.push(chunk);
  }

  snapshot() {
    const chunks = [...this._chunkBuffer];
    this._chunkBuffer = [];
    for (const chunk of chunks) {
      const data: IDataAnalysisResponseMessage["payload"] = JSON.parse(chunk);
      if (data.stage === "planning") {
        const node: INodeState = this.planning || {
          stage: "planning",
          stop: data.stop,
          name: data.name,
          content: [],
          error: data.error,
          metadata: {
            stepIndex: data.index,
          },
        };
        if (data.token) {
          node.content.push(data.token);
        }
        node.stop = data.stop;
        this.planning = node;
      } else if (data.stage === "analysis") {
        let node = this.analysis.find(
          (item) => item.metadata?.stepIndex === data.index
        );
        if (!node) {
          node = {
            stage: data.stage,
            stop: data.stop,
            name: data.name,
            content: [],
            metadata: {
              stepIndex: data.index,
            },
          };
          this.analysis.push(node);
        }

        if (data.token) {
          node.content.push(data.token);
        }

        if (data.error) {
          node.error = data.error;
        }

        if (data.stop) {
          node.stop = true;
        }
      }
      if (data.stage === "summarizing") {
        const node: INodeState = this.summarizing || {
          stage: data.stage,
          stop: data.stop,
          name: data.name || "总结",
          error: data.error,
          content: [],
          metadata: {
            stepIndex: data.index,
          },
        };
        data.token && node.content.push(data.token);
        node.stop = data.stop;
        this.summarizing = node;
      }
    }

    return {
      nodes: [this.planning, ...this.analysis, this.summarizing].filter(
        Boolean
      ),
      agent: "analysis",
      planningTarget: this.planningTarget,
      analysisTargets: this.analysisTargets,
      analysisResults: this.analysisResults,
    };
  }
}
