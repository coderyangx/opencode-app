import type {
  LanguageModelV1,
  StreamTextResult,
  ToolSet,
  TextStreamPart,
} from "ai";
import type { IRunContext } from "./context.js";
import EventEmitter from "events";

export interface IAgent<TOOLS extends ToolSet = ToolSet, O = any>
  extends EventEmitter {
  name: string;
  description: string;
  instructions: string | ((ctx: IRunContext) => string | Promise<string>);
  model: LanguageModelV1;
  tools: TOOLS;
  run(options: {
    input?: any;
    onProgress: (progress: TextStreamPart<TOOLS>) => void;
    onComplete: (result: O) => void;
    onFail: (error: Error) => void;
  }):
    | Promise<StreamTextResult<TOOLS, never>>
    | Promise<object>
    | Promise<string>;
}
