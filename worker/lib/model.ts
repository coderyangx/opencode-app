import { createOpenAI } from '@ai-sdk/openai';

type ModelEnv = {
  OPENAI_BASE_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL_ID?: string;
};

export function getModel(env: ModelEnv, name?: string) {
  const client = createOpenAI({
    baseURL: env.OPENAI_BASE_URL,
    apiKey: env.OPENAI_API_KEY
  });
  return client.chat(name ?? env.OPENAI_MODEL_ID ?? 'gpt-5.4-mini');
}
