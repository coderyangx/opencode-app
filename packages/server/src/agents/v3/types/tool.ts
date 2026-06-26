import type { Tool } from "ai";
import type { IRunContext } from "./context.js";

export type IExtendedTool = Tool & {
  name: string;
};

export type IToolFactory = (
  ctx: IRunContext,
  options?: Record<string, any>,
) => IExtendedTool;
