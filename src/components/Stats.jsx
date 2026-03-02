import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import { useFastingContext } from '../hooks/useFasting';
import './Stats.scss';

const formatDuration = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Stats() {
  const { history, clearHistory } = useFastingContext();

  const totalFasts = history.length;
  const completedFasts = history.filter((r) => r.completed).length;
  const totalHours = history.reduce((sum, r) => sum + r.duration, 0) / (1000 * 60 * 60);

  const recentHistory = history.slice(0, 5);

  const handleClear = () => {
    clearHistory();
  };

  return (
    <View className='stats-container'>
      <Text className='stats-title'>统计</Text>

      <View className='stats-summary'>
        <View className='stat-item'>
          <Text className='stat-value'>{totalFasts}</Text>
          <Text className='stat-label'>总断食次数</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-value'>{completedFasts}</Text>
          <Text className='stat-label'>完成次数</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-value'>{totalHours.toFixed(1)}h</Text>
          <Text className='stat-label'>累计时长</Text>
        </View>
      </View>

      {recentHistory.length > 0 && (
        <View className='history-section'>
          <View className='history-header'>
            <View>
              <Text className='history-title'>最近记录</Text>
            </View>
            <View>
              <Button className='clear-btn' style={{ width: '100%' }} onClick={handleClear}>
                清空记录
              </Button>
            </View>
          </View>
          <View className='history-list'>
            {recentHistory.map((record, index) => (
              <View key={index} className='history-item'>
                <View className='history-info'>
                  <Text className='history-plan'>{record.plan}</Text>
                  <Text className='history-date'>{formatDate(record.startTime)}</Text>
                </View>
                <View className='history-status'>
                  <Text className='history-duration'>{formatDuration(record.duration)}</Text>
                  <Text
                    className={`history-badge ${record.completed ? 'completed' : 'incomplete'}`}
                  >
                    {record.completed ? '完成' : '中断'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {history.length === 0 && <Text className='stats-empty'>暂无断食记录</Text>}
    </View>
  );
}
