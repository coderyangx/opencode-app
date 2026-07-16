import { Page } from 'puppeteer';
import { BaseCase } from '../../app/case-mgr';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { averageMetrics } from '../../metrics/metrics';
import { ICaseParams } from '../type';

export default class RenderFstCase extends BaseCase {
  getKey() {
    return 'renderFst';
  }
  protected async onExecute(page: Page, caseParams: ICaseParams): Promise<any> {
    const { metrics = ['load', 'memory'] } = caseParams;
    // await page.setCacheEnabled(false);
    // const client = await page.target().createCDPSession();
    // await client.send('Network.setCacheDisabled', {
    //   cacheDisabled: true
    // });
    const getPerformanceMetrics = async (page: Page) => {
      const timing = await page.evaluate(() => {
        const { timing } = performance;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        return {
          // DOM 加载时间
          domComplete: timing.domComplete - timing.navigationStart,
          domInteractive: timing.domInteractive - timing.navigationStart,
          // 首屏相关
          FP: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-paint')?.startTime,
          FCP: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime,
          // 页面加载完成时间
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          // other
          DNS: timing.domainLookupEnd - timing.domainLookupStart,
          TCP: timing.connectEnd - timing.connectStart,
          TTFB: timing.responseStart - timing.requestStart,
          // 新版 Navigation Timing API
          DCL: navigation?.domContentLoadedEventEnd,
          pageLoad: navigation?.loadEventEnd
        };
      });

      return timing;
    };

    const metricTool = new MetricToolkit(page, metrics);
    await metricTool.start();

    // 请求拦截
    await page.setRequestInterception(true);
    // const fstPromise = new Promise((resolve) => {
    //   page.on('request', (req) => {
    //     let fst;
    //     if (req.url().includes('api/speed?') && req.url().includes('submission')) {
    //       const { searchParams } = new URL(req.url());
    //       const speedArr = searchParams.get('speed')!.split('|');
    //       fst = +speedArr[speedArr.length - 2]!;
    //       // console.log('FormRender首屏 - fst --------------', fst);
    //       resolve(fst);
    //     }
    //     req.continue();
    //   });
    // });

    const fstPromise = new Promise((resolve) => {
      const timer = setInterval(async () => {
        const fst = await page.evaluate(() => {
          return window?.Owl?.fstInfo?.FST;
        });
        if (fst > 0) {
          resolve(fst);
          clearInterval(timer);
        }
      }, 1000);
    });

    try {
      const fst = await fstPromise;
      // const start = performance.now();
      // const performanceMetrics = await getPerformanceMetrics(page);
      await metricTool.end();
      const res = await metricTool.getMetrics();
      res.fst = fst;
      res.baseLine = 3000;
      // console.log('sssss', res);
      // res.performanceMetrics = performanceMetrics;
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
