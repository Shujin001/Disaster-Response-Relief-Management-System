import * as Icons from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

// In dark mode, tone="critical"/"blue"/"warning"/"safe" render as a vivid
// gradient "hero" card — that's the original design and reads fine against
// a dark page. In light mode the same vivid gradient reads as a jarring,
// oversaturated block sitting on an otherwise clean white page, so instead
// we fall back to the same neutral card as tone="neutral" plus a colored
// left accent border and colored icon — enough to keep the severity/meaning
// visible without the whole box being colored.
const GRADIENT_TONE = {
  critical: 'bg-gradient-to-br from-brand-crimson to-brand-crimsondeep text-white',
  blue: 'bg-gradient-to-br from-brand-blue to-[#0A2E6E] text-white',
  warning: 'bg-gradient-to-br from-status-warning to-[#C97F0F] text-base',
  safe: 'bg-gradient-to-br from-status-safe to-[#127A3F] text-white',
}

const ACCENT_BORDER = {
  critical: 'border-l-status-critical',
  blue: 'border-l-brand-blueLight',
  warning: 'border-l-status-warning',
  safe: 'border-l-status-safe',
}

const ACCENT_ICON = {
  critical: 'text-status-critical',
  blue: 'text-brand-blueLight',
  warning: 'text-status-warning',
  safe: 'text-status-safe',
}

export default function Panel({
  title,
  icon,
  tone = 'neutral',
  size = 'md',
  action,
  children,
  className = '',
}) {
  const { theme } = useTheme()
  const Icon = icon ? Icons[icon] : null
  const isColoredTone = tone !== 'neutral'
  const useVividBg = isColoredTone && theme !== 'light'

  const containerClass = useVividBg
    ? GRADIENT_TONE[tone]
    : isColoredTone
    ? `bg-base-surface border border-base-border border-l-4 ${ACCENT_BORDER[tone]} text-ink-primary`
    : 'bg-base-surface border border-base-border text-ink-primary'

  const iconClass = useVividBg ? 'opacity-90' : isColoredTone ? ACCENT_ICON[tone] : 'text-ink-secondary'
  const titleClass = useVividBg ? '' : 'text-ink-primary'
  const bodyClass = useVividBg ? 'text-sm opacity-95' : 'text-ink-secondary text-sm'

  return (
    <div
      className={`rounded-xl p-5 flex flex-col shadow-panel ${containerClass} ${
        size === 'lg' ? 'min-h-[220px]' : 'min-h-[140px]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={20} className={iconClass} />}
          <h3 className={`font-display font-semibold ${size === 'lg' ? 'text-xl' : 'text-base'} ${titleClass}`}>
            {title}
          </h3>
        </div>
        {action}
      </div>
      <div className={`mt-3 flex-1 ${bodyClass}`}>{children}</div>
    </div>
  )
}
