import { useState } from 'react'
import { Map, ArrowUpRight } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import StatusDot from '../components/StatusDot'
import {
  govSidebar,
  govStats,
  govIncidents,
  incidentsByType,
  rescueTeams,
  reliefOverview,
  govAnnouncements,
  currentUser,
} from '../data/mockData'

const severityTone = { Critical: 'critical', High: 'warning', Medium: 'warning', Low: 'safe' }

export default function GovernmentDashboard() {
  const [active, setActive] = useState(0)

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={currentUser.government} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={govSidebar} activeIndex={active} onSelect={setActive} accent="crimson" user={currentUser.government}/>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-primary">Command Overview</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              Real-time situational awareness across all active operations.
            </p>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {govStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title="Live Disaster Map" icon="Map" tone="critical" size="lg" className="lg:col-span-2">
              <div className="relative h-full min-h-[180px] rounded-lg bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden">
                <Map size={40} className="opacity-30" />
                <span className="absolute top-3 left-3 text-xs font-mono bg-black/30 rounded px-2 py-1">
                  14 active markers
                </span>
                <span className="absolute bottom-3 right-3 text-xs opacity-80">
                  Map integration pending — connect Mapbox/Leaflet + live incident feed
                </span>
              </div>
            </Panel>

            <Panel title="Emergency Alerts" icon="Megaphone" tone="blue">
              <ul className="space-y-2.5">
                {govAnnouncements.map((a) => (
                  <li key={a.title} className="flex items-start gap-2">
                    <StatusDot tone="warning" className="mt-1" />
                    <div>
                      <p className="leading-snug">{a.title}</p>
                      <span className="text-xs opacity-70">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Incidents Management" icon="FlameKindling" tone="neutral" className="lg:col-span-2">
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="text-left text-ink-muted text-xs uppercase font-mono">
                      <th className="font-normal py-1.5 px-2">ID</th>
                      <th className="font-normal py-1.5 px-2">Type</th>
                      <th className="font-normal py-1.5 px-2">Location</th>
                      <th className="font-normal py-1.5 px-2">Severity</th>
                      <th className="font-normal py-1.5 px-2">Status</th>
                      <th className="font-normal py-1.5 px-2">Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    {govIncidents.map((inc) => (
                      <tr key={inc.id} className="border-t border-base-border hover:bg-base-raised/60">
                        <td className="py-2 px-2 font-mono text-xs text-ink-muted">{inc.id}</td>
                        <td className="py-2 px-2">{inc.type}</td>
                        <td className="py-2 px-2 text-ink-secondary">{inc.location}</td>
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center gap-1.5">
                            <StatusDot tone={severityTone[inc.severity]} />
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-ink-secondary">{inc.status}</td>
                        <td className="py-2 px-2 text-ink-muted text-xs">{inc.reported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Rescue Team Status" icon="Users" tone="neutral">
              <ul className="space-y-3">
                {rescueTeams.map((t) => (
                  <li key={t.name} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-ink-primary">{t.name}</p>
                      <p className="text-xs text-ink-muted">
                        {t.members} members • {t.zone}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded-full border ${
                        t.status === 'Deployed'
                          ? 'border-status-critical/40 text-status-critical'
                          : t.status === 'En Route'
                          ? 'border-status-warning/40 text-status-warning'
                          : 'border-status-idle/40 text-status-idle'
                      }`}
                    >
                      {t.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Relief Distribution Overview" icon="PackageOpen" tone="neutral" className="lg:col-span-2">
              <div className="space-y-3">
                {reliefOverview.map((r) => {
                  const pct = Math.round((r.distributed / r.target) * 100)
                  return (
                    <div key={r.category}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink-secondary">{r.category}</span>
                        <span className="font-mono text-ink-muted">
                          {r.distributed.toLocaleString()} / {r.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-base-raised overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-blueLight"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>

            <Panel title="Incidents By Type" icon="BarChart3" tone="neutral">
              <ul className="space-y-2.5">
                {incidentsByType.map((i) => (
                  <li key={i.type} className="flex items-center justify-between text-sm">
                    <span className="text-ink-secondary">{i.type}</span>
                    <span className="font-mono text-ink-primary">{i.count}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Recent Announcements" icon="Megaphone" tone="neutral" className="lg:col-span-3">
              <div className="grid sm:grid-cols-3 gap-3">
                {govAnnouncements.map((a) => (
                  <div key={a.title} className="rounded-lg border border-base-border p-3">
                    <p className="text-sm text-ink-primary leading-snug">{a.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-ink-muted">{a.time}</span>
                      <ArrowUpRight size={14} className="text-ink-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </main>
      </div>
    </div>
  )
}
