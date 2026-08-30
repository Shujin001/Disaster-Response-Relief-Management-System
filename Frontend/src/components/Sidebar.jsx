import * as Icons from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

// Items can either carry a `to` (real route — rendered as a NavLink, so
// clicking it actually navigates and highlights based on the URL) or omit
// it (falls back to the old in-page tab behavior via onSelect/activeIndex).
export default function Sidebar({ items, activeIndex = 0, onSelect, accent = 'crimson', user }) {
  const [collapsed, setCollapsed] = useState(false)

  const accentText = accent === 'blue' ? 'text-brand-blueLight' : 'text-brand-crimson'
  const accentBg = accent === 'blue' ? 'bg-brand-blue/15' : 'bg-brand-crimson/15'
  const accentBorder = accent === 'blue' ? 'border-brand-blueLight' : 'border-brand-crimson'

  const itemClass = (active) =>
    `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors border-l-2 ${
      active
        ? `${accentBg} ${accentText} ${accentBorder} font-medium`
        : 'text-ink-secondary border-transparent hover:bg-base-raised hover:text-ink-primary'
    }`

  return (
    <aside
      className={`${
        collapsed ? 'w-[64px]' : 'w-[232px]'
      } shrink-0 border-r border-base-border bg-base-surface flex flex-col transition-all duration-200`}
    >
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((item, i) => {
          const Icon = Icons[item.icon] || Icons.Circle

          if (item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => itemClass(isActive)}
              >
                <Icon size={17} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          }

          const active = i === activeIndex
          return (
            <button
              key={item.label}
              onClick={() => onSelect?.(i)}
              title={collapsed ? item.label : undefined}
              className={itemClass(active)}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div
        className={`flex items-center gap-2 border-t border-base-border py-3 ${
          collapsed ? 'justify-center px-0' : 'px-3'
        }`}
      >
        <div
          className="h-8 w-8 shrink-0 rounded-full bg-brand-blue flex items-center justify-center text-xs font-display font-semibold"
          title={collapsed ? user.name : undefined}
        >
          {user.initials}
        </div>
        {!collapsed && (
          <div className="leading-tight min-w-0">
            <p className="text-sm font-medium text-ink-primary truncate">{user.name}</p>
            <p className="text-xs text-ink-muted truncate">{user.role}</p>
          </div>
        )}
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
