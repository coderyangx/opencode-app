import { ITask } from '../app/type';
import { TComponentKey } from './type';

interface IParams {
  number: number;
  repeat: number;
  formCode: string;
  componentType: TComponentKey;
}

const taskConfig = {
  viewport: {
    width: 2048,
    height: 1280,
    devicePixelRatio: 2
  }
};

/** 100组件，5个子表单 */
// const urlTable = 'https://kuaida.it.test.sankuai.com/admin/app-ixv8dxylubvngm93npi43/design/pageDesign?formCode=form-5crjkageur92iis1e3wwt';

// 21227-prbty-sl- 1941-wtrca
const url = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/admin/app-ixv8dxylubvngm93npi43/design/pageDesign?formCode=form-ly7oofay0jhax5v2yqviz';
// const url = 'https://kuaida.it.test.sankuai.com/admin/app-ixv8dxylubvngm93npi43/design/pageDesign?formCode=form-ly7oofay0jhax5v2yqviz';
// const url = 'https://1941-wtrca-sl-kuaida.it.test.sankuai.com/admin/app-ixv8dxylubvngm93npi43/design/pageDesign?formCode=form-ly7oofay0jhax5v2yqviz';
// 500组件表单
const url500 = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/admin/app-26rsy2mo9tztk73ywjzlx/design/pageDesign?formCode=form-ndcir1fabo5231z2p8fyt';
// const url500 = 'https://kuaida.it.test.sankuai.com/admin/app-ixv8dxylubvngm93npi43/design/pageDesign?formCode=form-ivdl2nihaakns3o207b0i';
// const url500 = 'https://kuaida.it.test.sankuai.com/admin/app-26rsy2mo9tztk73ywjzlx/design/pageDesign?formCode=form-ndcir1fabo5231z2p8fyt'
const editorUrl = (num: number, formCode: string) => {
  if (num === 500) {
    return url500.replace(/(formCode=)[^&]+/, `$1${formCode}`);
  }
  return url.replace(/(formCode=)[^&]+/, `$1${formCode}`);
};

/** 组件上限测试case 约500组件之后出现问题 */
export const mockLimitTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-tyfruql6fpejl04g8z8yd', componentType } = params;
  const limitUrl = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/admin/app-j8nu8frur0zhrpo8mxjvk/design/pageDesign?formCode=form-60inl9spatis92g0ot3l0';
  return {
    projectId: '快搭线下性能测试',
    // reportKey: 'kuaida-formEditor-performance', // 最终使用的报告模板
    taskConfig,
    taskId: `limit-${number}`, // 上限测试 100组件
    caseKey: 'editorLimit',
    // 传入用例执行函数 onExecute(page, caseParams)
    caseParams: { number, componentType }, // 100组件测试
    url: limitUrl,
    // 导出报告时，通过该字段实现自定义逻辑， groupItems 为key，相同的 groupItems 报告展示在一个表格中，column代表这次测试结果
    //         表头：流畅维度-组件上限
    //            指标          内存变化         单针最大渲染时长
    //  column：  100组件测试
    //  column：  200组件测试
    reportParams: {
      column: `${number}组件测试`,
      groupItems: ['流畅维度', '组件上限']
    },
    repeat: 1
  };
};

/** 组件选中 */
export const mockSelectTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `select-${number}`,
    caseKey: 'editorSelect',
    caseParams: {
      metrics: ['fps', 'memory'],
      componentType
    },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件选中`,
      groupItems: ['流畅维度']
    },
    repeat
  };
};

/** 组件添加 */
export const mockAddTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;

  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `add-${number}`,
    caseKey: 'editorAdd',
    caseParams: { metrics: ['fps', 'memory'], componentType },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件添加`,
      groupItems: ['流畅维度']
    },
    repeat
  };
};

/** 组件删除 */
export const mockDeleteTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;

  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `delete-${number}`,
    caseKey: 'editorDelete',
    caseParams: { metrics: ['fps', 'memory'], componentType },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件删除`,
      groupItems: ['流畅维度']
    },
    repeat
  };
};

/** 组件复制 */
export const mockCopyTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;

  return {
    projectId: '快搭线下性能测试',
    // reportKey: 'kuaida-formEditor-performance', // 最终使用的报告模板
    taskConfig,
    taskId: `copy-${number}`,
    caseKey: 'editorCopy',
    caseParams: { metrics: ['fps', 'memory', 'load'], componentType },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件复制`,
      groupItems: ['流畅维度']
    },
    repeat
  };
};

/** 设计器属性编辑 isOnly */
export const mockSetterEditTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `setter-edit-${number}`,
    caseKey: 'setterEdit',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      actionGroup: [
        {
          type: 'edit',
          validation: 'isOnly'
        }
      ],
      componentType
    },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件属性编辑`,
      groupItems: ['流畅维度']
    }, // 导出报告时，通过该字段实现自定义逻辑
    repeat
  };
};

/** 组件拖动 */
export const mockDragTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType = 'select' } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `drag-${number}`,
    caseKey: 'editorDrag',
    caseParams: { metrics: ['fps', 'memory'], componentType },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件拖动`,
      groupItems: ['流畅维度']
    },
    repeat
  };
};

/** 设计器添加500个组件内存变化 */
export const mockMemoryTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType = 'select' } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `editor-memory-${number}`,
    caseKey: 'editorMemory',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      componentType
    },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}添加500组件内存变化`,
      groupItems: ['流畅维度']
    },
    repeat: 1
  };
};

/** 设计器日期区间组件setter显隐测试 */
export const mockSetterVisibility = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-g8kfwzhju1n1xstu4gsh0', componentType } = params;
  // 200 g8kfwzhju1n1xstu4gsh0
  // 500 2mumoj7dr0siqmzn7g02z
  const visibilityUrl = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-j8nu8frur0zhrpo8mxjvk/submission/form-g8kfwzhju1n1xstu4gsh0';
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `setter-visibility-${number}`,
    caseKey: 'setterVisibility',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      componentType
    },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件渲染器首屏时间&表单解析时间`,
      groupItems: ['加载维度']
    },
    repeat
  };
};

/** 设计器首屏时间 */
export const mockFormEditorFstTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType = 'select' } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `editor-fst-${number}`,
    caseKey: 'editorFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      componentType
    },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件设计器首屏时间`,
      groupItems: ['加载维度']
    },
    repeat
  };
};

// ****************************************
/** 渲染器首屏时间 */
const renderUrl = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/submission/form-ly7oofay0jhax5v2yqviz';
// const renderUrl = 'https://kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/submission/form-ly7oofay0jhax5v2yqviz';
// 上一迭代master分支，用于回归测试
// const renderUrl = 'https://1941-wtrca-sl-kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/submission/form-ly7oofay0jhax5v2yqviz';
// v1.8
// const renderUrl500 = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-26rsy2mo9tztk73ywjzlx/submission/form-ndcir1fabo5231z2p8fyt';
const renderUrl500 = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-26rsy2mo9tztk73ywjzlx/submission/form-ndcir1fabo5231z2p8fyt';
// mock 耗时api
const renderUrl500_none_api = 'https://1941-wtrca-sl-kuaida.it.test.sankuai.com/app-26rsy2mo9tztk73ywjzlx/submission/form-ndcir1fabo5231z2p8fyt';
// mock dom变化
const renderUrl500_mock_dom = 'https://yangxu63-ttqat-sl-kuaida.it.test.sankuai.com/app-26rsy2mo9tztk73ywjzlx/submission/form-ndcir1fabo5231z2p8fyt';
// mock 资源变化
const renderUrl500_mock_resource = 'https://yangxu63-mgwov-sl-kuaida.it.test.sankuai.com/app-26rsy2mo9tztk73ywjzlx/submission/form-ndcir1fabo5231z2p8fyt';
// const renderUrl = 'https://21227-drrmt-sl-kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/submission/form-ly7oofay0jhax5v2yqviz';
// const renderUrl = 'https://kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/submission/form-ly7oofay0jhax5v2yqviz';
const getRenderUrl = (number: number, formCode: string) => {
  if (number === 500) {
    return renderUrl500.replace(/(form-)[^&]+/, formCode);
  }
  return renderUrl.replace(/(form-)[^&]+/, formCode);
};
export const mockFormRenderFst = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `render-fst-${number}`,
    caseKey: 'renderFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      componentType,
      number
    },
    url: getRenderUrl(number, formCode),
    reportParams: {
      column: `${number}组件渲染器首屏时间&表单解析时间`,
      groupItems: ['加载维度']
    },
    repeat
  };
};

/** 渲染器引擎解析时间 */
export const mockFormParseTime = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `render-parseTime-${number}`,
    caseKey: 'formParse',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      componentType
    },
    url: getRenderUrl(number, formCode),
    reportParams: {
      column: `${number}组件渲染器首屏时间&表单解析时间`,
      groupItems: ['加载维度']
    },
    repeat
  };
};

/** 渲染侧条件显隐测试 */
export const mockRenderVisibility = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-g8kfwzhju1n1xstu4gsh0', componentType } = params;
  // 200 g8kfwzhju1n1xstu4gsh0
  // 500 2mumoj7dr0siqmzn7g02z
  const visibilityUrl = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-j8nu8frur0zhrpo8mxjvk/submission/form-g8kfwzhju1n1xstu4gsh0';
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `render-visibility-${number}`,
    caseKey: 'renderVisibility',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      componentType
    },
    url:
      number === 200
        ? visibilityUrl.replace(/(form-)[^&]+/, 'form-g8kfwzhju1n1xstu4gsh0')
        : visibilityUrl.replace(/(form-)[^&]+/, 'form-2mumoj7dr0siqmzn7g02z'),
    reportParams: {
      column: `${number}组件渲染器首屏时间&表单解析时间`,
      groupItems: ['加载维度']
    },
    repeat
  };
};

/** 渲染器属性编辑 */
export const mockRenderEditTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType = 'select' } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `render-edit-${number}`, // 上限测试 100组件
    caseKey: 'renderEdit',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      actionGroup: [
        {
          type: 'edit',
          validation: 'isOnly'
        }
      ],
      componentType
    },
    url: getRenderUrl(number, formCode),
    reportParams: {
      column: `${number}组件渲染器属性编辑`,
      groupItems: ['流畅维度']
    }, // 导出报告时，通过该字段实现自定义逻辑
    repeat
  };
};

/** 画布滚动 */
export const mockScrollTask = (params: IParams): ITask => {
  const { number = 100, repeat = 10, formCode = 'form-ly7oofay0jhax5v2yqviz', componentType } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: `editor-scroll-${number}`,
    caseKey: 'editorScroll',
    caseParams: { number, componentType },
    url: editorUrl(number, formCode),
    reportParams: {
      column: `${number}组件测试`,
      groupItems: ['响应维度', '分组']
    },
    repeat
  };
};

export const mockScrollTask1: ITask = {
  projectId: '快搭线下性能测试',
  taskConfig,
  taskId: '测试画布滚动-100组件',
  // caseKey: 'form-editor-scroll',
  caseKey: 'components-limit',
  // 传入用例执行函数 onExecute(page, caseParams)
  caseParams: { componentsNumber: 100 }, // 100组件测试
  url: 'http://localhost:8002/admin/app-2i2z3bdn2ngtf6jlzgmza/design/pageDesign?formCode=form-egh4l5nsqhydzcmjn67f8',
  // url: 'https://kuaida.it.test.sankuai.com/admin/app-2i2z3bdn2ngtf6jlzgmza/design/pageDesign?formCode=form-l5t3neihxx13f4l1uzrtk',
  // urlParams: '',
  reportParams: { column: '100组件测试', groupItems: ['响应维度', '分组'] }, // 导出报告时，通过该字段实现自定义逻辑
  repeat: 1
};

/** 审批中心 */
const shenpiHome = 'https://1941-wtrca-sl-shenpi.it.test.sankuai.com/p/home';
const shenpiSubmit = 'https://21227-prbty-sl-shenpi.it.test.sankuai.com/p/submit?pdId=82437';
const shenpiNewdetail = 'https://21227-prbty-sl-shenpi.it.test.sankuai.com/p/newdetail?bpmCode=EMUN3000002016529';
// const shenpiHome = 'https://shenpi.it.test.sankuai.com/p/home';
// const shenpiSubmit = 'https://shenpi.it.test.sankuai.com/p/submit?pdId=82437';
// const shenpiNewdetail = 'https://shenpi.it.test.sankuai.com/p/newdetail?bpmCode=EMUN3000002016529';
export const mockHomeFst = (params: IParams): ITask => {
  const { repeat = 10 } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: 'shenpiHome-fst',
    caseKey: 'renderFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load']
    },
    url: shenpiHome,
    reportParams: {
      column: '审批中心首页fst',
      groupItems: ['加载维度']
    },
    repeat
  };
};
export const mockSubmitFst = (params: IParams): ITask => {
  const { number = 100, repeat = 10 } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: 'shenpiSubmit-fst',
    caseKey: 'shenpiFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      number
    },
    url: shenpiSubmit,
    reportParams: {
      column: '审批中心提交页fst',
      groupItems: ['加载维度']
    },
    repeat
  };
};
export const mockNewdetailFst = (params: IParams): ITask => {
  const { number = 100, repeat = 10 } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: 'shenpiNewdetail-fst',
    caseKey: 'shenpiFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load'],
      number
    },
    url: shenpiNewdetail,
    reportParams: {
      column: '审批中心详情页fst',
      groupItems: ['加载维度']
    },
    repeat
  };
};

/** 快搭应用 */
const workbench = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/workbench/form-ly7oofay0jhax5v2yqviz';
const submission = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/submission/form-ly7oofay0jhax5v2yqviz';
const detail = 'https://21227-prbty-sl-kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/detail?recordId=6fbd0a2b722648a7b1fbee83e193cdbd';
// const workbench = 'https://kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/workbench/form-ly7oofay0jhax5v2yqviz';
// const submission = 'https://kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/submission/form-ly7oofay0jhax5v2yqviz';
// const detail = 'https://kuaida.it.test.sankuai.com/app-ixv8dxylubvngm93npi43/detail?recordId=6fbd0a2b722648a7b1fbee83e193cdbd';
export const mockWorkbenchFst = (params: IParams): ITask => {
  const { repeat = 10 } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: 'workbench-fst',
    caseKey: 'renderFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load']
    },
    url: workbench,
    reportParams: {
      column: '快搭应用表单列表页fst',
      groupItems: ['加载维度']
    },
    repeat
  };
};
export const mockSubmissionFst = (params: IParams): ITask => {
  const { repeat = 10 } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: 'submission-fst',
    caseKey: 'renderFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load']
    },
    url: submission,
    reportParams: {
      column: '快搭应用提交页fst',
      groupItems: ['加载维度']
    },
    repeat
  };
};
export const mockDetailFst = (params: IParams): ITask => {
  const { repeat = 10 } = params;
  return {
    projectId: '快搭线下性能测试',
    taskConfig,
    taskId: 'detail-fst',
    caseKey: 'renderFst',
    caseParams: {
      metrics: ['fps', 'memory', 'load']
    },
    url: detail,
    reportParams: {
      column: '快搭应用记录详情页fst',
      groupItems: ['加载维度']
    },
    repeat
  };
};
