import { tool, ToolSet } from 'ai';
import { z } from 'zod';

// Wikipedia Search API 返回结构
interface WikiSearchResult {
  query: {
    search: Array<{ title: string; snippet: string; pageid: number }>;
  };
}

// Wikipedia Summary API 返回结构
interface WikiSummary {
  title: string;
  extract: string; // 纯文本摘要
  content_urls?: {
    desktop?: { page?: string };
  };
}

/**
 * get_weather：天气查询工具（mock 数据，用于测试 tool 调用渲染）
 */
const get_weather = tool({
  description: '查询指定城市的当前天气。用户问天气时调用此工具。',
  inputSchema: z.object({
    city: z.string().describe('城市名称，如"北京"、"上海"、"Tokyo"')
  }),
  execute: async ({ city }) => {
    const weatherMap: Record<
      string,
      { temp: number; condition: string; humidity: number; wind: string }
    > = {
      北京: { temp: 28, condition: '晴', humidity: 45, wind: '东南风 3 级' },
      上海: { temp: 32, condition: '多云', humidity: 78, wind: '东风 2 级' },
      广州: { temp: 35, condition: '雷阵雨', humidity: 85, wind: '南风 4 级' },
      深圳: { temp: 34, condition: '阵雨', humidity: 82, wind: '东南风 3 级' },
      杭州: { temp: 31, condition: '晴转多云', humidity: 65, wind: '东北风 2 级' },
      成都: { temp: 26, condition: '阴', humidity: 72, wind: '无风' },
      西安: { temp: 30, condition: '晴', humidity: 40, wind: '西北风 2 级' },
      tokyo: { temp: 29, condition: 'Partly Cloudy', humidity: 68, wind: 'SE 10km/h' }
    };
    const key = city.toLowerCase() in weatherMap ? city.toLowerCase() : city;
    const w = weatherMap[key] ?? { temp: 22, condition: '晴', humidity: 55, wind: '微风' };
    return {
      city,
      temperature: `${w.temp}°C`,
      condition: w.condition,
      humidity: `${w.humidity}%`,
      wind: w.wind,
      updatedAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };
  }
});

/**
 * 判断字符串是否主要为中文（含中文字符超过 20%）
 */
function isChinese(text: string): boolean {
  const zhCount = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  return zhCount / text.length > 0.2;
}

/**
 * web_search：网络搜索工具
 * 基于 Wikipedia 公开 API（支持中英文），完全免费、无需 Key
 *
 * 自动语言检测：
 *   - 中文关键词 → zh.wikipedia.org（返回中文结果）
 *   - 英文关键词 → en.wikipedia.org（返回英文结果）
 *
 * 两步实现：
 *   1. Search API  → 搜关键词，拿到最相关的词条列表
 *   2. Summary API → 并发取前 3 条词条的摘要
 *
 * 局限性：仅覆盖 Wikipedia 收录内容，不适合实时新闻/股价等
 */
const web_search = tool({
  description:
    '搜索互联网获取信息。当用户询问概念解释、人物介绍、技术知识、历史事件等时调用此工具。支持中英文搜索。',
  inputSchema: z.object({
    query: z.string().describe('搜索关键词，中英文均可，如"机器学习"或"React 19 features"')
  }),
  execute: async ({ query }) => {
    // 根据关键词语言自动选择 Wikipedia 站点
    const lang = isChinese(query) ? 'zh' : 'en';
    const BASE = `https://${lang}.wikipedia.org`;
    const headers = { 'User-Agent': 'opencode-app/1.0 (contact: dev@example.com)' };

    // Step 1: 搜索关键词，获取匹配词条列表
    const searchUrl =
      `${BASE}/w/api.php?action=query&list=search` +
      `&srsearch=${encodeURIComponent(query)}&format=json&srlimit=3&origin=*`;

    const searchRes = await fetch(searchUrl, { headers });
    if (!searchRes.ok) {
      return { error: `搜索失败：HTTP ${searchRes.status}`, query };
    }

    const searchData = (await searchRes.json()) as WikiSearchResult;
    const hits = searchData.query?.search ?? [];
    if (hits.length === 0) {
      return { query, lang, results: [], message: '未找到相关词条' };
    }

    // Step 2: 取前 3 条词条的摘要（并发请求）
    const summaries = await Promise.all(
      hits.slice(0, 3).map(async (hit) => {
        const title = encodeURIComponent(hit.title.replace(/ /g, '_'));
        const summaryUrl = `${BASE}/api/rest_v1/page/summary/${title}`;
        try {
          const res = await fetch(summaryUrl, { headers });
          if (!res.ok) return null;
          const s = (await res.json()) as WikiSummary;
          return {
            title: s.title,
            // 摘要截取前 400 字，避免 context 过长
            extract: s.extract?.slice(0, 400) ?? '',
            url: s.content_urls?.desktop?.page ?? `${BASE}/wiki/${title}`
          };
        } catch {
          return null;
        }
      })
    );

    return {
      query,
      lang,
      results: summaries.filter(Boolean)
    };
  }
});

/**
 * 所有可用工具的集合，传给 streamText / ToolLoopAgent 的 tools 字段
 * 新增工具：在此文件定义后加入 tools 对象即可
 */
export const tools: ToolSet = {
  get_weather,
  web_search
};
