import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { sleep } from '../util';

/** 测试组件从0添加至500组件时的内存变化 */
export default class RenderVisibilityCase extends BaseCase {
  getKey() {
    return 'renderVisibility';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory'] } = caseParams;

    await sleep(2000);

    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();
    const prev = performance.now();
    try {
      // 500组件显隐测试
      // const numberEle = await page.$('input[placeholder="输入数字"]');
      await page.type('input[placeholder="输入数字"]', '1');
      // 输入完之后失焦触发
      await page.keyboard.press('Tab');
    } catch (e) {
      throw new Error('显隐条件测试失败');
    }
    console.log('显隐条件测试操作耗时', performance.now() - prev);
    await metricTool.end();
    const res = await metricTool.getMetrics();
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
