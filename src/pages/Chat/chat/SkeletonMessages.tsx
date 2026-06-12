export default function SkeletonMessages() {
  const shimmer =
    'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:600px_100%] animate-[shimmer_1.4s_infinite_linear]';
  const Row = ({ widths, isUser }: { widths: string[]; isUser?: boolean }) => (
    <div
      className={`flex gap-4 px-[max(24px,calc(50%-370px))] py-5 ${isUser ? 'bg-gray-50' : 'bg-white'}`}
    >
      <div className={`w-[34px] h-[34px] min-w-[34px] rounded-md shrink-0 ${shimmer}`} />
      <div className='flex-1 flex flex-col gap-2.5 pt-1.5'>
        {widths.map((w, i) => (
          <div
            key={i}
            className={`h-3.5 rounded-full ${shimmer}`}
            style={{ width: w, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
  return (
    <div className='flex-1 animate-[fadeIn_0.3s_ease]' aria-label='加载中'>
      <Row widths={['72%', '55%', '64%']} />
      <Row widths={['40%']} isUser />
      <Row widths={['80%', '60%']} />
    </div>
  );
}
