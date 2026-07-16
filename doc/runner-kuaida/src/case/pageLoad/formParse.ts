import { Page } from 'puppeteer';
import { BaseCase } from '../../app/case-mgr';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { averageMetrics } from '../../metrics/metrics';
import { ICaseParams } from '../type';
import { baseLineMapAdd, baseLineMapRenderParse } from '../util';

export default class FormParseCase extends BaseCase {
  getKey() {
    return 'formParse';
  }
  protected async onExecute(page: Page, caseParams: ICaseParams): Promise<any> {
    const { metrics = ['load', 'memory'], number } = caseParams;
    await page.setCacheEnabled(false);
    const client = await page.target().createCDPSession();
    await client.send('Network.setCacheDisabled', {
      cacheDisabled: true
    });

    const metricTool = new MetricToolkit(page, metrics);
    await metricTool.start();

    // 请求拦截
    await page.setRequestInterception(true);

    const parseTimePromise = new Promise((resolve) => {
      let parseTime: number | undefined;
      let fst: number | undefined;
      // const fstTimer = setInterval(async () => {
      //   fst = await page.evaluate(() => {
      //     console.log('等待首屏时间', window?.Owl?.fstInfo?.FST);
      //     return window?.Owl?.fstInfo?.FST;
      //   });
      // }, 1000);

      page.on('request', (req) => {
        if (req.url().includes('/api/metric?') && req.url().includes('com.sankuai.oa.kuaida')) {
          const decodeData = decodeURIComponent(req.postData() as string);
          const jsonData = JSON.parse(decodeData.split('=')[1]!);
          // parseTime = jsonData.kvs['form-parse-time']?.[0];
          console.log('请求拦截/n', jsonData.kvs, '解析时间', jsonData.kvs?.['form-parse-time']?.[0]);
          parseTime = jsonData.kvs?.['form-parse-time']?.[0];
        }

        req.continue();

        if (parseTime !== undefined) {
          // if (parseTime !== undefined && fst !== undefined) {
          // clearInterval(fstTimer);
          resolve({ parseTime, fst });
        }
      });
    });

    const { fst, parseTime } = await parseTimePromise;
    console.log('解析时间', parseTime, '首屏时间', fst);

    await metricTool.end();
    const res = await metricTool.getMetrics();
    res.fst = fst;
    res.parseTime = parseTime;
    res.baseLine = baseLineMapRenderParse[number];
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
