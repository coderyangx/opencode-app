import { IResponseMetrics } from '../type';

export enum PerformanceMarkNames {
  ZRenderRefresh = 'zrender-refresh',
  ZRenderPaint = 'zrender-paint',
}

export interface ResponseConfig {
  observeLongtask?: boolean;
  beginMark: string;
  endMark: string;
}

interface IResult {
  entryType: string;
  name: string;
  startTime: number;
  duration: number;
}

export class MarkMonitor {
  private _observing = false;
  private _result: IResult[] = [];
  private _observer?: PerformanceObserver;
  private _config!: ResponseConfig;

  private _beginSuffix = '@begin';
  private _endSuffix = '@end';

  constructor() {
    this.init();
  }

  init() {
    this._observer = new PerformanceObserver((list) => {
      if (this._observing) {
        const allEntries = list.getEntries();
        const markEntryList = allEntries.filter(
          (entry) => entry.entryType === 'longtask'
            || entry.name.endsWith(this._beginSuffix)
            || entry.name.endsWith(this._endSuffix)
        );

        markEntryList.forEach((entry) => {
          this._result.push({
            entryType: entry.entryType,
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
          });
        });
      }
    });
  }

  start(config: ResponseConfig) {
    this._config = config;
    this._result = [];
    this._observing = true;
    this._observer?.takeRecords();
    this._observer?.observe({ entryTypes: config?.observeLongtask ? ['longtask', 'mark'] : ['mark'], });
  }

  stop() {
    this._observing = false;
    this._observer?.disconnect();
  }

  getTime(beginMark: string, endMark: string): number {
    const beginName = this._getBeginName(beginMark);
    const endName = this._getEndName(endMark);
    const beginEntry = this._result.filter((o) => o.name === beginName)[0];
    const endEntry = this._result.filter((o) => o.name === endName)[0];

    let time = 0;
    if (beginEntry && endEntry) {
      time = endEntry.startTime - beginEntry.startTime;
    }
    return time;
  }

  getResponseMetrics(): IResponseMetrics | undefined {
    if (!this._result.length) {
      return undefined;
    }

    console.log('response---', this._result);

    const paintTime = this.getTime(
      PerformanceMarkNames.ZRenderPaint,
      PerformanceMarkNames.ZRenderPaint
    );
    const renderTime = this.getTime(
      PerformanceMarkNames.ZRenderRefresh,
      PerformanceMarkNames.ZRenderRefresh
    );
    const responseTime = this.getTime(
      this._config.endMark,
      this._config.beginMark
    );
    return {
      custom: {
        响应总耗时: responseTime,
        响应渲染耗时: renderTime,
        响应绘制耗时: paintTime,
      },
    };
  }

  private _getBeginName(name: string) {
    return `${name}${this._beginSuffix}`;
  }

  private _getEndName(name: string) {
    return `${name}${this._endSuffix}`;
  }

  //   getResult (startMarkName: string, stopMarkName: string) {
  //     const validResult = [];

  //     let searchedStartMark = false;
  //     let startEntry = null;
  //     let lastLongtask = null;
  //     for (let index = 0; index < this._result.length; index++) {
  //       const entry = this._result[index]!;
  //       if (entry.entryType === 'longtask') {
  //         lastLongtask = {
  //           ...entry,
  //           children: []
  //         };
  //         validResult.push(lastLongtask);
  //       } else if (!searchedStartMark) {
  //         // 查找开始mark
  //         if (entry.name.endsWith('@begin') && entry.name.replace('@begin', '') === startMarkName) {
  //           searchedStartMark = true;
  //           startEntry = {
  //             ...entry,
  //             name: entry.name.replace('@begin', '')
  //           };
  //           validResult.push(startEntry);
  //         }
  //       } else if (!startEntry) {
  //         if (entry.name.endsWith('@begin')) {
  //           startEntry = entry;
  //           validResult.push(startEntry);
  //         }
  //       } else if (entry.name.endsWith('@end') && entry.name.replace('@end', '') === startEntry.name) {
  //         startEntry.duration = parseFloat((entry.startTime - startEntry.startTime).toFixed(2));
  //         if (startEntry.name === stopMarkName) break;
  //         startEntry = null;
  //       }
  //     }
  //     return validResult;
  //   }
}
