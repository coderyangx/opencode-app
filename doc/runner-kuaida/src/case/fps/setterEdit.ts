import { Page } from 'puppeteer';
import { averageMetrics } from '../../metrics/metrics';
import { MetricToolkit } from '../../metrics/metric-toolkit';
import { BaseCase } from '../../app/case-mgr';
import { ICaseParams } from '../type';
import { baseLineMapAdd, baseLineMapSetterEdit, selectNode, sleep } from '../util';

export default class SetterEditCase extends BaseCase {
  getKey() {
    return 'setterEdit';
  }

  protected async onExecute(page: Page, caseParams: ICaseParams, repeatStep: number): Promise<any> {
    const { metrics = ['fps', 'memory', 'load'], scene = 'editor', number, actionGroup = [] } = caseParams;

    await sleep(2000);

    const metricTool = new MetricToolkit(page, metrics);

    // 开始收集指标
    await metricTool.start();
    const start = performance.now();

    try {
      for (let i = 0; i < actionGroup.length; i++) {
        const action = actionGroup[i];
        const { type, validation = 'isOnly' } = action!;
        if (type === 'edit') {
          if (validation === 'isOnly') {
            // 编辑单多选控件名称
            await selectNode(page, 'select');
            // 选中属性
            const elSelector = '#setterField_label > .setter-body input';
            await page.waitForSelector(elSelector);
            await page.click(elSelector);
            await page.type(elSelector, '新增输入一段文本');
            const inputText = '测试输入一段文本';
            // TODO: 模拟真实的输入卡顿

            // for (let i = 0; i < inputText.length; i++) {
            //   const char = inputText[i];
            //   await page.evaluate(
            //     (selector, char) => {
            //       const input = document.querySelector(selector) as HTMLInputElement;
            //       if (input) {
            //         input.value += char;
            //         const event = new Event('input', { bubbles: true });
            //         input.dispatchEvent(event);
            //       }
            //     },
            //     elSelector,
            //     char
            //   );
            // }
          } else if (validation === 'option') {
            //  实现控件选项编辑用例
          } else if (validation === 'visibility') {
            // 实现控件可见性编辑用例
          } else {
            // 无校验属性测试
          }
        } else {
          await page.evaluate(() => {
            window.alert('用例配置有误，请检查');
          });
          throw new Error('用例配置有误，缺少操作类型');
        }
      }
    } catch (error) {
      console.log(error);
    }

    await metricTool.end();
    const res = await metricTool.getMetrics();
    res.baseLineFrame = baseLineMapSetterEdit[number];

    console.log('属性编辑测试结束，执行时间：', performance.now() - start);
    console.log('属性编辑测试结束，输出结果：', res);
    return res;
  }

  protected onProcessResult(result: any[]) {
    return averageMetrics(result);
  }
}
