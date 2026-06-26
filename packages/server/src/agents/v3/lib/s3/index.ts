import { objectRepository } from "../db/repositories/index.js";

interface S3Object {
  data: Buffer;
  metadata: {
    type: string; // mime-type
  };
}

export class TempS3 {
  async putObject(
    key: string,
    obj: S3Object,
    options?: {
      expires?: number;
    }
  ) {
    await objectRepository.putObject({
      key,
      content: obj.data,
      metadata: {
        ...obj.metadata,
        expires: options?.expires,
      },
    });
  }

  async getObject(key: string) {
    const entity = await objectRepository.getObject(key);
    if (!entity) {
      return null;
    }

    const { expires, ...metadata } = entity.metadata;

    if (expires && expires * 1000 + entity.createdAt.getTime() < Date.now()) {
      return null;
    }

    return {
      data: entity.content,
      metadata: metadata,
    };
  }

  toJSON() {
    return "[Object MemoryS3]";
  }
}

export const s3 = new TempS3();
