import type { Handler } from "hono";
import { s3 } from "../lib/memory-s3/index.js";
import { isBuffer } from "lodash-es";

export const S3Preview: Handler = async (c) => {
  const key = c.req.param("key");
  const obj = s3.getObject(key);
  if (!obj) {
    return c.text("内容已过期", 200);
  }

  const buffer = isBuffer(obj.data)
    ? obj.data
    : Buffer.from((obj as any).data.data);

  return c.body(buffer, 200, {
    "Content-Type": obj.metadata.type,
  });
};
