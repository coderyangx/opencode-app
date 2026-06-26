import { useState } from 'react';
import {
  Code2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Check,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { type ChatAddToolApproveResponseFunction, type ToolUIPart } from 'ai';

interface Props {
  toolInvocation: ToolUIPart;
  /** HITL 审批回调，approval-requested 状态下用于确认/拒绝 */
  onToolApproval?: ChatAddToolApproveResponseFunction;
}

export default function ToolInvocationPart({ toolInvocation, onToolApproval }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [showReason, setShowReason] = useState(false);

  const { state, input, output, type: toolName, approval } = toolInvocation;

  // ── 审批请求态：展开确认/拒绝卡片 ────────────────────────────────────────
  if (state === 'approval-requested' && approval) {
    const handleRespond = (approved: boolean) => {
      onToolApproval?.({
        id: approval.id,
        approved,
        reason: reason.trim() || undefined
      });
    };

    return (
      <div className='rounded-xl border-2 border-amber-400 bg-amber-50 mb-2 overflow-hidden text-[13px] shadow-sm'>
        {/* 头部：⚠️ 需要确认 */}
        <div className='flex items-center gap-2 px-3.5 py-2.5 bg-amber-100/60'>
          <ShieldAlert size={16} className='text-amber-600 shrink-0' />
          <span className='flex-1 font-semibold text-amber-800'>{toolName}</span>
          <span className='text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 animate-pulse'>
            需要确认
          </span>
        </div>

        {/* 操作内容预览 */}
        <div className='px-3.5 py-3 space-y-3'>
          {input && (
            <div>
              <div className='text-[11px] font-semibold text-amber-700/70 uppercase tracking-wider mb-1.5'>
                即将执行
              </div>
              <pre className='bg-gray-900 text-gray-100 rounded-lg p-3 text-[12px] overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all'>
                {JSON.stringify(input, null, 2)}
              </pre>
            </div>
          )}

          {/* 补充说明 / 修改意见（可选） */}
          {showReason ? (
            <div>
              <div className='text-[11px] font-semibold text-amber-700/70 uppercase tracking-wider mb-1.5'>
                补充说明 / 修改意见（可选）
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder='例如：收件人不对，改成 xxx@example.com；或说明拒绝原因…'
                rows={2}
                className='w-full rounded-lg border border-amber-300 bg-white px-2.5 py-2 text-[12.5px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 resize-none'
              />
            </div>
          ) : (
            <button
              onClick={() => setShowReason(true)}
              className='text-[11.5px] text-amber-700 hover:text-amber-900 underline underline-offset-2'
            >
              + 添加补充说明 / 修改意见
            </button>
          )}

          {/* 操作按钮 */}
          <div className='flex items-center gap-2 pt-0.5'>
            <button
              onClick={() => handleRespond(true)}
              className='flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-medium transition-colors shadow-sm'
            >
              <Check size={14} />
              确认执行
            </button>
            <button
              onClick={() => handleRespond(false)}
              className='flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-600 text-[12.5px] font-medium border border-gray-300 transition-colors'
            >
              <X size={14} />
              拒绝
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 审批已提交态 ────────────────────────────────────────────────────────
  // approved=true: 已确认，等后端 execute 返回结果（过渡态）
  // approved=false: 已拒绝，execute 不会被调用 → 这是拒绝后的最终态
  if (state === 'approval-responded' && approval) {
    // 拒绝：不可逆，显示「已取消」+ 拒绝原因
    if (!approval.approved) {
      return (
        <div className='rounded-xl border border-gray-300 bg-gray-50 mb-2 overflow-hidden text-[13px]'>
          <div className='flex items-center gap-2 px-3.5 py-2.5'>
            <X size={16} className='text-gray-400 shrink-0' />
            <span className='flex-1 font-medium text-gray-500 line-through'>{toolName}</span>
            <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500'>
              已取消
            </span>
          </div>
          {approval.reason && (
            <div className='border-t border-gray-200 px-3.5 py-2.5 text-[12px] text-gray-500'>
              <span className='font-semibold'>拒绝原因：</span>
              {approval.reason}
            </div>
          )}
        </div>
      );
    }

    // 确认：等后端执行返回
    return (
      <div className='rounded-xl border border-blue-300 bg-blue-50 mb-2 overflow-hidden text-[13px]'>
        <div className='flex items-center gap-2 px-3.5 py-2.5'>
          <Loader2 size={16} className='text-blue-500 animate-spin shrink-0' />
          <span className='flex-1 font-medium text-blue-800'>{toolName}</span>
          <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700'>
            已确认，处理中…
          </span>
        </div>
      </div>
    );
  }

  // ── 错误态 ──────────────────────────────────────────────────────────────
  if (state === 'output-error') {
    const errorText = toolInvocation.errorText;
    return (
      <div className='rounded-xl border border-red-300 bg-red-50 mb-2 overflow-hidden text-[13px]'>
        <div className='flex items-center gap-2 px-3.5 py-2.5'>
          <AlertCircle size={16} className='text-red-500 shrink-0' />
          <span className='flex-1 font-medium text-red-800'>{toolName}</span>
          <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600'>
            出错
          </span>
        </div>
        {open && errorText && (
          <div className='border-t border-red-200 px-3.5 py-3'>
            <pre className='bg-gray-900 text-red-200 rounded-lg p-3 text-[12px] overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all'>
              {errorText}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // ── 输入流式 / 执行中 / 完成（保留原有折叠卡片样式） ─────────────────────
  // input-streaming: 工具入参还在流式生成
  // input-available: 入参完整，服务端执行中（非 approval 工具）
  // output-available: 执行完成（approval 工具到这说明已确认并执行完毕）
  const isDone = state === 'output-available';
  const isStreaming = state === 'input-streaming';
  const wasApproved = isDone && approval?.approved === true;

  const badgeText = isStreaming
    ? '准备中…'
    : isDone
      ? wasApproved
        ? '已确认'
        : '完成'
      : '执行中…';

  const iconClass = isDone ? 'text-[#10b981]' : 'text-amber-600';
  const borderClass = isDone ? 'border-[#10b981] bg-emerald-50' : 'border-amber-300 bg-amber-50';
  const badgeClass = isDone ? 'bg-emerald-100 text-[#059669]' : 'bg-amber-100 text-amber-700';

  return (
    <div className={`rounded-xl border mb-2 overflow-hidden text-[13px] ${borderClass}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2 w-full px-3.5 py-2.5 text-left hover:brightness-95 transition-all'
      >
        <Code2 size={16} className={iconClass} />
        <span className='flex-1 font-medium text-gray-800'>{toolName}</span>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {badgeText}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className='border-t border-current/10 px-3.5 py-3 space-y-3'>
          {input && (
            <div>
              <div className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
                输入
              </div>
              <pre className='bg-gray-900 text-gray-100 rounded-lg p-3 text-[12px] overflow-x-auto leading-relaxed font-mono'>
                {JSON.stringify(input, null, 2)}
              </pre>
            </div>
          )}
          {isDone && output !== undefined && (
            <div>
              <div className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
                输出
              </div>
              <pre className='bg-gray-900 text-gray-100 rounded-lg p-3 text-[12px] overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all'>
                {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
