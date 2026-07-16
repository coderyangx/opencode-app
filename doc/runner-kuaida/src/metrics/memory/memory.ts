import { Page } from 'puppeteer';

export interface IMemoryInfo {
  total: number;
  used: number;
}

export async function getMemoryInfo (page: Page) {
  await collectGarbage(page); // 垃圾回收
  const ret = await page.metrics();
  return {
    total: formatMB(ret.JSHeapTotalSize!),
    used: formatMB(ret.JSHeapUsedSize!)
  };
}

/**
 * 触发垃圾回收
 */
export async function collectGarbage (page: Page) {
  const context = await (page.mainFrame() as any).executionContext();
  await context._client.send('HeapProfiler.enable');
  await context._client.send('HeapProfiler.collectGarbage');
}

export function formatMB (bytes: number) {
  return parseFloat((bytes / 1024 / 1024).toFixed(2));
}

export function formatKB (bytes: number) {
  return parseFloat((bytes / 1024).toFixed(2));
}
