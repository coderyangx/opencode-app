import { IMetrics, IMetricsConfig, IMemoryMetrics, IFPSMetrics, IResponseMetrics, Dictionary } from './type';

/**
 * 计算平均指标
 * @param metrics IMetrics[]
 * @returns
 */
export function averageMetrics(metrics: IMetrics[]): IMetrics {
  return new Metrics().averageMetrics(metrics);
}

class Metrics implements IMetrics {
  // 总时长
  public totalTime?: number;
  // 渲染时长
  public renderTime?: number;
  // 渲染次数
  public renderCount?: number;
  // 内存变化
  public memoryRange?: [number, number];
  // 单帧最大渲染时长
  public maxRenderTimePerFrame?: number;
  // 最小FPS（卡顿帧数量）
  public worstFrameData?: { fps: number; count: number };
  // 平均FPS
  public averageFPS?: number;
  // 总卡顿帧数
  public jankFrameCount?: number;

  // 总帧数
  public totalFrameCount?: number;

  /** 以下为新增指标 */
  public fstArray: number[] = [];
  public parseTimeArray: number[] = [];
  public fpsArray: number[] = [];
  public maxRenderTimePerFrameArray: number[] = [];

  averageMetrics(metrics: IMetrics[]): Dictionary<any> {
    console.log('averageMetrics,最终的指标数据', metrics);
    let totalTimeCount = 0;
    let renderTimeCount = 0;
    let memoryRangeCount = 0;
    let maxRenderTimePerFrameCount = 0;
    let worstFrameDataCount = 0;
    let averageFPSCount = 0;
    let jankFrameCountCount = 0;
    let totalFrameCountCount = 0;

    let fstCount = 0;
    let parseTimeCount = 0;

    const result: Dictionary<{ total: number; count: number }> = {};
    metrics.forEach((item) => {
      if (item.totalTime !== undefined) {
        totalTimeCount++;
        this.totalTime = item.totalTime + (this.totalTime || 0);
      }
      if (item.renderTime !== undefined) {
        renderTimeCount++;
        this.renderTime = item.renderTime + (this.renderTime || 0);
      }
      if (item.renderCount !== undefined) {
        this.renderCount = item.renderCount;
      }
      if (item.memoryRange) {
        memoryRangeCount++;
        this.memoryRange = [
          item.memoryRange[0] + (this.memoryRange ? this.memoryRange[0] : 0),
          item.memoryRange[1] + (this.memoryRange ? this.memoryRange[1] : 0)
        ];
      }
      if (item.maxRenderTimePerFrame !== undefined) {
        maxRenderTimePerFrameCount++;
        this.maxRenderTimePerFrame = item.maxRenderTimePerFrame + (this.maxRenderTimePerFrame || 0);
      }
      if (item.worstFrameData) {
        worstFrameDataCount++;
        this.worstFrameData = {
          fps: item.worstFrameData.fps + (this.worstFrameData?.fps || 0),
          count: item.worstFrameData.count + (this.worstFrameData?.count || 0)
        };
      }
      if (item.averageFPS !== undefined) {
        averageFPSCount++;
        this.averageFPS = item.averageFPS + (this.averageFPS || 0);
      }
      if (item.jankFrameCount !== undefined) {
        jankFrameCountCount++;
        this.jankFrameCount = item.jankFrameCount + (this.jankFrameCount || 0);
      }
      if (item.totalFrameCount !== undefined) {
        totalFrameCountCount++;
        this.totalFrameCount = item.totalFrameCount + (this.totalFrameCount || 0);
      }
      /** 新增指标 */
      if (item.fst) {
        fstCount++;
        this.fstArray.push(item.fst);
      }
      if (item.parseTime) {
        parseTimeCount++;
        this.parseTimeArray.push(item.parseTime);
      }
      if (item.averageFPS) {
        this.fpsArray.push(item.averageFPS);
      }
      if (item.maxRenderTimePerFrame) {
        this.maxRenderTimePerFrameArray.push(item.maxRenderTimePerFrame);
      }

      if (item.custom) {
        for (const key in item.custom) {
          if (Object.prototype.hasOwnProperty.call(item.custom, key)) {
            if (!result[key]) {
              result[key] = { total: item.custom[key]!, count: 1 };
            } else {
              result[key]!.total += item.custom[key]!;
              result[key]!.count += 1;
            }
          }
        }
      }
    });

    const customMetrics: Dictionary<number> = {};
    for (const key in result) {
      customMetrics[key] = result[key]!.total / result[key]!.count;
    }

    // 1、计算单帧最大渲染时长时：去除最大最小值再取平均
    console.log('单帧最大渲染时长总和111：', this.maxRenderTimePerFrame, '计数', maxRenderTimePerFrameCount, this.maxRenderTimePerFrameArray);
    const tempMaxRenderTimePerFrameArray = [...this.maxRenderTimePerFrameArray].sort((a, b) => a - b);
    const minValue = tempMaxRenderTimePerFrameArray.shift();
    const maxValue = tempMaxRenderTimePerFrameArray.pop();
    this.maxRenderTimePerFrame = this.maxRenderTimePerFrame! - minValue! - maxValue!;
    maxRenderTimePerFrameCount -= 2;
    // console.log('metrics', metrics);
    // console.log('单帧最大渲染时长总和：', this.maxRenderTimePerFrame, '计数', maxRenderTimePerFrameCount, this.maxRenderTimePerFrameArray);
    const extraProperty = {
      // 组件上限测试
      maxComponentLimit: {
        limit: metrics.some((item) => item.limit),
        metrics
      },
      // 设置器显隐交互是否work
      setterVisibility: {
        hasWrong: metrics.some((item) => !item.isWork),
        metrics
      }
    };
    const res = {
      totalTime: totalTimeCount > 0 ? this._round(this.totalTime! / totalTimeCount) : undefined,
      renderTime: renderTimeCount > 0 ? this._round(this.renderTime! / renderTimeCount) : undefined,
      renderCount: this.renderCount,
      memoryRange:
        memoryRangeCount > 0
          ? [this._round(this.memoryRange![0] / memoryRangeCount), this._round(this.memoryRange![1] / memoryRangeCount)]
          : undefined,
      maxRenderTimePerFrame: maxRenderTimePerFrameCount > 0 ? this._round(this.maxRenderTimePerFrame! / maxRenderTimePerFrameCount) : undefined,
      worstFrameData:
        worstFrameDataCount > 0
          ? {
            fps: this._round(this.worstFrameData!.fps / worstFrameDataCount),
            count: this._round(this.worstFrameData!.count / worstFrameDataCount)
          }
          : undefined,
      averageFPS: averageFPSCount > 0 ? this._round(this.averageFPS! / averageFPSCount) : undefined,
      jankFrameCount: jankFrameCountCount > 0 ? this._round(this.jankFrameCount! / jankFrameCountCount) : undefined,
      totalFrameCount: totalFrameCountCount > 0 ? this._round(this.totalFrameCount! / totalFrameCountCount) : undefined,
      custom: customMetrics,
      /** 新增指标 */
      parseTime: parseTimeCount && this._round(this.parseTimeArray.reduce((v, pre) => +v + +pre, 0) / parseTimeCount),
      fst: this.fstArray?.length && this._calculateFst(this.fstArray),
      averageFst: fstCount && this._round(this.fstArray!.reduce((v, pre) => +v + +pre, 0) / fstCount),
      fstArray: this.fstArray,
      fpsArray: this.fpsArray,
      maxRenderTimePerFrameArray: this.maxRenderTimePerFrameArray,
      baseLine: metrics[0]?.baseLine
      // 测试过程中所有卡顿数据
      // jankFrameData
    };
    // 组件上限测试和设置器显隐测试补充额外数据
    if (metrics.some((item) => 'isWork' in item) || metrics.some((item) => 'limit' in item)) {
      return Object.assign(res, extraProperty);
    }
    return res;
  }

  private _round(num: number) {
    return Math.round(num * 100) / 100;
  }

  /** 2、计算首屏时间时：剔除异常数据，如sso耗时、网络波动、测试环境 */
  private _calculateFst(fstArr: number[]) {
    if (fstArr.length === 0) {
      throw new Error(`数据为空--${fstArr}`);
    }
    const data = fstArr.slice();
    const average = data.reduce((prev, cur) => prev + cur, 0) / data.length;
    const error = 500;
    const low = average - error;
    const high = average + error;
    const newData = data.filter((val) => val >= low && val <= high);
    const res = newData.reduce((prev, cur) => prev + cur, 0) / newData.length;
    return res;
  }
}

export type { IMetrics, IMetricsConfig, IMemoryMetrics, IFPSMetrics, IResponseMetrics, Dictionary };
