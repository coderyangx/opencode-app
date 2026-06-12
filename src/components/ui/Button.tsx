/**
 * src/components/ui/Button.tsx
 * 通用按钮组件集，统一 Chat 页面所有按钮风格，消除 className 字符串重复。
 *
 * 导出：
 *   IconButton   — 正方形图标按钮（w-7~w-9，只含图标）
 *   TextButton   — 全宽文字+图标行按钮（侧边栏导航、菜单项）
 *   ActionButton — 普通文字按钮（对话框 footer 的取消/确认）
 */

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// IconButton
type IconButtonVariant = 'ghost' | 'primary' | 'danger' | 'active';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 视觉变体 */
  variant?: IconButtonVariant;
  /** 尺寸：sm=w-7h-7, md=w-8h-8(默认), lg=w-9h-9 */
  size?: IconButtonSize;
  /** 强制激活高亮（绿色背景） */
  active?: boolean;
  children: React.ReactNode;
}

const sizeMap: Record<IconButtonSize, string> = {
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-9 h-9'
};

const variantMap: Record<IconButtonVariant, string> = {
  ghost:
    'text-gray-400 hover:bg-gray-100 hover:text-[#10b981] disabled:opacity-30 disabled:cursor-not-allowed',
  primary:
    'bg-[#10b981] hover:bg-[#059669] text-white shadow-sm shadow-emerald-200 hover:scale-105 active:scale-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  active: 'bg-[rgba(16,185,129,0.12)] text-[#059669]'
};

export function IconButton({
  variant = 'ghost',
  size = 'md',
  active = false,
  className = '',
  children,
  ...rest
}: IconButtonProps) {
  const effectiveVariant = active ? 'active' : variant;
  return (
    <button
      type='button'
      className={[
        'flex items-center justify-center rounded-lg transition-all shrink-0 cursor-pointer',
        sizeMap[size],
        variantMap[effectiveVariant],
        className
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TextButton
interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 危险操作（红色文字） */
  danger?: boolean;
  children: React.ReactNode;
}

export function TextButton({
  icon,
  danger = false,
  disabled,
  className = '',
  children,
  ...rest
}: TextButtonProps) {
  return (
    <button
      type='button'
      disabled={disabled}
      className={[
        'w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm text-left transition-colors cursor-pointer',
        danger
          ? 'text-[#dc2626] hover:bg-red-50'
          : disabled
            ? 'text-[#9ca3af] cursor-not-allowed!'
            : 'hover:bg-[#f4f4f4]',
        className
      ].join(' ')}
      {...rest}
    >
      {icon && <span className='shrink-0'>{icon}</span>}
      {children}
    </button>
  );
}

// ActionButton
type ActionButtonVariant = 'default' | 'primary' | 'danger';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const actionVariantMap: Record<ActionButtonVariant, string> = {
  default: 'bg-white border border-[#e5e7eb] text-[#374151] hover:bg-gray-50 hover:border-gray-300',
  primary:
    'bg-[#10b981] border border-[#10b981] text-white hover:bg-[#059669] hover:border-[#059669] disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400',
  danger: 'bg-red-500 border border-red-500 text-white hover:bg-red-600 hover:border-red-600'
};

export function ActionButton({
  variant = 'default',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type='button'
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer',
        actionVariantMap[variant],
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading && (
        <span className='w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin' />
      )}
      {children}
    </button>
  );
}
