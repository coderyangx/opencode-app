export const COLUMN_TYPE_MAP: {
  columnType: number;
  type: string;
  role: "dimension" | "metric";
  comment?: string;
}[] = [
  {
    // 多行文本/AI 列
    columnType: 1,
    type: "VARCHAR",
    role: "dimension",
  },
  {
    // 数字
    columnType: 2,
    type: "INTEGER",
    role: "metric",
  },
  {
    // 单选
    columnType: 3,
    type: "ENUM",
    role: "dimension",
  },
  {
    columnType: 4, // people
    type: "JSON",
    role: "dimension",
    comment: "A JSON array of numbers",
  },
  {
    // 多选
    columnType: 5,
    type: "ENUM",
    role: "dimension",
  },
  {
    // 附件
    columnType: 6,
    type: "VARCHAR",
    role: "dimension",
  },
  {
    // 日期
    columnType: 7,
    type: "TIMESTAMP",
    role: "dimension",
  },
  {
    // 货币
    columnType: 8,
    type: "DECIMAL",
    role: "metric",
  },
  {
    // 公式
    columnType: 9,
    type: "VARCHAR",
    role: "dimension",
  },
];
