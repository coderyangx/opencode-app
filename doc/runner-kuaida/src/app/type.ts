export interface IProject {
  projectId: string; // 测试项目id
  reportKey: string; // 报告
  taskConfig?: ITaskConfig; // 每个测试任务的配置
  tasks: ITask[]; // 测试任务
}

export interface IViewport {
  width?: number;
  height?: number;
  devicePixelRatio?: number;
}

export interface ITask {
  projectId: string;
  taskId: string; // 任务id
  caseKey: string; // 用例
  caseParams?: { [key: string]: any }; // 用例执行需要的参数
  url: string; // 浏览器访问地址
  urlParams?: { [key: string]: any }; // 浏览器访问地址参数，会帮忙拼接
  reportParams?: { [key: string]: any }; // 导出报告使用的参数
  repeat?: number; // 该任务重复测试次数
  taskConfig?: ITaskConfig;
  copy?: boolean; // 是否要复制一份
}

export interface ITaskConfig {
  viewport: IViewport;
  autoClose?: boolean;
  isIncognito?: boolean;
}
