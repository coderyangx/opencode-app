import { useFastingContext } from '../hooks/useFasting';
import './Stats.css';

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
    minute: '2-digit'
  });
};

export default function Stats() {
  const { history, clearHistory } = useFastingContext();

  const totalFasts = history.length;
  const completedFasts = history.filter((r) => r.completed).length;
  const totalHours = history.reduce((sum, r) => sum + r.duration, 0) / (1000 * 60 * 60);

  const recentHistory = history.slice(0, 5);

  return (
    <div className='stats-container'>
      <h3 className='stats-title'>统计</h3>

      <div className='stats-summary'>
        <div className='stat-item'>
          <span className='stat-value'>{totalFasts}</span>
          <span className='stat-label'>总断食次数</span>
        </div>
        <div className='stat-item'>
          <span className='stat-value'>{completedFasts}</span>
          <span className='stat-label'>完成次数</span>
        </div>
        <div className='stat-item'>
          <span className='stat-value'>{totalHours.toFixed(1)}h</span>
          <span className='stat-label'>累计时长</span>
        </div>
      </div>

      {recentHistory.length > 0 && (
        <div className='history-section'>
          <div className='history-title-row'>
            <h4 className='history-title'>最近记录</h4>
            <button className='clear-btn' onClick={() => clearHistory()}>
              清空记录
            </button>
          </div>
          <ul className='history-list'>
            {recentHistory.map((record, index) => (
              <li key={index} className='history-item'>
                <div className='history-info'>
                  <span className='history-plan'>{record.plan}</span>
                  <span className='history-date'>{formatDate(record.startTime)}</span>
                </div>
                <div className='history-status'>
                  <span className='history-duration'>{formatDuration(record.duration)}</span>
                  <span className={`history-badge ${record.completed ? 'completed' : 'incomplete'}`}>
                    {record.completed ? '完成' : '中断'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {history.length === 0 && <p className='stats-empty'>暂无断食记录</p>}
    </div>
  );
}
