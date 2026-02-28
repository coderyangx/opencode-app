const STORAGE_KEY = 'fasting_data';

const DEFAULT_DATA = {
  currentPlan: '16:8',
  isFasting: false,
  fastingStartTime: null,
  fastingEndTime: null,
  history: [],
};

export const getStorageData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return DEFAULT_DATA;
};

export const saveStorageData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addHistoryRecord = (record) => {
  const data = getStorageData();
  data.history.unshift(record);
  if (data.history.length > 100) {
    data.history = data.history.slice(0, 100);
  }
  saveStorageData(data);
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
