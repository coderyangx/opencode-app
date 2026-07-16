import { ElementHandle, Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { sleep, getNodeCount, baseLineMapSelect } from '../util';

// 选中逻辑应该测试所有组件
export default class EditorSelectCase extends BaseCase {
  getKey() {
    return 'editorSelect';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'load', 'memory'], componentType, number, screenshot } = caseParams;

    await sleep(2000);
    const metricTool = new MetricToolkit(page, metrics);

    // const ComponentTypeMapping = {
    //   input: 'div[data-jimu-id^="input_"]', // 文本组件选中测试
    //   number: 'div[data-jimu-id^="number_"]', // 数字组件选中测试
    //   select: 'div[data-jimu-id^="select_"]', // 单选组件选中测试
    //   selectdd: 'div[data-jimu-id^="selectdd_"]', // 多选组件选中测试
    // };

    const nodes: Array<ElementHandle<Element>> = await page.$$(`div[data-jimu-id^="${componentType}_"]`);

    const len = nodes.length;

    // 开始收集指标
    await metricTool.start();

    const prev = performance.now();
    // 测试多次选中时的性能平均，将结果放大
    try {
      for (let i = 0; i < Math.min(len, 5); i++) {
        await nodes[i]!.click();
        // await sleep(1000); // 会增加 averageFPS 值
      }
    } catch (e) {
      throw new Error('选中节点失败');
    } finally {
      console.log('设计器组件选中操作', await getNodeCount(page));
    }

    console.log('设计器组件选中操作耗时', performance.now() - prev);
    await metricTool.end();
    const res = await metricTool.getMetrics();
    res.baseLineFrame = baseLineMapSelect[number];
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
