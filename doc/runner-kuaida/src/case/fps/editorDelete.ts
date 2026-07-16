import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { sleep, delNode, getNodeCount, baseLineMapAdd } from '../util';

export default class EditorDeleteCase extends BaseCase {
  getKey() {
    return 'editorDelete';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory'], componentType = 'select', number } = caseParams;

    await sleep(2000);
    const nodeCount = await getNodeCount(page);
    console.log('当前画布中节点数量：', nodeCount);
    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();

    try {
      await delNode(page, 1, componentType);
      const _nodeCount = await getNodeCount(page);
      if (_nodeCount !== nodeCount - 1) {
        console.log('删除节点失败');
      }
    } catch (e) {
      throw new Error('删除节点失败');
    } finally {
      console.log('删除操作，此时节点数量', await getNodeCount(page));
    }

    await metricTool.end();
    const res = await metricTool.getMetrics();
    res.baseLineFrame = baseLineMapAdd[number];
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
