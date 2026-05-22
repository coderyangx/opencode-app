/**
 * TODO 2.1 — 结构化日志替换 console.log                  [P1]
 *
 * 问题：当前 onStepFinish 直接 console.log(step)，输出是整个对象，
 *       生产环境无法聚合、告警、关联追踪。
 *
 * 方案：实现轻量级结构化日志器，每条日志带固定字段。
 * 文件：新建 src/agents/logger.ts
 * 日志结构（JSON Lines 格式）：
 *
 *   {
 *     "timestamp": "2026-04-21T10:00:00.000Z",
 *     "level": "info" | "warn" | "error",
 *     "sessionId": "xxx",
 *     "traceId": "yyy",      // 对应 OpenTelemetry trace
 *     "event": "step_finish" | "tool_call" | "tool_result" | "finish",
 *     "stepNumber": 1,
 *     "toolName": "calculateBMI",   // 仅 tool 相关事件
 *     "latencyMs": 234,
 *     "tokenUsage": { "inputTokens": 500, "outputTokens": 150 },
 *     "finishReason": "stop" | "tool-calls" | "max-steps"
 *   }
 *
 * onStepFinish 改造：
 *
 *   onStepFinish: (step) => {
 *     logger.info({
 *       event: 'step_finish',
 *       stepNumber: step.stepNumber,
 *       finishReason: step.finishReason,
 *       tokenUsage: step.usage,
 *       toolCalls: step.toolCalls?.map(tc => ({
 *         name: tc.toolName,
 *         inputSummary: JSON.stringify(tc.input).slice(0, 100)  // 截断敏感/大型输入
 *       }))
 *     })
 *   }
 */

import winston from 'winston';
import { createLogger, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new winston.transports.Console()]
});

export default logger;
