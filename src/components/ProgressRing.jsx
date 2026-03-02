import React from 'react';
import { View, Text } from '@tarojs/components';
import './ProgressRing.scss';

export default function ProgressRing({ progress = 0, size = 280, children }) {
  const width = progress > 0 ? progress + '%' : 0;
  const progressPercent = progress > 0 ? progress.toFixed(2) + '%' : '0%';

  return (
    <View className='progress-ring-wrapper'>
      <View className='progress-ring-circle'>
        <View className='progress-ring-content'>{children}</View>
      </View>
      <View className='progress-bar'>
        <View
          className={`progress-bar-fill ${progress >= 100 ? 'completed' : ''}`}
          style={{ width }}
        />
      </View>
      <Text className='progress-text'>{progressPercent}</Text>
    </View>
  );
}
