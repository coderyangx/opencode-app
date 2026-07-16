import { CaseManager } from '../app/case-mgr';
// 注册测试用例
import EditorScroll from './fps/editorScroll';
import EditorLimit from './fps/editorLimit';
import EditorSelect from './fps/editorSelect';
import EditorAdd from './fps/editorAdd';
import EditorCopy from './fps/editorCopy';
import EditorDelete from './fps/editorDelete';
import EditorDrag from './fps/editorDrag';
import EditorMemory from './memory/editorMemory';
import EditorFst from './pageLoad/editorFst';
import RenderFst from './pageLoad/renderFst';
import SetterEdit from './fps/setterEdit';
import RenderEdit from './fps/renderEdit';
import RenderSchemaParse from './pageLoad/formParse';
import RenderVisibilityCase from './fps/renderVisibility';
import SetterVisibilityCase from './fps/setterVisibility'; // 日期区间组件显隐交互
import ShenpiFst from './pageLoad/shenpiFst'; // 审批中心fst

import CardSelect from './fps/cardSelect';

export function registerCases() {
  CaseManager.ins.registerCase(new EditorScroll());
  CaseManager.ins.registerCase(new EditorLimit());
  CaseManager.ins.registerCase(new EditorSelect());
  CaseManager.ins.registerCase(new EditorAdd());
  CaseManager.ins.registerCase(new EditorCopy());
  CaseManager.ins.registerCase(new EditorDelete());
  CaseManager.ins.registerCase(new EditorDrag());
  CaseManager.ins.registerCase(new EditorMemory());
  CaseManager.ins.registerCase(new EditorFst());
  CaseManager.ins.registerCase(new RenderFst());
  CaseManager.ins.registerCase(new SetterEdit());
  CaseManager.ins.registerCase(new RenderEdit());
  CaseManager.ins.registerCase(new RenderSchemaParse());
  CaseManager.ins.registerCase(new RenderVisibilityCase());
  CaseManager.ins.registerCase(new SetterVisibilityCase());
  CaseManager.ins.registerCase(new ShenpiFst());
  // 卡片测试用例
  CaseManager.ins.registerCase(new CardSelect());
}
