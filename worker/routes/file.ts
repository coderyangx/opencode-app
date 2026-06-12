import { Hono } from 'hono';
import { createSupabaseAdmin as getSupabase } from '../lib/supabase';
import type { Env, Variables } from '../index';
import { formatSize } from '@/utils/file';

const file = new Hono<{ Bindings: Env; Variables: Variables }>();

/**
 * POST /sandbox-api/file/upload   multipart/form-data: file
 * 上传附件到 Supabase Storage，返回公开 URL（用于消息中展示图片/文件，与沙箱无关）
 * domain：https://db0mbhdronqd94.database.sankuai.com/project/default/storage/buckets/sandbox
 *  BUCKETS：sandbox
 *    path：sandbox/uploads
 *      file：sandbox/uploads/ai-man.jpeg
 */
file.post('/upload', async (c) => {
  // 创建一个 File，可以转 arrayBuffer()、stream()、
  // const file = new File(['foo---fun'], 'foo.txt', {
  //   type: 'text/plain',
  // });
  const user = c.get('user');
  const formData = await c.req.formData();
  const fileData = formData.get('file') as File | null;
  if (!fileData) return c.json({ ok: false, error: 'no file' }, 400);

  const ext = fileData.name.split('.').pop() ?? 'bin';
  // const storagePath = `uploads/${fileData.name}`;
  const storagePath = `${user.id}/${fileData.name}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  // const bytes = await fileData.arrayBuffer();

  const supabase = getSupabase(c.env);
  const { error } = await supabase.storage
    .from('attachments')
    .upload(storagePath, fileData, { contentType: fileData.type, upsert: false }); // upsert true 代表如果存在可以覆盖

  if (error) return c.json({ ok: false, error: error.message }, 500);

  const { data: urlData } = supabase.storage.from('attachments').getPublicUrl(storagePath);

  return c.json({
    ok: true,
    key: storagePath,
    url: urlData.publicUrl,
    name: fileData.name,
    mimeType: fileData.type,
    size: formatSize(fileData.size)
  });
});

// const sandbox = getClient().storage.from('sandbox');
// console.log('Supabase Storage', sandbox.getPublicUrl(baseFilePath + 'ai-man.jpeg'));

export default file;
