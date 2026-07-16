import { Page } from 'puppeteer';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import path from 'path';
import { fileURLToPath } from 'url';
import { averageMetrics } from '../../metrics/metrics';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { sleep, addNode, getNodeCount } from '../util';

export default class EditorLimitCase extends BaseCase {
  getKey() {
    return 'editorLimit';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory', 'load'], screenshot } = caseParams;

    const nodeCount1 = await getNodeCount(page);
    console.log('当前画布中节点数量：', nodeCount1);

    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();
    const start = performance.now();

    // 截图
    if (screenshot?.enabled) {
      await page.screenshot({
        path: screenshot.path,
        fullPage: screenshot.fullPage
      });
    }

    // 不断增加节点
    try {
      for (let i = 1; i <= 800; i++) {
        await addNode(page, 1);
        const nodeCount = await getNodeCount(page);
        console.log('正在添加------, 此时节点数量: ', nodeCount, i + 1);
        if (nodeCount !== i + 1) {
          // 截图
          const dirname = path.dirname(fileURLToPath(import.meta.url));
          const filePath = `../../app/result/R72/组件上限${nodeCount}.png`;
          const fullPath = path.join(dirname, filePath);
          console.log(dirname, filePath);
          await page.screenshot({
            path: fullPath,
            fullPage: true
          });

          await metricTool.end();
          const res = await metricTool.getMetrics();
          res.limit = nodeCount;
          console.log('组件上限测试结束，组件上限：', nodeCount, '耗时: ', performance.now() - start, 'ms', res);
          return res;
          // throw new Error('新增失败');
        }
      }
    } catch (e) {
      console.log('组件上限测试出错: ', e);
    } finally {
      console.log('新增操作，此时节点数量', await getNodeCount(page));
    }

    await metricTool.end();
    const res = await metricTool.getMetrics();
    console.log('组件上限测试结束，输出结果：', '耗时: ', performance.now() - start, 'ms', res);

    return res;
  }

  protected onProcessResult(result: any[], caseParams?: any, urlParams?: any) {
    return averageMetrics(result);
  }
}
