import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Chat } from './handlers/chat.js';
import { serveStatic } from '@hono/node-server/serve-static';
import { logger } from './lib/log/index.js';
import { ChartCitation } from './handlers/chart-citation.js';
import { S3Preview } from './handlers/s3.js';
import { fileURLToPath } from 'url';
import path from 'node:path';
import fs from 'fs/promises';
import { SQLPreview } from './handlers/sql.js';
import { initConfig } from './config/index.js';
import { ChartOptions } from './handlers/chart-options.js';
import { Recommendations } from './handlers/recommendations.js';
import { S3Upload } from './handlers/upload.js';
import { createNodeWebSocket } from '@hono/node-ws';
import { DeepAnalysisChat } from './handlers/ws/deep-analysis-chat.js';

// Global error handlers to prevent server crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection: ' + String(reason));
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error('Uncaught Exception: ' + error.message);
});

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.use(
  '/ai-agent/static/*',
  serveStatic({
    root: '../widgets/dist',
    rewriteRequestPath(path) {
      return path.replace('/ai-agent/static/', '/');
    },
  }),
);

app.use(
  '/ai-agent/temp-reports/*',
  serveStatic({
    root: './reports',
    rewriteRequestPath(path) {
      return path.replace('/ai-agent/temp-reports/', '/');
    },
  }),
);

app.get('/', (c) => {
  return c.text('Hello World!');
});

app.get('/ai-agent', (c) => {
  logger.info('ok');
  return c.text('Hello World!');
});

app.get('/monitor/alive', (c) => {
  return c.text('OCTO check ok');
});

app.post('/ai-agent/chat', Chat);
app.post('/ai-agent/chart-citation', ChartCitation);
app.post('/ai-agent/chart-options', ChartOptions);
app.get('/ai-agent/object/:key', S3Preview);
app.post('/ai-agent/attachments/upload', S3Upload);
app.post('/ai-agent/query/preview', SQLPreview);
app.post('/ai-agent/recommendations', Recommendations);

app.get('/ai-agent/chat/app', async (c) => {
  logger.info('ws chat');
  const view = await c.req.query('view');
  const env = await c.req.query('env');

  if (process.env.NODE_ENV === 'local') {
    const targetUrl = `http://localhost:5173?view=${view}&env=${env}`;
    const proxyResponse = await fetch(targetUrl);
    let htmlContent = await proxyResponse.text();
    htmlContent = htmlContent.replace('<head>', `<head>\n<base href="http://localhost:5173">`);

    return c.html(htmlContent, 200);
  }

  const __filename = fileURLToPath(import.meta.url);
  const file = path.join(path.dirname(__filename), '../../widgets/dist/.vite/manifest.json');
  const content = await fs.readFile(file, 'utf8');
  const json = JSON.parse(content);
  const jsFile = json['src/entries/deep-analysis/index.tsx'].file;

  return c.html(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>数据分析小助手</title>
</head>
<body>
  <div id="root"></div>
  <script src="/ai-agent/static/${jsFile}">
  </script>
  <script type='text/javascript'>
    window.DeepAnalysis && window.DeepAnalysis.init(document.getElementById('root'), ${JSON.stringify(
      { view, env },
    )});
  </script>
</body>
</html>`);
});

app.get('/ai-agent/ws/chat', upgradeWebSocket(DeepAnalysisChat));

console.log('[服务端运行]', process.env.NODE_PORT);
const server = serve(
  {
    fetch: app.fetch,
    port: process.env.NODE_PORT ? Number(process.env.NODE_PORT) : 8080,
  },
  (info) => {
    initConfig();
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

injectWebSocket(server);

app.onError((err, c) => {
  console.error(err);
  logger.error(err);
  return c.text(err.message);
});
