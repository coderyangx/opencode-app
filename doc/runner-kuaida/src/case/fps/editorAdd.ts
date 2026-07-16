import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams, convertTypeKeyToName } from '../type';
import { sleep, addNode, getNodeCount, baseLineMapAdd } from '../util';

export default class EditorAddCase extends BaseCase {
  getKey() {
    return 'editorAdd';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory'], componentType = 'select', number, screenshot } = caseParams;

    await sleep(2000);
    const nodeCount = await getNodeCount(page);
    console.log('当前画布中节点数量：', nodeCount);
    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();
    // if (screenshot?.enabled) {
    //   await page.screenshot({
    //     path: screenshot.path,
    //     fullPage: screenshot.fullPage
    //   });
    // }
    try {
      // 添加节点需要每个节点都测试
      for (let i = 1; i <= 5; i++) {
        const comName = convertTypeKeyToName(componentType);
        await addNode(page, 1, comName);
        const _nodeCount = await getNodeCount(page);
        if (_nodeCount !== nodeCount + 1) {
          console.log('添加节点失败');
        }
      }
    } catch (e) {
      throw new Error('添加节点失败');
    } finally {
      console.log('添加操作，此时节点数量', await getNodeCount(page));
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
