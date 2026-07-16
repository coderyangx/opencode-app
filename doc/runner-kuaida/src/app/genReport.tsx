import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import open from 'open';

const resultDir = '/Users/yangxu/Desktop/snapshot测试/snapshot/packages/runner-kuaida/src/app/result/R72';
const dataList = [];
const fstDataList = [];

const files = fs.readdirSync(resultDir);

for (const file of files) {
  if (!file.includes('.json')) continue;
  const filePath = path.join(resultDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonContent = JSON.parse(fileContent);
  // console.log('jsonContent', jsonContent);

  const data = {
    filename: file,
    maxRenderTimePerFrame: jsonContent.maxRenderTimePerFrame,
    averageFPS: jsonContent.averageFPS,
    fst: jsonContent.fst,
    fpsArray: jsonContent.fpsArray,
    parseTime: jsonContent.parseTime
    // baseLine: jsonContent.baseLine
  };
  if (filePath.includes('fst')) {
    data.baseLineFst = jsonContent.baseLine;
    fstDataList.push(data);
  } else if (filePath.includes('parseTime')) {
    data.baseLineParse = jsonContent.baseLine;
  }

  dataList.push(data);
}

generateHtml(dataList, fstDataList);

function generateHtml(dataList: any[], fstDataList: any[]) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .copy-btn { margin: 10px; padding: 5px 10px; }
        .base { background: rgb(237, 250, 244) }
      </style>
    </head>
    <body>
      <h1>性能测试报告</h1>
      <button class="copy-btn" onclick="copyTable('allTable')">复制</button>
      <table id="allTable">
        <tr>
          <th>文件名</th>
          <th>单帧最大渲染时长</th>
          <th>基准值</th>
          <th>平均FPS</th>
          <th>基准值</th>
          <th>FST</th>
          <th>基准值</th>
          <th>解析时间</th>
          <th>基准值</th>
        </tr>
        ${dataList
    .map(
      (item) => `
          <tr>
            <td>${item.filename}</td>
            <td>${item.maxRenderTimePerFrame}</td>
            <td class='base'>${item.baseLineFrame ?? '-'}</td>
            <td>${item.averageFPS}</td>
            <td class='base'>${item.baseLineFps ?? '-'}</td>
            <td>${parseInt(item.fst)}</td>
            <td class='base'>${item.baseLineFst ?? '-'}</td>
            <td>${item.parseTime || '-'}</td>
            <td class='base'>${item.baseLineParse ?? '-'}</td>
          </tr>
        `
      // <td>${item.fpsArray.map((fps: number) => fps.toFixed(2)).join('  ')}</td>
    )
    .join('')}
      </table>

      <h1>fst性能测试报告</h1>
      <button class="copy-btn" onclick="copyTable('fstTable')">复制</button>
      <table id="fstTable">
        <tr>
          <th>文件名</th>
          <th>FST</th>
          <th>基准值</th>
        </tr>
        ${fstDataList
    .map(
      (item) => `
          <tr>
            <td>${item.filename}</td>
            <td>${parseInt(item.fst)}</td>
            <td class='base'>${item.baseLineFst ?? '-'}</td>
          </tr>
        `
    )
    .join('')}
      </table>

      <script>
        function copyTable(tableId) {
          const table = document.getElementById(tableId);
          const range = document.createRange();
          range.selectNode(table);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand('copy');
          window.getSelection().removeAllRanges();
        }
      </script>
    </body>
    </html>
  `;

  const reportPath = path.join(resultDir, 'generateHtml.html');
  fs.writeFileSync(reportPath, html);

  // 自动打开生成的 HTML 文件
  open(reportPath);
}
