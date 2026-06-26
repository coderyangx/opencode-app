import { LangfuseExporter } from "./exporter.js";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { trace } from "@opentelemetry/api";
import { getConfig } from "../config/index.js";
import { IRunContext } from "../types/context.js";

// Global tracer support
export const getTracker = () => {
  if (process.env.NODE_ENV === "local") {
    // return null;
  }

  return new NodeSDK({
    traceExporter: new LangfuseExporter({
      baseUrl: process.env.LANGFUSE_BASEURL || "https://langfuse.sankuai.com",
      debug: false,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });
};

let e2eTrackerSingleton: NodeSDK | null = null;

export const getTracer = (ctx: IRunContext) => {
  if (!ctx.e2e) {
    return trace.getTracer("ai"); // global tracer
  }
  if (!e2eTrackerSingleton) {
    const config = JSON.parse(getConfig("EVALUATION_LANGFUSE") || "{}");
    const client = new NodeSDK({
      serviceName: "ai_e2e",
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "ai_e2e",
      }),
      traceExporter: new LangfuseExporter({
        baseUrl: process.env.LANGFUSE_BASEURL || "https://langfuse.sankuai.com",
        debug: false,
        publicKey: config.pk,
        secretKey: config.sk,
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    client.start();

    process.on("SIGTERM", () => client.shutdown());

    e2eTrackerSingleton = client;
  }

  return trace.getTracer("ai_e2e");
};
