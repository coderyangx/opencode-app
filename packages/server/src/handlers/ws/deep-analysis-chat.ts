import type { Context } from "hono";
import { WSEvents } from "hono/ws";
import { IRunContext } from "../../types/context";
import { s3 } from "../../lib/memory-s3/index.js";
import { NL2SQLDataService } from "../../data/service.js";
import { nanoid } from "nanoid";
import {
  ERequestMessageType,
  IWebSocketRequestMessage,
} from "../../types/deep-analysis/index.js";
import { sessionMemoryManager } from "../../lib/cache/session.js";
import { Orchestrator } from "../../agents/v2/orchestrator.js";

const ChatSession = new Map<string, Orchestrator>();

export const DeepAnalysisChat: (c: Context) => Promise<WSEvents> = async (
  c
) => {
  c.header("X-Accel-Buffering", "no");

  const url = new URL(c.req.url);

  let orchestrator: Orchestrator;
  let sessionId: string;

  return {
    onMessage(event, ws) {
      console.log(`Message from client: ${event.data}`);

      if (event.data === "PING") {
        return ws.send("PONG");
      }

      const data = JSON.parse(event.data as string) as IWebSocketRequestMessage;

      if (data.type === ERequestMessageType.QUERY) {
        const { messages, fileKey } = data.payload;
        sessionId = data.payload.conversationId || nanoid(16);

        const runContext: IRunContext = {
          cookie: c.req.header("Cookie"),
          view: url.searchParams.get("view") || "",
          env: url.searchParams.get("env") || "",
          origin: c.req.header("Origin") || "",
          history: messages.slice(-10),
          s3,
          presetId: url.searchParams.get("preset") || "mock",
          sessionId,
          memory: sessionMemoryManager.get(sessionId),
        };

        if (fileKey) {
          runContext.presetOptions = {
            fileKey,
          };
        }

        runContext.dataSvc = new NL2SQLDataService(runContext);

        orchestrator = new Orchestrator(runContext);
        orchestrator.bindSocket(ws).start();
        ChatSession.set(sessionId, orchestrator);
      } else if (data.type === ERequestMessageType.COMMAND) {
        const orchestrator = ChatSession.get(data.payload.conversationId);
        if (!orchestrator) {
          ws.send(
            JSON.stringify({
              type: "ERROR",
              payload: {
                message: "会话出错了",
                keys: Array.from(ChatSession.keys()),
              },
            })
          );
          return;
        }
        if (data.payload.command === "stop") {
          orchestrator.stop();
        } else if (data.payload.command === "reconnect") {
          orchestrator.reconnect(ws);
        }
      }
    },
    onClose: () => {
      console.log("Connection closed");
      setTimeout(() => {
        orchestrator?.stop();
        ChatSession.delete(sessionId);
      }, 3600 * 1000);
    },
  };
};
