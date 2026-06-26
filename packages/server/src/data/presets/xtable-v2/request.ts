import OpenSDKClient from "./mock-sdk.js";
import type { TableColumnItem } from "./mock-sdk.js";
import { COLUMN_TYPE_MAP } from "./formatter.js";
import { IColumnSchema } from "../../types/index.js";
import { IRunContext } from "../../../types/context.js";
import { getConfig } from "../../../config/index.js";

// cookie key com.sankuai.it.saas.procc_ssoid/com.sankuai.it.ead.citadel_ssoid

const getClient = (ctx: IRunContext): OpenSDKClient => {
  const appId = getConfig("XTABLE_APP_ID") || process.env.XTABLE_APP_ID;
  const appSecret =
    getConfig("XTABLE_APP_SECRET") || process.env.XTABLE_APP_SECRET;
  const appKey = "com.sankuai.oa.kuaida.agent";
  const cookie = ctx.cookie || "";
  const ssoCookies = cookie
    .split(";")
    .map((item) => {
      const [key, ...value] = item.trim().split("=");
      return [key, value.join("=")];
    })
    .filter((item) => item[0].endsWith("_ssoid"));
  const userSSOToken = ssoCookies[0]?.[1] || process.env.XTABLE_SSO_ID || "";
  console.log(
    "appId",
    appId,
    "appSecret",
    appSecret,
    "userSSOToken",
    userSSOToken
  );
  const client = new OpenSDKClient({
    appId,
    appSecret,
    appKey,
    userSSOToken,
  });
  return client;
};

export interface TableRow {
  rowId: number;
  data: Record<string, { columnType: number; value: any }>;
}

export async function getTableRows(
  tableId: number,
  columnIds: number[],
  ctx: IRunContext
) {
  const getOnePageTableRows = async (pageToken?: number) => {
    const batch = Math.ceil(columnIds.length / 10);
    let nextPageToken: number | undefined;
    let total: number | undefined;

    const rows: TableRow[] = [];

    for (let i = 0; i < batch; i++) {
      const currentColumns = columnIds.slice(i * 10, (i + 1) * 10);
      const resp = await getClient(ctx).queryTableData({
        tableId,
        columnIds: currentColumns,
        pageSize: 100,
        pageToken,
      });
      nextPageToken = resp.nextPageToken;
      total = resp.total;
      for (const row of resp.tableData) {
        const existRow = rows.find((item) => item.rowId === row.rowId);
        if (existRow) {
          existRow.data = {
            ...existRow.data,
            ...row.rowData,
          };
        } else {
          rows.push({
            rowId: row.rowId,
            data: row.rowData,
          });
        }
      }
    }

    return {
      rows,
      total,
      nextPageToken,
    };
  };

  const rows: TableRow[] = [];
  let pageToken: number | undefined;
  let total: number | undefined;
  while (true) {
    const result = await getOnePageTableRows(pageToken);
    total = result.total;
    rows.push(...result.rows);
    if (result.nextPageToken) {
      pageToken = result.nextPageToken;
    } else {
      break;
    }
  }

  return {
    rows,
    total,
  };
}

async function getTableMeta(tableId, ctx: IRunContext) {
  const tableMeta = await getClient(ctx).queryTableMeta({ tableId });
  return {
    version: tableMeta.stepVersion,
    columns: tableMeta.tableColumnDTOS,
  };
}

export async function getDBSchema(ctx: IRunContext) {
  const tableList = await getClient(ctx).queryTableList(Number(ctx.view));
  if (tableList.length === 0) {
    return {
      info: {
        tables: [],
      },
      raw: [],
    };
  }

  const infoTasks: Promise<{
    table: {
      title: string;
      tableId: number;
    };
    version: number;
    columns: TableColumnItem[];
  }>[] = [];
  for (const table of tableList) {
    const task = getTableMeta(table.tableId, ctx).then((result) => ({
      columns: result.columns,
      version: result.version,
      table,
    }));
    infoTasks.push(task);
  }
  const results = await Promise.all(infoTasks);

  const info = {
    tables: results.map((item) => {
      return {
        name: item.table.title,
        description: "",
        columns: item.columns
          .filter((col) => col.columnId < 100)
          .map((col) => {
            const mapValue = COLUMN_TYPE_MAP.find(
              (c) => c.columnType === col.columnType
            );

            const colName = `${col.columnName}_${col.columnId}`;
            const colInfo: IColumnSchema = {
              name: colName,
              description: mapValue?.comment || "",
              type: mapValue?.type,
              role: mapValue?.role || "dimension",
            };

            return colInfo;
          }),
      };
    }),
  };

  console.log(info);

  return { info, raw: results };
}
