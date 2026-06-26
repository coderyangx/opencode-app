/**
 * v3 迁移代码 - chat-session 服务 stub
 *
 * 原始代码位于 src/service/chat-session.ts，依赖学城 RPC 接口。
 * 这里仅提供函数签名 stub 用于学习目的。
 */

export const saveCopilotTask = async (
  _data: {
    sessionId?: string;
    taskId?: number;
    bizId?: string;
    response: string;
    operator?: string;
    operatorUid?: number | null;
  },
  _options: {
    traceId?: string;
    platform?: string;
  }
): Promise<void> => {
  // stub: 学习用代码，不实现真实持久化
};
