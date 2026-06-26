import { processDataStream, UIMessage } from "ai";
import { findLast } from "lodash-es";

/**
 * 单个文本消息转成流，方便形成统一的 stream pipe 模式
 */
export const createMessageReadableStream = (message: string) => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(message);
      controller.close();
    },
  });
};

/**
 * ai sdk 消息 chunk 合并为消息 parts
 */
export const createDataStreamProcessor = () => {
  const parts: UIMessage["parts"] = [];
  const duplex = new TransformStream<string, string>({});
  const writer = duplex.writable.getWriter();
  const cache: string[] = [];

  const task = processDataStream({
    stream: duplex.readable.pipeThrough(new TextEncoderStream()),
    onTextPart(streamPart) {
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart.type === "text") {
        lastPart.text += streamPart;
      } else {
        parts.push({ type: "text", text: streamPart });
      }
    },
    onToolCallPart(streamPart) {
      parts.push({
        type: "tool-invocation",
        toolInvocation: {
          toolCallId: streamPart.toolCallId,
          toolName: streamPart.toolName,
          args: streamPart.args,
          state: "call",
        },
      });
    },
    onToolResultPart(streamPart) {
      const lastCall = findLast(
        parts,
        (part) => part.type === "tool-invocation"
      );
      if (
        lastCall &&
        lastCall.toolInvocation.toolCallId === streamPart.toolCallId
      ) {
        lastCall.toolInvocation.state = "result";
        lastCall.toolInvocation["result"] = streamPart.result;
      }
    },
  });

  return {
    push(chunk: string) {
      cache.push(chunk);
      writer.write(chunk);
    },

    getResult() {
      return parts;
    },

    end() {
      writer.close();
      return parts;
    },
    task,
  };
};
