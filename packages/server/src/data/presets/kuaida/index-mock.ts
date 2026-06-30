import { IRunContext } from '../../../types/context';
import { IColumnSchema, IDataAnalysisPreset, IDatabaseSchema, ITableSchema } from '../../types';
import { dataList } from './list.js';
import { formatDataRow } from '../../executors/kuaida/formatter.js';

// --- Kuaida Mock 数据：基于真实快搭表单数据，格式化为标准结构，用于本地测试 ---

// 系统字段
const SYSTEM_COLUMNS: IColumnSchema[] = [
  {
    name: 'SYSTEM_CREATOR',
    description: '创建人',
    type: 'VARCHAR',
    role: 'dimension',
  },
  {
    name: 'SYSTEM_DATE_CREATED',
    description: '创建时间（时间戳，毫秒）',
    type: 'TIMESTAMP',
    role: 'dimension',
  },
];

// 业务字段（基于快搭表单字段 ID 定义）
const BUSINESS_COLUMNS: IColumnSchema[] = [
  {
    name: 'select_dd4c38eb',
    description: '项目等级（S/A/B/C）',
    type: 'ENUM',
    role: 'dimension',
  },
  {
    name: 'select_2a4f18cd',
    description: '项目状态（立项中/进行中/已完成/已取消）',
    type: 'ENUM',
    role: 'dimension',
  },
  {
    name: 'input_73a6744d',
    description: '项目目标',
    type: 'VARCHAR',
    role: 'dimension',
  },
  {
    name: 'input_ba0c62d5',
    description: '项目领域',
    type: 'VARCHAR',
    role: 'dimension',
  },
  {
    name: 'people_b9e25f8f',
    description: '项目负责人',
    type: 'VARCHAR',
    role: 'dimension',
  },
  {
    name: 'date_264f174a',
    description: '计划完成日期（时间戳，毫秒）',
    type: 'TIMESTAMP',
    role: 'dimension',
  },
  {
    name: 'date_082d9123',
    description: '实际完成日期（时间戳，毫秒）',
    type: 'TIMESTAMP',
    role: 'dimension',
  },
  {
    name: 'date_9e37d3a0',
    description: '项目开始日期（时间戳，毫秒）',
    type: 'TIMESTAMP',
    role: 'dimension',
  },
];

// 将快搭原始数据格式化为标准扁平结构
const getFormattedData = () => {
  return dataList.map((item) => {
    const flatRow = formatDataRow({
      id: item.id,
      ...item.fields,
      SYSTEM_CREATOR: item.submitter,
      SYSTEM_DATE_CREATED: item.submitTime,
    });
    return flatRow;
  });
};

// 缓存格式化后的数据
let cachedData: Record<string, any>[] | null = null;

export const getKuaidaMockData = () => {
  if (!cachedData) {
    cachedData = getFormattedData();
  }
  return cachedData;
};

export const getDataSchema = async (_ctx: IRunContext): Promise<IDatabaseSchema> => {
  const data = getKuaidaMockData();

  const table: ITableSchema = {
    name: 'kuaida_projects',
    description: '快搭项目信息表，包含项目等级、状态、目标、领域、负责人、日期等信息',
    columns: [...BUSINESS_COLUMNS, ...SYSTEM_COLUMNS],
    data_samples: data.slice(0, 20),
  };

  return { tables: [table] };
};

export const kuaidaMockPreset: IDataAnalysisPreset = {
  id: 'kuaida-mock',
  description: '本地快搭模拟数据（基于真实表单数据格式化，无需 Cookie）',
  prompt: '',
  database_schema: getDataSchema,
  query_executor: 'kuaida-mock',
};
