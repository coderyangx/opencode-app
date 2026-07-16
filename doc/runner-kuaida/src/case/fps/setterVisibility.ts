import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { selectNode } from '../util';

/** 属性设置器间的显隐联动 */
export default class SetterVisibilityCase extends BaseCase {
  getKey() {
    return 'setterVisibility';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory', 'load'], scene = 'editor', actionGroup = [] } = caseParams;

    const metricTool = new MetricToolkit(page, metrics);

    await metricTool.start();
    const start = performance.now();

    let isWork = false;
    try {
      // 选中日期区间组件
      await selectNode(page, 'daterange');
      const elSelector = '.setter-body .mtd-switch input[type="checkbox"]';
      await page.waitForSelector(elSelector);
      await page.click(elSelector);
      // 查看是否出现 标题3 setter
      const setterSelector = '.setter-body .mtd-input input[value="时长"]';
      const setterEl = await page.$(setterSelector);
      if (setterEl) {
        isWork = true;
      }
    } catch (error) {
      console.log(error);
    }

    await metricTool.end();
    const res = await metricTool.getMetrics();
    res.isWork = isWork;
    console.log('属性编辑显隐联动测试结束，执行时间：', performance.now() - start, '输出结果：', res);
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
