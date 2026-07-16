// import { IMetricsConfig } from '../../metrics/type';

export type TTaskType =
  | 'Scroll'
  | 'Limit'
  | 'Select'
  | 'Add'
  | 'Delete'
  | 'Copy'
  | 'Drag'
  | 'Memory'
  | 'SetterEdit'
  | 'RenderEdit'
  | 'EditorFst'
  | 'RenderFst'
  | 'FormParse'
  | 'RenderVisibility'
  | 'SetterVisibility'
  | 'HomeFst'
  | 'SubmitFst'
  | 'NewdetailFst'
  | 'WorkbenchFst'
  | 'DetailFst';
// | 'SubmissionFst';

export type TComponentKey =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'selectdd'
  | 'money'
  | 'date'
  | 'daterange'
  | 'table'
  | 'captions'
  | 'card'
  | 'columnsgrid'
  | 'people'
  | 'multiplepeople'
  | 'chatgroup'
  | 'department'
  | 'image'
  | 'file'
  | 'associatedrecord'
  | 'associateddatasource'
  | 'associatedquery';

export enum ComponentName {
  // 10个基础组件
  Input = 'Input',
  TextArea = 'TextArea',
  Number = 'Number',
  Money = 'Money',
  Date = 'Date',
  DateRange = 'DateRange',
  Table = 'Table',
  Select = 'Select',
  SelectDD = 'SelectDD',
  Captions = 'Captions',
  // 2个布局组件
  Card = 'Card',
  ColumnsGrid = 'ColumnsGrid',
  // 9个增强组件
  Image = 'Image',
  File = 'File',
  People = 'People',
  Department = 'Department',
  ChatGroup = 'ChatGroup',
  AssociatedRecord = 'AssociatedRecord',
  AssociatedQuery = 'AssociatedQuery',
  AssociatedDataSource = 'AssociatedDataSource',
  MultiplePeople = 'MultiplePeople'
}

export enum EnhancedComponent {
  Image = 'Image',
  File = 'File',
  People = 'People',
  Department = 'Department',
  ChatGroup = 'ChatGroup',
  AssociatedRecord = 'AssociatedRecord',
  AssociatedQuery = 'AssociatedQuery',
  AssociatedDataSource = 'AssociatedDataSource',
  MultiplePeople = 'MultiplePeople'
}

export type TBasicComponent = 'Input' | 'TextArea' | 'Number' | 'Money' | 'Date' | 'DateRange' | 'Table' | 'Select' | 'SelectDD' | 'Captions';

export type TEnhancedComponent =
  | 'Image'
  | 'File'
  | 'People'
  | 'Department'
  | 'ChatGroup'
  | 'AssociatedRecord'
  | 'AssociatedQuery'
  | 'AssociatedDataSource'
  | 'MultiplePeople';

// 布局组件非 jm-form-item
export type TLayoutComponent = 'Card' | 'ColumnsGrid';

export type TComponentName = TBasicComponent | TEnhancedComponent | TLayoutComponent;

/** 将组件类型的key转换为组件名称，用于 AddNode CopyNode等输入 */
export const convertTypeKeyToName = (key: TComponentKey): TComponentName => {
  const map: Record<TComponentKey, TComponentName> = {
    input: ComponentName.Input,
    textarea: ComponentName.TextArea,
    number: ComponentName.Number,
    money: ComponentName.Money,
    date: ComponentName.Date,
    daterange: ComponentName.DateRange,
    // table: ComponentName.Table,
    select: ComponentName.Select,
    selectdd: ComponentName.SelectDD,
    captions: ComponentName.Captions,
    card: ComponentName.Card,
    columnsgrid: ComponentName.ColumnsGrid,
    image: ComponentName.Image,
    file: ComponentName.File,
    people: ComponentName.People,
    chatgroup: ComponentName.ChatGroup,
    department: ComponentName.Department,
    associatedrecord: ComponentName.AssociatedRecord,
    associatedquery: ComponentName.AssociatedQuery,
    associateddatasource: ComponentName.AssociatedDataSource,
    multiplepeople: ComponentName.MultiplePeople
  };
  return map[key];
};

// type TActionType = 'add' | 'copy' | 'remove' | 'batchAdd' | 'batchCopy' | 'batchRemove';
type TActionType = 'add' | 'copy' | 'delete' | 'drag' | 'select' | 'edit';

interface IAction {
  type: TActionType; // 操作类型
  validation?: 'none' | 'isOnly' | 'option' | 'visibility';
  number?: number; // 一次添加/复制/删除等的节点数量，默认1个
  repeat?: number; // 操作次数，默认1次
  intervalTime?: number; // 每次操作的间隔时间，默认0ms
}

/** 用例执行参数 */
export interface ICaseParams {
  // metrics: IMetricsConfig;
  metrics: Array<'fps' | 'memory' | 'load'>;
  scene: 'editor' | 'render'; // 默认 editor
  number: number;
  actionGroup?: IAction[];
  screenshot?: {
    enabled: boolean;
    fullPage?: boolean;
    path?: string; // 保存路径
  };
  componentType?: TComponentKey;
}
