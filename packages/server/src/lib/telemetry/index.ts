import { LangfuseExporter } from './exporter.js';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { trace, type Tracer } from '@opentelemetry/api';
import type { IRunContext } from '../../types/context.js';

// 遥测初始化入口，导出 initTelemetry、getTracer、getSharedMetadata

/**
 * 全局 NodeSDK 实例，服务启动时初始化一次
 */
let sdkSingleton: NodeSDK | null = null;

/**
 * 初始化 OpenTelemetry NodeSDK，将 AI SDK 的 span 通过 LangfuseExporter 上报到 Langfuse
 *
 * 应在服务启动时调用一次（src/index.ts）
 */
export const initTelemetry = (): NodeSDK => {
  if (sdkSingleton) {
    return sdkSingleton;
  }

  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const baseUrl = process.env.LANGFUSE_BASEURL || 'https://cloud.langfuse.com';

  // 未配置 Langfuse 密钥时跳过初始化（本地开发可选）
  if (!publicKey || !secretKey) {
    console.log(
      '[Telemetry] LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY 未配置，跳过 Langfuse 初始化',
    );
    return null as any;
  }

  const sdk = new NodeSDK({
    serviceName: 'data-analysis-agent',
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'data-analysis-agent',
    }),
    traceExporter: new LangfuseExporter({
      baseUrl,
      publicKey,
      secretKey,
      debug: process.env.LANGFUSE_DEBUG === 'true',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  // 优雅关闭
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('[Telemetry] SDK shut down'))
      .catch((err) => console.error('[Telemetry] SDK shutdown error', err));
  });

  sdkSingleton = sdk;
  console.log(`[Telemetry] Langfuse SDK 已启动，baseUrl=${baseUrl}`);
  return sdk;
};

/**
 * 获取 OpenTelemetry Tracer，供 AI SDK 的 experimental_telemetry 使用
 *
 * 所有 Agent 共用同一个全局 tracer（"ai"）
 */
export const getTracer = (_ctx?: IRunContext): Tracer => {
  return trace.getTracer('ai');
};

/**
 * 构建传递给 Langfuse 的 metadata，用于在 trace 上标识会话、用户、数据源等信息
 *
 * 这些字段会被 LangfuseExporter 解析并映射到 Langfuse trace 属性：
 * - langfuseTraceId → 自定义 trace ID（对应 ctx.bizId）
 * - sessionId → Langfuse session
 * - userId → Langfuse user
 */
export const getSharedMetadata = (ctx: IRunContext, more: Record<string, any> = {}) => {
  const common: Record<string, any> = {
    langfuseTraceId: ctx.bizId,
    sessionId: ctx.sessionId,
    userId: ctx.user?.mis,
    ...more,
  };

  // if (ctx.presetId === 'xtable') {
  //   return {
  //     ...common,
  //     dataSetType: 'xtable',
  //     dataContentId: ctx.view?.split('.')[0],
  //     dataTableId: ctx.view?.split('.')[1],
  //   };
  // }

  return {
    ...common,
    dataSetType: ctx.presetId,
    dataTableId: ctx.view,
  };
};
