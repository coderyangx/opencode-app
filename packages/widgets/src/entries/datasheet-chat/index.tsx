import { createRoot } from 'react-dom/client';
import { Chat } from './chat';
import {
  getKuaidaMockData,
  getDataSchema,
} from '../../../../server/src/data/presets/kuaida/index-mock';
import '../../shared/global.css';

export function App() {
  const url = new URL(window.location.href);
  const query = Array.from(url.searchParams.keys()).reduce(
    (prev, curr) => {
      prev[curr] = url.searchParams.get(curr);
      return prev;
    },
    {} as Record<string, string | null>,
  );

  const data = getKuaidaMockData();
  const dataSchema = (async () => {
    const ret = await getDataSchema({} as any);
    console.log('dataSchema', ret);
    return ret;
  })();
  console.log('后端mock的数据', 'data', data);
  console.log('datasheet-chat', query);

  return <Chat {...query} />;
}

export function init() {
  createRoot(document.getElementById('root')!).render(<App />);
}
