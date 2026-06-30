import { generateText, experimental_createMCPClient, CoreMessage } from 'ai';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
import { z } from 'zod';
import path from 'path';
import { getModel } from '../lib/ai/model-provider.js';
import { IRunContext } from '../types/context.js';
import { getSystemInfo } from '../agents/systemInfo.js';
import { IToolFactory } from '../types/tool.js';
import { getSharedMetadata } from '../agents/metadata.js';

// ReAct 范式（nl-python-analysis 工具）：CoT 的进化版，将推理（Thought）
// 和行动（Action）交替执行——Thought → Action → Observation → Thought → ...
// 这是 Agent 范式的核心

const Cat = {};
const AICodeTemplate = `
import requests
import json
from typing import Any, Optional

# <--- YOUR_IMPORTS_HERE --->

def analyze_data(all_datasets: dict[str, list[list[Any]]]) -> str:
    """
    接收所有数据集，并按需选择数据集进行核心分析

    例如，数据结构始终如下：
    {
        "dataset_id_1": [
            ['Header1', 'Header2', 'Header3'],
            ['Value1A', 'Value1B', 'Value1C']
        ],
        "dataset_id_2": [
            ['AnotherHeader1', 'AnotherHeader2'],
            ['AnotherValue1A', 'AnotherValue1B']
        ]
    }

    Args:
        all_datasets (dict[str, list[list[Any]]]):
            一个字典，键为数据集ID，值为原始的二维数组数据（第一行为表头）。

    Returns:
        str: 序列化的一个至多个结果集
    """
    # <--- YOUR_ANALYSIS_CODE_HERE --->
`;

const CODE_TEMPLATE_FACTORY = (datasetIds: string[], aiCode: string, ctx: IRunContext) => `
import requests
import json
import time
from typing import Any, Optional

${aiCode}

def fetch_json_data(
    url: str,
    timeout: int = 30,
    retries: int = 6,
    delay_ms: int = 10
) -> Optional[list[list[Any]]]:
    """
    从指定的URL获取JSON数据，支持对404状态码和网络错误的重试。
    """
    delay = delay_ms / 1000.0
    for i in range(retries + 1):
        try:
            response = requests.get(url, timeout=timeout)
            if response.status_code == 404:
                # print("404错误重试下载")
                if i < retries:
                    time.sleep(delay)
                    continue

            response.raise_for_status()
            json_data = response.json()

            if not isinstance(json_data, list) or not json_data:
                # print("警告：获取到的数据不是列表或为空。")
                return None

            return json_data

        except requests.exceptions.HTTPError as e:
            # print("其他错误重试下载")
            if i < 2:
                time.sleep(delay)
                continue
            return None

        except requests.exceptions.RequestException as e:
            return None
    return None

# --- 主执行逻辑 ---

# 定义一个字典来存储所有成功获取的数据，确保在 main 函数外部定义
all_raw_data: dict[str, list[list[Any]]] = {}

def main():
    """
    程序的主执行函数。
    负责获取数据，调用分析函数，并输出结果。
    """
    dataset_ids_str = "${datasetIds.join(',')}"
    dataset_ids = [id.strip() for id in dataset_ids_str.split(',') if id.strip()]
    if not dataset_ids:
        print("错误：未提供数据集ID。请提供一个或多个数据集ID（例如：'dataset1' 或 'dataset1,dataset2'）。")
        return

    for dataset_id in dataset_ids:
        data_url = f"${ctx.origin}/analysis-agent/object/{dataset_id}.json"
        raw_data = fetch_json_data(data_url)
        if raw_data is not None:
            all_raw_data[dataset_id] = raw_data
            print(f"数据集 '{dataset_id}' 获取成功。")
        else:
            print(f"未能获取数据集 '{dataset_id}' 的有效数据或数据结构不符合预期。")

    if all_raw_data:
        print("所有成功获取的数据集已准备就绪，正在进行数据分析...")
        analysis_result = analyze_data(all_raw_data)
        # print("--- 综合数据分析结果 ---")
        # 使用 ensure_ascii=False 以支持中文输出
        print(analysis_result)
    else:
        print("未能获取到任何有效数据集，无法执行数据分析。")

if __name__ == "__main__":
    main()
`;

const removeDuplicatedImports = (codeString: string) => {
  const importPattern = new RegExp(/^(import .*|from .* import .*)$/gm);
  const allImports: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importPattern.exec(codeString)) !== null) {
    allImports.push(match[0]);
  }

  const uniqueImports: Set<string> = new Set(allImports);
  const sortedUniqueImports = Array.from(uniqueImports).sort();

  let codeBody = codeString;

  if (allImports.length > 0) {
    // 找到最后一个导入语句的结束位置，以确定代码体开始的地方
    const lastImportLine = allImports[allImports.length - 1];
    const lastImportIndex = codeString.lastIndexOf(lastImportLine) + lastImportLine.length;

    // 切片，获取导入语句之后的所有代码
    codeBody = codeString.slice(lastImportIndex);
  }

  const finalCode = sortedUniqueImports.join('\n') + codeBody;

  return finalCode.trim();
};

interface ILoopRound {
  observation?: any;
  previousCode?: string;
  round: number;
  forceExit?: boolean;
}

const trimCodeBlock = (code: string) => {
  code = code.trim();
  if (code.startsWith('```')) {
    const lines = code.split('\n');
    const firstLine = lines[0];
    return {
      type: firstLine.slice(3).trim(),
      content: lines.slice(1, -1).join('\n').trim(),
    };
  }

  if (code.startsWith('"""') || code.startsWith('import') || code.startsWith('from')) {
    return { type: 'python', content: code };
  }

  return { type: 'answer', content: code };
};

const getCodeInterceptorTool = async () => {
  let transport;
  if (process.env.NODE_ENV === 'local') {
    transport = new Experimental_StdioMCPTransport({
      command: 'uv',
      args: ['--directory', path.join(process.cwd(), '../mcp/python-sandbox'), 'run', 'server.py'],
    });
  } else {
    transport = {
      type: 'sse',
      url: 'http://mcphub-server.sankuai.com/mcphub-api/a0e4a7f869b04f',
    };
  }

  const client = await experimental_createMCPClient({
    transport,
  });

  const tools = await client.tools();

  const codeTool = Object.keys(tools).find((item) => item.toLowerCase().includes('code'));

  return tools[codeTool];
};

const parametersSchema = z.object({
  // datasets: z
  //   .array(
  //     z.object({
  //       dataset_id: z
  //         .string()
  //         .describe("上游数据查询工具返回的数据集 ID，UUID 格式，请不要虚构"),
  //       dataset_columns: z.array(z.string()).describe("数据集字段"),
  //       dataset_description: z.string().describe("数据集简单描述"),
  //     })
  //   )
  //   .describe("引用的数据集列表"),
  goal_id: z.string().describe('当前洞察目标的唯一标识符'),
  goal_description: z.string().describe('当前洞察目标描述'),
  task_id: z.string().describe('当前任务的唯一标识符'),
  task_description: z.string().describe('当前任务的具体、无歧义的描述'),
  analysis_logic: z.string().describe('实现该任务所需的 Python 代码核心逻辑的文字描述'),
  expected_analysis_output: z
    .string()
    .describe('分析任务完成后，数据结果的形式和核心内容，以及其直接的业务应用或价值'),
});

const nlPythonAnalysis = async (
  args: z.infer<typeof parametersSchema> & { datasets },
  ctx: IRunContext,
  roundInfo: ILoopRound,
) => {
  console.log('python design', JSON.stringify(args));

  const system = `-----

## **角色和目标**

你是一位拥有丰富经验的 Python 数据科学专家。你的任务是根据用户的分析需求，**严格遵循提供的代码模板，仅填充必要部分来生成可执行的 Python 分析代码**。以完成数据处理和洞察。你必须将所有的分析逻辑和思考过程都融入到生成的代码注释中。

-----

## **代码模板**

**使用该代码模板并填充其中分析逻辑部分来生成最终的代码。**

\`\`\`python
${AICodeTemplate}
\`\`\`

-----

## **系统信息**

${getSystemInfo(ctx)}
- **Python 版本**: 3.12
- **支持的数据分析库**:
  - pandas: 版本 2.3.1
  - numpy
  - scipy
  - **文本分析库**: jieba
  - **机器学习库**: scikit-learn

-----

## **数据集信息**

**每个数据集的表头+样例数据:**

\`\`\`json
${JSON.stringify(args.datasets)}
\`\`\`

  - 数据库集中所有时间戳（timestamp）字段均以毫秒为单位

-----

## **工作流程和输出要求**

请严格遵循以下流程和格式来完成任务：

1.  **代码生成**:
    * **思考**: **在生成代码之前，你必须先在内部完成以下思考过程，但不要将思考过程作为输出。** 这段思考包括对问题的分析、选择的策略以及每一步的意图。
    * **数据清洗**：**在进行任何分析前，必须首先检查并清洗数据。** 这包括处理缺失值（如用空字符串填充 \`NaN\`），确保列的数据类型正确（例如，将文本列转换为 \`str\` 类型），以及处理其他异常值。**请注意每个数据集的第一行为表头行，不需要额外处理，也不作为统计范围**。
    * **代码内容**: **你必须在一个独立的 \`python\` 代码块中，严格按照提供的代码模板生成代码。** 你只能在指定的占位符内填充分析逻辑和必要的 \`import\` 语句，严禁修改模板的任何其他部分，严禁生成函数定义（def）、主函数（main）。
    * **非结构化文本处理**: **严禁基于样例数据进行主观推断，然后采用关键词匹配的方式进行分类。必须采用科学、数据驱动的文本分析流程**。在进行分词聚类前，你必须先观察数据示例。如果发现文本存在固定的、可识别的模式或分隔符，你必须优先使用正则表达式等低成本方法提取出最具备相关性文本部分来降噪。然后，再对提取出的文本使用 \`jieba\` 进行分词，使用 \`scikit-learn\` 对完整数据进行聚类。
    * **\`analyze_data\` 函数输出要求**:
        * **必须**确保 \`analyze_data\` 函数的返回值是**一个序列化后的 JSON 字符串**。
        * 在进行序列化之前，数据结构必须是一个**包含所有分析结果的列表**，其中每个元素都是一个字典。
        * 每个字典**必须**包含两个字段：\`"name"\`（结果集的名称，反映结果集的内容）和 \`"data"\`（结果集的数据）。
        * 在序列化前，**所有 NumPy 数组或类型都必须转换为标准的 Python 列表或基本类型**。
        * **示例返回结构**：
            * **Python对象**: \`[{"name": "用户反馈分类", "data": [{"cluster_id": 0, "category_name": "...", "top_keywords": ["..."], ...}]}]\`
            * **最终返回值**: 使用 \`json.dumps([...])\`，并设置 ensure_ascii=False 以支持中文输出
    * **特别说明**: 在基于分词聚类的统计分析场景，按照以下清晰、可读的格式设计结果集数据内容：
        -   **类别名称**: 距离聚类中心最近的原始文本，作为类别标签及该聚类的可读的名称。
        -   **类别摘要**: 包含该聚类的主要关键词，作为可读的标题。
        -   **统计信息**: 数量和占比。
        -   **代表性反馈**: 展示该聚类中最具代表性的 1-2 条原始反馈文本，以提供语境。

2.  **结果评估与处理**:
    * 当代码执行完毕，系统将返回 \`Observation\`。
    * **思考**: 仔细评估 \`Observation\` 的内容。如果代码执行出错或结果不符合预期，请重新规划下一步行动，并生成新的 \`python\` 代码块。
    * **如果结果符合预期**:
        * **思考**: 对 \`Observation\` 中的原始结果进行总结和润色，以增强可读性和连贯性。
          - **只提供对数据的客观描述和解释，严禁添加任何建议、判断或结论。**
          - **聚类场景下类别内容高度相似或重复时，请自动将它们合并为一个类别，同时相应的统计数值也进行合并**
          - **聚类场景下必须对较长的聚类的类别标签进行适当地提炼，内容与当前分析目标保证相关性（一般不超过10个字）**
        * **输出**: **将润色后的最终答案，封装在一个独立的 \`answer\` 代码块中返回。**
    * **如果结果不符合预期**:
        * **思考**: 分析错误原因，并重新规划代码逻辑。然后，重新生成 \`python\` 代码块。

-----

## **约束与限制**

- **不要生成可视化相关代码**：当前执行环境不支持可视化库
- **请用 Python 3.9+ 的语法编写代码**。
- **所有变量名必须严格遵循 snake_case 命名风格**。
- **保障代码的健壮性**：务必处理可能存在的缺失数据（NaN）。
- **输出格式约束**: **你必须只输出一个代码块。代码块的类型可以是 \`python\` 或 \`answer\`，具体取决于你所处的任务阶段**。
- **必须移除所有注释**：保证代码的精简

-----

`;

  // /no_think
  const prompt = `请基于下面的任务信息执行数据分析代码设计：

---

1. **整体洞察目标**：${args.goal_description}
2. **当前分析目标**：${args.task_description}
3. **参考分析逻辑**：${args.analysis_logic} （仅参考，具体实现以实际数据内容进行动态调整）
4. **期望的输出**: ${args.expected_analysis_output}

---
`;

  console.log('system length', system.length);
  console.log('prompt length', prompt.length);

  const start = Date.now();
  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: system,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  if (roundInfo.previousCode && roundInfo.observation) {
    messages.push({
      role: 'assistant',
      content: `\`\`\`python\n${roundInfo.previousCode}\n\`\`\``,
    });
    messages.push({
      role: 'user',
      content: `Observation 如下：

${roundInfo.observation}
`,
    });
  }

  const { text } = await generateText({
    model: getModel('gpt-oss-120b-meituan'), // qwen3-coder-480b-a35b-instruct-fp8-meituan
    temperature: 0.3,
    maxRetries: 1,
    maxSteps: 1,
    messages,
    maxTokens: 10000,
    experimental_telemetry: {
      isEnabled: true,
      metadata: getSharedMetadata(ctx),
    },
    // toolChoice:
    //   roundInfo.previousCode && roundInfo.observation
    //     ? roundInfo.forceExit
    //       ? "required"
    //       : "auto"
    //     : "none",
  });

  console.log('\ngenerate code in ', Date.now() - start);
  console.log('code is', text.length, text);
  console.log('roundInfo', roundInfo);

  const block = trimCodeBlock(text);

  return {
    code: block.type === 'python' ? block.content : '',
    result: block.type !== 'python' ? block.content : '',
  };
};

export const nlPythonAnalysisToolFactory: IToolFactory = (ctx) => {
  return {
    name: 'analysis-data',
    description: `接收自然语言表达的具体的数据分析目标和数据集 ID，设计 Python 代码并执行实现数据分析`,
    parameters: parametersSchema,
    async execute(args: z.infer<typeof parametersSchema>, options) {
      // const t = Cat.newTransaction('pythonAnalysis', 'overall');
      let codeInterceptorTool;
      try {
        codeInterceptorTool = await getCodeInterceptorTool();
      } catch (e) {
        // t.logError(e);
        // t.setStatus(Cat.STATUS.FAIL);
        // t.complete();
        return {
          content: [
            {
              type: 'text',
              text: `连接代码解释器服务失败`,
            },
          ],
          isError: true,
        };
      }

      // 直接大模型传递的 uuid 格式的 dataset_id 可能有幻觉，这里工程兜底用简短的任务 ID 传递+memory
      // memory 提取
      const goalId = args.goal_id;
      const taskId = args.task_id;
      const goals = ctx.memory?.get('goals') || [];
      const goal = goals.find((item) => item.goal_id === goalId);
      const datasets: {
        dataset_id: string;
        dataset_columns: string[];
        rows_count: number;
        sample_data: any[];
      }[] = [];
      if (goal && taskId) {
        const tasks = goal.tasks || [];
        const dependencies =
          tasks.find((item) => item.task_id === taskId)?.dependency_task_ids || [];
        for (const dep of dependencies) {
          // const depTask = tasks.find((item) => item.task_id === dep);
          const mem = ctx.memory?.get(dep);
          mem && datasets.push(mem);
        }
      }

      if (!datasets.length) {
        return {
          content: [
            {
              type: 'text',
              text: '未提供数据集 ID',
            },
          ],
          isError: true,
        };
      }

      // loop
      const reActLoop = async (roundCtx: ILoopRound) => {
        let code;
        // const t1 = Cat.newTransaction('pythonAnalysis', 'codeGen');
        try {
          const ret = await nlPythonAnalysis({ ...args, datasets }, ctx, roundCtx);
          if (ret.result) {
            return {
              exit: true,
              result: {
                content: [
                  {
                    type: 'text',
                    text: ret.result,
                  },
                ],
                isError: false,
              },
            };
          }

          code = ret.code;
          if (!code) {
            throw new Error('生成分析代码失败');
          }
          // t1.complete();
        } catch (e) {
          console.log(e);
          // t1.logError(e);
          // t1.setStatus(Cat.STATUS.FAIL);
          // t1.complete();
          return {
            exit: true,
            result: {
              content: [
                {
                  type: 'text',
                  text: `生成分析代码过程发生了一点问题：${e.message}`,
                },
              ],
              isError: true,
            },
          };
        }

        // exec
        // const t2 = Cat.newTransaction('pythonAnalysis', 'codeMcpRun');
        try {
          roundCtx.previousCode = code;

          const start = Date.now();
          const finalCode = removeDuplicatedImports(
            CODE_TEMPLATE_FACTORY(
              datasets.map((item) => item.dataset_id),
              code,
              ctx,
            ),
          );

          const { structuredContent, ...result } = await codeInterceptorTool.execute({
            code: finalCode,
            language: 'python',
          } as any);

          console.log('mcp result', Date.now() - start, result);

          if (process.env.NODE_ENV === 'local' || result.isError) {
            // t2.complete();
            // 代码执行异常不会以 isError 方式暴露，而是stderr
            return {
              result,
            };
          }

          let resultPart = result.content[0].text;
          if (typeof resultPart === 'string') {
            resultPart = JSON.parse(resultPart);
          }

          const { stdout, stderr } = resultPart.run_result;

          // {"status":"Success","message":"","run_result":{"status":"Finished","execution_time":1.3104791641235352,"return_code":0,"stdout":"pandas版本号: 2.3.1\n","stderr":""},"files":{}}
          //         {
          //   content: [
          //     {
          //       type: 'text',
          //       text: '{"status":"Success","message":"","run_result":{"status":"Finished","execution_time":0.5375568866729736,"return_code":0,"stdout":"2.32.3\\n","stderr":""},"files":{}}'
          //     }
          //   ],
          //   isError: false
          // }

          // t2.complete();
          return {
            result: {
              content: stderr
                ? [{ type: 'text', text: `stderr: ${stderr}` }]
                : [{ type: 'text', text: `stdout: ${stdout}` }],
              isError: !!stderr,
            },
          };
        } catch (e) {
          console.log('e', e);
          // t2.logError(e);
          // t2.setStatus(Cat.STATUS.FAIL);
          // t2.complete();
          return {
            exit: true,
            result: {
              content: [
                {
                  type: 'text',
                  text: `数据分析过程发生了一点问题：${e.message}`,
                },
              ],
              isError: true,
            },
          };
        }
      };

      const roundCxt: ILoopRound = {
        round: 1,
        previousCode: '',
        observation: '',
        forceExit: false,
      };
      let finalResult;
      while (!roundCxt.forceExit) {
        // 最多两轮代码生成，外加额外一次总结
        const output = await reActLoop(roundCxt);
        if (output.exit) {
          finalResult = output.result;
          break;
        }
        console.log('output is', output);
        roundCxt.observation =
          typeof output.result === 'string' ? output.result : JSON.stringify(output.result);
        roundCxt.forceExit = roundCxt.round >= 4; // 可尝试修复 2 次
        roundCxt.round += 1;
      }

      console.log('finalResult', finalResult);
      // t.addData('loopRound', `${roundCxt.round - 1}`);

      if (!finalResult) {
        if (!roundCxt.observation) {
          // t.setStatus(Cat.STATUS.FAIL);
        }
        // t.complete();
        return roundCxt.observation
          ? roundCxt.observation && typeof roundCxt.observation.isError !== 'undefined'
            ? roundCxt.observation
            : {
                isError: false,
                content: [
                  {
                    type: 'text',
                    text: roundCxt.observation,
                  },
                ],
              }
          : {
              isError: true,
              content: [
                {
                  type: 'text',
                  text: '未能生成分析结果',
                },
              ],
            };
      }

      // t.complete();
      return finalResult;
    },
  };
};
