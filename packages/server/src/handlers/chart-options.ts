import type { Handler } from "hono";
import { sessionMemoryManager } from "../lib/cache/session.js";
import { s3 } from "../lib/memory-s3/index.js";
import { getCookie } from "hono/cookie";

export const ChartOptions: Handler = async (c) => {
  const { id } = await c.req.json();

  // First try S3 (V2 generate-chart tool stores configs in S3)
  const s3Obj = s3.getObject(id);
  if (s3Obj) {
    const content = s3Obj.data.toString("utf-8");
    try {
      return c.json(JSON.parse(content));
    } catch {
      // ignore parse error
    }
  }

  // Fallback to session memory (V1 compatibility)
  const sessionId = getCookie(c, "chatSessionId");
  if (!sessionId) {
    return c.json(null);
  }
  const memManager = sessionMemoryManager.get(sessionId);
  const config = memManager.get(id);

  if (!config) {
    return c.text("Not found", 404);
  }

  return c.json(JSON.parse(config));
};
