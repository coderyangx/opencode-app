// WebSocket stream protocol (shared with server)

import type { TextStreamPart } from "ai";

export const enum EAssistantMessageType {
  // 普通的对话回复消息
  NORMAL = "NORMAL",
  // 数据分析消息
  ANALYSIS = "ANALYSIS",
  // 异常消息
  ERROR = "ERROR",
  // DEBUG LOG
  LOG = "LOG",
}

// 所有 WebSocket 消息的基础接口
interface IBaseWebSocketResponseMessage {
  conversationId: string;
  messageId: string;
  timestamp: number;
}

// 普通对话回复消息
export interface IDialogResponseMessage extends IBaseWebSocketResponseMessage {
  type: EAssistantMessageType.NORMAL;
  payload: {
    token: string; // 增量内容
    stop: boolean;
  };
}

// 数据分析响应消息
export interface IDataAnalysisResponseMessage
  extends IBaseWebSocketResponseMessage {
  type: EAssistantMessageType.ANALYSIS;
  payload: {
    token: TextStreamPart<any>; // 增量内容
    stop: boolean;
    messageTag: "header" | "summary" | "start" | "final" | "end"; // header 是节点标题，summary 是节点内容
    stepIndex: number;
    error?: string;
  };
}

// 错误
export interface IErrorResponseMessage extends IBaseWebSocketResponseMessage {
  type: EAssistantMessageType.ERROR;
  payload: {
    message: string;
  };
}

export interface ILogMessage {
  type: EAssistantMessageType.LOG;
  [key: string]: any;
}

export type IWebSocketResponseMessage =
  | IDialogResponseMessage
  | IDataAnalysisResponseMessage
  | IErrorResponseMessage
  | ILogMessage;

// client send message

export const enum ERequestMessageType {
  QUERY = "QUERY",
  COMMAND = "COMMAND",
}

export interface IUserQueryRequestMessage {
  type: ERequestMessageType.QUERY;
  payload: {
    conversationId: string;
    messages: any[];
    fileKey?: string;
  };
}

export interface ICommandRequestMessage {
  type: ERequestMessageType.COMMAND;
  payload: {
    conversationId: string;
    command: "stop" | "rerun" | "reconnect";
  };
}

export type IWebSocketRequestMessage =
  | IUserQueryRequestMessage
  | ICommandRequestMessage;
