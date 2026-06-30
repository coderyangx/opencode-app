import { IRunContext } from '../../../types/context';
import { IColumnSchema, IDataAnalysisPreset, IDatabaseSchema, ITableSchema } from '../../types';

// --- Mock 数据：模拟一份销售订单数据，用于本地开发和无 Cookie 场景 ---

const SALES_COLUMNS: IColumnSchema[] = [
  {
    name: 'order_id',
    description: '订单编号',
    type: 'VARCHAR',
    role: 'dimension',
  },
  {
    name: 'product_category',
    description: '商品分类（电子产品/服装/食品/家居/图书）',
    type: 'ENUM',
    role: 'dimension',
  },
  {
    name: 'region',
    description: '销售地区（华北/华东/华南/西南/西北）',
    type: 'ENUM',
    role: 'dimension',
  },
  {
    name: 'salesperson',
    description: '销售员姓名',
    type: 'VARCHAR',
    role: 'dimension',
  },
  {
    name: 'order_date',
    description: '订单日期（时间戳，毫秒）',
    type: 'TIMESTAMP',
    role: 'dimension',
  },
  {
    name: 'quantity',
    description: '订单数量',
    type: 'INTEGER',
    role: 'metric',
  },
  {
    name: 'amount',
    description: '订单金额（元）',
    type: 'DECIMAL',
    role: 'metric',
  },
];

const CATEGORIES = ['电子产品', '服装', '食品', '家居', '图书'];
const REGIONS = ['华北', '华东', '华南', '西南', '西北'];
const SALESPEOPLE = ['张三', '李四', '王五', '赵六', '钱七', '王二麻子', '李飞机', '姜老五'];

// 生成 200 条模拟销售记录
const generateMockData = () => {
  const data: Record<string, any>[] = [];
  const baseTime = new Date('2024-01-01').getTime();
  const dayMs = 24 * 3600 * 1000;

  for (let i = 0; i < 200; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const region = REGIONS[(i * 3) % REGIONS.length];
    const salesperson = SALESPEOPLE[i % SALESPEOPLE.length];
    const quantity = Math.floor(Math.random() * 50) + 1;
    const unitPrice = Math.floor(Math.random() * 500) + 50;
    const amount = quantity * unitPrice;

    data.push({
      order_id: `ORD-${String(i + 1).padStart(4, '0')}`,
      product_category: category,
      region,
      salesperson,
      order_date: baseTime + (i % 180) * dayMs,
      quantity,
      amount,
    });
  }

  return data;
};

// 缓存生成的数据，避免每次查询重新生成
let cachedData: Record<string, any>[] | null = null;

export const getMockData = () => {
  if (!cachedData) {
    cachedData = generateMockData();
  }
  return cachedData;
};

const getDataSchema = async (ctx: IRunContext): Promise<IDatabaseSchema> => {
  const data = getMockData();
  console.log('mock的数据', ctx);

  const table: ITableSchema = {
    name: 'sales_orders',
    description: '销售订单表，包含商品分类、地区、销售员、数量和金额等信息',
    columns: SALES_COLUMNS,
    data_samples: data.slice(0, 7),
  };

  return { tables: [table] };
};

export const mockPreset: IDataAnalysisPreset = {
  id: 'mock',
  description: '本地模拟销售数据（无需 Cookie，开箱即用）',
  prompt: '',
  database_schema: getDataSchema,
  query_executor: 'mock',
};
