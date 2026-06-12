// Workers 原生日志：console 输出到 Cloudflare Observability 面板
// 开发时 wrangler tail 实时查看，生产时 Dashboard > Workers > Logs

// 本地 wrangler dev 环境有 process 对象，Cloudflare 生产 runtime 没有
export const isLocal = typeof process !== 'undefined';

const C = {
  reset: '\x1b[0m',
  info: '\x1b[36m', // cyan
  warn: '\x1b[33m', // yellow
  error: '\x1b[1;31m', // bold red
  debug: '\x1b[90m' // gray
};

/** 日志打印 */
function fmt(level: keyof typeof C, msg: string, data?: unknown): void {
  if (isLocal) {
    const prefix = `${C[level]}[${level.toUpperCase()}]${C.reset}`;
    data !== undefined ? console.log(prefix, msg, data) : console.log(prefix, msg);
  } else {
    // 生产 Observability 面板：纯 JSON，结构化查询友好
    console.log(JSON.stringify({ level, msg, ...(data !== undefined ? { data } : {}) }));
  }
}

/** 日志打印 */
export const logger = {
  info: (msg: string, data?: unknown) => fmt('info', msg, data),
  warn: (msg: string, data?: unknown) => fmt('warn', msg, data),
  error: (msg: string, data?: unknown) => fmt('error', msg, data),
  debug: (msg: string, data?: unknown) => fmt('debug', msg, data)
};

// export const logger = {
//   info: (msg: string, data?: object) =>
//     console.log(JSON.stringify({ level: 'info', msg, ...data })),
//   warn: (msg: string, data?: object) =>
//     console.warn(JSON.stringify({ level: 'warn', msg, ...data })),
//   error: (msg: string, data?: object) =>
//     console.error(JSON.stringify({ level: 'error', msg, ...data })),
//   debug: (msg: string, data?: object) =>
//     console.debug(JSON.stringify({ level: 'debug', msg, ...data }))
// };
