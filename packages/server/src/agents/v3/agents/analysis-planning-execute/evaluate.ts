import { generateObject, LanguageModelV1, ToolSet } from "ai";
import { IPlanningAgentOutput } from "./planning.js";
import { IAgent } from "../type";
import { IRunContext } from "../../types/context.js";
import { getLanguageModel } from "../../model/llm.js";
import { z } from "zod";
import Cat from "@dp/cat-client";
import { getSharedMetadata } from "../../trace/metadata.js";
import { getTracer } from "../../trace/langfuse.js";

export interface IEvaluationAgentInput {
  planned_goals: Array<{
    goal: IPlanningAgentOutput["goals"][number];
    result?: string;
  }>;
}

const feedbackSchema = z.object({
  status: z
    .enum(["SUCCESS", "NEEDS_REPLANNING"])
    .describe(
      "评估的总体状态, SUCCESS 代表目标达成，NEEDS_REPLANNING 代表需要重新规划任务"
    ),
  issues_found: z
    .array(
      z.object({
        original_objective: z.string().describe("问题出自的原始目标"),
        issue_description: z.string().describe("问题描述"),
        severity: z
          .enum(["CRITICAL", "MAJOR", "MINOR"])
          .describe("问题严重程度"),
        recommended_action: z.string().describe("推荐行动"),
      })
    )
    .describe("评估发现的问题列表")
    .optional(),
});

export type IEvaluationAgentOutput = z.infer<typeof feedbackSchema>;

export class EvaluationAgent<TOOLS extends ToolSet>
  implements IAgent<null, IEvaluationAgentOutput>
{
  name: string;
  description: string;

  instructions = async (ctx: IRunContext) => {
    const tableInfo = await ctx.dataSvc?.getDataSchema();

    return `---
你是一个**关键的评估和反馈专家**，在多 Agent 分析架构中扮演着核心角色。你的任务是**严格评估先前 \`Execute\` Agent 的批量执行结果、查询设计，以及产出的洞察总结**。你的评估应基于以下几个方面：

1.  **数据分析目标达成度与洞察质量评估**：
    * **核心目标匹配**：比较 \`Execute\` Agent 的输出（例如，分析结果、洞察总结、报告草稿）与 \`Planning\` Agent 最初设定的**数据分析目标、用户意图或关键性能指标（KPIs）**。判断分析是否全面、深入，是否有效回答了用户提出的所有分析问题或解决了既定目标。
    * **查询设计合理性**：评估 \`Execute\` Agent 在实现分析目标时，所进行的**查询设计是否高效、准确且充分**。例如，是否选择了最合适的数据表和字段，筛选条件是否精确，聚合和计算逻辑是否正确且符合业务需求。
    * **洞察质量与相关性**：审查 \`Execute\` Agent 产出的**洞察总结是否清晰、有价值、具有可操作性**。洞察是否直接来源于分析结果，是否具有说服力，并且与最初的分析目标紧密相关。避免泛泛而谈或与目标偏离的总结。
    * **报告完整性**：核实结果或报告是否包含了所有必要的信息点，其结论和洞察是否与分析目的直接相关，并提供了充分的支撑数据。

2.  **执行异常与数据准确性检查**：
    * 审查执行日志，查找是否有**明显的执行错误、警告、数据处理失败或逻辑异常**。
    * 验证分析结果的**数据准确性**和**内部一致性**。例如，聚合数据是否正确，计算指标是否符合预期，是否存在明显的数据偏差或异常值。
    * 检查分析步骤是否按 \`Planning\` Agent 的规划正确执行，是否存在遗漏或错误的步骤。

3.  **给出反馈与建议**：
    * 根据评估结果，生成结构化的反馈。
    * 如果目标已达成、洞察高质量且无明显异常，明确表示"**分析任务成功，目标达成，洞察有效**"。
    * 如果存在问题，**清晰、具体、量化地指出存在的问题**（例如，"客户流失原因分析未涵盖用户行为数据，洞察不够深入"、"销售额查询设计缺少时间维度限制，结果过于宽泛"、"风险评估报告缺少关键指标的趋势分析，总结不全面"）。
    * **提出具体、可操作的建议**，指导 \`Planning\` Agent 如何调整或增加后续任务以修正问题或进一步优化结果（例如，"建议 \`Execute\` Agent 重新设计查询，加入用户行为表数据"、"需要 \`Execute\` Agent 对销售额进行按月聚合，并总结环比变化"、"建议 \`Execute\` Agent 补充相关性分析，提升洞察的深度"）。
    * 建议应围绕如何**提高分析结果的准确性、洞察的深度/价值、查询设计的合理性或整体报告的完整性**。

**重要原则**：

* **客观公正**：你的评估必须基于事实和数据，避免主观判断。
* **严谨细致**：不放过任何可能影响结果质量和洞察深度的细节或异常。
* **清晰可操作**：反馈必须明确，并提供具体行动方向，以便 \`Planning\` Agent 能够据此进行决策。

---

**关键参考信息**：

数据库结构信息如下

\`\`\`json
${JSON.stringify(tableInfo)}
\`\`\`

---
`;
  };

  model: LanguageModelV1;
  tools: TOOLS;
  ctx: IRunContext;

  constructor(ctx: IRunContext) {
    this.name = "evaluate";
    this.description = "";
    this.ctx = ctx;
    this.model = getLanguageModel("LongCat-Large-32K-Chat-0626");
  }

  async run(input: IEvaluationAgentInput) {
    const system = await this.instructions(this.ctx);
    const prompt = `已经执行的目标结果如下：

-----
\`\`\`json
${JSON.stringify(input.planned_goals)}
\`\`\`
-----

`;

    try {
      const { object } = await generateObject({
        model: this.model,
        system,
        prompt,
        temperature: 0.3,
        schema: feedbackSchema,
        experimental_telemetry: {
          isEnabled: true,
          functionId: "agent.evaluation",
          metadata: getSharedMetadata(this.ctx),
          tracer: getTracer(this.ctx),
        },
      });

      console.log("\nevaluation result", JSON.stringify(object));

      return object;
    } catch (e) {
      Cat.logError(this.name, e.error as Error);
      return null;
    }
  }
}
