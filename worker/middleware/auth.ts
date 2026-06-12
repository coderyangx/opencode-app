import { User } from '@supabase/supabase-js';
import { createMiddleware } from 'hono/factory';
import { createSupabaseAdmin as getSupabase } from '../lib/supabase';
import { UnauthorizedError } from '../util/errors';
import type { Env, Variables } from '../index';

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(
  async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedError();
    // TODO mock 已登录
    // c.set('user', {
    //   id: '238531',
    //   name: 'yangxu'
    // });
    // await next();

    const {
      data: { user },
      error
    } = await getSupabase(c.env).auth.getUser(token);
    if (error || !user) throw new UnauthorizedError();

    c.set('user', user as User);
    await next();
  }
);
