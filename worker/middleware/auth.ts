import { User } from '@supabase/supabase-js';
import { createMiddleware } from 'hono/factory';
import { createSupabaseAdmin } from '../lib/supabase';
import { UnauthorizedError } from '../util/errors';
import type { Env } from '../index';

export const authMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) throw new UnauthorizedError();

  const supabase = createSupabaseAdmin(c.env);
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);
  if (error || !user) throw new UnauthorizedError();

  c.set('user', user as User);
  await next();
});
