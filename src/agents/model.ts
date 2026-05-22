import { openai, createOpenAI } from '@ai-sdk/openai';
import { customProvider } from 'ai';
import 'dotenv/config';

// Friday API 正确路径：/v1/openai/native（支持 Chat Completions 格式）
// const BASE_URL = 'https://aigc.sankuai.com/v1/openai/native';
// const fridayBaseUrl = BASE_URL; // 'https://aigc.sankuai.com/v1/responses';
// const fridayApiKey = '21902918114338451458';
// const ModelId = 'gpt-5.4';
const ModelId = 'gpt-5.4-mini';
// 中转站
// https://api.codeturbo.ai
// sk-b0376b7c81cf352ad3ec997d721e5a7174f302b6479d0a09fc2609d095238837
const BASE_URL = 'https://api.codeturbo.ai/v1';
const fridayBaseUrl = BASE_URL;
const fridayApiKey = 'sk-b0376b7c81cf352ad3ec997d721e5a7174f302b6479d0a09fc2609d095238837';

// 创建 OpenAI 兼容模型实例
// 必须用 .chat() 明确走 Chat Completions API
// createOpenAI()(modelId) 在新版 AI SDK 中默认走 Responses API，
// 而第三方兼容接口只支持 Chat Completions
export const createModel = (options?: { baseURL?: string; apiKey: string }) => {
  if (options?.apiKey) {
    const openaiClient = createOpenAI(options);
    // return openaiClient.chat('z-ai/glm-4.7-flash:free');
    return openaiClient.chat(ModelId);
  }
  return openai(ModelId);
};

export const defaultModel = createModel({
  baseURL: fridayBaseUrl, // 'https://api.ofox.ai/v1',
  apiKey: fridayApiKey // 'sk-of-jeidkPnfReUsZYYirqNNARgzkQfurAZoXGcyJalCdCwtkfiBZTbjOtuMNkcCVHbi'
});

export function getModel(name: string) {
  const apiKey = fridayApiKey;

  const myAIModels = customProvider({
    languageModels: [name].reduce((prev, name) => {
      if (name.toLowerCase().includes('qwen')) {
        prev[name] = createOpenAI({
          baseURL: BASE_URL,
          name,
          apiKey
        }).chat(name);
      } else {
        prev[name] = createOpenAI({
          baseURL: BASE_URL,
          apiKey
        }).chat(name);
      }
      return prev;
    }, {} as any)
  });

  return myAIModels.languageModel(name);
}

console.log('[model.ts]当前配置env', process.env.OPENAI_API_KEY, import.meta.env);
