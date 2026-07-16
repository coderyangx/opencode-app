import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { sleep, getNodeCount } from '../util';

export default class CardSelectCase extends BaseCase {
  getKey() {
    return 'cardSelect';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'load', 'memory'], screenshot } = caseParams;

    await sleep(2000);
    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();

    const prev = performance.now();
    // 测试多次选中按钮组时的性能平均，将结果放大
    try {
      const btnGroupNodes = await page.$$('.button-group-main');
      for (let i = 0; i < btnGroupNodes.length; i++) {
        await btnGroupNodes[i]!.click();
        // await sleep(1000); // 会增加 averageFPS 值
      }
    } catch (e) {
      throw new Error('选中组件失败');
    } finally {
      console.log('卡片按钮组选中操作', await getNodeCount(page));
    }

    console.log('卡片选中操作耗时', performance.now() - prev);
    await metricTool.end();
    const res = await metricTool.getMetrics();
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
