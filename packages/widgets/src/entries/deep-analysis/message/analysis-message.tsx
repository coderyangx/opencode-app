import type { DataAnalysisMessage } from "./model";
import { MessagePart } from "./parts";
import { AnalysisSteps } from "./analysis-steps";

export function AIAnalysisMessageComponent(props: {
  message: DataAnalysisMessage;
  loading?: boolean;
}) {
  const { message, loading } = props;

  return (
    <div className="message-bubble bg-white rounded-lg py-3 px-0 relative text-sm text-gray-600 w-full">
      <AnalysisSteps message={message} />
      {message.parts.length > 0 && (
        <div className="prose prose-neutral prose-sm text-base prose-ol:my-1 prose-ul:my-1 prose-p:my-1 prose-li:leading-5 text-medium break-words mt-6">
          {message.parts.map((part, index) => {
            if (part.type === "step-start" || part.type === "tool-invocation") {
              return null;
            }

            return (
              <div className={`message-part part-${part.type}`} key={index}>
                <MessagePart
                  message={message}
                  part={part}
                  addToolResult={() => {}}
                />
              </div>
            );
          })}
        </div>
      )}
      {loading && (
        <span className="inline-dots-wrapper">
          <span className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </span>
      )}
    </div>
  );
}
