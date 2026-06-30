import { ToolCacheManager } from '../../../lib/cache/tool.js';
import { formFetch } from '../../../lib/request/form.js';
import { IRunContext } from '../../../types/context';
import { IColumnSchema, IDataAnalysisPreset, IDatabaseSchema } from '../../types';

const cacheManager = new ToolCacheManager({
  ttl: 1000 * 60 * 10,
});

// ---
const SYSTEM_FIELDS: IColumnSchema[] = [
  {
    name: 'SYSTEM_CREATOR',
    description: '创建人',
    type: 'VARCHAR',
    role: 'dimension',
  },
  {
    name: 'SYSTEM_DATE_CREATED',
    description: '创建时间',
    type: 'TIMESTAMP',
    role: 'dimension',
  },
];

const columnsFormatter: Array<{
  reg: RegExp;
  format: (data: { id: string; props: Record<string, any> }) => IColumnSchema;
}> = [
  {
    reg: /^number_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'INTEGER',
        description: props?.label || '',
        role: 'metric',
      };
    },
  },
  {
    reg: /^select_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'ENUM',
        enum_values: (props.options || []).filter(Boolean).map((item) => item.label),
        description: props?.label || '',
        role: 'dimension',
      };
    },
  },
  {
    reg: /^selectdd_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'JSON',
        description: props?.label || '',
        comment: `ENUM ARRAY, available enums is: ${JSON.stringify(
          (props?.options || []).map((item) => item.label),
        )}`,
        role: 'dimension',
      };
    },
  },
  {
    reg: /^people_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'VARCHAR',
        description: props?.label || '',
        role: 'dimension',
      };
    },
  },
  {
    reg: /^date_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'TIMESTAMP',
        description: props?.label || '',
        role: 'dimension',
      };
    },
  },
  {
    reg: /^textarea_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'TEXT',
        description: props?.label || '',
        role: 'dimension',
      };
    },
  },
  {
    reg: /^money_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'DECIMAL',
        description: props?.label || '',
        role: 'metric',
      };
    },
  },
  {
    reg: /^department_/i,
    format: ({ id, props }) => {
      return {
        name: id,
        type: 'VARCHAR',
        description: props?.label || '',
        role: 'dimension',
      };
    },
  },
];

const getDataSchema = async (ctx: IRunContext): Promise<IDatabaseSchema> => {
  const cacheKey = {
    view: ctx.view,
  };
  const cache = cacheManager.get(cacheKey);
  let results;
  if (typeof cache !== 'undefined') {
    results = cache;
  } else {
    const result = await formFetch(ctx).get<{
      name: string;
      schema: string;
      showFields: string[];
    }>(`/api/zeroconsole/view/showInfo/${ctx.view}`);
    const { name, schema, showFields } = result;
    const schemaObj = JSON.parse(schema);
    const fields = [...SYSTEM_FIELDS];
    const walk = (field: any) => {
      if (!field) {
        return;
      }
      if (field.parentInstanceKey) {
        const formatter = columnsFormatter.find((item) => item.reg.test(field.id));
        if (formatter) {
          // 如果需要格式化就格式化输出，增加更多字段信息
          fields.push(formatter.format(field));
          // 单多选还有 enum_value：即 options选项：
          // [
          //   { label: 'S', value: 'select05yp5obzmo9m', color: '#E8F1FF' },
          //   { label: 'A', value: 'select0ny2v3brm7s', color: '#FFF2F0' },
          //   { label: 'B', value: 'select02291l5ll2bo', color: '#E6FAF8' },
          //   { label: 'C', value: 'select0zmnrxcoexqd', color: '#FFF9DE' },
          // ];
        } else {
          fields.push({
            name: field.id, // 字段id："select_dd4c38eb"
            description: field.props?.label || '', // 项目等级
            type: 'VARCHAR',
            role: 'dimension',
          });
        }
      }
      if (field.children) {
        field.children.forEach(walk);
      }
    };

    walk(schemaObj.pages[0].layout);

    results = {
      name: ctx.view, // view
      description: name, // "项目信息管理_仿CLC"
      columns: showFields // 列信息：转换成name、description、type、role结构
        .map((item) => fields.find((field) => field.name === item))
        .filter(Boolean),
    };

    cacheManager.set(cacheKey, results);
  }

  return {
    tables: [results],
  };
};

// ---
export const kuaidaPreset: IDataAnalysisPreset = {
  id: 'kuaida',
  description: '快搭表单数据列表',
  prompt: '',
  database_schema: getDataSchema,
  query_executor: 'kuaida',
};
