import { IRunContext } from "../types/context";

export const getSharedMetadata = (ctx: IRunContext, more = {}) => {
  const common = {
    langfuseTraceId: ctx.bizId,
    // langfuseUpdateParent: false,
    sessionId: ctx.sessionId,
    userId: ctx.user?.mis,
    e2e_test: ctx.e2e?.batchId ? true : undefined,
    e2e_id: ctx.e2e?.batchId,
    ...more,
  };

  if (ctx.presetId === 'xtable') {
    return {
      ...common,
      dataSetType: 'xtable',
      dataContentId: ctx.view.split('.')[0],
      dataTableId: ctx.view.split('.')[1],
    };
  }
  return {
    ...common,
    dataSetType: ctx.presetId,
    dataTableId: ctx.view,
  };
};
