// Workers 原生日志：console 输出到 Cloudflare Observability 面板
// 开发时 wrangler tail 实时查看，生产时 Dashboard > Workers > Logs
export const logger = {
  info: (msg: string, data?: object) =>
    console.log(JSON.stringify({ level: 'info', msg, ...data })),
  warn: (msg: string, data?: object) =>
    console.warn(JSON.stringify({ level: 'warn', msg, ...data })),
  error: (msg: string, data?: object) =>
    console.error(JSON.stringify({ level: 'error', msg, ...data })),
  debug: (msg: string, data?: object) =>
    console.debug(JSON.stringify({ level: 'debug', msg, ...data }))
};
