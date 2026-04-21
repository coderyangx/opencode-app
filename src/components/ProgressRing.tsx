import './ProgressRing.css';

export default function ProgressRing({ progress, size = 200, strokeWidth = 12, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className='progress-ring-container'>
      <svg width={size} height={size} className='progress-ring'>
        <circle className='progress-ring-bg' strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
        <circle
          className='progress-ring-progress'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <div className='progress-ring-content'>{children}</div>
    </div>
  );
}
