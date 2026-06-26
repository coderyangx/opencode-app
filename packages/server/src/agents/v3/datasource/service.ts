/**
 * v3 迁移代码 - 数据源服务
 *
 * 原始代码位于 src/datasource/service.ts，依赖 presetManager 和 executors。
 * 这里保留了 NL2SQLDataService 的核心接口结构，供 agent 代码引用。
 * presetManager 和 executors 的完整实现请参考原始 datasource 目录。
 */

import Cat from "@dp/cat-client";
import type { IRunContext } from "../types/context.js";

// 简化的查询配置类型
export interface QUERY_CONFIG {
  dsl_query: {
    sql: string;
    from: string;
    [key: string]: any;
  };
}

/**
 * Preset 管理器 stub
 * 原始代码位于 src/datasource/manager/preset.ts
 */
class PresetManagerStub {
  getPreset(presetId?: string): any {
    if (!presetId) {
      throw new Error("无匹配/可用的数据预设项");
    }
    return {
      type: presetId,
      getSchema: async (_ctx: IRunContext) => {
        // stub: 返回空 schema，实际由具体 preset 实现填充
        return [];
      },
      executeQuery: async (_dsl: any, _ctx: IRunContext) => {
        // stub: 返回空结果，实际由具体 preset 的 executor 实现
        return [];
      },
    };
  }
}

export const presetManager = new PresetManagerStub();

export class NL2SQLDataService {
  private ctx: IRunContext;

  constructor(ctx: IRunContext) {
    this.ctx = ctx;
  }

  private getPreset(presetId?: string) {
    const preset = presetManager.getPreset(presetId || this.ctx.presetId);
    if (!preset) {
      throw new Error("无匹配/可用的数据预设项");
    }
    return preset;
  }

  async getDataSchema(presetId?: string) {
    const t1 = Cat.newTransaction("DataSourceService", "getDataSchema");
    t1.addData("datasourceType", presetId || this.ctx.presetId);
    try {
      const preset = this.getPreset(presetId);
      const ret = await preset.getSchema(this.ctx);
      t1.complete();
      return ret;
    } catch (e) {
      t1.logError(e);
      t1.setStatus(Cat.STATUS.FAIL);
      t1.complete();
      throw e;
    }
  }

  async executeQuery(dsl: QUERY_CONFIG["dsl_query"], presetId?: string) {
    const t1 = Cat.newTransaction("DataSourceService", "queryData");
    t1.addData("datasourceType", presetId || this.ctx.presetId);
    const preset = this.getPreset(presetId);
    console.log("preset.query_executor", preset.type);
    const execute = preset.executeQuery;

    if (!execute) {
      t1.setStatus(Cat.STATUS.FAIL);
      t1.complete();
      throw new Error("无可用的数据查询执行器");
    }

    try {
      const ret = await execute(dsl, this.ctx);
      t1.complete();
      return ret;
    } catch (e) {
      t1.logError(e);
      t1.setStatus(Cat.STATUS.FAIL);
      t1.complete();
      throw e;
    }
  }

  toJSON() {
    return "[Object NL2SQLDataService]";
  }
}
