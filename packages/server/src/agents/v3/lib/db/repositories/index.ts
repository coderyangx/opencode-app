/**
 * v3 迁移代码 - DB 仓库 stub
 *
 * 原始代码依赖 src/lib/db/repositories 中的 objectRepository，
 * 这里仅提供接口 stub 用于学习目的，不包含真实数据库实现。
 */

interface ObjectEntity {
  key: string;
  content: Buffer;
  metadata: Record<string, any>;
  createdAt: Date;
}

class ObjectRepositoryStub {
  async putObject(data: {
    key: string;
    content: Buffer;
    metadata: Record<string, any>;
  }): Promise<void> {
    // stub: 学习用代码，不实现真实存储
  }

  async getObject(key: string): Promise<ObjectEntity | null> {
    // stub: 学习用代码，不实现真实读取
    return null;
  }
}

export const objectRepository = new ObjectRepositoryStub();
