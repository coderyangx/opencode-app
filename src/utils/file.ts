/** 将 File 读取为 data URL（data:image/png;base64,...） */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
    // URL.createObjectURL(file);
  });
}

/** 格式化文件大小 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileTypeConfig {
  label: string; // 显示的类型标签，如 "XLSX"
  color: string; // Tailwind bg 色，如 "#1d6f42"
}

/** 根据文件扩展名返回类型标签和主题色 */
export function fileTypeConfig(name: string): FileTypeConfig {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, FileTypeConfig> = {
    // Office
    xlsx: { label: 'XLSX', color: '#1d6f42' }, // Excel 绿
    xls: { label: 'XLS', color: '#1d6f42' },
    csv: { label: 'CSV', color: '#1d6f42' },
    docx: { label: 'DOCX', color: '#2b579a' }, // Word 蓝
    doc: { label: 'DOC', color: '#2b579a' },
    pptx: { label: 'PPTX', color: '#d24726' }, // PPT 橙红
    ppt: { label: 'PPT', color: '#d24726' },
    // 文档
    pdf: { label: 'PDF', color: '#e03c31' }, // 红
    txt: { label: 'TXT', color: '#6b7280' }, // 灰
    md: { label: 'MD', color: '#6b7280' },
    // 代码
    py: { label: 'PY', color: '#3572a5' }, // Python 蓝
    js: { label: 'JS', color: '#f1e05a' }, // JS 黄（深色文字）
    ts: { label: 'TS', color: '#3178c6' }, // TS 蓝
    tsx: { label: 'TSX', color: '#3178c6' },
    jsx: { label: 'JSX', color: '#61dafb' },
    json: { label: 'JSON', color: '#8bc34a' },
    // 压缩
    zip: { label: 'ZIP', color: '#795548' },
    tar: { label: 'TAR', color: '#795548' },
    gz: { label: 'GZ', color: '#795548' }
  };
  const cfg = map[ext];
  if (cfg) return cfg;
  const label = ext.toUpperCase().slice(0, 4) || 'FILE';
  return { label, color: '#4b5563' };
}

/** 根据文件扩展名返回简短类型标签（向后兼容） */
export function fileTypeLabel(name: string): string {
  return fileTypeConfig(name).label;
}
