import axios from 'axios';
import { FORM_API_SERVER_MAP } from '../../const/index.js';

declare module 'axios' {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}

export const formFetch = (ctx: any) => {
  const env = ctx.env && FORM_API_SERVER_MAP[ctx.env] ? ctx.env : 'development';
  // 优先使用请求携带的 Cookie；本地开发若未带有效登录态，兜底使用 .env 中的 KUAIDA_COOKIE
  const fallbackCookie = process.env.KUAIDA_COOKIE || '';
  const cookie = ctx.cookie || fallbackCookie;
  const instance = axios.create({
    baseURL: FORM_API_SERVER_MAP[env],
    headers: {
      Cookie: cookie,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    },
  });

  instance.interceptors.response.use(
    (resp) => {
      if (resp.data?.code === 200) {
        return resp.data.data;
      }
      const isHtml = typeof resp.data === 'string' && resp.data.includes('sso.auth.fe');
      if (isHtml) {
        throw new Error(
          '快搭接口返回SSO登录页，请检查Cookie是否有效。本地开发可在 packages/server/.env 中配置 KUAIDA_COOKIE',
        );
      }
      throw new Error('请求异常');
    },
    (error) => {
      console.log('request error', error.message);
      throw error;
    },
  );

  return instance;
};
