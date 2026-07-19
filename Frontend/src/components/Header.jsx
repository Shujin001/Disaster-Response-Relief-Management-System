import { Bell, ChevronDown } from 'lucide-react'
import { orgInfo } from '../data/mockData'

export default function Header({ user }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-base-border bg-base-surface/80 backdrop-blur px-6 py-3.5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-crimson to-brand-crimsondeep flex items-center justify-center font-display font-semibold text-sm shadow-panel shrink-0">
          NP
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-mono tracking-wide text-brand-crimson uppercase">
            {orgInfo.country}
          </p>
          <p className="font-display font-semibold text-ink-primary text-sm sm:text-base">
            {orgInfo.department}
          </p>
          <p className="text-xs text-ink-muted hidden sm:block">{orgInfo.location}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-ink-secondary hover:text-ink-primary hover:bg-base-raised transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-critical" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-base-border">
          <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center text-xs font-display font-semibold">
            {user.initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-ink-primary">{user.name}</p>
            <p className="text-xs text-ink-muted">{user.role}</p>
          </div>
          <ChevronDown size={14} className="text-ink-muted ml-1" />
        </div>
      </div>
    </header>
  )
}
