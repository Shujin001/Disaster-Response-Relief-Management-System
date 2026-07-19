import { useState } from 'react'
import { Waves, CheckCircle2, Circle, Clock } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import StatusDot from '../components/StatusDot'
import {
  volunteerSidebar,
  volunteerStats,
  volunteerTasks,
  volunteerActivity,
  currentUser,
} from '../data/mockData'

const priorityTone = { High: 'critical', Medium: 'warning', Low: 'idle' }
const statusIcon = { Completed: CheckCircle2, 'In Progress': Clock, Pending: Circle }

export default function VolunteerDashboard() {
  const [active, setActive] = useState(0)
  const upcoming = volunteerTasks.filter((t) => t.status !== 'Completed')

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={currentUser.volunteer} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={volunteerSidebar} activeIndex={active} onSelect={setActive} accent="crimson" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-primary">
              Hey {currentUser.volunteer.name.split(' ')[0]}, thank you for showing up.
            </h1>
            <p className="text-sm text-ink-muted mt-0.5">Here's what needs your attention today.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {volunteerStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel
              title="Flood Relief Operation (Riverside Risk Area)"
              icon="Waves"
              tone="warning"
              size="lg"
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-4">
                <Waves size={36} className="opacity-70 shrink-0" />
                <div>
                  <p>
                    Active mission: coordinate food and medical relief along the Riverside sector.
                    12 volunteers currently deployed.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono">
                    <StatusDot tone="critical" pulse />
                    Live — started 3h ago
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Emergency Alerts" icon="Siren" tone="critical">
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <StatusDot tone="critical" pulse className="mt-1" />
                  <div>
                    <p className="leading-snug">River levels rising near Sector 4 — evacuate low ground</p>
                    <span className="text-xs opacity-70">15m ago</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <StatusDot tone="warning" className="mt-1" />
                  <div>
                    <p className="leading-snug">Heavy rain expected — secure supply tents</p>
                    <span className="text-xs opacity-70">1h ago</span>
                  </div>
                </li>
              </ul>
            </Panel>

            <Panel title="Recent Activity" icon="History" tone="safe">
              <ul className="space-y-2.5">
                {volunteerActivity.map((a) => (
                  <li key={a.text} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 opacity-90" />
                    <div>
                      <p className="leading-snug">{a.text}</p>
                      <span className="text-xs opacity-70">{a.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Upcoming Task" icon="ListChecks" tone="blue">
              <ul className="space-y-3">
                {upcoming.map((t) => {
                  const Icon = statusIcon[t.status]
                  return (
                    <li key={t.id} className="flex items-start gap-2.5">
                      <Icon size={16} className="mt-0.5 shrink-0 opacity-90" />
                      <div className="flex-1">
                        <p className="leading-snug">{t.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                          <span>{t.due}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <StatusDot tone={priorityTone[t.priority]} />
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </div>
        </main>
      </div>
    </div>
  )
}
