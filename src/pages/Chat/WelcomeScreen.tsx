const SUGGESTIONS = [
  '帮我写一段 TypeScript 工具函数，支持深拷贝对象',
  '解释 React useEffect 的依赖数组工作原理',
  '给我一个 SQL 慢查询优化的排查思路',
  '用 Hono 写一个带 JWT 鉴权的 API 路由'
];

export default function WelcomeScreen({ onSuggest }: { onSuggest?: (text: string) => void }) {
  return (
    <div className='flex flex-col items-center justify-center flex-1 px-6 py-16 text-center animate-fade-in-up'>
      {/* Logo */}
      <div className='w-14 h-14 rounded-2xl bg-linear-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-2xl text-white shadow-lg shadow-emerald-200 mb-5 animate-float'>
        ✦
      </div>

      <h2 className='text-2xl font-bold text-gray-900 mb-2 tracking-tight'>有什么可以帮您？</h2>
      <p className='text-[15px] text-gray-500 mb-9'>
        AI 助手，随时为您解答问题、编写代码、分析数据
      </p>

      {/* 建议词卡片 */}
      <div className='grid grid-cols-2 gap-2.5 w-full max-w-[560px]'>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest?.(s)}
            className='px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-700 text-left leading-snug transition-all hover:border-[#10b981] hover:bg-emerald-50 hover:text-emerald-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-100 active:translate-y-0'
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
