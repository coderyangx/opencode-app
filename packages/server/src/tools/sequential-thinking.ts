import type { IToolFactory } from '../types/tool.js';
import { z } from 'zod';

// Planning-Execute 范式（V2/V3）：先规划任务列表再执行，属于 Plan-and-Solve，是 CoT 思想在多 Agent 场景的延伸

// sequential-thinking 工具：项目里有一个顺序思考工具，本质就是显式的 CoT

// CoT 是 Prompting 范式下的推理增强技术，ReAct 是 CoT + 工具调用的 Agent 范式。
// 你的项目主要用的是 ReAct 和 Plan-Execute 这两种 Agent 范式

const system = `
一种用于动态、反思性思维问题解决的详细工具。该工具通过灵活的思维过程帮助分析问题，能够不断适应和演变。随着理解的深入，每个想法都可以建立在先前的见解之上，提出质疑或进行修改。  
适用场景：  
  - 将复杂问题分解为步骤  
  - 需要留有修订空间的规划与设计  
  - 需要调整方向的分析  
  - 问题初始范围不明确时  
  - 需要多步解决方案的问题  
  - 多个步骤中需保持上下文的任务  
  - 需要过滤无关信息的情境  

  主要功能：  
  - 按照进展可自由增减总思路数量  
  - 可对先前的想法提出质疑或修改  
  - 即使看似已结束，仍可添加更多想法  
  - 能表达不确定性并探索替代方案  
  - 并非所有想法都必须线性推进——可分叉或回溯  
  - 生成解决方案假设  
  - 根据“思维链”验证该假设步骤 - 重复该过程，直到满意为止 - 提供正确答案  
  参数说明：  
  - thought：当前的思考步骤，可能包括：  
    * 正常的分析步骤  
    * 对先前想法的修改  
    * 关于先前决策的问题  
    * 意识到需要进一步分析  
    * 方法的改变  
    * 假设的生成  
    * 假设的验证  
  - next_thought_needed：如果需要更多思考，即使看似已接近结束时也应为真  
  - thought_number：当前序列中的编号（如有需要可超过初始总数）  
  - total_thoughts：当前估计所需思考的数量（可上下调整）  
  - is_revision：布尔值，表示此思考是否对先前想法进行了修订  
  - revises_thought：若 is_revision 为真，则是哪个思考编号正在被重新考虑  
  - branch_from_thought：若存在分支，则是从哪个思考编号开始分叉  
  - branch_id：当前分支的标识符（如有）  
  - needs_more_thoughts：到达终点但意识到仍需更多思考  

  你应该：  
  1. 先给出一个初始的思考数量估计，但随时准备调整  
  2. 可自由质疑或修改之前的思考  
  3. 如有需要，即使在“结束”阶段也不必犹豫添加更多思考  
  4.5. 当当前步骤存在不确定性时，明确表达  
  6. 标记那些修改先前思考或转向新路径的想法  
  7. 忽略与当前步骤无关的信息  
  8. 在适当情况下生成一个解决方案假设  
  9. 根据思维链的步骤验证该假设  
  10. 将最终输出为一个单一且理想情况下正确的答案  
  11. 只有在真正完成并得到满意答案时，才将 next_thought_needed 设置为 false
`;

const schema = z.object({
  thought: z.string().describe('Your current thinking step'),
  nextThoughtNeeded: z.boolean().describe('Whether another thought step is needed'),
  thoughtNumber: z.number().min(1).describe('Current thought number'),
  totalThoughts: z.number().min(1).describe('Estimated total thoughts needed'),
  isRevision: z.boolean().describe('Whether this revises previous thinking').optional(),
  revisesThought: z
    .number()
    // .min(1)
    .describe('Which thought is being reconsidered')
    .optional(),
  branchFromThought: z
    .number()
    // .min(1)
    .describe('Branching point thought number')
    .optional(),
  branchId: z.string().describe('Branch identifier').optional(),
  needsMoreThoughts: z.boolean().describe('If more thoughts are needed').optional(),
});

type ThoughtData = z.infer<typeof schema>;

const validateThoughtData = (input: unknown): ThoughtData => {
  const data = input as Record<string, unknown>;

  if (!data.thought || typeof data.thought !== 'string') {
    throw new Error('Invalid thought: must be a string');
  }
  if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number') {
    throw new Error('Invalid thoughtNumber: must be a number');
  }
  if (!data.totalThoughts || typeof data.totalThoughts !== 'number') {
    throw new Error('Invalid totalThoughts: must be a number');
  }
  if (typeof data.nextThoughtNeeded !== 'boolean') {
    throw new Error('Invalid nextThoughtNeeded: must be a boolean');
  }

  return {
    thought: data.thought,
    thoughtNumber: data.thoughtNumber,
    totalThoughts: data.totalThoughts,
    nextThoughtNeeded: data.nextThoughtNeeded,
    isRevision: data.isRevision as boolean | undefined,
    revisesThought: data.revisesThought as number | undefined,
    branchFromThought: data.branchFromThought as number | undefined,
    branchId: data.branchId as string | undefined,
    needsMoreThoughts: data.needsMoreThoughts as boolean | undefined,
  };
};

export const sequentialThinkingToolFactory: IToolFactory = (ctx) => {
  const thoughtHistory: any[] = [];
  const branches: Record<string, any[]> = {};

  return {
    name: 'sequential-thinking',
    description: `A detailed tool for dynamic and reflective problem-solving through thoughts.
This tool helps analyze problems through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Problems that require a multi-step solution
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out

Key features:
- You can adjust total_thoughts up or down as you progress
- You can question or revise previous thoughts
- You can add more thoughts even after reaching what seemed like the end
- You can express uncertainty and explore alternative approaches
- Not every thought needs to build linearly - you can branch or backtrack
- Generates a solution hypothesis
- Verifies the hypothesis based on the Chain of Thought steps
- Repeats the process until satisfied
- Provides a correct answer

Parameters explained:
- thought: Your current thinking step, which can include:
* Regular analytical steps
* Revisions of previous thoughts
* Questions about previous decisions
* Realizations about needing more analysis
* Changes in approach
* Hypothesis generation
* Hypothesis verification
- next_thought_needed: True if you need more thinking, even if at what seemed like the end
- thought_number: Current number in sequence (can go beyond initial total if needed)
- total_thoughts: Current estimate of thoughts needed (can be adjusted up/down)
- is_revision: A boolean indicating if this thought revises previous thinking
- revises_thought: If is_revision is true, which thought number is being reconsidered
- branch_from_thought: If branching, which thought number is the branching point
- branch_id: Identifier for the current branch (if any)
- needs_more_thoughts: If reaching end but realizing more thoughts needed

You should:
1. Start with an initial estimate of needed thoughts, but be ready to adjust
2. Feel free to question or revise previous thoughts
3. Don't hesitate to add more thoughts if needed, even at the "end"
4. Express uncertainty when present
5. Mark thoughts that revise previous thinking or branch into new paths
6. Ignore information that is irrelevant to the current step
7. Generate a solution hypothesis when appropriate
8. Verify the hypothesis based on the Chain of Thought steps
9. Repeat the process until satisfied with the solution
10. Provide a single, ideally correct answer as the final output
11. Only set next_thought_needed to false when truly done and a satisfactory answer is reached`,
    parameters: schema,
    execute: async (args: ThoughtData, options) => {
      const validatedInput = validateThoughtData(args);

      if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
        validatedInput.totalThoughts = validatedInput.thoughtNumber;
      }

      thoughtHistory.push(validatedInput);

      if (validatedInput.branchFromThought && validatedInput.branchId) {
        if (!branches[validatedInput.branchId]) {
          branches[validatedInput.branchId] = [];
        }
        branches[validatedInput.branchId].push(validatedInput);
      }

      return {
        thoughtNumber: validatedInput.thoughtNumber,
        totalThoughts: validatedInput.totalThoughts,
        nextThoughtNeeded: validatedInput.nextThoughtNeeded,
        branches: Object.keys(branches),
        thoughtHistoryLength: thoughtHistory.length,
      };
    },
  };
};
