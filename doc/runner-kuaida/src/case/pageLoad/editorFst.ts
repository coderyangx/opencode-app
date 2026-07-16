import { Page } from 'puppeteer';
import { BaseCase } from '../../app/case-mgr';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { averageMetrics } from '../../metrics/metrics';
import { ICaseParams } from '../type';

export default class EditorFstCase extends BaseCase {
  getKey() {
    return 'editorFst';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['load', 'memory'] } = caseParams;
    await page.setCacheEnabled(false);
    const client = await page.target().createCDPSession();
    await client.send('Network.setCacheDisabled', {
      cacheDisabled: true
    });

    const metricTool = new MetricToolkit(page, metrics);
    await metricTool.start();

    // 请求拦截
    await page.setRequestInterception(true);
    // https://catfront.51ping.com/api/speed?v=1&sdk=1.10.1&webVersion=2024-07-23T11:54:22.688Z%20803bd3f7&project=com.sankuai.oa.kuaida.admin&pageurl=

    const fstPromise = new Promise((resolve) => {
      page.on('request', async (req) => {
        let fst;
        // fst = await page.evaluate(() => {
        //   fst = window.Owl?.fstInfo?.FST;
        //   resolve(fst);
        //   req.continue();
        // });
        // 需额外判断接口query参数
        if (req.url().includes('api/speed?') && req.url().includes('com.sankuai.oa.kuaida.admin')) {
          const { searchParams, search } = new URL(req.url());
          const speedArr = searchParams.get('speed')!.split('|');
          // console.log('拦截owl上报参数', search, speedArr);
          fst = +speedArr[speedArr.length - 2]!;
          // console.log('FormEditorFormEditor首屏 - fst --------------', speedArr, fst);
          resolve(fst);
          req.continue();
        } else {
          req.continue();
        }
      });
    });

    const timeoutPromise = new Promise((rs) => setTimeout(() => rs(0), 10000));

    try {
      // const fstPromise = await page.evaluate(async () => {
      //   return new Promise((rs, rj) => {
      //     const timeout = setTimeout(() => {
      //       clearInterval(timer);
      //       page.reload();
      //       rj(new Error('Timeout: FST value not found'));
      //     }, 5000); // 10秒超时
      //     const timer = setInterval(() => {
      //       const res = window?.Owl?.fstInfo?.FST;
      //       console.log(res);
      //       if (res > 0) {
      //         clearInterval(timer);
      //         clearInterval(timeout);
      //         rs(res);
      //       }
      //     }, 1000);
      //   });
      // });
      const fst = await Promise.race([fstPromise, timeoutPromise]);
      await metricTool.end();
      // console.log('formRenderfst - 开始获取metricTool', await metricTool.getMetrics(), 'fst', fst);
      const res = await metricTool.getMetrics();
      res.fst = fst;
      res.baseLine = 3000;
      // console.log('FormEditorFormEditor首屏 - 结果：', res, this.#fst);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
