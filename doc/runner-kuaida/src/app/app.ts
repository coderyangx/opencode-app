/* eslint-disable @typescript-eslint/indent */
import { ITask } from './type';
import { CaseManager } from './case-mgr';
import Puppeteer, { Page, Viewport } from 'puppeteer';
// TODO: 注释获取任务接口
import { getNextTask, updateKdTaskResultError, updateKdTaskResultSuccess } from './service';
import { registerCases } from '../case';
import { sleep, PredefinedNetworkConditions } from '../case/util';
import { checkLogin, checkLoginST } from './login/login';
import { performance } from 'perf_hooks';
import { TTaskType, TComponentKey } from '../case/type';
import {
  mockLimitTask,
  mockScrollTask,
  mockSelectTask,
  mockAddTask,
  mockDeleteTask,
  mockCopyTask,
  mockFormEditorFstTask,
  mockFormRenderFst,
  mockFormParseTime,
  mockMemoryTask,
  mockDragTask,
  mockSetterEditTask,
  mockRenderEditTask,
  mockRenderVisibility,
  mockSetterVisibility,
  mockHomeFst,
  mockSubmitFst,
  mockNewdetailFst,
  mockWorkbenchFst,
  mockSubmissionFst,
  mockDetailFst
} from '../case/mock';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class App {
  private pendingTask = false;

  // #page: Page = {} as any;

  private constructor() {}

  public static readonly ins = new App();

  // 服务启动
  async start(pollTime: number = 2 * 60 * 1000) {
    registerCases();

    await this.loop();
    // setInterval(this.loop, pollTime);
  }

  private loop = async () => {
    if (!this.pendingTask) {
      this.pendingTask = true;

      this.#getTaskAndExecute();
    }
  };

  async executeTask(task: ITask) {
    const { repeat, url, urlParams, caseKey, caseParams, taskConfig, copy } = task;

    // 找到用例
    const testCase = CaseManager.ins.getCase(caseKey);
    if (!testCase) {
      throw new Error('app.ts 没有对应用例');
    }
    testCase.init();

    // 打开浏览器
    if (taskConfig?.viewport.devicePixelRatio !== undefined) {
      taskConfig.viewport.deviceScaleFactor = taskConfig?.viewport.devicePixelRatio;
    }
    const browser = await this.#createBrowser(taskConfig?.viewport || { width: 800, height: 800 });

    // 多次执行
    const realRepeat = !repeat || isNaN(repeat) || repeat <= 0 ? 1 : repeat;

    for (let i = 0; i < realRepeat; i++) {
      // 无痕模式打开页面
      // const context = await browser.createIncognitoBrowserContext();
      // const page = await context.newPage();

      const page = await browser.newPage();

      await page.setCacheEnabled(false);
      const client = await page.target().createCDPSession();
      await client.send('Network.setCacheDisabled', {
        cacheDisabled: true
      });

      const realUrl = await this.#getRealUrl(url, urlParams);
      // 模拟网络
      // page.emulateNetworkConditions(PredefinedNetworkConditions.Fast4G);
      // 打开测试地址
      await page.goto(realUrl);
      await checkLogin(page, 'yangxu63', i);

      // 便于肉眼debug
      await sleep(1000);

      // 执行用例并保存结果
      await testCase.execute(page, caseParams, i);

      // 避免puppeteer获取鼠标是否成功的回调，由于页面关闭导致crash https://github.com/puppeteer/puppeteer/issues/2982
      await sleep(1000);

      // 关闭页面
      if (!(taskConfig?.autoClose === false)) {
        // await context.close();
        await page.close();
        await sleep(1000);
      }
    }

    await browser.close();

    // 加工处理结果
    return testCase.processResult(caseParams, urlParams);
  }

  async #createBrowser(viewport?: any) {
    // 启动
    const realViewPort = viewport || { width: 1800, height: 800 };
    const ret = await Puppeteer.launch({
      defaultViewport: viewport,
      // devtools: true,
      headless: true, // 打开浏览器，测试数据更准确，且很诡异的比不打开性能更好 https://github.com/puppeteer/puppeteer/issues/1718
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: [
        '--no-sandbox',
        '--disable-cache',
        '--disable-extensions', // 浏览器扩展
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        `--window-size=${realViewPort.width},${realViewPort.height}`
      ] // 去掉浏览器默认的沙箱安全机制，提高测试性能，window-size可以控制browser大小
    });
    return ret;
  }

  #getRealUrl(baseUrl: string, urlParams: Record<string, string>) {
    if (!urlParams || !Object.keys(urlParams).length) return baseUrl;

    const queryString = new URLSearchParams(urlParams).toString();
    const separator = baseUrl.includes('?') ? '&' : '?';

    return `${baseUrl}${separator}${queryString}`;
  }

  /* 获取所有任务依次执行 */
  async #getTaskAndExecute() {
    try {
      const tasks = this.#getTaskList();

      for (const task of tasks) {
        try {
          const startTime = performance.now();
          console.log(`---------- ${task.caseKey}-${task?.caseParams?.componentType || ''} 场景测试用例开始执行 ----------`);
          const result = await this.executeTask(task);
          result.taskTime = performance.now() - startTime;
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const resultDir = path.join(__dirname, '/result/R72/');
          if (!fs.existsSync(resultDir)) {
            fs.mkdirSync(resultDir);
          }
          const filePath = path.join(resultDir, `R72-${task.taskId}-${task?.caseParams?.componentType || ''}.json`);
          fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        } catch (error: any) {
          console.log(`projectId:  ${task.projectId} taskId:  ${task.taskId}，执行失败`, error);
          const obj = { message: error?.message, name: error?.name, stack: JSON.stringify(error?.stack) };
          console.log(obj);
        }
      }
    } finally {
      this.pendingTask = false;
    }
  }

  /** 获取本地测试 mock 数据 */
  #getMockTask = (type: TTaskType, componentNumber: number, componentType?: TComponentKey) => {
    const formCodeMap: any = {
      100: 'form-ly7oofay0jhax5v2yqviz',
      200: 'form-tdl7v2a3fmgqy25npxkk5',
      300: 'form-xmcnqgjgxo18z4otv9ifb',
      400: 'form-1fbmxdaq429tt1zg3juab',
      500: ['Limit', 'Memory'].includes(type) ? 'form-tyfruql6fpejl04g8z8yd' : 'form-ndcir1fabo5231z2p8fyt'
    };
    const formCode = formCodeMap[componentNumber] || '';
    const mockTaskMap = {
      Limit: mockLimitTask,
      Scroll: mockScrollTask, // 暂不测试
      Select: mockSelectTask,
      Add: mockAddTask,
      Delete: mockDeleteTask,
      Copy: mockCopyTask,
      Drag: mockDragTask,
      Memory: mockMemoryTask,
      SetterEdit: mockSetterEditTask,
      RenderEdit: mockRenderEditTask,
      EditorFst: mockFormEditorFstTask,
      RenderFst: mockFormRenderFst,
      FormParse: mockFormParseTime,
      RenderVisibility: mockRenderVisibility,
      SetterVisibility: mockSetterVisibility,
      // 审批中心fst
      HomeFst: mockHomeFst,
      SubmitFst: mockSubmitFst,
      NewdetailFst: mockNewdetailFst,
      // 快搭应用fst
      WorkbenchFst: mockWorkbenchFst,
      // SubmissionFst: mockSubmissionFst,
      DetailFst: mockDetailFst
    }[type];
    const params = {
      number: componentNumber,
      repeat: ['Limit', 'Memory'].includes(type) ? 1 : 30,
      formCode,
      componentType
    };
    return mockTaskMap(params);
  };

  /** 获取所有场景下的测试任务 */
  #getTaskList(): ITask[] {
    const tasks: ITask[] = [];
    // 21个组件类型：分为高优和低优组件
    const componentTypes: TComponentKey[] = [
      // 'input'
      // 'textarea',
      // 'money',
      // 'number',
      'select'
      // 'selectdd',
      // 'date',
      // 'daterange',
      // 'image',
      // 'file',
      // 'people',
      // 'multiplepeople',
      // 'chatgroup',
      // 'department',
      // 'associatedrecord',
      // 'associateddatasource',
      // 'associatedquery',
      // 'table',
      // 'captions',
      // 'card',
      // 'columnsgrid'
    ];
    // 所有测试任务，包含14个测试场，其中组件选中和组件添加 需要测试多种类型组件
    const taskTypes: TTaskType[] = [
      /** 设计器-组件添加上限测试 */
      // 'Limit', // 不区分组件类型 从0加到500组件
      // 'Add', // 只测试500组件场景
      // 'Copy', // 不区分组件类型
      // 'Select', // 只测试500组件场景
      // 'Delete', // 不区分组件类型
      // 'Drag', // 不区分组件类型
      // 'SetterEdit', // 不区分组件类型
      // 'EditorFst', // 不区分组件类型
      // 'RenderFst', // 不区分组件类型 即SubmissionFst
      // 'RenderEdit', // 不区分组件类型 只测试500组件场景
      // 'FormParse', // 不区分组件类型
      // 'RenderVisibility', // 不区分组件类型 只测试500组件场景 渲染器-组件显隐控制测试
      // 'SetterVisibility', // 不区分组件类型 只测试500组件场景 设计器-setter显隐联动测试
      // 'Memory', // 不区分组件类型 只测试500组件场景 设计器-添加500个组件内存测试
      'HomeFst', // 审批中心fst
      // 'SubmitFst',
      // 'NewdetailFst',
      // 'WorkbenchFst', // 快搭应用fst
      // 'DetailFst'
      // 'SubmissionFst'
    ];

    // 只测试500组件场景
    const task500: TTaskType[] = [
      'Limit',
      // 'Add',
      'Select',
      'RenderEdit',
      'SetterVisibility',
      'RenderVisibility',
      'Memory'
      // 'HomeFst',
      // 'SubmitFst',
      // 'NewdetailFst',
      // 'WorkbenchFst',
      // 'SubmissionFst',
      // 'DetailFst'
    ];

    // 不区分组件类型场景
    const singleComponentTypeTask: TTaskType[] = [
      'Limit',
      'Copy',
      'Delete',
      'RenderEdit',
      'RenderVisibility',
      'SetterVisibility',
      'SetterEdit',
      'Drag',
      'EditorFst',
      'RenderFst',
      'FormParse',
      'Memory',
      'HomeFst',
      'SubmitFst',
      'NewdetailFst',
      'WorkbenchFst',
      // 'SubmissionFst',
      'DetailFst'
    ];

    for (let i = 100; i <= 100; i += 100) {
      for (const taskType of taskTypes) {
        if (task500.includes(taskType) && i !== 500) {
          continue;
        } else if (singleComponentTypeTask.includes(taskType)) {
          // 添加不区分组件类型场景task
          tasks.push(this.#getMockTask(taskType, i));
        } else {
          for (const componentType of componentTypes) {
            // 添加区分组件类型场景task
            tasks.push(this.#getMockTask(taskType, i, componentType));
          }
        }
      }
    }
    return tasks;
  }
}
