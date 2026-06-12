import { Hono } from 'hono';
import type { Env } from '../index';

const model = new Hono<{ Bindings: Env }>();

const AVAILABLE_MODELS = [
  { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini (fast)' },
  { id: 'gpt-5.5', label: 'GPT-5.5' },
  { id: 'gpt-5.4', label: 'GPT-5.4' },
  { id: 'claude-sonnet-4.6', label: 'Claude Sonnet 4.6' }
];

model.get('/', (c) => c.json(AVAILABLE_MODELS));

export default model;
