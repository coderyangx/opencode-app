import { generateText, streamText, ToolLoopAgent, tool, stepCountIs, isLoopFinished } from 'ai';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';
import { defaultModel } from '../model';
import {
  calculateBMITool,
  execBashTool,
  getCurrentTimeTool,
  readFileTool,
  writeFileTool
} from './tool';

const fastingInstruction = `
   ## 角色
   你是一个专业的轻断食健康助手。只回答与断食、健康饮食相关的问题。
   ## 职责
   - 1. 回答用户关于轻断食的问题
   - 2. 提供健康的断食建议
   - 3. 解释不同断食方法（如16:8、5:2等）的优缺点
   - 4. 鼓励用户坚持健康的饮食习惯
   - 5. 如有需要可以查询当前时间或帮用户计算 BMI

   ## 工具使用规则
   - 当用户提到具体体重/身高数字时，**必须**调用 calculateBMI 工具后再给建议
   - 当用户询问"现在"、"今天"、"当前时间"等时间信息时，调用 getCurrentTime 工具
   - 其他情况直接回答，不要无故调用工具

   ## 输出规范
   - 回复内容不要过短也不要过长
   - 语气：专业但亲切，像营养师朋友
   - 如果给出建议，用有序列表格式

   ## 边界处理
   - 用户问医疗诊断/药物/手术：礼貌拒绝并建议就医
   - 用户问与断食无关的话题：说明你的专业范围，引导回正题
   - 用户BMI < 18：警示偏瘦风险，不建议断食，建议就医
   - 用户BMI > 35：提示高风险，建议在医生指导下进行

   ## 禁止事项
   - 不能给出具体药物名称或剂量
   - 不能承诺减重效果（如"保证瘦10斤"）
   - 不能声称自己是人类或医生
`;

const fastingInstruction1 = `
你是一个全能助手，可以读写文件、执行 bash 命令、搜索内容，完成用户的各种任务。

## 工具使用规则
- 读取文件：使用 readFile 工具，路径相对于工作目录
- 写入文件：使用 writeFile 工具，会自动创建不存在的目录
- 执行命令：使用 execBash 工具，适合查看目录、运行脚本等
- 对于不确定的操作（如删除、覆盖重要文件），必须先向用户确认
- 如果有任何歧义，主动追问用户

## 安全限制
- 禁止执行破坏性命令（如 rm -rf /、格式化磁盘等）
- 禁止访问工作目录以外的敏感系统路径
- 写文件前如果文件已存在，告知用户将要覆盖
`;

// ============================================================
// ToolLoopAgent 实现
// 与 SimpleAgent 的区别：
//   1. 使用 AI SDK 内置的 ToolLoopAgent 类，无需手动封装 generateText
//   2. 支持工具调用（Tool Calling）：LLM 可以主动调用工具获取外部信息
//   3. 自动工具循环：调用工具 → 获取结果 → 继续生成，直到满足停止条件
//   4. 可通过 InferAgentUIMessage 与 React useChat 深度集成，拥有完整类型安全
// ============================================================

/**
 * 带工具调用的轻断食助手 Agent（ToolLoopAgent 版本）
 *
 * 与 fastingAssistantAgent(SimpleAgent) 的核心区别：
 *   - SimpleAgent：直接调用 generateText，无工具，单轮问答
 *   - fastingAgent：通过 ToolLoopAgent 管理，LLM 可自主决定
 *     是否调用工具（如查询时间、计算 BMI），并在拿到工具结果后
 *     继续生成最终回答，整个过程自动循环，无需手动处理
 * TODO 上下文管理/memory/可观测性-日志/系统提示词过程/GuardRails/错误恢复与降级
 */
export const fastingAgent = new ToolLoopAgent({
  model: defaultModel,
  instructions: fastingInstruction1,
  tools: {
    getCurrentTime: getCurrentTimeTool,
    calculateBMI: calculateBMITool,
    execBash: execBashTool,
    readFile: readFileTool,
    writeFile: writeFileTool
  },
  experimental_context: {
    username: 'yangxu'
  },
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'fasting-agent', // trace 中的标识
    metadata: {
      name: ' fastingAgent',
      version: '1.0.0'
    },
    // recordInputs: true,
    recordOutputs: true
  },
  maxOutputTokens: 8_000, // Friday 最多支持 16384，保守设置 8000
  // 最多执行 10 个步骤后停止（防止无限循环）
  stopWhen: [stepCountIs(10), isLoopFinished()]
  // onStepFinish: (step) => {
  //   console.log('当前步骤onStepFinish:', step);
  // },
  // onFinish: (event) => {
  //   console.log('结束onFinish:', event.reasoning);
  // },

  // prepareCall 在每个 step 前执行，可以动态修改请求
  // prepareCall: async (options) => {
  //   const { messages, instructions } = options;
  //   const userMsg = messages.filter((m) => m.role === 'user');
  //   const lastUserMsg = userMsg[userMsg.length - 1];
  //   // 检测 prompt injection
  //   // if (containsInjection(lastUserMsg?.content)) {
  //   //   throw new Error('GUARDRAIL_TRIGGERED: suspicious input detected');
  //   // }
  //   return { instructions, messages };
  // },
});

// console.log('agent.ts:', 'fastingAgent.id', fastingAgent.id, 'fastingAgent', fastingAgent);
