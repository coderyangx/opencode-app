import { Page } from 'puppeteer';

export abstract class BaseCase {
  private _result: any[] = [];

  init () {
    this._result = [];
  }

  async execute (page: Page, params: any = {}, repeatStep: number) {
    const ret = await this.onExecute(page, params, repeatStep);

    console.log(`第 ${repeatStep + 1} 次重复测试结果，`, ret);
    this._result.push(ret);
  }

  processResult (caseParams?: any, urlParams?: any) {
    return this.onProcessResult(this._result, caseParams, urlParams);
  }

  abstract getKey (): string;

  protected abstract onExecute (page: Page, params: any, repeatStep: number): Promise<any>;

  protected abstract onProcessResult (result: any[], caseParams?: any, urlParams?: any): any;
}

export class CaseManager {
  private _cases: Map<string, BaseCase> = new Map();

  private constructor () {}

  public static readonly ins = new CaseManager();

  registerCase (testCase: BaseCase) {
    this._cases.set(testCase.getKey(), testCase);
  }

  getCase (caseKey: string): BaseCase | undefined {
    return this._cases.get(caseKey);
  }

  /**
   * 当前注册的用例个数
   */
  get totalCase () {
    return this._cases.size;
  }
}
