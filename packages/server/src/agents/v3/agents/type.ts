import type { LanguageModelV1, ToolSet } from "ai";
import type { IRunContext } from "../types/context";
import { z } from "zod";

export interface IAgentOptions<I extends z.AnyZodObject = null> {
  inputSchema?: I;
  ctx: IRunContext;
}

export interface IAgent<
  I extends z.AnyZodObject = undefined,
  O = ReadableStream<string>
> {
  name: string;
  description: string;
  instructions: string | ((ctx: IRunContext) => string | Promise<string>);
  model: LanguageModelV1;
  tools?: ToolSet;
  inputSchema?: I;
  run(input?: z.infer<I>, options?: Record<string, any>): Promise<O>;
}
