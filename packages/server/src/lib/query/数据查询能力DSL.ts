/**
 * from 选择数据表  string
 * select 选择数据列（原始列/派生列）列表  type Select = Array<{ // 选择的列名 column: string; // 别名，可以被 groupBy 引用 alias?: string; // 使用聚合函数 aggr?: 'COUNT' | 'COUNT_DISTINCT' | 'SUM' | 'AVG' | 'MAX'; // 使用列派生函数 func: [ 'DATE_FORMAT', // 第一个为函数名，目前只支持 DATE_FORMAT ...string|number // 后续为函数参数列表 ]; }>
 * where 增加筛选条件 where condition仅支持逻辑与（AND），为了DSL 结构更扁平化，优化模型推理生成效率
 * groupBy 数据分组 type GroupFields = string[]; // 元素为列名，可以是原始列，或者派生列别名
 * orderBy 结果排序 type OrderBy = Array<{ // 列名，支持原始列/派生列 column: string; // 排序方式 sort: 'ASC' | 'DESC'; }>
 * limit 限制返回数据条数 number
 * offset 取数偏移 number
 */
const QueryDSLExample = {
  // 选择数据表
  from: 'order',
  // 选择返回的数据列（包括原始列、派生列）
  select: [
    // 用法1：选择原始列
    {
      column: 'order_id',
    },
    // 用法2：选择原始列并设置别名
    {
      column: 'order_id',
      alias: 'oid',
    },
    // 用法3：列聚合
    {
      column: '*',
      aggr: 'COUNT', // 统计总条数
    },
    {
      column: 'user_id',
      aggr: 'COUNT_DISTINCT', // 统计字段去重的总数
    },
    {
      column: 'sales',
      aggr: 'SUM', // 统计总和
    },
    {
      column: 'price',
      aggr: 'AVG', // 统计字段平均值
    },
    {
      column: 'price',
      aggr: 'MAX', // 统计字段最大值
    },
    {
      column: 'price',
      aggr: 'MIN', // 统计字段最小值
    },
    {
      column: 'order_time', // 字段日期格式化
      func: ['DATE_FORMAT', 'yyyy-MM-dd'],
      alias: 'order_date',
    },
  ],
  // 筛选条件
  where: [
    // 数字字段的比较操作符 eq/ne/gt/lt/gte/lte/in
    {
      column: 'product_id',
      operator: 'eq',
      value: 123,
    },
    // 文本字段的比较操作符 eq/ne/in/startsWith/endsWith/contains
    {
      column: 'product_name',
      operator: 'in',
      value: ['Phone', 'Watch'],
    },
    {
      column: 'product_name',
      operator: 'startsWith', // 前缀模式模糊匹配
      value: '电',
    },
    // 日期字段的比较操作符gt/lt/gte/lte
    {
      column: 'order_time',
      operator: 'gt',
      value: '2025-05-01 10:00:00',
    },
    // 基础类型数组字段的比较操作符 contains
    {
      column: 'tags', // tags 可能是 ['Food', 'Electronic']
      operator: 'contains',
      value: 'Electronic',
    },
    // 字段通用 isNull, isNotNull
    {
      column: 'comment',
      operator: 'isNotNull',
    },
  ],
  // 分组
  groupBy: [
    'user_id', // 直接按原始字段分组
    'order_date', // 按派生字段分组，此派生列由select生成并提供alias
  ],
  orderBy: [
    {
      column: 'order_time', // 支持原始字段/派生字段
      sort: 'ASC', // ASC/DESC
    },
  ],
  limit: 10,
  offset: 0,
};

// 场景示例

// 求和：分析/统计 xxx的总数
// DSL
const DSL = {
  from: 'contracts',
  select: [
    {
      column: 'estimated_cash',
      aggr: 'SUM',
      alias: 'total_estimated_cash',
    },
  ],
  where: [
    {
      column: 'sign_time',
      operator: 'gte',
      value: '2025-07-08 00:00:00', // 本周开始日期
    },
    {
      column: 'sign_time',
      operator: 'lte',
      value: '2025-07-14 23:59:59', // 本周结束日期 (假设周日结束)
    },
    {
      column: 'status',
      operator: 'eq',
      value: 'signed', // 确保只统计已签约的
    },
  ],
};
// SQL
const SQL = `SELECT
    SUM(estimated_cash) AS total_estimated_cash
FROM
    contracts
WHERE
    sign_time >= '2025-07-08 00:00:00' AND sign_time <= '2025-07-14 23:59:59'
AND
    status = 'signed'`;

// 计数：分析/统计 xxx的数量
