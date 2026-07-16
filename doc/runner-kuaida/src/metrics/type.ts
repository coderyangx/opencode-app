export enum MetricsConfig {
  // 内存变化
  memoryRange = 'memoryRange',
  // 单帧最大渲染时长
  maxRenderTimePerFrame = 'maxRenderTimePerFrame',
  // 最小FPS（卡顿帧数量）
  worstFrameData = 'worstFrameData',
  // 平均FPS
  averageFPS = 'averageFPS',
  // 总卡顿帧数
  jankFrameCount = 'jankFrameCount',
  // 总帧数
  totalFrameCount = 'totalFrameCount',
  // 总时长
  totalTime = 'totalTime',
  // 渲染时长
  renderTime = 'renderTime',
  // 渲染次数
  renderCount = 'renderCount',
  // 自定义mark
  custom = 'custom',
  // load
  load = 'load',
  /** 快搭新增指标 */
  fst = 'fst',
  parseTime = 'parseTime'
}

export interface IMemoryMetrics {
  // 内存变化
  [MetricsConfig.memoryRange]?: [number, number];
}

export interface IFPSMetrics {
  // 单帧最大渲染时长
  [MetricsConfig.maxRenderTimePerFrame]?: number;
  // 最小FPS（卡顿帧数量）
  [MetricsConfig.worstFrameData]?: { fps: number; count: number };
  // 平均FPS
  [MetricsConfig.averageFPS]?: number;
  // 总卡顿帧数
  [MetricsConfig.jankFrameCount]?: number;
  // 总帧数
  [MetricsConfig.totalFrameCount]?: number;
}

export interface IResponseMetrics {
  // 总时长
  [MetricsConfig.totalTime]?: number;
  // 渲染时长
  [MetricsConfig.renderTime]?: number;
  // 渲染次数
  [MetricsConfig.renderCount]?: number;
  // 自定义指标
  [MetricsConfig.custom]?: Dictionary<number>;
  /** 快搭新增指标 */
  [MetricsConfig.fst]?: number; // fst
  [MetricsConfig.parseTime]?: number; // 表单渲染解析时间
}

export interface Dictionary<T> {
  [key: string]: T;
}

export interface IMetrics extends IMemoryMetrics, IFPSMetrics, IResponseMetrics {}

/** IMetrics */
export interface IMetricsConfig {
  memoryRange?: [number, number];
  maxRenderTimePerFrame?: number;
  worstFrameData?: { fps: number; count: number };
  averageFPS?: number;
  jankFrameCount?: number;
  totalFrameCount?: number;
  totalTime?: number;
  renderTime?: number;
  renderCount?: number;
  custom?: Dictionary<number>;

  load?: string;
  fps?: string;
  memory?: string;
  response?: string;
}
