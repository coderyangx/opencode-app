import { customProvider } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createQwen } from "qwen-ai-provider";
import { getConfig } from "../config/index.js";

const modelNames = [
  "deepseek-chat",
  "QwQ-32B-Friday",
  "qwen-vl-plus-latest",
  "gpt-4o-mini",
  "qwen-turbo-latest",
  "deepseek-v3-friday",
  "deepseek-r1-friday",
  "Doubao-deepseek-v3",
  "Doubao-deepseek-r1",
  "gpt-4.1-nano",
  "gpt-4.1",
  "gpt-4o-2024-11-20",
  "anthropic.claude-3.7-sonnet",
  "anthropic.claude-sonnet-4",
  "Doubao-Seed-1.6",
  "LongCat-Large-32K-Chat-0626",
  "qwen3-235b-a22b-meituan",
  "kimi-k2-instruct-meituan",
  "LongCat-Flash-Chat-Preview",
  "qwen3-235b-a22b-Instruct-2507-meituan",
  "qwen3-coder-480b-a35b-instruct-fp8-meituan",
  "gpt-oss-120b-meituan",
];

const BASE_URL = "https://aigc.sankuai.com/v1/openai/native";

export function getLanguageModel(name: string) {
  const apiKey = getConfig("FRIDAY_API_KEY") || process.env.FRIDAY_API_KEY;

  const myAIModels = customProvider({
    languageModels: modelNames.reduce((prev, name) => {
      if (name.toLowerCase().includes("deepseek")) {
        prev[name] = createDeepSeek({
          apiKey,
          baseURL: BASE_URL,
        })(name);
      } else if (name.toLowerCase().includes("qwen")) {
        prev[name] = createQwen({
          apiKey,
          baseURL: BASE_URL,
        })(name);
      } else {
        prev[name] = createOpenAI({
          baseURL: BASE_URL,
          apiKey,
        })(name);
      }
      return prev;
    }, {} as any),
  });

  return myAIModels.languageModel(name);
}
