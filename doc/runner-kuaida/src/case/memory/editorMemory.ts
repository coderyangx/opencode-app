import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { sleep, addNode, getNodeCount } from '../util';

/** 测试组件从0添加至500组件时的内存变化 */
export default class EditorMemoryChangeCase extends BaseCase {
  getKey() {
    return 'editorMemory';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory'] } = caseParams;

    await sleep(2000);

    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();
    const prev = performance.now();
    try {
      await addNode(page, 500);
      const _nodeCount = await getNodeCount(page);
      console.log('500组件添加完成, 此时节点数量: ', _nodeCount);
    } catch (e) {
      throw new Error('添加节点失败');
    } finally {
      console.log('添加500组件内存变化，此时节点数量', await getNodeCount(page));
    }
    console.log('添加500组件内存变化操作耗时', performance.now() - prev);
    await metricTool.end();
    const res = await metricTool.getMetrics();
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
