/**
 * src/components/ui/Icons.tsx
 *
 * 统一管理图标导出。
 * 通用图标直接从 lucide-react re-export，保持对外接口不变。
 * 仅保留无法用 lucide 替代的自定义 SVG（AppLogoIcon、PinIcon）。
 */

// ─────────────────────────────────────────────────────────────────────────────
// lucide-react re-exports（对外接口保持不变）
// ─────────────────────────────────────────────────────────────────────────────
export {
  PanelLeft as PanelIcon,
  SquarePen as ComposeIcon,
  Search as SearchIcon,
  X as CloseIcon,
  User as UserIcon,
  Settings as SettingIcon,
  LogOut as LogoutIcon,
  ChevronsUpDown as ChevronUpDownIcon,
  ChevronDown as ChevronDownIcon
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// App Logo 星形（Sidebar AppLogo 内部 + WelcomeScreen）
// lucide 无等价，保留自定义实现
// ─────────────────────────────────────────────────────────────────────────────
export function AppLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
    </svg>
  );
}
