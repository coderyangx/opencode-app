export default function TypingIndicator() {
  return (
    <div className='px-[max(24px,calc(50%-380px))]'>
      <div className='flex gap-3 items-start'>
        {/* 与 MessageBubble AI 消息完全一致的小圆点标识，避免切换时突变 */}
        <div className='w-5 h-5 mt-0.5 rounded-full bg-linear-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-[10px] shrink-0 shadow-sm'>
          ✦
        </div>
        {/* 跳动圆点 */}
        <div className='flex items-center gap-1.5 h-5 mt-0.5'>
          {[0, 200, 400].map((delay) => (
            <span
              key={delay}
              className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-[typing-bounce_1.2s_ease-in-out_infinite]'
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
