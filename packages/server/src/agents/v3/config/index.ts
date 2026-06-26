import Lion from "@dp/lion-client";
import { APP_KEY } from "../const/index.js";
import { getKeyByName } from "@dp/node-kms";

const CONFIG: Map<string, string> = new Map();

export const initConfig = async () => {
  const keys = [
    "FRIDAY_API_KEY",
    "XTABLE_APP_ID",
    "XTABLE_APP_SECRET",
    "WEBSTATIC_TOKEN",
    "LANGFUSE_SECRET_KEY",
    "LANGFUSE_PUBLIC_KEY",
    "EVALUATION_LANGFUSE",
  ];
  for (const key of keys) {
    try {
      const value = await Lion.getProperty(`${APP_KEY}.${key}`, "");
      CONFIG.set(key, value);
      if (!process.env[key]) {
        process.env[key] = value;
      }
    } catch {
      // ignore
    }
  }

  const kmsKeys = ["SSO_CLIENT_ID", "SSO_CLIENT_SECRET"];
  for (const key of kmsKeys) {
    try {
      const value = await getKeyByName("com.sankuai.citadel.xtable.agent", key);
      console.log("kms get", key, value);
      CONFIG.set(key, value);
      if (!process.env[key]) {
        process.env[key] = value;
      }
    } catch {
      // ignore
    }
  }
};

export const getConfig = (key: string) => {
  return CONFIG.get(key);
};
