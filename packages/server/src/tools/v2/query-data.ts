import { QUERY_SCHEMA } from "../../lib/query/dsl-schema.js";
import type { IToolFactory } from "../../types/tool.js";
import { z } from "zod";

const parametersSchema = z.object({
  query_dsl: QUERY_SCHEMA.describe(
    "由 design-query-dsl 工具生成的数据查询 DSL"
  ),
});

export const queryDataToolFactory: IToolFactory = (ctx) => {
  return {
    name: "query-data",
    description: `接收数据查询 DSL，执行查询并返回数据结果`,
    parameters: parametersSchema,
    async execute(args: z.infer<typeof parametersSchema>, options) {
      console.log("query", JSON.stringify(args, null, 2));
      try {
        const result = await ctx.dataSvc?.executeQuery(args.query_dsl);
        return result;
      } catch (e) {
        console.log(e);
        return {
          content: [
            {
              type: "text",
              text: `Failed to get table records.
:::hidden
Debug 信息:

Error -> ${e.message}
:::
`,
            },
          ],
          isError: true,
        };
      }
    },
  };
};
