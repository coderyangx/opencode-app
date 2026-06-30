langfuse 上报原理：
每个 LLM 调用都会在 Langfuse 上生成一条 trace，包含：

- trace 级 metadata：sessionId、userId（mis）、dataSetType、dataTableId、langfuseTraceId（ctx.bizId）
- generation 级数据：模型名、温度、token 用量、输入/输出内容
- tool call 级数据：工具名、参数、返回结果
- functionId 标识调用来源（agent.data_analysis / agent.query_planning / agent.query_design / agent.html_report_generate）

```
用户提问
  │
  ▼
MainAgent.streamText() ─── experimental_telemetry ──┐
  │                                                  │
  ├─ handoff.query-planning ── generateObject() ────┤
  │                                                  │
  ├─ handoff.query-design ──── generateObject() ────┤
  │                                                  ▼
  ├─ query-data 工具                          OpenTelemetry NodeSDK
  │                                           收集 AI SDK spans
  ├─ generate-chart 工具                             │
  │                                                  ▼
  └─ handoff.generate-html-report ──────────── LangfuseExporter
                                               转换为 Langfuse trace
                                                      │
                                                      ▼
                                               Langfuse 平台
                                          (trace/generation/span)
```
