import { Langfuse } from 'langfuse';

// 自定义 OpenTelemetry SpanExporter，将 AI SDK span 转换为
// Langfuse trace/generation 并上报（基于 v3 exporter）

const limitOutput = (output: string, limit = 1000) => {
  if (output.length > limit) {
    return `${output.slice(0, limit)}\n... 省略更多<${output.length - limit}>字符`;
  }

  return output;
};

let releaseVersion: string | undefined;

/**
 * 服务启动时的版本简单实现，2025080715 会到小时级别.
 */
const getReleaseVersion = () => {
  if (releaseVersion) {
    return releaseVersion;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const formattedDate = `${year}${month}${day}${hour}`;

  releaseVersion = formattedDate;
  return releaseVersion;
};

/**
 * 自定义 OpenTelemetry SpanExporter
 * 将 AI SDK 产生的 span 转换为 Langfuse trace/span/generation 并上报
 *
 * 基于 v3 trace/exporter.ts，移除了 @dp/cat-client 依赖
 */
export class LangfuseExporter {
  static langfuse: Langfuse;
  langfuse: Langfuse;
  debug = false;
  allSpans: any;

  constructor(params: any = {}) {
    this.debug = params.debug ?? false;
    if (!LangfuseExporter.langfuse) {
      LangfuseExporter.langfuse = new Langfuse({
        ...params,
        persistence: 'memory',
        sdkIntegration: 'vercel-ai-sdk',
      });
      if (this.debug) {
        LangfuseExporter.langfuse.debug();
      }
    }
    this.langfuse = LangfuseExporter.langfuse;
  }

  async export(allSpans, resultCallback) {
    allSpans = allSpans.filter((span) => this.isAiSdkSpan(span));
    if (allSpans.length === 0) {
      resultCallback({
        code: 0,
      });
      return;
    }
    this.allSpans = [...Array.from(this.allSpans || []), ...allSpans];
    this.logDebug('exporting spans', allSpans);
    try {
      const traceSpanMap = new Map();
      for (const span of allSpans) {
        if (!this.isAiSdkSpan(span)) {
          this.logDebug('Ignoring non-AI SDK span', span.name);
          continue;
        }
        const traceId = span.spanContext().traceId;
        traceSpanMap.set(traceId, (traceSpanMap.get(traceId) ?? []).concat(span));
      }
      for (const [traceId, spans] of traceSpanMap) {
        this.processTraceSpans(traceId, spans);
      }
      await this.langfuse.flushAsync();
      const successCode = 0;
      resultCallback({
        code: successCode,
      });
    } catch (err) {
      console.error('[LangfuseExporter] export error', err);
      const failureCode = 1;
      resultCallback({
        code: failureCode,
        error: err instanceof Error ? err : new Error('Unknown error'),
      });
    }
  }

  processTraceSpans(traceId, spans) {
    const rootSpan = spans.find((span) => this.isRootAiSdkSpan(span, spans));
    if (!rootSpan) {
      this.logDebug('No root span found with AI SDK spans, skipping trace');
      console.log('spans without rootSpan', spans);
      return;
    }
    const userProvidedTraceId = this.parseTraceId(spans);
    const finalTraceId = userProvidedTraceId ?? traceId;
    const langfusePrompt = this.parseLangfusePromptTraceAttribute(spans);
    const updateParent = this.parseLangfuseUpdateParentTraceAttribute(spans);
    const traceParams = {
      userId: this.parseUserIdTraceAttribute(spans),
      sessionId: this.parseSessionIdTraceAttribute(spans),
      tags:
        this.parseTagsTraceAttribute(spans).length > 0
          ? this.parseTagsTraceAttribute(spans)
          : undefined,
      input: this.parseInput(rootSpan),
      output: this.parseOutput(rootSpan),
      metadata: this.filterTraceAttributes(this.parseMetadataTraceAttribute(spans)),
    };
    const finalTraceParams = {
      id: finalTraceId,
      release: getReleaseVersion(),
      ...(updateParent ? traceParams : {}),
    };
    this.langfuse.trace(finalTraceParams as any);
    for (const span of spans) {
      if (this.isGenerationSpan(span)) {
        this.processSpanAsLangfuseGeneration(
          finalTraceId,
          span,
          this.isRootAiSdkSpan(span, spans),
          langfusePrompt,
        );
      } else {
        this.processSpanAsLangfuseSpan(
          finalTraceId,
          span,
          this.isRootAiSdkSpan(span, spans),
          userProvidedTraceId ? this.parseTraceName(spans) : undefined,
        );
      }
    }
  }

  processSpanAsLangfuseSpan(traceId, span, isRootSpan, rootSpanName) {
    const spanContext = span.spanContext();
    const attributes = span.attributes;

    let name = span.name;
    if ('ai.toolCall.name' in attributes) {
      name = 'ai.toolCall ' + attributes['ai.toolCall.name']?.toString();
    } else if (isRootSpan && rootSpanName) {
      name = rootSpanName;
    }

    this.langfuse.span({
      traceId,
      parentObservationId: isRootSpan ? undefined : this.getParentSpanId(span),
      id: spanContext.spanId,
      name,
      startTime: this.hrTimeToDate(span.startTime),
      endTime: this.hrTimeToDate(span.endTime),
      input: this.parseInput(span),
      output: this.parseOutput(span),
      metadata: this.filterTraceAttributes(this.parseSpanMetadata(span)),
    });
  }

  processSpanAsLangfuseGeneration(traceId, span, isRootSpan, langfusePrompt) {
    const spanContext = span.spanContext();
    const attributes = span.attributes;
    this.langfuse.generation({
      traceId,
      parentObservationId: isRootSpan ? undefined : this.getParentSpanId(span),
      id: spanContext.spanId,
      name: span.name,
      startTime: this.hrTimeToDate(span.startTime),
      endTime: this.hrTimeToDate(span.endTime),
      completionStartTime:
        'ai.response.msToFirstChunk' in attributes
          ? new Date(
              this.hrTimeToDate(span.startTime).getTime() +
                Number(attributes['ai.response.msToFirstChunk']),
            )
          : 'ai.stream.msToFirstChunk' in attributes
            ? new Date(
                this.hrTimeToDate(span.startTime).getTime() +
                  Number(attributes['ai.stream.msToFirstChunk']),
              )
            : undefined,
      model:
        'ai.response.model' in attributes
          ? attributes['ai.response.model']?.toString()
          : 'gen_ai.request.model' in attributes
            ? attributes['gen_ai.request.model']?.toString()
            : 'ai.model.id' in attributes
              ? attributes['ai.model.id']?.toString()
              : undefined,
      modelParameters: {
        toolChoice:
          'ai.prompt.toolChoice' in attributes
            ? (attributes['ai.prompt.toolChoice']?.toString() ?? null)
            : null,
        maxTokens:
          'gen_ai.request.max_tokens' in attributes
            ? (attributes['gen_ai.request.max_tokens']?.toString() ?? null)
            : null,
        finishReason:
          'gen_ai.response.finish_reasons' in attributes
            ? (attributes['gen_ai.response.finish_reasons']?.toString() ?? null)
            : 'gen_ai.finishReason' in attributes
              ? (attributes['gen_ai.finishReason']?.toString() ?? null)
              : null,
        system:
          'gen_ai.system' in attributes
            ? (attributes['gen_ai.system']?.toString() ?? null)
            : 'ai.model.provider' in attributes
              ? (attributes['ai.model.provider']?.toString() ?? null)
              : null,
        maxRetries:
          'ai.settings.maxRetries' in attributes
            ? (attributes['ai.settings.maxRetries']?.toString() ?? null)
            : null,
        mode:
          'ai.settings.mode' in attributes
            ? (attributes['ai.settings.mode']?.toString() ?? null)
            : null,
        temperature:
          'gen_ai.request.temperature' in attributes
            ? (attributes['gen_ai.request.temperature']?.toString() ?? null)
            : null,
      },
      usage: this.parseUsageDetails(attributes),
      usageDetails: this.parseUsageDetails(attributes),
      input: this.parseInput(span),
      output: this.parseOutput(span),
      metadata: this.filterTraceAttributes(this.parseSpanMetadata(span)),
      prompt: langfusePrompt,
    });
  }

  parseUsageDetails(attributes) {
    return {
      input:
        'gen_ai.usage.prompt_tokens' in attributes
          ? parseInt(attributes['gen_ai.usage.prompt_tokens']?.toString() ?? '0')
          : 'gen_ai.usage.input_tokens' in attributes
            ? parseInt(attributes['gen_ai.usage.input_tokens']?.toString() ?? '0')
            : undefined,
      output:
        'gen_ai.usage.completion_tokens' in attributes
          ? parseInt(attributes['gen_ai.usage.completion_tokens']?.toString() ?? '0')
          : 'gen_ai.usage.output_tokens' in attributes
            ? parseInt(attributes['gen_ai.usage.output_tokens']?.toString() ?? '0')
            : undefined,
      total:
        'ai.usage.tokens' in attributes
          ? parseInt(attributes['ai.usage.tokens']?.toString() ?? '0')
          : undefined,
    };
  }

  parseSpanMetadata(span) {
    return Object.entries(span.attributes).reduce((acc, [key, value]) => {
      const metadataPrefix = 'ai.telemetry.metadata.';
      if (key.startsWith(metadataPrefix) && value != null) {
        const strippedKey = key.slice(metadataPrefix.length);
        acc[strippedKey] = value;
      }
      const spanKeysToAdd = [
        'ai.settings.maxToolRoundtrips',
        'ai.prompt.format',
        'ai.toolCall.id',
        'ai.schema',
      ];
      if (spanKeysToAdd.includes(key) && value != null) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  isGenerationSpan(span) {
    const generationSpanNameParts = ['doGenerate', 'doStream', 'doEmbed'];
    return generationSpanNameParts.some((part) => span.name.includes(part));
  }

  isAiSdkSpan(span) {
    const instrumentationScopeName =
      span.instrumentationLibrary?.name ?? span.instrumentationScope?.name;
    return instrumentationScopeName === 'ai' || instrumentationScopeName === 'ai_e2e';
  }

  isRootAiSdkSpan(span, spans) {
    const spanIds = new Set(spans.map((span) => span.spanContext().spanId));
    const parentSpanId = this.getParentSpanId(span);
    return !parentSpanId || !spanIds.has(parentSpanId);
  }

  logDebug(message, ...args) {
    if (!this.debug) {
      return;
    }
    console.log(`[${new Date().toISOString()}] [LangfuseExporter] ${message}`, ...args);
  }

  getParentSpanId(span) {
    return span.parentSpanId ?? span.parentSpanContext?.spanId;
  }

  hrTimeToDate(hrtime) {
    const nanoSeconds = hrtime[0] * 1e9 + hrtime[1];
    const milliSeconds = nanoSeconds / 1e6;
    return new Date(milliSeconds);
  }

  async forceFlush() {
    this.logDebug('Force flushing Langfuse...');
    await this.langfuse.flushAsync();
  }

  async shutdown() {
    this.logDebug('Shutting down Langfuse...');
    await this.langfuse.shutdownAsync();
  }

  parseInput(span) {
    const attributes = span.attributes;
    const tools = [];
    let chatMessages = [];
    if ('ai.prompt.messages' in attributes) {
      chatMessages = [attributes['ai.prompt.messages']];
      try {
        chatMessages = JSON.parse(attributes['ai.prompt.messages']);
      } catch {}
    }
    chatMessages = chatMessages.slice(-1);
    return 'ai.prompt.messages' in attributes
      ? [...chatMessages, ...(Array.isArray(tools) ? tools : [])]
      : 'ai.prompt' in attributes
        ? limitOutput(attributes['ai.prompt'])
        : 'ai.toolCall.args' in attributes
          ? attributes['ai.toolCall.args']
          : undefined;
  }

  parseOutput(span) {
    const attributes = span.attributes;
    return 'ai.response.text' in attributes
      ? limitOutput(attributes['ai.response.text'])
      : 'ai.result.text' in attributes
        ? attributes['ai.result.text']
        : 'ai.toolCall.result' in attributes
          ? attributes['ai.toolCall.result']
          : 'ai.response.object' in attributes
            ? attributes['ai.response.object']
            : 'ai.result.object' in attributes
              ? attributes['ai.result.object']
              : 'ai.response.toolCalls' in attributes
                ? attributes['ai.response.toolCalls']
                : 'ai.result.toolCalls' in attributes
                  ? attributes['ai.result.toolCalls']
                  : undefined;
  }

  parseTraceId(spans) {
    return spans
      .map((span) => this.parseSpanMetadata(span)['langfuseTraceId'])
      .find((id) => Boolean(id))
      ?.toString();
  }

  parseTraceName(spans) {
    return spans
      .map((span) => span.attributes['resource.name'])
      .find((name) => Boolean(name))
      ?.toString();
  }

  parseUserIdTraceAttribute(spans) {
    return spans
      .map((span) => this.parseSpanMetadata(span)['userId'])
      .find((id) => Boolean(id))
      ?.toString();
  }

  parseSessionIdTraceAttribute(spans) {
    return spans
      .map((span) => this.parseSpanMetadata(span)['sessionId'])
      .find((id) => Boolean(id))
      ?.toString();
  }

  parseLangfusePromptTraceAttribute(spans) {
    const jsonPrompt = spans
      .map((span) => this.parseSpanMetadata(span)['langfusePrompt'])
      .find((prompt) => Boolean(prompt));
    try {
      if (jsonPrompt) {
        const parsedPrompt = JSON.parse(jsonPrompt.toString());
        if (
          typeof parsedPrompt !== 'object' ||
          !(
            parsedPrompt['name'] &&
            parsedPrompt['version'] &&
            typeof parsedPrompt['isFallback'] === 'boolean'
          )
        ) {
          throw Error('Invalid langfusePrompt');
        }
        return parsedPrompt;
      }
    } catch (e) {
      return undefined;
    }
  }

  parseLangfuseUpdateParentTraceAttribute(spans) {
    return Boolean(
      spans
        .map((span) => this.parseSpanMetadata(span)['langfuseUpdateParent'])
        .find((val) => val != null) ?? true,
    );
  }

  parseTagsTraceAttribute(spans) {
    return [
      ...new Set(
        spans
          .map((span) => this.parseSpanMetadata(span)['tags'])
          .filter((tags) => Array.isArray(tags) && tags.every((tag) => typeof tag === 'string'))
          .reduce((acc, tags) => acc.concat(tags), []),
      ),
    ];
  }

  parseMetadataTraceAttribute(spans) {
    return spans.reduce((acc, span) => {
      const metadata = this.parseSpanMetadata(span);
      for (const [key, value] of Object.entries(metadata)) {
        if (value) {
          acc[key] = value;
        }
      }
      return acc;
    }, {});
  }

  filterTraceAttributes(obj) {
    const langfuseTraceAttributes = [
      'userId',
      'sessionId',
      'tags',
      'langfuseTraceId',
      'langfusePrompt',
      'langfuseUpdateParent',
    ];
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (!langfuseTraceAttributes.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
}

LangfuseExporter.langfuse = null as any;
