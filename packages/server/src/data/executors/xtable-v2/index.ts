import { LocalQueryEngine } from "../../../lib/query/engine.js";
import { executorRegistryManager } from "../../manager/executor.js";
import { getTableRows, getDBSchema } from "../../presets/xtable-v2/request.js";
import type { TableRow } from "../../presets/xtable-v2/request.js";
import { IQueryExecutorFunction } from "../../types";
import { formatters } from "./formatter.js";

const executor: IQueryExecutorFunction = async (dsl, ctx) => {
  const { raw, info } = await getDBSchema(ctx);
  const table = info.tables.find((item) => item.name === dsl.from);
  const rawTable = raw.find((item) => item.table.title === dsl.from);

  console.log("selected table", JSON.stringify(rawTable));
  if (!table || !rawTable) {
    throw new Error(`数据查询失败，表<${dsl.from}>不存在`);
  }

  const rows = await getTableRows(
    rawTable.table.tableId,
    rawTable.columns.map((item) => item.columnId),
    ctx
  );

  console.log(JSON.stringify(rows, null, 2));

  console.log(
    `get rows from <${rawTable.table.tableId}>, count <${rows.total}>`
  );

  const formatDataRow = (item: TableRow) => {
    const result: Record<string, any> = {};
    for (const key in item.data) {
      const column = rawTable.columns.find((c) => c.columnId === Number(key));
      const name = `${column.columnName}_${column.columnId}`;
      const formatter = formatters.find(
        (f) => f.columnType === column.columnType
      );
      console.log("formatter", formatter);
      if (formatter && formatter?.format) {
        result[name] = formatter.format(item.data[key].value, {});
      } else {
        result[name] = item.data[key].value;
      }
    }
    return result;
  };

  const queryEngine = new LocalQueryEngine(
    rows.rows.map(formatDataRow),
    table.columns
  );

  const queryResult = await queryEngine.query(dsl);

  return queryResult;
};

executorRegistryManager.registerExecutor("xtable", executor);
