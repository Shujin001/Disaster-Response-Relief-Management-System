import { useState } from 'react'
import { Map } from 'lucide-react'
import * as Icons from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import StatusDot from '../components/StatusDot'
import {
  citizenSidebar,
  citizenStats,
  citizenAlerts,
  citizenRequests,
  nearbyShelters,
  citizenAnnouncements,
  citizenQuickActions,
  currentUser,
} from '../data/mockData'

const levelTone = { Critical: 'critical', Warning: 'warning', Notice: 'info' }

export default function CitizenDashboard() {
  const [active, setActive] = useState(0)

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={currentUser.citizen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={citizenSidebar} activeIndex={active} onSelect={setActive} accent="blue" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-primary">
              Welcome back, {currentUser.citizen.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-ink-muted mt-0.5">
              Stay informed and get help fast during emergencies.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {citizenStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title="Disaster Map" icon="Map" tone="critical" size="lg" className="lg:col-span-2">
              <div className="relative h-full min-h-[180px] rounded-lg bg-black/20 border border-white/10 flex items-center justify-center">
                <Map size={40} className="opacity-30" />
                <span className="absolute bottom-3 right-3 text-xs opacity-80">
                  Showing alerts within 5km of your location
                </span>
              </div>
            </Panel>

            <Panel title="Emergency Alert" icon="BellRing" tone="blue">
              <ul className="space-y-2.5">
                {citizenAlerts.map((a) => (
                  <li key={a.title} className="flex items-start gap-2">
                    <StatusDot tone={levelTone[a.level]} pulse={a.level === 'Critical'} className="mt-1" />
                    <div>
                      <p className="leading-snug">{a.title}</p>
                      <span className="text-xs opacity-70">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Quick Actions" icon="Zap" tone="safe">
              <div className="grid grid-cols-2 gap-2">
                {citizenQuickActions.map((qa) => {
                  const Icon = Icons[qa.icon] || Icons.Circle
                  return (
                    <button
                      key={qa.label}
                      className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
                    >
                      <Icon size={18} />
                      <span className="text-xs leading-tight">{qa.label}</span>
                    </button>
                  )
                })}
              </div>
            </Panel>

            <Panel title="Recent Request" icon="Inbox" tone="neutral">
              <ul className="space-y-3">
                {citizenRequests.map((r) => (
                  <li key={r.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-ink-primary">{r.type}</p>
                      <p className="text-xs text-ink-muted font-mono">
                        {r.id} • {r.date}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded-full border ${
                        r.status === 'Approved'
                          ? 'border-status-safe/40 text-status-safe'
                          : 'border-status-warning/40 text-status-warning'
                      }`}
                    >
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Nearby Shelters" icon="Home" tone="neutral">
              <ul className="space-y-3">
                {nearbyShelters.map((s) => (
                  <li key={s.name} className="text-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-ink-primary">{s.name}</p>
                      <span
                        className={`text-xs font-mono ${
                          s.status === 'Full' ? 'text-status-critical' : 'text-status-safe'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {s.distance} away • {s.capacity} occupied
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Announcement" icon="Megaphone" tone="neutral">
              <ul className="space-y-3">
                {citizenAnnouncements.map((a) => (
                  <li key={a.title} className="text-sm">
                    <p className="text-ink-primary leading-snug">{a.title}</p>
                    <span className="text-xs text-ink-muted">{a.time}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </main>
      </div>
    </div>
  )
}
