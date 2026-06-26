import type { IToolFactory } from "../../types/tool.js";
import { z } from "zod";
import * as echarts from "echarts";
import { IRunContext } from "../../types/context.js";
import { nanoid } from "nanoid";
import { merge } from "lodash-es";

const generateChartSVG = async (chartConfig: any, ctx: IRunContext) => {
  const chart = echarts.init(null, null, {
    renderer: "svg",
    devicePixelRatio: 3,
    ssr: true,
    width: 400,
    height: 300,
  });

  chart.setOption(
    merge(
      {
        title: {
          textStyle: {
            fontSize: 12,
          },
        },
        xAxis: {
          nameTextStyle: {
            fontSize: 0,
          },
        },
      },
      {
        textStyle: {
          fontFamily: "PingFang SC, microsoft yahei, sans-serif",
        },
        yAxis: {},
        ...chartConfig,
      }
    )
  );

  const svgStr = chart.renderToSVGString();

  chart.dispose();

  const key = nanoid(6) + ".svg";
  ctx.s3?.putObject(key, {
    data: Buffer.from(svgStr),
    metadata: {
      type: "image/svg+xml",
    },
  });

  return `${ctx.origin}/ai-agent/object/${key}`;
};

export const chartToolFactory: IToolFactory = (c) => {
  return {
    name: "generate-chart",
    description:
      "这是一个强大的数据可视化工具。当你需要将结构化的数据（如Markdown表格中的数据）转化为直观的图表（例如，折线图、柱状图、饼图等）时，请调用此工具。你需要提供明确的图表类型建议、清洗整理后的数据、以及图表标题、X轴、Y轴标签等详细配置信息。调用成功后，它将返回一个图表的URL，你可以将此URL嵌入到报告中以显示图表。请记住，图表是报告中数据洞察的关键组成部分，务必利用此工具增强报告的可读性。",
    parameters: z.object({
      chartOptions: z.object({
        xAxis: z
          .object({
            name: z.string().describe("The name of xAxis"),
            data: z.array(z.string()).describe("The data items of xAxis"),
          })
          .describe("X 轴配置，当使用 bar 类型图表时，不需要提供该配置")
          .optional(),
        title: z
          .object({
            text: z.string().describe("The chart name"),
          })
          .optional(),
        series: z
          .array(
            z.object({
              name: z.string().describe("The name of a data series"),
              type: z.string().describe("Chart type (bar, line, pie, radar)"),
              data: z
                .array(
                  z.union([
                    z.number(),
                    z.object({
                      value: z.number(),
                      name: z.string(),
                    }),
                  ])
                )
                .describe("The data points of a data series"),
            })
          )
          .describe("The data series of yAxis"),
      }),
    }),
    async execute(args, options) {
      try {
        console.log("echarts args", JSON.stringify(args, null, 2));

        const configId = `${nanoid(6)}.json`;
        c.s3?.putObject(configId, {
          data: Buffer.from(JSON.stringify(args)),
          metadata: {
            type: "application/json",
          },
        });

        return {
          content: [
            {
              type: "text",
              content: `
---
:::echarts{id=${configId}}
:::
---
`,
            },
          ],
        };
      } catch (e) {
        console.log(e);
        return {
          content: {
            type: "text",
            text: "Failed to generate chart",
          },
          isError: true,
        };
      }
    },
  };
};
