import { getKuaidaMockData } from './src/data/presets/kuaida/index-mock.js';

const data = getKuaidaMockData();
console.log('Total records:', data.length);
console.log('First record (formatted):');
console.log(JSON.stringify(data[0], null, 2));
console.log('---');
console.log('Sample values:');
console.log(
  'select_dd4c38eb (项目等级):',
  [...new Set(data.map((r) => r.select_dd4c38eb))].filter(Boolean),
);
console.log(
  'select_2a4f18cd (项目状态):',
  [...new Set(data.map((r) => r.select_2a4f18cd))].filter(Boolean),
);
console.log(
  'people_b9e25f8f (负责人) sample:',
  [...new Set(data.map((r) => r.people_b9e25f8f))].filter(Boolean).slice(0, 5),
);
