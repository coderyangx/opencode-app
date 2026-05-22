/**
 * 工具定义
 * 使用 tool() 函数 + inputSchema(zod) + execute 函数
 */
import { tool } from 'ai';
import z from 'zod';
import path from 'path';
import fs from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

const execAsync = promisify(exec);
// 工作目录：限制在项目根目录下，防止越权
const WORKSPACE = process.cwd();

// ============================================================
// 系统工具：执行 bash + 读写文件
// ============================================================
export const execBashTool = tool({
  description: '执行 bash 命令并返回输出。适合列目录、查看文件、运行脚本等。禁止执行破坏性命令。',
  inputSchema: z.object({
    command: z.string().describe('要执行的 bash 命令，如 ls -la src/ 或 cat package.json'),
    cwd: z.string().optional().describe('执行命令的工作目录，默认为项目根目录')
  }),
  execute: async ({ command, cwd }) => {
    // 简单拦截最危险的模式
    const dangerous = ['rm -rf /', 'sudo', 'shutdown', 'reboot', '> /dev/'];
    const BLOCKED = /rm\s+-rf\s+\/|mkfs|dd\s+if=|:\(\)\{.*\}/;
    if (BLOCKED.test(command) || dangerous.some((pattern) => command.includes(pattern))) {
      return { ok: false, error: '该命令被安全策略拦截', command };
      // return 'Error: Dangerous command blocked';
    }
    try {
      const workDir = cwd ? path.resolve(WORKSPACE, cwd) : WORKSPACE;
      // const child = spawn(command, {
      //   cwd: cwd,
      //   shell: true,
      //   stdio: ['ignore', 'pipe', 'pipe']
      // });
      const { stdout, stderr } = await execAsync(command, {
        cwd: workDir,
        timeout: 15_000, // 15s 超时
        maxBuffer: 1024 * 1024 // 1MB 输出上限
      });
      return {
        ok: true,
        stdout: stdout.trim(),
        stderr: stderr.trim() || undefined,
        command
      };
    } catch (err: any) {
      return {
        ok: false,
        error: err.message,
        stdout: err.stdout?.trim(),
        stderr: err.stderr?.trim(),
        exitCode: err.code
      };
    }
  }
});

export const readFileTool = tool({
  description: '读取文件内容。路径相对于当前工作目录，也可以是绝对路径。',
  inputSchema: z.object({
    filePath: z.string().describe('文件路径，如 src/agents/test.txt 或 /tmp/test.txt')
  }),
  execute: async ({ filePath }) => {
    try {
      const absPath = path.isAbsolute(filePath) ? filePath : path.join(WORKSPACE, filePath);
      const content = await fs.readFile(absPath, 'utf-8');
      const lines = content.split('\n').length;
      return { ok: true, content, lines, path: absPath };
    } catch (err: any) {
      return { ok: false, error: err.message, code: err.code };
    }
  }
});

export const writeFileTool = tool({
  description: '写入内容到文件。自动创建不存在的父目录。路径相对于当前工作目录。',
  inputSchema: z.object({
    filePath: z.string().describe('文件路径，如 output/result.txt'),
    content: z.string().describe('要写入的文本内容'),
    append: z.boolean().optional().describe('true = 追加到末尾，false/不填 = 覆盖写入')
  }),
  execute: async ({ filePath, content, append = false }) => {
    try {
      const absPath = path.isAbsolute(filePath) ? filePath : path.join(WORKSPACE, filePath);
      // 自动创建父目录
      await fs.mkdir(path.dirname(absPath), { recursive: true });
      if (append) {
        await fs.appendFile(absPath, content, 'utf-8');
      } else {
        await fs.writeFile(absPath, content, 'utf-8');
      }
      return {
        ok: true,
        path: absPath,
        bytes: Buffer.byteLength(content, 'utf-8'),
        mode: append ? 'append' : 'overwrite'
      };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  }
});

export const getCurrentTimeTool = tool({
  description: '获取当前日期和时间',
  inputSchema: z.object({}),
  execute: async () => {
    return {
      datetime: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };
  }
});

export const calculateBMITool = tool({
  description: '根据身高和体重计算 BMI 指数',
  inputSchema: z.object({
    weight: z.number().describe('体重，单位：千克'),
    height: z.number().describe('身高，单位：厘米')
  }),
  needsApproval: (input, option) => {
    return input.weight > 200 || input.height > 200;
  },
  execute: async ({ weight, height }) => {
    try {
      const heightInMeter = height / 100;
      const bmi = weight / (heightInMeter * heightInMeter);
      let category: string;
      if (bmi < 18.5) category = '偏瘦';
      else if (bmi < 24) category = '正常';
      else if (bmi < 28) category = '偏胖';
      else category = '肥胖';
      return { bmi: bmi.toFixed(1), category };
    } catch (err) {
      console.error('计算 BMI 失败:', err);
      return null;
    }
  }
});
