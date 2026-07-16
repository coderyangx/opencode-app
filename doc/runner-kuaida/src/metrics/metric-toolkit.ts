import { Page } from 'puppeteer';
import { FPSMonitor } from './fps/fps-monitor';
import { MarkMonitor, ResponseConfig } from './response/mark-monitor';
import { LoadMonitor } from './load/load-monitor';
import { IMetrics, MetricsConfig } from './type';
import { IMemoryInfo, getMemoryInfo } from './memory/memory';
import merge from 'lodash.merge';

export interface StartMonitors {
  response?: boolean;
  fps?: boolean;
  memory?: boolean;
  load?: boolean;
}

export interface MetricsParams {
  response?: ResponseConfig;
}

type TMetric = 'fps' | 'memory' | 'response' | 'load' | MetricsConfig;

/**
 * 性能指标管理类：决定收集哪些维度的指标，并得到对应指标结果
 */
export class MetricToolkit {
  private _configs: Set<MetricsConfig> = new Set();

  private _needs = { memory: false, fps: false, response: false, load: false };
  private _started = {
    memory: false,
    fps: false,
    response: false,
    load: false
  };
  private _memoryChange: [IMemoryInfo, IMemoryInfo] = [
    { total: 0, used: 0 },
    { total: 0, used: 0 }
  ];

  constructor(private page: Page, configs?: TMetric[]) {
    configs && this.addConfig(configs);
  }

  addConfig(configs: TMetric[]) {
    configs.forEach((config) => {
      if (config === 'fps') {
        this._configs.add(MetricsConfig.averageFPS);
        this._configs.add(MetricsConfig.jankFrameCount);
        this._configs.add(MetricsConfig.maxRenderTimePerFrame);
        this._configs.add(MetricsConfig.worstFrameData);
        this._configs.add(MetricsConfig.totalFrameCount);
      } else if (config === 'memory') {
        this._configs.add(MetricsConfig.memoryRange);
      } else if (config === 'response') {
        this._configs.add(MetricsConfig.totalTime);
        this._configs.add(MetricsConfig.renderTime);
      } else if (config === 'load') {
        this._configs.add(MetricsConfig.load);
      } else {
        this._configs.add(config);
      }
    });
  }

  async start(monitors?: StartMonitors, params?: MetricsParams) {
    if (monitors) {
      // 指定了启动项
      if (monitors.memory !== undefined) {
        this._needs.memory = monitors?.memory;
      }
      if (monitors.fps !== undefined) {
        this._needs.fps = monitors?.fps;
      }
      if (monitors.response !== undefined) {
        this._needs.response = monitors?.response;
      }
      if (monitors.load !== undefined) {
        this._needs.load = monitors?.load;
      }
    } else {
      // 未指定启动项
      this._needs.memory = this._needMemory();
      this._needs.fps = this._needFPS();
      this._needs.response = this._needResponse();
      this._needs.load = this._needLoad();
    }

    if (this._needs.memory && !this._started.memory) {
      console.log('start-memory');
      this._memoryChange[0] = await getMemoryInfo(this.page);
      this._started.memory = true;
    }

    if (this._needs.response && !this._started.response) {
      console.log('start-response');
      await this.page.evaluate(
        (classStr: string, responseConfig: any) => {
          const TmpClass = eval(`(${classStr})`);
          (window as any).tmpMarkMonitor = new TmpClass();
          ((window as any).tmpMarkMonitor as MarkMonitor).start(responseConfig);
          // eslint-disable-next-line
        },
        MarkMonitor.toString(),
        params?.response
      );
      this._started.response = true;
    }

    if (this._needs.fps && !this._started.fps) {
      console.log('start-fps');
      // console.log('start-fps-1', FPSMonitor, FPSMonitor.toString());
      await this.page.evaluate((classStr: string) => {
        const TmpClass = eval(`(${classStr})`);
        (window as any).tmpFPSMonitor = new TmpClass();
        ((window as any).tmpFPSMonitor as FPSMonitor).start();
      }, FPSMonitor.toString());
      this._started.fps = true;
    }

    if (this._needs.load && !this._started.load) {
      console.log('start-load');
      await this.page.evaluate((classStr: string) => {
        const TmpClass = eval(`(${classStr})`);
        (window as any).tmpLoadMonitor = new TmpClass();
        ((window as any).tmpLoadMonitor as LoadMonitor).start();
      }, LoadMonitor.toString());
      this._started.load = true;
    }
  }

  async end(monitors?: StartMonitors) {
    if (monitors ? monitors.fps : this._needs.fps) {
      console.log('end--fps===========================');
      await this.page.evaluate(() => {
        const monitor = (window as any).tmpFPSMonitor as FPSMonitor;
        monitor.stop();
      });
    }

    if (monitors ? monitors.response : this._needs.response) {
      console.log('end--response===========================');
      await this.page.evaluate(() => {
        const monitor = (window as any).tmpMarkMonitor as MarkMonitor;
        monitor.stop();
      });
    }

    if (monitors ? monitors.memory : this._needs.memory) {
      console.log('end--memory===========================');
      this._memoryChange[1] = await getMemoryInfo(this.page);
    }

    if (monitors ? monitors.load : this._needs.load) {
      console.log('end--load===========================');
      await this.page.evaluate(() => {
        const monitor = (window as any).tmpLoadMonitor as LoadMonitor;
        monitor.stop();
      });
    }
  }

  async getMetrics(): Promise<IMetrics> {
    let ret: IMetrics = {};

    if (this._needs.fps) {
      const fpsMetrics = await this.page.evaluate(() => {
        const monitor = (window as any).tmpFPSMonitor as FPSMonitor;
        return monitor.getFPSMetrics();
      });
      merge(ret, fpsMetrics);
    }

    if (this._needs.response) {
      const responseMetrics = await this.page.evaluate(() => {
        const monitor = (window as any).tmpMarkMonitor as MarkMonitor;
        return monitor.getResponseMetrics();
      });
      if (responseMetrics) {
        merge(ret, responseMetrics);
      }
    }

    if (this._needs.memory) {
      ret = merge(ret, { memoryRange: [this._memoryChange[0].used, this._memoryChange[1].used] });
    }

    // if (this._needs.load) {
    //   const loadMetrics = await this.page.evaluate(() => {
    //     const monitor = (window as any).tmpLoadMonitor as LoadMonitor;
    //     return monitor.getLoadMetrics();
    //   });
    //   ret = merge(ret, loadMetrics);
    // }

    // console.log('getMetricsResult---', ret);
    return ret;
  }

  private _needMemory(): boolean {
    return this._configs.has(MetricsConfig.memoryRange);
  }

  private _needFPS(): boolean {
    return (
      this._configs.has(MetricsConfig.averageFPS)
      || this._configs.has(MetricsConfig.jankFrameCount)
      || this._configs.has(MetricsConfig.maxRenderTimePerFrame)
      || this._configs.has(MetricsConfig.totalFrameCount)
      || this._configs.has(MetricsConfig.worstFrameData)
    );
  }

  private _needResponse(): boolean {
    return this._configs.has(MetricsConfig.totalTime) || this._configs.has(MetricsConfig.renderTime);
  }

  private _needLoad(): boolean {
    return this._configs.has(MetricsConfig.load);
  }
}
