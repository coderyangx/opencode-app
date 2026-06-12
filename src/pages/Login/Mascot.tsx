/* 机器人吉祥物 */
export interface MascotProps {
  hideEyes?: boolean;
  className?: string;
}

export default function Mascot({ hideEyes = false, className }: MascotProps) {
  return (
    <div
      className={`mascot-wrapper${hideEyes ? ' hide-eyes' : ''}${className ? ` ${className}` : ''}`}
    >
      <svg
        className='mascot-svg'
        viewBox='0 0 100 108'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
      >
        <defs>
          {/* 头部金属渐变 - 清爽银灰色 */}
          <linearGradient id='headGrad' x1='20%' y1='0%' x2='80%' y2='100%'>
            <stop offset='0%' stopColor='#dce8e4' />
            <stop offset='50%' stopColor='#c8ddd8' />
            <stop offset='100%' stopColor='#b8d0ca' />
          </linearGradient>
          {/* 面板渐变（稍暗） */}
          <linearGradient id='panelGrad' x1='30%' y1='0%' x2='70%' y2='100%'>
            <stop offset='0%' stopColor='#cfe0db' />
            <stop offset='100%' stopColor='#baced8' />
          </linearGradient>
          {/* 眼睛屏幕发光渐变 */}
          <radialGradient id='eyeGlow' cx='50%' cy='40%' r='60%'>
            <stop offset='0%' stopColor='#6ee7b7' />
            <stop offset='100%' stopColor='#059669' />
          </radialGradient>
          {/* 天线顶部发光 */}
          <radialGradient id='antennaGlow' cx='50%' cy='50%' r='50%'>
            <stop offset='0%' stopColor='#34d399' />
            <stop offset='100%' stopColor='#10b981' />
          </radialGradient>
        </defs>

        {/* 天线 */}
        <line
          x1='50'
          y1='6'
          x2='50'
          y2='18'
          stroke='#10b981'
          strokeWidth='2.5'
          strokeLinecap='round'
        />
        <circle cx='50' cy='5' r='4' fill='url(#antennaGlow)' />
        {/* 天线光晕 */}
        <circle
          cx='50'
          cy='5'
          r='6'
          fill='none'
          stroke='rgba(16,185,129,0.3)'
          strokeWidth='1.5'
          className='mascot-antenna-ring'
        />

        {/* 头部主体（圆角矩形） */}
        <rect x='8' y='16' width='84' height='78' rx='20' ry='20' fill='url(#headGrad)' />
        {/* 高光边框 */}
        <rect
          x='8'
          y='16'
          width='84'
          height='78'
          rx='20'
          ry='20'
          fill='none'
          stroke='rgba(16,185,129,0.35)'
          strokeWidth='1.5'
        />
        {/* 顶部高光条 */}
        <rect x='20' y='17' width='60' height='4' rx='2' fill='rgba(255,255,255,0.5)' />

        {/* 面板区域（稍亮的内嵌矩形） */}
        <rect x='16' y='28' width='68' height='56' rx='12' ry='12' fill='url(#panelGrad)' />

        {/* ── 睁眼：矩形屏幕眼睛 ── */}
        <g className='mascot-eyes'>
          {/* 左眼框 */}
          <rect x='22' y='36' width='24' height='18' rx='5' fill='#8bbdb5' />
          {/* 左眼屏幕发光 */}
          <rect
            className='mascot-pupil-left'
            x='24'
            y='38'
            width='20'
            height='14'
            rx='3.5'
            fill='url(#eyeGlow)'
            opacity='0.9'
          />
          {/* 左眼高光 */}
          <rect x='25.5' y='39.5' width='7' height='4' rx='2' fill='rgba(255,255,255,0.35)' />
          {/* 左眼扫描线 */}
          <line x1='24' y1='44' x2='44' y2='44' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
          <line x1='24' y1='47' x2='44' y2='47' stroke='rgba(0,0,0,0.15)' strokeWidth='0.8' />

          {/* 右眼框 */}
          <rect x='54' y='36' width='24' height='18' rx='5' fill='#8bbdb5' />
          {/* 右眼屏幕发光 */}
          <rect
            className='mascot-pupil-right'
            x='56'
            y='38'
            width='20'
            height='14'
            rx='3.5'
            fill='url(#eyeGlow)'
            opacity='0.9'
          />
          {/* 右眼高光 */}
          <rect x='57.5' y='39.5' width='7' height='4' rx='2' fill='rgba(255,255,255,0.35)' />
          {/* 右眼扫描线 */}
          <line x1='56' y1='44' x2='76' y2='44' stroke='rgba(0,0,0,0.2)' strokeWidth='1' />
          <line x1='56' y1='47' x2='76' y2='47' stroke='rgba(0,0,0,0.15)' strokeWidth='0.8' />
        </g>

        {/* ── 休眠：横线眼睛 ── */}
        <g className='mascot-eyes-closed'>
          {/* 左眼框（保持） */}
          <rect x='22' y='36' width='24' height='18' rx='5' fill='#8bbdb5' />
          <line
            x1='26'
            y1='45'
            x2='42'
            y2='45'
            stroke='#10b981'
            strokeWidth='3'
            strokeLinecap='round'
          />
          {/* 右眼框（保持） */}
          <rect x='54' y='36' width='24' height='18' rx='5' fill='#8bbdb5' />
          <line
            x1='58'
            y1='45'
            x2='74'
            y2='45'
            stroke='#10b981'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </g>

        {/* 鼻子指示灯 */}
        <circle cx='50' cy='60' r='3' fill='#10b981' className='mascot-nose-led' />
        <circle cx='50' cy='60' r='5' fill='none' stroke='rgba(16,185,129,0.3)' strokeWidth='1' />

        {/* 腮红 */}
        <ellipse cx='26' cy='67' rx='7' ry='4' fill='rgba(251,113,133,0.22)' />
        <ellipse cx='74' cy='67' rx='7' ry='4' fill='rgba(251,113,133,0.22)' />

        {/* 嘴部：圆角微笑 */}
        <rect
          x='26'
          y='70'
          width='48'
          height='16'
          rx='8'
          fill='rgba(255,255,255,0.18)'
          stroke='rgba(16,185,129,0.25)'
          strokeWidth='1'
        />
        {/* 微笑弧线 */}
        <path
          className='mascot-mouth'
          d='M33 75 Q50 84 67 75'
          fill='none'
          stroke='#10b981'
          strokeWidth='2.5'
          strokeLinecap='round'
        />
        {/* 嘴角小圆点 */}
        <circle cx='33' cy='75' r='1.5' fill='#34d399' />
        <circle cx='67' cy='75' r='1.5' fill='#34d399' />

        {/* 侧面耳朵/散热片 */}
        <rect
          x='3'
          y='40'
          width='7'
          height='5'
          rx='2'
          fill='#b5d4ce'
          stroke='rgba(16,185,129,0.4)'
          strokeWidth='1'
        />
        <rect
          x='3'
          y='48'
          width='7'
          height='5'
          rx='2'
          fill='#b5d4ce'
          stroke='rgba(16,185,129,0.4)'
          strokeWidth='1'
        />
        <rect
          x='90'
          y='40'
          width='7'
          height='5'
          rx='2'
          fill='#b5d4ce'
          stroke='rgba(16,185,129,0.4)'
          strokeWidth='1'
        />
        <rect
          x='90'
          y='48'
          width='7'
          height='5'
          rx='2'
          fill='#b5d4ce'
          stroke='rgba(16,185,129,0.4)'
          strokeWidth='1'
        />
      </svg>
    </div>
  );
}
