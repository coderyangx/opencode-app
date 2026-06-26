import { executorRegistryManager } from '../../manager/executor.js';
import { IQueryExecutorFunction } from '../../types';
import { sleep } from '../../../lib/index.js';
import { formFetch } from '../../../lib/request/form.js';
import { ToolCacheManager } from '../../../lib/cache/tool.js';
import { LocalQueryEngine } from '../../../lib/query/engine.js';
import { IRunContext } from '../../../types/context.js';
import { QUERY_CONFIG } from '../../../lib/query/dsl-schema.js';
import { formatDataRow } from './formatter.js';

const cacheManager = new ToolCacheManager({
  ttl: 1000 * 60 * 60, // 1h
});

export const getFormRecordsOfPage = async (ctx: any, page: number, pageSize: number) => {
  const result = await formFetch(ctx).post<{
    page: { pageNo: number; totalCount: number };
    pageList: { id: string; fields: Record<string, any> }[];
  }>('/api/zeroconsole/view/data/list', {
    pageNo: page,
    pageSize,
    viewCode: ctx.view,
  });

  return result;
};

const getFormRecords = async (dsl: QUERY_CONFIG['dsl_query'], ctx: IRunContext) => {
  const maxRecords = 100000; // temp
  const cacheKey = {
    view: ctx.view,
    maxRecords,
  };

  const cache = cacheManager.get(cacheKey);
  let results;
  if (typeof cache !== 'undefined') {
    results = cache;
  } else {
    const pageSize = 100;
    // TODO 获取视图下、分页表单记录完整数据
    const firstPageResult = await getFormRecordsOfPage(ctx, 1, pageSize);
    const maxPages = Math.ceil(Math.min(maxRecords, firstPageResult.page.totalCount) / pageSize);

    if (firstPageResult.page.totalCount > maxRecords) {
      throw new Error(`记录总数已超过${maxRecords}, 建议新建视图缩小数据范围再进行分析`);
    }

    results = [...firstPageResult.pageList];
    for (let i = 2; i <= maxPages; i++) {
      const result = await getFormRecordsOfPage(ctx, i, pageSize);
      results.push(...result.pageList);
      await sleep(10);
    }

    cacheManager.set(cacheKey, results);
  }

  const data = results.map((item) => ({
    id: item.id, // 表单记录 id
    // 字段key和value：{ select_dd4c38eb: { label: 'S', value: 'select0ny2v3brm7s' }, date_9e37d3a0: 1717084800000, ... }
    ...item.fields,
    // { mis: yangxu63, name: 杨旭, dept: xxx, icon: xxx }
    SYSTEM_CREATOR: item.submitter,
    SYSTEM_DATE_CREATED: item.submitTime, // 1753190968004
  }));

  const { tables } = await ctx.dataSvc?.getDataSchema();
  // TODO 配合 schema
  const table = tables.find((item) => item.name === dsl.from);
  if (!table) {
    // debug
    console.log(JSON.stringify(dsl));
    console.log(JSON.stringify(tables));
  }

  //  本地 SQL 引擎执行
  // LocalQueryEngine 用 DSLTranslator 把 DSL 翻译成 SQL，
  // 再用 alasql（纯 JS 的内存 SQL 引擎）执行：
  const queryEngine = new LocalQueryEngine(data.map(formatDataRow), table.columns);

  const queryResult = await queryEngine.query(dsl);
  // 在 viewDataList.ts 的 20 条数据中，select_dd4c38eb.label === 'S' 的
  // 有 4 条（id 为 9c4d6d4a...、e5bebad2...、b0d12790...、8648330d...），
  // 所以返回 [ { count: 4 } ]。

  //   第八步：LLM 总结与输出
  // MainAgent 拿到 query-data 返回的 [{ count: 4 }] 后：
  // 评估结果是否满足目标
  // 可选调用 generate-chart 生成可视化图表
  // 以 Markdown 流式输出给用户："项目等级为 S 的数据共有 4 条"
  // 最终通过 result.toDataStreamResponse() 以 AI SDK 的 Data Stream 协议返回前端。
  return queryResult;
};

const executor: IQueryExecutorFunction = async (dsl, ctx) => {
  const result = await getFormRecords(dsl, ctx);
  return result;
};

executorRegistryManager.registerExecutor('kuaida', executor);
