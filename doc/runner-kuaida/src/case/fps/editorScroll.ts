import { ElementHandle, Page } from 'puppeteer';
import { BaseCase } from '../../app/case-mgr';
import { IFPSMetrics, IMemoryMetrics, averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { ICaseParams } from '../type';
import { sleep } from '../util';

interface IFormEditorScrollCaseResult extends IFPSMetrics, IMemoryMetrics {}

export default class FormEditorScrollCase extends BaseCase {
  getKey(): string {
    return 'editorScroll';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams): Promise<IFormEditorScrollCaseResult> {
    const { metrics = ['load', 'memory'] } = caseParams;

    await sleep(2000);
    const editorCoreDom: ElementHandle<Element> | null = await page.waitForSelector('.editor-core');
    if (!editorCoreDom) {
      throw Error('editor-core dom未准备好');
    }

    const bbox = (await editorCoreDom.boundingBox())!;
    // console.log('bbox:', bbox);
    await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);

    const deltaY = [2, 25, 65, 50, 250, 280, 75, 500, 200, 20];
    deltaY.push(...deltaY.map((o) => -o));
    const deltaX = [1, 5, 50, 130, 400, 150, 80, 100, 70, 8];
    deltaX.push(...deltaX.map((o) => -o));

    const scrollTime = 10e3; // 滚动10秒
    const wheelTime = 40; // 模拟触摸板滚动，自测大约是40ms一次
    const scale = Math.ceil(scrollTime / wheelTime / deltaX.length);

    const tmpDeltaX = deltaX.slice();
    const tmpDeltaY = deltaY.slice();
    for (let i = 0; i < scale; i++) {
      deltaX.push(...tmpDeltaX);
      deltaY.push(...tmpDeltaY);
    }

    const toolkit = new MetricToolkit(page, metrics);

    await toolkit.start(); // 开始收集性能指标

    await new Promise((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        page.mouse.wheel({ deltaX: deltaX[i], deltaY: deltaY[i] });
        i++;
        if (i >= deltaX.length) {
          clearInterval(timer);
          resolve('');
        }
      }, wheelTime);
    });

    await toolkit.end(); // 结束收集性能指标
    const res = await toolkit.getMetrics();
    return res;
  }

  protected onProcessResult(result: IFormEditorScrollCaseResult[]): IFormEditorScrollCaseResult {
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
