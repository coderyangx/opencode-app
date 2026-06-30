import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCitationDirective } from './citation';
import { merge } from 'lodash-es';

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

export function EChartsDirective(props: any) {
  const [options, setOptions] = useState<any>(null);
  const [sources, setSources] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const getOptions = useCallback(async (id: string) => {
    try {
      console.log('getOptions', id);
      const resp = await fetch(`${window.location.origin}/ai-agent/chart-options`, {
        headers: {},
        method: 'POST',
        body: JSON.stringify({
          id,
        }),
      });

      if (resp.ok) {
        const info = await resp.json();
        console.log(typeof info);
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
            info.chartOptions,
          ),
        );
        setSources(info.queryIds || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    getOptions(props.id);
  }, [props.id]);

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

  // console.log('生成图表', options, sources);

  return (
    <div>
      <div
        className='my-3 relative border border-gray-200 rounded'
        style={{ paddingBottom: '100%' }}
      >
        <div className='chart-container absolute top-0 left-0 w-full h-full' ref={ref} />
      </div>
      {sources.length > 0 && <EChartsCitationDirective ids={sources} />}
    </div>
  );
}
