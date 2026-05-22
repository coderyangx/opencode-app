import { ModelMessage } from 'ai';
import { createInterface } from 'readline';

/**
 * 开始 REPL 环境, While 循环 runAgent
 */
export async function startRepl(options: {
  sessionId: string;
  runTurn: (history: ModelMessage[]) => Promise<void>;
}) {
  const { sessionId, runTurn } = options;
  const history: ModelMessage[] = [];
  process.stdin.setEncoding('utf8');

  while (true) {
    const prompt = await readLine(`\u001b[36m${sessionId} >> \u001b[0m`);
    const query = prompt.trim();
    if (!query || query.toLowerCase() === 'q' || query.toLowerCase() === 'exit') {
      break;
    }

    history.push({ role: 'user', content: query });
    await runTurn(history);

    const last = history.at(-1);
    if (last && Array.isArray(last.content)) {
      const text = extractText(last.content as any[]);
      // if (text) console.log('[startRepl] extractText 完成', text);
    }
    console.log();
  }
}

function readLine(prompt: string) {
  return new Promise<string>((resolve) => {
    // 使用 readline 模块，支持退格、方向键、中文输入等行编辑能力
    // process.stdin.once('data') 是 raw 模式，不支持行编辑，会导致退格失效和乱码
    const readline = createReadlineInterface();
    readline.question(prompt, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

function createReadlineInterface() {
  // 每次创建新实例（question 后立即 close），确保 resume/pause 状态正确
  return createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true // 开启行编辑：支持退格键、方向键、中文输入
  });
}

export function extractText(content: any[]) {
  return content.map((c) => c.text).join('\n');
}

export function isMainModule(metaUrl: string) {
  const entry = process.argv[1];
  if (!entry) return false;
  return new URL(metaUrl).pathname === entry;
}
