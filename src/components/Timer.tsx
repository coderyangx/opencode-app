import { useCallback } from 'react';
import { useFastingContext } from '../hooks/useFasting';
import { requestPermission } from '../utils/notifications';
import ProgressRing from './ProgressRing';
import './Timer.css';

const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function Timer() {
  const { isFasting, currentPlan, planConfig, progress, remainingTime, startFasting, endFasting } = useFastingContext();

  const handleStartFasting = useCallback(async () => {
    await requestPermission();
    startFasting();
  }, [startFasting]);

  return (
    <div className='timer-container'>
      <ProgressRing progress={progress} size={220} strokeWidth={14}>
        <span className='timer-status'>{isFasting ? '断食中' : '进食中'}</span>
        <span className='timer-time'>
          {isFasting ? formatTime(remainingTime) : formatTime(planConfig.eatingHours * 60 * 60 * 1000)}
        </span>
        <span className='timer-plan'>{currentPlan}</span>
      </ProgressRing>

      <button
        className={`timer-button ${isFasting ? 'stop' : 'start'}`}
        onClick={isFasting ? endFasting : handleStartFasting}
      >
        {isFasting ? '结束断食' : '开始断食'}
      </button>

      <p className='timer-hint'>
        {isFasting
          ? `还需断食 ${formatTime(remainingTime)}`
          : `断食 ${planConfig.fastingHours} 小时，进食 ${planConfig.eatingHours} 小时`}
      </p>
    </div>
  );
}
