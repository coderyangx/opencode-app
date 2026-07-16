import { Dictionary } from '../metrics';

export enum PerformanceMarkNames {
  XTableLoaded = 'xtable-loaded-time',
  XTableModelInit = 'xtable-model-init-time',
  ReactViewRender = 'react-view-render',
  ZRenderRefresh = 'zrender-refresh',
  ZRenderPaint = 'zrender-paint',

  XTableAppInit = 'xtable-app-init', // xtable app 开始加载时间
  XTableAppStart = 'xtable-app-start', // xtable app 开始 (start.js开始，开始时间点)
  XTableAppRender = 'xtable-app-render', // xtable app 开始render APP
  XTableAppPageParse = 'xtable-app-page-parse', // xtable page 开始解析
}

export class LoadMonitor {
  private _observing = false;
  private _observer?: PerformanceObserver;

  private _beginSuffix = '@begin';
  private _endSuffix = '@end';

  private _FP: number = 0;
  private _FCP: number = 0;
  private _LCP: number = 0;

  #fstStart: number = 0;
  #fstEnd: number = 0;

  private entryMap: Map<string, { begin?: PerformanceEntry; end?: PerformanceEntry }> = new Map();

  constructor () {
    this.init();
  }

  save (key: string, entry: PerformanceEntry, type: 'begin' | 'end') {
    if (!this.entryMap.has(key)) {
      this.entryMap.set(key, {});
    }

    const timeEntrys = this.entryMap.get(key)!;
    if (!timeEntrys[type]) {
      timeEntrys[type] = entry;
    }
  }

  init () {
    this._observer = new PerformanceObserver((list) => {
      if (this._observing) {
        const allEntries = list.getEntries();
        const markEntryList = allEntries.filter((entry) => entry.entryType !== 'mark' || entry.name.endsWith(this._beginSuffix) || entry.name.endsWith(this._endSuffix));
        markEntryList.length > 0 && console.log('allEntries---', markEntryList);

        markEntryList.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            this._LCP = entry.startTime;
          } else {
            switch (entry.name) {
              case `${PerformanceMarkNames.XTableLoaded}@begin`:
                this.save(PerformanceMarkNames.XTableLoaded, entry, 'begin');
                break;
              case `${PerformanceMarkNames.XTableLoaded}@end`:
                this.save(PerformanceMarkNames.XTableLoaded, entry, 'end');
                break;
              case `${PerformanceMarkNames.XTableModelInit}@begin`:
                this.save(PerformanceMarkNames.XTableModelInit, entry, 'begin');
                break;
              case `${PerformanceMarkNames.XTableModelInit}@end`:
                this.save(PerformanceMarkNames.XTableModelInit, entry, 'end');
                break;
              case `${PerformanceMarkNames.ReactViewRender}@begin`:
                this.save(PerformanceMarkNames.ReactViewRender, entry, 'begin');
                break;
              case `${PerformanceMarkNames.ReactViewRender}@end`:
                this.save(PerformanceMarkNames.ReactViewRender, entry, 'end');
                break;
              case `${PerformanceMarkNames.ZRenderRefresh}@begin`:
                this.save(PerformanceMarkNames.ZRenderRefresh, entry, 'begin');
                break;
              case `${PerformanceMarkNames.ZRenderRefresh}@end`:
                this.save(PerformanceMarkNames.ZRenderRefresh, entry, 'end');
                break;
              case `${PerformanceMarkNames.ZRenderPaint}@begin`:
                this.save(PerformanceMarkNames.ZRenderPaint, entry, 'begin');
                break;
              case `${PerformanceMarkNames.ZRenderPaint}@end`:
                this.save(PerformanceMarkNames.ZRenderPaint, entry, 'end');
                break;
              case `${PerformanceMarkNames.XTableAppInit}@begin`:
                this.save(PerformanceMarkNames.XTableAppInit, entry, 'begin');
                break;
              case `${PerformanceMarkNames.XTableAppInit}@end`:
                this.save(PerformanceMarkNames.XTableAppInit, entry, 'end');
                break;
              // 这几个指标只记录了begin
              case `${PerformanceMarkNames.XTableAppStart}@begin`:
                this.save(PerformanceMarkNames.XTableAppStart, entry, 'begin');
                break;
              case `${PerformanceMarkNames.XTableAppRender}@begin`:
                this.save(PerformanceMarkNames.XTableAppRender, entry, 'begin');
                break;
              case `${PerformanceMarkNames.XTableAppPageParse}@begin`:
                this.save(PerformanceMarkNames.XTableAppPageParse, entry, 'begin');
                break;
              default:
                break;
            }
          }
        });
      }
    });
  }

  start () {
    this._observing = true;
    this._observer?.observe({ entryTypes: ['largest-contentful-paint', 'mark'] });

    // 计算fst时间
    this.#fstStart = performance.now();
  }

  stop () {
    this._FP = window.performance.getEntriesByName('first-paint')[0]!.startTime;
    this._FCP = window.performance.getEntriesByName('first-contentful-paint')[0]!.startTime;

    this._observing = false;
    this._observer?.disconnect();

    this.#fstEnd = performance.now();
  }

  getDuration (key: string): number {
    const entry = this.entryMap.get(key);
    return (entry?.end?.startTime ?? 0) - (entry?.begin?.startTime ?? 0);
  }

  // FP、FCP、FMP、LCP
  getLoadMetrics (): Dictionary<any> {
    const fmp = (this.entryMap.get(PerformanceMarkNames.ZRenderRefresh)?.end?.startTime || 0) - this._FP;
    const dataLoad = this.getDuration(PerformanceMarkNames.XTableLoaded);
    return {
      custom: {
        // FP: this._FP,
        // FCP: this._FCP,
        // LCP: this._LCP,
        // Model_Complete: this._modelComplete,
        // Tree_Complete: this._zrenderTreeComplete,
        // Draw_Complete: this._canvasDrawComplete,
        '数据加载(ms)': dataLoad,
        '模型初始化(ms)': this.getDuration(PerformanceMarkNames.XTableModelInit),
        'ZRender渲染(ms)': this.getDuration(PerformanceMarkNames.ZRenderRefresh),
        'ZRender绘制(ms)': this.getDuration(PerformanceMarkNames.ZRenderPaint),
        '首屏耗时(ms)': fmp,
        '首屏排除数据加载(ms)': fmp - dataLoad,
        '微应用加载时间(ms)': this.getDuration(PerformanceMarkNames.XTableAppInit),
        '微应用startjs开始加载(ms)': (this.entryMap.get(PerformanceMarkNames.XTableAppStart)?.begin?.startTime || 0) - this._FP,
        '微应用App开始Render(ms)': (this.entryMap.get(PerformanceMarkNames.XTableAppRender)?.begin?.startTime || 0) - this._FP,
        '微应用XTable页面开始解析(ms)': (this.entryMap.get(PerformanceMarkNames.XTableAppPageParse)?.begin?.startTime || 0) - this._FP,
        kuaidaFST: this.#fstEnd - this.#fstStart,
      }
    };
  }
}
