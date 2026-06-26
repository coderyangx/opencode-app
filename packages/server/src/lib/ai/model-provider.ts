import { customProvider } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getConfig } from '../../config/index.js';

// Supported model names - can be extended via environment variables
const defaultModelNames = [
  'gpt-4.1',
  'gpt-4.1-nano',
  'gpt-4o-mini',
  'gpt-4o',
  'deepseek-chat',
  'anthropic.claude-sonnet-4',
  'anthropic.claude-3.7-sonnet',
];

export function getModel(name: string) {
  const apiKey = getConfig('FRIDAY_API_KEY') || process.env.OPENAI_API_KEY || 'sk-placeholder';

  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  console.log('getModel:', name, 'baseURL:', baseURL);

  // Build a provider that supports all known model names
  const modelNames = [...defaultModelNames];

  // If the requested name isn't in the list, add it dynamically
  if (!modelNames.includes(name)) {
    modelNames.push(name);
  }

  const myAIModels = customProvider({
    languageModels: modelNames.reduce((prev, modelName) => {
      prev[modelName] = createOpenAI({
        baseURL,
        apiKey,
      })(modelName);
      return prev;
    }, {} as any),
  });

  return myAIModels.languageModel(name);
}
