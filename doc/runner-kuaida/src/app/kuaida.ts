import Puppeteer, { Page, Viewport } from 'puppeteer';
import { IProject, ITask } from './type';
import { CaseManager } from './case-mgr';
// TODO: 注释获取任务接口
import { getNextTask, updateKdTaskResultError, updateKdTaskResultSuccess } from './service';
import { registerCases } from '../case';
import { sleep } from '../case/util';
import { checkLogin, checkLoginST } from './login/login';
import { Config } from './login/config';
import { performance } from 'perf_hooks';
import { mockLimitTask, mockFormEditorFstTask, mockFormRenderFstTask } from '../case/mock';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { stMis, stPass } = Config;

export class App {
  private _pendingTask = false;

  // TODO: 用于存储结果数据
  private page: Page;

  private constructor() {}

  public static readonly ins = new App();

  // 服务启动
  async start(pollTime: number = 2 * 60 * 1000) {
    /* 注册所有测试用例 */
    registerCases();

    await this._loop();
    // TODO: 2min执行一次
    // setInterval(this._loop, pollTime);
  }

  private _loop = async () => {
    console.log('执行 kuaida.ts');
    if (!this._pendingTask) {
      this._pendingTask = true;
      let task: ITask | undefined;

      try {
        // 获取任务
        // task = await getNextTask();
        // task = mockLimitTask;
        task = mockFormEditorFstTask(500, 10, 'form-ivdl2nihaakns3o207b0i');
        while (task !== undefined) {
          // 执行任务
          const startTime = performance.now();
          console.log('---------- 开始执行 ----------');
          const result = await this.executeTask(task);
          (result as any).taskTime = performance.now() - startTime;

          console.log(`loop：projectId:  ${task.projectId} taskId:  ${task.taskId}，执行成功`);
          console.log(result);
          console.log('---------- 执行结束 ----------');
          // TODO: 将结果输出json
          // await this.page.goto('http://localhost:8000/kuaida');
          // await this.page.evaluate((task, result) => {
          //   window.sessionStorage.setItem(`${task.projectId}_${task.taskId}`, JSON.stringify(result));
          //   window.localStorage.setItem(`${task.projectId}_${task.taskId}`, JSON.stringify(result));
          // }, task, result);
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const filePath = path.join(__dirname, `${task.projectId}_${task.taskId}.json`);
          fs.writeFileSync(filePath, JSON.stringify(result));

          // 更新处理结果
          // await updateTaskResultSuccess(task.projectId, task.taskId, result);
          await sleep(3000);
          // 获取下个可执行任务
          // TODO: 清空 undefined
          task = undefined;
          // task = await getNextTask();
        }
      } catch (error: any) {
        // TODO 发出告警
        console.log(`projectId:  ${task?.projectId} taskId:  ${task?.taskId}，执行失败`);
        const obj = { message: error?.message, name: error?.name, stack: JSON.stringify(error?.stack) };
        console.log(obj);
        if (task) {
          await updateKdTaskResultError(task.projectId, task.taskId, obj);
        }
      } finally {
        this._pendingTask = false;
      }
    }
  };

  async executeTask(task: ITask) {
    // 获取 task 的 json 配置，根据 key 获取对应实例，调用实例执行
    const { repeat, url, urlParams, caseKey, caseParams, taskConfig, copy } = task;

    console.log('获取任务 task-->', task, '重复测试次数', task.repeat);

    // 匹配对应测试用例
    const testCase = CaseManager.ins.getCase(caseKey);
    // console.log('当前注册的测试用例个数：', CaseManager.ins.totalCase);
    if (!testCase) {
      throw Error('没有对应的用例');
    }
    testCase.init();

    // 打开浏览器
    if (taskConfig?.viewport.devicePixelRatio !== undefined) {
      (taskConfig.viewport as any).deviceScaleFactor = taskConfig?.viewport.devicePixelRatio;
    }
    const browser = await this._createBrowser((taskConfig?.viewport || { width: 800, height: 800 }) as any);

    // 多次执行
    const realRepeat = !repeat || isNaN(repeat) || repeat <= 0 ? 1 : repeat;

    for (let i = 0; i < realRepeat; i++) {
      // 无痕模打开
      // const context = await browser.createIncognitoBrowserContext();
      // const page = await context.newPage();
      const page = await browser.newPage();
      // TODO: 保存 page
      this.page = page;
      // 处理登录
      if (!url.includes('localhost')) {
        if (url.includes('.st')) {
          await page.goto('https://km.it.st.sankuai.com/');
          await checkLoginST(page, stMis, stPass);
        } else {
          // await page.goto('https://1941-zvwqt-sl-km.it.test.sankuai.com/');
          // await checkLogin(page, 'zhangshufei02');
          //  TODO: 快搭测试
          await page.goto('https://km.it.test.sankuai.com/');
          await checkLogin(page, 'yangxu63');
        }
      }

      console.log(`\n重复执行用例${realRepeat}次，正在执行第${i + 1}次测试，url：`, url);

      const realUrl = await this._getRealUrl(url, urlParams, page, copy);

      // 打开测试地址
      await page.goto(realUrl);
      // if (i === 0) {
      await checkLogin(page, 'yangxu63', i);
      // }

      // 便于肉眼debug
      await sleep(1000);
      const startTime = performance.now();

      // TODO:等待页面加载完成，重复执行时本地环境有问题，测试环境待验证
      if (i === 0) {
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
      }
      // this.addMouseIndicator(page);

      const endTime = performance.now();
      const fst = endTime - startTime;
      console.log(`首屏渲染时间 (FST): ${fst} ms`);

      // 执行用例并保存该次结果
      await testCase.execute(page, caseParams, i);

      // 避免puppeteer获取鼠标是否成功的回调，由于页面关闭导致crash https://github.com/puppeteer/puppeteer/issues/2982
      // await sleep(1000);

      await page.close();
      await sleep(3000);

      // 关闭页面
      // if (!(taskConfig?.autoClose === false)) {
      //   await browser.close();
      //   await context.close();
      // }
    }

    // await browser.close();

    // 加工处理结果
    return testCase.processResult(caseParams, urlParams);
  }

  private async _createBrowser(viewport?: Viewport) {
    // 启动
    const realViewPort = viewport || { width: 1800, height: 800 };
    const ret = await Puppeteer.launch({
      defaultViewport: viewport,
      // devtools: true,
      headless: false, // 打开浏览器，测试数据更准确，且很诡异的比不打开性能更好 https://github.com/puppeteer/puppeteer/issues/1718
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox', `--window-size=${realViewPort.width},${realViewPort.height}`] // 去掉浏览器默认的沙箱安全机制，提高测试性能，window-size可以控制browser大小
    });
    return ret;
  }

  private _concatUrlParams(url: string, urlParams: any): string {
    if (!urlParams) {
      return url;
    }

    const str = Object.keys(urlParams)
      .map((o) => `${o}=${urlParams[o]}`)
      .join('&');
    if (url.includes('?')) {
      return `${url}&${str}`;
    }
    return `${url}?${str}`;
  }

  /**
   * 抽出学城链接前缀和pageId
   */
  private _getCitadelData(url: string): { source: string; pageId: string } {
    let source;
    let pageId;

    let testResult = new RegExp('(.*?)/xtable/([0-9]+)').exec(url);
    if (testResult && testResult[1] && testResult[2]) {
      source = testResult[1];
      pageId = testResult[2];
    }

    if (!source || !pageId) {
      testResult = new RegExp('(.*?)/collabpage/([0-9]+)').exec(url);
      if (testResult && testResult[1] && testResult[2]) {
        source = testResult[1];
        pageId = testResult[2];
      }
    }
    if (!source || !pageId) {
      throw Error('不合法的学城地址，不支持复制测试');
    }

    return { source, pageId };
  }

  private async _getRealUrl(url: string, urlParams: any, page: Page, copy?: boolean) {
    let ret;

    if (copy) {
      const citadelData = this._getCitadelData(url);
      const newPageId = await copyPage(page, citadelData.source, citadelData.pageId);
      if (newPageId) {
        const newUrl = url.replace(citadelData.pageId, `${newPageId}`);
        ret = this._concatUrlParams(newUrl, urlParams);
      } else {
        throw Error('复制新文档失败');
      }
    } else {
      ret = this._concatUrlParams(url, urlParams);
    }

    return ret;
  }

  /**
   * 跟踪鼠标指示器
   * @param page
   */
  private async addMouseIndicator(page: Page) {
    await page.evaluate(() => {
      const box = document.createElement('div');
      box.style.position = 'absolute';
      box.style.width = '10px';
      box.style.height = '10px';
      box.style.background = 'red';
      box.style.borderRadius = '50%';
      box.style.pointerEvents = 'none';
      document.body.appendChild(box);

      document.addEventListener('mousemove', (event) => {
        box.style.left = `${event.pageX - 5}px`;
        box.style.top = `${event.pageY - 5}px`;
      });

      document.addEventListener('click', (event) => {
        box.style.width = '20px';
        box.style.height = '20px';
        setTimeout(() => {
          box.style.width = '10px';
          box.style.height = '10px';
        }, 200);
      });
    });
  }
}

// interface ICopyXTableResponse {
//   status: number;
//   data: {
//     contentId: number;
//     xTableId?: number;
//   };
// }

export async function copyPage(page: any, source1: string, pageId1: string) {
  const newXTableId = await page.evaluate(
    (params: string[]) => {
      const url = `${params[0]}/api/xtable/copycontent`;
      const body = JSON.stringify({ contentId: `${params[1]}` });

      return fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body
      })
        .then((response) => response.json())
        .then((result) => {
          return result.data.contentId;
        });
    },
    [source1, pageId1]
  );

  return newXTableId;
}
