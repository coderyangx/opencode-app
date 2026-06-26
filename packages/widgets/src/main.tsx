import { createRoot } from 'react-dom/client';
import { App as DeepAnalysisApp } from './entries/deep-analysis';
import { App as DatasheetChatApp } from './entries/datasheet-chat';

// 通过 URL 参数 ?app=datasheet 切换到 V1 HTTP 版本，默认使用 V2 WebSocket 版本
const url = new URL(window.location.href);
const useV2 = url.searchParams.get('app') === 'deepApp';

createRoot(document.getElementById('root')!).render(
  useV2 ? <DeepAnalysisApp /> : <DatasheetChatApp />,
);
