import { LocalQueryEngine } from '../../../lib/query/engine.js';
import { executorRegistryManager } from '../../manager/executor.js';
import { IQueryExecutorFunction } from '../../types';
import { getMockData } from '../../presets/mock/index.js';

const executor: IQueryExecutorFunction = async (dsl, ctx) => {
  const { tables } = await ctx.dataSvc?.getDataSchema();
  const table = tables.find((t) => t.name === dsl.from);

  if (!table) {
    throw new Error(`数据查询失败，表<${dsl.from}>不存在`);
  }

  const data = getMockData();

  const queryEngine = new LocalQueryEngine(data, table.columns);
  const queryResult = await queryEngine.query(dsl);

  return queryResult;
};

executorRegistryManager.registerExecutor('mock', executor);
