import Koa from 'koa';

import { App } from './app/app';

const app = new Koa();
app.listen(3000);

app.use(async (ctx: any) => {
  ctx.body = '服务启动成功';
});

App.ins.start();

export const viteNodeApp = app;
