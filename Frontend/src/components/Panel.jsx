import * as Icons from 'lucide-react'

const toneStyles = {
  critical: 'bg-gradient-to-br from-brand-crimson to-brand-crimsondeep text-white',
  blue: 'bg-gradient-to-br from-brand-blue to-[#0A2E6E] text-white',
  warning: 'bg-gradient-to-br from-status-warning to-[#C97F0F] text-base',
  safe: 'bg-gradient-to-br from-status-safe to-[#127A3F] text-white',
  neutral: 'bg-base-surface border border-base-border text-ink-primary',
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
  const Icon = icon ? Icons[icon] : null
  const isColored = tone !== 'neutral'

  return (
    <div
      className={`rounded-xl p-5 flex flex-col shadow-panel ${toneStyles[tone]} ${
        size === 'lg' ? 'min-h-[220px]' : 'min-h-[140px]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={20} className={isColored ? 'opacity-90' : 'text-ink-secondary'} />}
          <h3
            className={`font-display font-semibold ${
              size === 'lg' ? 'text-xl' : 'text-base'
            } ${isColored ? '' : 'text-ink-primary'}`}
          >
            {title}
          </h3>
        </div>
        {action}
      </div>
      <div className={`mt-3 flex-1 ${isColored ? 'text-sm opacity-95' : 'text-ink-secondary text-sm'}`}>
        {children}
      </div>
    </div>
  )
}
