// Mock of @dp/lion-client - reads from environment variables instead of Lion config center
const CONFIG: Map<string, string> = new Map();

export const initConfig = async () => {
  const keys = ["FRIDAY_API_KEY", "XTABLE_APP_ID", "XTABLE_APP_SECRET"];
  for (const key of keys) {
    try {
      // Read from environment variables (fallback to empty string)
      const value = process.env[key] || "";
      CONFIG.set(key, value);
      console.log("init config key:", key, "value:", value ? "***" : "(empty)");
    } catch {
      // ignore
    }
  }
};

export const getConfig = (key: string) => {
  return CONFIG.get(key) || process.env[key] || "";
};
