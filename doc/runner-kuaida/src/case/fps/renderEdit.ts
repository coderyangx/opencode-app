import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { sleep } from '../util';

// const jankTime = 500; // ms

export default class RenderEditCase extends BaseCase {
  getKey() {
    return 'renderEdit';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory'], scene = 'render', actionGroup = [] } = caseParams;

    await sleep(2000);
    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();

    try {
      for (let i = 0; i < actionGroup.length; i++) {
        const action = actionGroup[i];
        const { type, validation = 'isOnly' } = action!;
        if (type === 'edit') {
          // 选中属性
          const elSelector = '.jimu-root .JmCard .jm-form-item .mtd-input input';
          await page.waitForSelector(elSelector);
          await page.click(elSelector);
          await page.type(elSelector, '测试输入一段文本');
        }
      }
    } catch (error) {
      console.log(error);
    }

    await metricTool.end();
    const res = await metricTool.getMetrics();
    console.log('属性编辑测试结束，输出结果：', res);
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
