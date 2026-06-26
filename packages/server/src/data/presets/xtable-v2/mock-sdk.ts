// Mock SDK for @onejs/xtable-data-api
// This is a local mock that replaces the internal package.
// It returns empty/mock data so the code compiles and runs without external dependencies.

export interface TableColumnItem {
  columnId: number;
  columnName: string;
  columnType: number;
  config?: string;
}

export interface TableListItem {
  tableId: number;
  title: string;
}

export interface TableDataItem {
  rowId: number;
  rowData: Record<string, { columnType: number; value: any }>;
}

export interface TableDataResponse {
  tableData: TableDataItem[];
  nextPageToken?: number;
  total: number;
}

export interface TableMetaResponse {
  stepVersion: number;
  tableColumnDTOS: TableColumnItem[];
}

interface OpenSDKClientOptions {
  appId: string;
  appSecret: string;
  appKey: string;
  userSSOToken: string;
}

export class OpenSDKClient {
  private options: OpenSDKClientOptions;

  constructor(options: OpenSDKClientOptions) {
    this.options = options;
    console.log("[Mock OpenSDKClient] initialized with appId:", options?.appId);
  }

  async queryTableList(pageId: number): Promise<TableListItem[]> {
    console.log("[Mock OpenSDKClient] queryTableList:", pageId);
    // Return empty list - no real data available without internal API
    return [];
  }

  async queryTableMeta(params: { tableId: number }): Promise<TableMetaResponse> {
    console.log("[Mock OpenSDKClient] queryTableMeta:", params.tableId);
    return {
      stepVersion: 1,
      tableColumnDTOS: [],
    };
  }

  async queryTableData(params: {
    tableId: number;
    columnIds: number[];
    pageSize: number;
    pageToken?: number;
  }): Promise<TableDataResponse> {
    console.log("[Mock OpenSDKClient] queryTableData:", params.tableId);
    return {
      tableData: [],
      total: 0,
    };
  }
}

export default OpenSDKClient;
