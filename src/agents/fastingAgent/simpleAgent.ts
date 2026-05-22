import { customProvider, generateText, streamText, ToolLoopAgent, tool, stepCountIs } from 'ai';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { createModel, defaultModel } from '../model';

/**
 * 简单的 AI Agent 示例
 * 支持单次对话和流式对话
 */
export class SimpleAgent {
  private systemPrompt: string;
  private model: ReturnType<typeof createModel>;

  constructor(systemPrompt: string = '你是一个有帮助的AI助手。', apiKey?: string) {
    this.systemPrompt = systemPrompt;
    this.model = apiKey ? createModel({ apiKey }) : defaultModel;
  }

  /**
   * 单次对话（非流式）
   */
  async chat(userMessage: string): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      system: this.systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    return text;
  }

  /**
   * 流式对话
   * 返回一个 AsyncIterable，可以逐步获取生成的文本
   */
  async *chatStream(userMessage: string): AsyncGenerator<string> {
    const { textStream } = streamText({
      model: this.model,
      system: this.systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    for await (const textPart of textStream) {
      yield textPart;
    }
  }
}

/**
 * 轻断食助手 Agent
 * 专门用于回答断食相关问题
 */
export class FastingAssistantAgent extends SimpleAgent {
  constructor(apiKey?: string) {
    super(
      `你是一个专业的轻断食助手。你的职责是：
1. 回答用户关于轻断食的问题
2. 提供健康的断食建议
3. 解释不同断食方法（如16:8、5:2等）的优缺点
4. 鼓励用户坚持健康的饮食习惯

请注意：
- 不要提供医疗建议
- 提醒用户如有健康问题请咨询医生
- 保持积极正面的态度`,
      apiKey
    );
  }
}

// 导出默认实例
export const fastingAssistantAgent = new FastingAssistantAgent();
