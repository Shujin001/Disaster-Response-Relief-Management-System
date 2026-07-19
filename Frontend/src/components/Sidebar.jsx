import * as Icons from 'lucide-react'
import { useState } from 'react'
import { Bell, PanelLeftClose, PanelLeftOpen, ChevronDown } from 'lucide-react'
import { orgInfo } from '../data/mockData'


export default function Sidebar({ items, activeIndex = 0, onSelect, accent = 'crimson', user}) {
  const [collapsed, setCollapsed] = useState(false)

  const accentText = accent === 'blue' ? 'text-brand-blueLight' : 'text-brand-crimson'
  const accentBg = accent === 'blue' ? 'bg-brand-blue/15' : 'bg-brand-crimson/15'
  const accentBorder = accent === 'blue' ? 'border-brand-blueLight' : 'border-brand-crimson'

  return (
    <aside
      className={`${
        collapsed ? 'w-[64px]' : 'w-[232px]'
      } shrink-0 border-r border-base-border bg-base-surface flex flex-col transition-all duration-200`}
    >
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((item, i) => {
          const Icon = Icons[item.icon] || Icons.Circle
          const active = i === activeIndex
          return (
            <button
              key={item.label}
              onClick={() => onSelect?.(i)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors border-l-2 ${
                active
                  ? `${accentBg} ${accentText} ${accentBorder} font-medium`
                  : 'text-ink-secondary border-transparent hover:bg-base-raised hover:text-ink-primary'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>
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

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 px-4 py-3 border-t border-base-border text-ink-muted hover:text-ink-primary text-xs"
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        {!collapsed && 'Collapse'}
      </button>
    </aside>
  )
}
