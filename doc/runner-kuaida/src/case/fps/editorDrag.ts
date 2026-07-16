import { ElementHandle, Page } from 'puppeteer';
import { BaseCase } from '../../app/case-mgr';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { averageMetrics } from '../../metrics/metrics';
import { IMemoryMetrics, IFPSMetrics } from '../../metrics/type';
import { baseLineMapAdd, sleep } from '../util';
import { ICaseParams } from '../type';

interface IProps extends IFPSMetrics, IMemoryMetrics {}

/* 画布中节点个数 */
// const nodeCount = 100;

export default class EditorDragCase extends BaseCase {
  getKey(): string {
    return 'editorDrag';
  }

  async onExecute(page: Page, caseParams: ICaseParams): Promise<IProps> {
    const { metrics = ['fps', 'memory', 'load'], number } = caseParams;

    await sleep(2000);
    const nodes = await page.$$('.jm-form-item');
    if (!nodes || !nodes.length) {
      throw new Error('画布中没有节点，无法选中');
    }
    // const index = Math.floor(Math.random() * nodes.length);
    const nodeToDrag = nodes[0];
    await page.evaluate((nodeToDrag) => {
      // const node = document.querySelector('.jm-form-item');
      console.log(nodeToDrag);
    }, nodeToDrag);

    console.log('nodeToDrag:', nodeToDrag);

    const bbox = await nodeToDrag!.boundingBox();
    // console.log('bbox:', bbox);

    const deltaX = 200; // 拖动x轴距离
    const deltaY = 800; // 拖动y轴距离
    await nodeToDrag!.click();
    // await sleep(1000);
    await page.mouse.down();

    const toolkit = new MetricToolkit(page, metrics);
    // 开始收集性能指标
    await toolkit.start();

    const steps = 100; // 拖动步数 100
    // const duration = 5000; // 拖动时间
    // const stepDuration = duration / steps;

    for (let i = 0; i < steps; i++) {
      await page.mouse.move(bbox!.x + bbox!.width / 10 + (deltaX / steps) * i, bbox!.y + bbox!.height / 5 + (deltaY / steps) * i, { steps: 1 });
      // await sleep(16);
    }

    // await page.mouse.move(bbox!.x + bbox!.width / 2 + deltaX, bbox!.y + bbox!.height / 2 + deltaY, { steps: 10 });
    await page.mouse.up();

    await toolkit.end();
    const res = await toolkit.getMetrics();
    res.baseLineFrame = baseLineMapAdd[number];
    return res;

    // try {
    //   const saveBtn = await page.$('#page-edit-header-save');
    //   await saveBtn!.click();
    //   // 等待保存成功
    //   await page.waitForSelector('.mtd-notification-title', { visible: true });
    //   const mtdTitleContent = await page.evaluate(() => {
    //     const mtdTitle = document.querySelector('.mtd-notification-title');
    //     return mtdTitle?.textContent;
    //   });
    //   console.log('mtdTitle:', mtdTitleContent);
    //   if (mtdTitleContent === '保存成功') {
    //     console.log(`保存表单配置，一共滚动了${deltaX.length}次，每次滚动的距离：${deltaX[0]}, ${deltaY[0]}，滚动时间：${scrollTime}ms`);
    //   }
    // } catch (e) {
    //   console.error('保存失败：', e);
    // }
  }

  /**
   * 处理结果
   * @param result
   * @returns
   */
  onProcessResult(result: IProps[]): IProps {
    let maxIndex: number | undefined;
    let minIndex: number | undefined;

    // 去掉最好最坏情况
    if (result.length >= 3) {
      // 根据 averageFPS * 0.6 + totalFrameCount * 0.4 来获得评分
      const scores = result.map((o) => {
        if (!o.averageFPS || !o.totalFrameCount) {
          return 0;
        }
        return o.averageFPS * 0.6 + o.totalFrameCount * 0.4;
      });

      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);

      maxIndex = scores.findIndex((o) => o === maxScore);
      minIndex = scores.findIndex((o) => o === minScore);
    }

    const list = result.filter((_o, i) => i !== maxIndex && i !== minIndex);
    const ret = averageMetrics(list);
    return ret;
  }
}
