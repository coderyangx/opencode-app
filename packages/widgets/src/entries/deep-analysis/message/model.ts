import type { Message } from "@ai-sdk/react";
import type {
  TextUIPart,
  ReasoningUIPart,
  ToolInvocationUIPart,
  SourceUIPart,
  FileUIPart,
  StepStartUIPart,
} from "@ai-sdk/ui-utils";
import type { JSONValue, TextStreamPart } from "ai";
import type { IDataAnalysisResponseMessage } from "@/types/deep-analysis/message";
import { findLast } from "lodash-es";

export type NodeStatus = "pending" | "running" | "completed" | "failed";

interface IStep {
  title: string;
  status: NodeStatus;
  content: Message["parts"];
}

export class DataAnalysisMessage implements Message {
  id: string;
  createdAt?: Date;
  role: "data" | "system" | "user" | "assistant";
  annotations?: JSONValue[];

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
    this.role = "assistant";
  }

  get content() {
    if (!this._summarizingNode) {
      return "";
    }
    return this._summarizingNode.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .filter(Boolean)
      .join("");
  }

  get parts(): (
    | TextUIPart
    | ReasoningUIPart
    | ToolInvocationUIPart
    | SourceUIPart
    | FileUIPart
    | StepStartUIPart
  )[] {
    return this._summarizingNode?.parts ?? [];
  }

  private _planningNode: {
    status: NodeStatus;
    parts: Message["parts"];
  };

  get planningNode() {
    return this._planningNode;
  }

  private _analysisNodes: {
    header: string;
    summary: Message["parts"];
    status: NodeStatus;
    stepIndex: number;
  }[] = [];

  get analysisNodes() {
    return this._analysisNodes;
  }

  private _summarizingNode: {
    status: NodeStatus;
    parts: Message["parts"];
  };

  get summarizingNode() {
    return this._summarizingNode;
  }

  private mergeStreamPart(
    part: TextStreamPart<any>,
    parts: Message["parts"],
    excludeTool = false
  ) {
    if (part.type === "text-delta") {
      if (parts[parts.length - 1]?.type === "text") {
        (parts[parts.length - 1] as TextUIPart).text += part.textDelta;
      } else {
        parts.push({
          type: "text",
          text: part.textDelta,
        });
      }
    }

    if (!excludeTool && part.type === "tool-call") {
      parts.push({
        type: "tool-invocation",
        toolInvocation: {
          state: "call",
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          args: part.args,
        },
      });
    }

    if (!excludeTool && part.type === "tool-result") {
      const toolInvocation: any = findLast(
        parts,
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation?.state === "call"
      ) as ToolInvocationUIPart;
      if (toolInvocation) {
        toolInvocation.toolInvocation.state = "result";
        toolInvocation.toolInvocation.result = part.result;
      }
    }

    return parts;
  }

  consumeSocketMessage(msg: IDataAnalysisResponseMessage) {
    const getStatus = () => {
      if (msg.payload.stop) {
        return msg.payload.error ? "failed" : "completed";
      }
      if (msg.payload.messageTag === "header") {
        return "pending";
      }
      return "running";
    };

    if (msg.payload.messageTag === "start") {
      if (!this._planningNode) {
        this._planningNode = {
          status: getStatus(),
          parts: this.mergeStreamPart(msg.payload.token, [], true),
        };
      } else {
        this._planningNode.status = getStatus();
        this.mergeStreamPart(msg.payload.token, this._planningNode.parts, true);
      }
    } else if (msg.payload.messageTag === "header") {
      const node = this.analysisNodes.find(
        (item) => item.stepIndex === msg.payload.stepIndex
      );
      const text =
        msg.payload.token.type === "text-delta"
          ? msg.payload.token.textDelta
          : "";
      if (!node) {
        this.analysisNodes.push({
          header: text,
          summary: [],
          status: getStatus(),
          stepIndex: msg.payload.stepIndex,
        });
      } else {
        node.header = text;
        node.status = getStatus();
      }
    } else if (msg.payload.messageTag === "summary") {
      const node = this.analysisNodes.find(
        (item) => item.stepIndex === msg.payload.stepIndex
      );
      if (!node) {
        return;
      }

      node.summary = this.mergeStreamPart(msg.payload.token, node.summary);
      node.status = getStatus();
    } else if (msg.payload.messageTag === "final") {
      if (!this._summarizingNode) {
        this._summarizingNode = {
          status: getStatus(),
          parts: this.mergeStreamPart(msg.payload.token, [], true),
        };
      } else {
        this._summarizingNode.status = getStatus();
        this.mergeStreamPart(
          msg.payload.token,
          this._summarizingNode.parts,
          true
        );
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      role: this.role,
      content: this.content,
      parts: this.parts,
      annotations: this.annotations,
    };
  }

  get steps(): IStep[] {
    const steps: IStep[] = [];
    if (this._planningNode) {
      steps.push({
        title: "规划",
        status: this._planningNode.status,
        content: this._planningNode.parts,
      });
    }
    if (this._analysisNodes.length) {
      steps.push(
        ...this._analysisNodes
          .sort((a, b) => a.stepIndex - b.stepIndex)
          .map((item) => {
            return {
              title: item.header,
              status: item.status,
              content: item.summary,
            };
          })
      );
    }
    return steps;
  }
}
