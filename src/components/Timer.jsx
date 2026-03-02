import React, { useCallback } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useFastingContext } from '../hooks/useFasting'
import { requestPermission } from '../utils/notifications'
import ProgressRing from './ProgressRing'
import './Timer.scss'

const formatTime = (ms) => {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function Timer() {
  const { isFasting, currentPlan, planConfig, progress, remainingTime, startFasting, endFasting } =
    useFastingContext()

  const handleStartFasting = useCallback(async () => {
    await requestPermission()
    startFasting()
  }, [startFasting])

  const handleStartFastingCallback = (fn) => {
    return function() {
      fn()
    }
  }

  return (
    <View className='timer-container'>
      <ProgressRing progress={progress} size={320}>
        <Text className='timer-status'>{isFasting ? '断食中' : '进食中'}</Text>
        <Text className='timer-time'>
          {isFasting
            ? formatTime(remainingTime)
            : formatTime(planConfig.eatingHours * 60 * 60 * 1000)}
        </Text>
        <Text className='timer-plan'>{currentPlan}</Text>
      </ProgressRing>

      <Button
        className={`timer-button ${isFasting ? 'stop' : 'start'}`}
        onClick={isFasting ? endFasting : handleStartFasting}
      >
        {isFasting ? '结束断食' : '开始断食'}
      </Button>

      <Text className='timer-hint'>
        {isFasting
          ? `还需断食 ${formatTime(remainingTime)}`
          : `断食 ${planConfig.fastingHours} 小时，进食 ${planConfig.eatingHours} 小时`}
      </Text>
    </View>
  )
}
