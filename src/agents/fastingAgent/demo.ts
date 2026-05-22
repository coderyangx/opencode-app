/**
 * Agent 使用示例 npx tsx src/agents/demo.ts
 */
import 'dotenv/config';
import { createInterface } from 'readline';
import { ModelMessage } from 'ai';
import { SimpleAgent, fastingAssistantAgent, fastingAgent } from './index';
import { isMainModule, startRepl } from './utils';

/**
 * 命令行交互测试
 */
if (isMainModule(import.meta.url)) {
  await startRepl({
    sessionId: '请输入问题', // 输入提示
    runTurn: async (history: ModelMessage[]) => {
      // 示例 ToolLoopAgent - 流式输出（带工具调用）
      // console.log('--- 示例 ToolLoopAgent 流式输出 ---');
      console.log('回答: ');
      // 先 await Promise，得到 StreamTextResult 对象，后续复用同一个实例
      // 避免对同一个 Promise 多次 await 导致的顺序问题
      const result = await fastingAgent.stream({
        messages: history
        // prompt
        // prompt: '现在是什么时间？适合开始断食窗口吗？'
      });
      // 流式消费文本输出
      for await (const chunk of result.textStream) {
        process.stdout.write(chunk);
      }
      console.log('\n');
      // textStream 消费完后，response 才完整（PromiseLike，需再 await）
      // resp.messages 包含本轮所有 step 输出：
      //   - assistant 消息（文本 + 可能的 tool-call）
      //   - tool 消息（工具执行结果，如果有工具调用）
      const resp = await result.response; // 等待所有 step settled
      console.log('[runTurn] 模型响应', JSON.stringify(resp.messages));
      console.log('\n');
      // 将 AI 回复存回 history，实现真正的多轮对话记忆
      // 必须用 spread push，因为带工具调用时会有多条消息（assistant + tool）
      history.push(...(resp.messages as ModelMessage[]));
      console.log('[runTurn] 完整 history', history);
    }
  });
}

// 简单测试
async function main() {
  const prompt = process.argv[2];
  console.log('用户prompt:', prompt);
  console.log();

  // // 示例 1: 使用简单 Agent
  // console.log('--- 示例 1: 简单对话 ---');
  // const simpleAgent = new SimpleAgent('你是一个友好的助手。');
  // const response1 = await simpleAgent.chat(prompt || '你好,你是谁');
  // console.log('回答:', response1);
  // console.log();

  // 示例 2: 使用轻断食助手
  // console.log('--- 示例 2: 轻断食助手 ---');
  // const response2 = await fastingAssistantAgent.chat('什么是16:8断食法？');
  // console.log('回答:', response2);
  // console.log();

  // // 示例 3: 流式输出
  // console.log('--- 示例 3: 流式输出 ---');
  // console.log('回答: ');
  // for await (const chunk of await fastingAssistantAgent.chatStream('断食期间可以喝水吗？')) {
  //   process.stdout.write(chunk);
  // }
  // console.log('\n');

  // 示例 4: ToolLoopAgent - 不带工具调用的普通问答
  // console.log('--- 示例 4: ToolLoopAgent 普通问答 ---');
  // const result4 = await fastingAgent.generate({
  //   prompt: '16:8断食法适合哪类人群？'
  // });
  // console.log('回答:', result4.text);
  // console.log();

  // 示例 5: ToolLoopAgent - 触发工具调用（计算 BMI）
  // console.log('--- 示例 5: ToolLoopAgent 工具调用（计算 BMI）---');
  // const result5 = await fastingAgent.generate({
  //   prompt: '我体重70千克，身高175厘米，请帮我计算BMI，并告诉我适合什么断食方案？'
  // });
  // console.log('步骤数:', result5.steps.length);
  // result5.steps.forEach((step, i) => {
  //   const toolCalls = step.toolCalls ?? [];
  //   if (toolCalls.length > 0) {
  //     console.log(`  步骤 ${i + 1} 调用工具:`, toolCalls.map((tc) => tc.toolName).join(', '));
  //   }
  // });
  // console.log('最终回答:', result5.text);
  // console.log();

  // 示例 6: ToolLoopAgent - 流式输出（带工具调用）
  console.log('--- 示例 6: ToolLoopAgent 流式输出 ---');
  console.log('回答: ');
  const stream6 = fastingAgent.stream({
    prompt
    // prompt: '现在是什么时间？适合开始断食窗口吗？'
  });
  for await (const chunk of (await stream6).textStream) {
    process.stdout.write(chunk);
  }
  console.log('\n');
}
// main().catch(console.error);

async function runAgentLoop(history: ModelMessage[]) {
  // 示例 ToolLoopAgent - 流式输出（带工具调用）
  console.log('--- 示例 ToolLoopAgent 流式输出 ---');
  console.log('回答: ');
  const stream = fastingAgent.stream({
    messages: history
    // prompt: '现在是什么时间？适合开始断食窗口吗？'
  });
  for await (const chunk of (await stream).textStream) {
    process.stdout.write(chunk);
  }
  console.log('\n');
}
