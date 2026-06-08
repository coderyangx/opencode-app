import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
};

// 懒加载单例：Workers Isolate 在 warm start 时复用全局变量，
// env 值在运行时固定（来自 wrangler secrets），可以安全缓存。
let _client: SupabaseClient | null = null;
let _cachedUrl = '';
let _cachedKey = '';

export function createSupabaseAdmin(env: SupabaseEnv): SupabaseClient {
  if (_client && _cachedUrl === env.SUPABASE_URL && _cachedKey === env.SUPABASE_KEY) {
    return _client;
  }
  _client = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
    // auth: {
    //   autoRefreshToken: false,
    //   persistSession: false
    // },
    global: {
      headers: { 'x-my-custom-header': 'opencode-app-worker' }
    }
  });
  _cachedUrl = env.SUPABASE_URL;
  _cachedKey = env.SUPABASE_KEY;
  return _client;
}
