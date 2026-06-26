import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

// 内存事件存储（生产替换 Redis）
type Event = {
  id: number;
  data: string;
  ts: number;
};

const eventStore: Event[] = [];

let globalId = 0;

/**
 * 模拟事件生产者
 */
setInterval(() => {
  const event: Event = {
    id: ++globalId,
    data: `message-${globalId}`,
    ts: Date.now()
  };

  eventStore.push(event);

  // 控制内存
  if (eventStore.length > 200) {
    eventStore.shift();
  }
}, 1000);

/**
 * SSE endpoint
 */
app.get('/sse', async (c) => {
  // 两种续传场景：
  //   1. 网络断开自动重连 → 浏览器自动携带 Last-Event-ID header
  //   2. 手动断开再重连  → 新 EventSource 不继承旧 id，通过 URL 参数传入
  const lastEventId = Number(c.req.header('last-event-id') || c.req.query('lastEventId') || 0);
  console.log('lastEventId', c.req.header('last-event-id'), c.req.query('lastEventId'));

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const send = (event: Event) => {
        if (closed) return;
        const payload = `id: ${event.id}\n` + `data: ${event.data}\n\n`;
        controller.enqueue(encoder.encode(payload)); // 追加队列
      };

      // 1. 回访缺失的事件 missed events
      const missed = eventStore.filter((e) => e.id > lastEventId);
      missed.forEach(send);

      // 2. 推送新事件 push new events
      // 用 cursor 追踪「已发送到哪个 id」，每次只推新增的
      // 不能复用 lastEventId（它是连接时的初始值，不会更新）
      let cursor = lastEventId;
      const timer = setInterval(() => {
        // 从缓存中读取数据
        const newEvents = eventStore.filter((e) => e.id > cursor);
        newEvents.forEach((e) => {
          send(e);
          cursor = e.id; // 更新游标，下次只推更新的
        });
      }, 1500);

      // 3. heartbeat（防止连接被代理断开）
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 15000);

      // 4. cleanup
      c.req.raw.signal.addEventListener('abort', () => {
        closed = true;
        clearInterval(timer);
        clearInterval(heartbeat);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      // CORS：允许 file:// 和任意 origin 访问（开发用）
      'Access-Control-Allow-Origin': '*',
      // 允许浏览器读取 Last-Event-ID header 并在重连时携带
      'Access-Control-Allow-Headers': 'Last-Event-ID'
    }
  });
});

app.get('/test', (c) => c.json({ ok: true, code: 200 }));

serve(
  {
    port: 3008,
    fetch: app.fetch
  },
  (info) => {
    console.log('SSE running on http://localhost:3008', info);
  }
);
