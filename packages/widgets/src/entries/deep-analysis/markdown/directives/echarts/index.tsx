import React, { useCallback, useEffect, useRef, useState } from "react";
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, LineChart, PieChart } from "echarts/charts";
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
import { EChartsCitationDirective } from "./citation";
import { merge } from "lodash-es";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const API_BASE = window.location.origin;

export function EChartsDirective(props: any) {
  const [options, setOptions] = useState<any>(null);
  const [sources, setSources] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const applyConfig = useCallback((config: { chartOptions?: any; queryIds?: string[] }) => {
    setOptions(
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
        config.chartOptions
      )
    );
    setSources(config.queryIds || []);
  }, []);

  const getOptions = useCallback(async (id: string) => {
    try {
      console.log("getOptions", id);
      const resp = !id.endsWith(".json") ? await fetch(
        `${API_BASE}/ai-agent/chart-options`,
        {
          headers: {},
          method: "POST",
          body: JSON.stringify({
            id,
          }),
        }
      ) : await fetch(`${API_BASE}/ai-agent/object/${id}`);

      if (resp.ok) {
        const info = await resp.json();
        if (info) {
          applyConfig(info);
        }
      }
    } catch {
      // ignore
    }
  }, [applyConfig]);

  useEffect(() => {
    // 优先从 directive 属性中直接解码配置，避免二次 fetch
    if (props.config) {
      try {
        const decoded = JSON.parse(atob(props.config));
        applyConfig(decoded);
        return;
      } catch {
        // 解码失败，回退到 fetch
      }
    }
    if (props.id) {
      getOptions(props.id);
    }
  }, [props.config, props.id, getOptions, applyConfig]);

  useEffect(() => {
    if (!options) {
      return;
    }
    const myChart = echarts.init(ref.current!);
    myChart.setOption({
      yAxis: {},
      tooltip: {
        show: true,
      },
      ...options,
    });

    return () => {
      myChart.dispose();
    };
  }, [options]);

  return (
    <div>
      <div
        className="my-3 relative border border-gray-200 rounded"
        style={{ paddingBottom: "100%" }}
      >
        <div
          className="chart-container absolute top-0 left-0 w-full h-full"
          ref={ref}
        />
      </div>
      {sources.length > 0 && <EChartsCitationDirective ids={sources} />}
    </div>
  );
}
