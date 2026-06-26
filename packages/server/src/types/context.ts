import type { CoreMessage } from 'ai';
import type { SessionMemory } from '../lib/cache/session';
import type { MemoryS3 } from '../lib/memory-s3';
import type { NL2SQLDataService } from '../data/service';

// export interface IRunContext {
//   cookie: string;
//   view: string;
//   env: string;
//   origin: string;
//   history?: CoreMessage[];
//   memory?: SessionMemory;
//   s3?: MemoryS3;
//   dataSvc?: NL2SQLDataService;
//   presetId?: string;
//   presetOptions?: Record<string, any>;
//   sessionId?: string;
// }

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
  };
  // 是否启用网页搜索
  searchWeb?: boolean;
  // 数据库版本标记，用来精细控制缓存
  dbVersion?: number;
}

export interface ISkill {
  name: string;
  description: string;
  skillId: number;
  prompt: string;
  shortcut: string;
}
