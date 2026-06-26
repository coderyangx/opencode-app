import type { CoreMessage } from "ai";
import type { SessionMemory } from "../lib/cache/session";
import type { TempS3 } from "../lib/s3";
import type { NL2SQLDataService } from "../datasource/service";
import type { ISkill } from "./skill";

export interface IRunContext {
  cookie: string;
  view: string;
  env: string;
  origin: string;
  history?: CoreMessage[];
  memory?: SessionMemory;
  s3?: TempS3;
  dataSvc?: NL2SQLDataService;
  presetId?: string;
  presetOptions?: Record<string, any>;
  sessionId?: string;
  user?: {
    userId: string;
    userName: string;
    mis: string;
  };
  language?: string;
  bizId?: string; // 业务自定义的单次问答任务的唯一标识，可以作为traceId使用
  taskId?: number; // 学城会话接口返回的 taskId
  skill?: ISkill;
  e2e?: {
    batchId: string;
    expectOutput: string;
  };
  // 是否启用网页搜索
  searchWeb?: boolean;
  // 数据库版本标记，用来精细控制缓存
  dbVersion?: number;
}
