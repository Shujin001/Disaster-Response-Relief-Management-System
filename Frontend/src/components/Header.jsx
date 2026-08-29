import { Bell, LogOut } from 'lucide-react'
import { orgInfo } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

export default function Header({ user }) {
  const { logout } = useAuth()

  return (
    <header className="flex items-center justify-between gap-4 border-b border-base-border bg-slate-400 backdrop-blur px-6 py-3.5">
      <div className="flex items-center gap-3">
       <div style={{ width: "120px", height: "120px" }}>
           <img src="/Emblem_of_Nepal.svg" alt=""/> 
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-mono tracking-wide text-brand-crimson uppercase">
            {orgInfo.country}
          </p>
          <p className="font-display font-semibold text-brand-blue text-sm">
            {orgInfo.department}
          </p>
          <p className="text-xs text-ink-muted hidden sm:block">{orgInfo.location}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {user && (
          <span className="hidden md:inline text-sm text-ink-primary">
            {user.name} <span className="text-ink-muted">· {user.role}</span>
          </span>
        )}
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-ink-secondary bg-base hover:text-ink-primary hover:bg-base-raised transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-critical" />
        </button>
        <button
          onClick={logout}
          aria-label="Log out"
          title="Log out"
          className="flex items-center gap-1.5 rounded-lg p-2 text-ink-secondary bg-base hover:text-status-critical hover:bg-base-raised transition-colors text-sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
        <div style={{ width: "48px", height: "48px", border:"1px" }}>
           <img src="/flag.gif" alt=""/> 
        </div>        
      </div>
    </header>
  )
}
