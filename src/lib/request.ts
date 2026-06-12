/**
 * 统一 HTTP 客户端
 * - 通过模块级 _currentToken（由 AuthContext 维护）同步获取 token，无需每次 async getSession
 * - 统一错误处理：401 → 跳登录；其他 → Toast 提示
 * - 返回 data 或抛出带 message 的 Error
 */
import { Toast } from '@douyinfe/semi-ui';
import { _currentToken } from './AuthContext';
import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** 供外部（如 ChatWindow）直接调用获取当前 token 请求头 */
export function getAuthHeaders(): Record<string, string> {
  return _currentToken
    ? { Authorization: `Bearer ${_currentToken}`, 'X-Opencode': 'opencode-app-client' }
    : { 'X-Opencode': 'opencode-app-client' };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    toast.error('登录已过期，请重新登录');
    // 延迟跳转，让 Toast 先展示
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    throw new ApiError('Unauthorized', 401);
  }

  if (res.status === 404) {
    throw new ApiError('资源不存在', 404);
  }

  if (!res.ok) {
    let msg = `请求失败 (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    toast.error(msg);
    throw new ApiError(msg, res.status);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const request = {
  get<T>(path: string): Promise<T> {
    return fetch(path, {
      headers: getAuthHeaders()
      // signal:
    }).then((res) => handleResponse<T>(res));
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return fetch(path, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined
    }).then((res) => handleResponse<T>(res));
  },

  /** 上传 FormData（文件上传），不设 Content-Type（浏览器自动加 boundary） */
  postForm<T>(path: string, form: FormData): Promise<T> {
    return fetch(path, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: form
    }).then((res) => handleResponse<T>(res));
  },

  /** 用于流式 SSE，返回原始 Response 供 useChat 消费 */
  async postStream(path: string, body: unknown): Promise<Response> {
    const res = await fetch(path, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.status === 401) {
      toast.error('登录已过期，请重新登录');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      throw new ApiError('Unauthorized', 401);
    }
    return res;
  }
};
