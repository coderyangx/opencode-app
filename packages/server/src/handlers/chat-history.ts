import type { Handler } from 'hono';
import { getCookie } from 'hono/cookie';
import { sessionMemoryManager } from '../lib/cache/session.js';

const HISTORY_KEY = '__chatHistory';

export const ChatHistory: Handler = async (c) => {
  const sessionId = getCookie(c, 'chatSessionId');
  if (!sessionId) {
    return c.json({ sessionId: null, history: [] });
  }
  const memory = sessionMemoryManager.get(sessionId);
  const history = memory.get(HISTORY_KEY) || [];
  return c.json({ sessionId, history });
};

export const ClearChatHistory: Handler = async (c) => {
  const sessionId = getCookie(c, 'chatSessionId');
  if (!sessionId) {
    return c.json({ success: true, message: 'no session' });
  }
  const memory = sessionMemoryManager.get(sessionId);
  memory.set(HISTORY_KEY, []);
  return c.json({ success: true });
};

export { HISTORY_KEY };
