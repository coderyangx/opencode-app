import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { convertTypeKeyToName, ICaseParams } from '../type';
import { sleep, copyNode, getNodeCount, baseLineMapAdd } from '../util';

export default class EditorCopyCase extends BaseCase {
  getKey() {
    return 'editorCopy';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory', 'load'], componentType = 'select', number, scene = 'editor' } = caseParams;
    // 组件计数
    // jm-ec-viewport-container > host-view-container > host-view > jimu-root > jm-form-item
    // const viewport = await page.$('.host-view');
    // const curNodeCount = await getNodeCount(page);

    await sleep(2000);
    const nodeCount = await getNodeCount(page);
    console.log('当前画布中节点数量：', nodeCount);
    const metricTool = new MetricToolkit(page, metrics);

    const nodes = await page.$$('div[data-jimu-id^="select_"]'); // 单选组件选中测试
    // const nodes = await page.$$('div[data-jimu-id^="selectdd_"]'); // 多选组件选中测试
    const len = nodes.length;

    // 开始收集指标
    await metricTool.start();

    // try {
    //   for (let i = 0; i < actionGroup.length; i++) {
    //     const action = actionGroup[i];
    //     const { type, number = 1 } = action!;
    //     if (type === 'copy') {
    //       for (let j = 0; j < number; j++) {
    //         await copyNode(page);
    //         // 截图
    //         if (screenshot?.enabled) {
    //           await page.screenshot({
    //             path: screenshot.path,
    //             fullPage: screenshot.fullPage
    //           });
    //         }
    //         await sleep(jankTime);
    //         const nodeCount = await getNodeCount(page);
    //         if (nodeCount !== nodeCount + 1) {
    //           throw new Error('复制组件测试失败');
    //         }
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   console.log('复制操作，此时节点数量', await getNodeCount(page));
    // }

    // 复制组件场景执行逻辑
    try {
      for (let i = 0; i < 5; i++) {
        // const comName = convertTypeKeyToName(componentType);
        await copyNode(page, componentType);
        // await sleep(200);
        const _nodeCount = await getNodeCount(page);
        console.log('复制成功，当前节点数量：', _nodeCount);
      }
    } catch (e) {
      throw new Error('复制组件场景异常');
    } finally {
      console.log('复制操作，此时节点数量', await getNodeCount(page));
    }

    await metricTool.end();
    const res = await metricTool.getMetrics();
    res.baseLineFrame = baseLineMapAdd[number];
    console.log('组件复制测试结束，输出结果：', res);

    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
