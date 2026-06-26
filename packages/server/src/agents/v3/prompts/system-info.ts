import { format } from "date-fns";
import { IRunContext } from "../types/context";

export const getSystemInfo = (context: IRunContext) => {
  const hasLangDefine =
    typeof context.language !== "undefined" && context.language != "中文";
  const langDefine = hasLangDefine
    ? `- **请务必使用 ${context.language} 回复用户，你总是使用${context.language} 或将输出翻译成${context.language}返回**.`
    : "";

  return `
    - **当前日期**: ${format(new Date(), "yyyy-MM-dd")}
    - **当前时区**: UTC+8
    ${langDefine}
  `;
};
