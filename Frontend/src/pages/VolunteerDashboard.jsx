import { useCallback, useState } from 'react'
import { Waves, CheckCircle2, Circle, Clock, Play, Flag } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import StatusDot from '../components/StatusDot'
import DisasterMap from '../components/DisasterMap'
import { LoadingState, ErrorBanner, EmptyRow } from '../components/AsyncState'
import { volunteerSidebar } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useViewUser } from '../hooks/useViewUser'
import { useApi } from '../hooks/useApi'
import {
  getVolunteerDashboard,
  getAlerts,
  getShelters,
  claimVolunteerTask,
  updateVolunteerTask,
} from '../api/endpoints'
import { timeAgo, capitalize, labelize } from '../utils/format'

const statusIcon = { completed: CheckCircle2, 'in-progress': Clock, assigned: Circle, open: Circle }

export default function VolunteerDashboard() {
  const [active, setActive] = useState(0)
  const { user } = useAuth()
  const viewUser = useViewUser()
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const fetchAll = useCallback(async () => {
    const [overview, alertsRes, sheltersRes] = await Promise.all([
      getVolunteerDashboard(),
      getAlerts('?active=true&limit=6'),
      getShelters('?limit=20'),
    ])
    return { ...overview.data, alerts: alertsRes.data, shelters: sheltersRes.data }
  }, [])

  const { data, loading, error, refetch } = useApi(fetchAll, [])

  const claimTask = async (id) => {
    setBusyId(id)
    setActionError('')
    try {
      await claimVolunteerTask(id)
      await refetch()
    } catch (err) {
      setActionError(err.message || 'Could not claim this task.')
    } finally {
      setBusyId(null)
    }
  }

  const advanceTask = async (id, nextStatus) => {
    setBusyId(id)
    setActionError('')
    try {
      await updateVolunteerTask(id, { status: nextStatus })
      await refetch()
    } catch (err) {
      setActionError(err.message || 'Could not update this task.')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <LoadingState label="Loading your tasks…" />

  const myTasks = data?.myTasks ?? []
  const openTasks = data?.openTasks ?? []
  const resources = data?.resources ?? []
  const activeIncidents = data?.activeIncidents ?? []
  const alerts = data?.alerts ?? []
  const shelters = data?.shelters ?? []

  const upcoming = myTasks.filter((t) => t.status !== 'completed')
  const completed = myTasks.filter((t) => t.status === 'completed')
  const featured = activeIncidents[0]

  const stats = [
    { label: 'Assigned Tasks', value: myTasks.length, tone: 'warning' },
    { label: 'In Progress', value: myTasks.filter((t) => t.status === 'in-progress').length, tone: 'critical' },
    { label: 'Completed', value: completed.length, tone: 'safe' },
    { label: 'Open Tasks', value: openTasks.length, tone: 'info' },
  ]

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={viewUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={volunteerSidebar} activeIndex={active} onSelect={setActive} accent="crimson" user={viewUser} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-primary">
              Hey {user?.name?.split(' ')[0]}, thank you for showing up.
            </h1>
            <p className="text-sm text-ink-muted mt-0.5">Here's what needs your attention today.</p>
          </div>

          {error && <ErrorBanner message={error} onRetry={refetch} />}
          {actionError && <ErrorBanner message={actionError} />}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title="Field Map" icon="Map" tone="warning" size="lg" className="lg:col-span-2">
              <div className="h-[320px]">
                <DisasterMap incidents={activeIncidents} shelters={shelters} />
              </div>
            </Panel>

            <Panel title="Emergency Alerts" icon="Siren" tone="critical">
              <ul className="space-y-2.5">
                {alerts.length === 0 && <EmptyRow>No active alerts.</EmptyRow>}
                {alerts.map((a) => (
                  <li key={a._id} className="flex items-start gap-2">
                    <StatusDot tone={a.severity} pulse={a.severity === 'critical'} className="mt-1" />
                    <div>
                      <p className="leading-snug">{a.title}</p>
                      <span className="text-xs opacity-70">{timeAgo(a.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            {featured && (
              <Panel
                title={`${labelize(featured.type)} — ${featured.location?.address}`}
                icon="Waves"
                tone="neutral"
                className="lg:col-span-3"
              >
                <div className="flex items-center gap-4">
                  <Waves size={30} className="opacity-70 shrink-0" />
                  <div>
                    <p>{featured.description || 'No further details reported.'}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs font-mono">
                      <StatusDot tone={featured.severity} pulse={featured.severity === 'critical'} />
                      {featured.peopleAffected ? `${featured.peopleAffected} people affected · ` : ''}
                      {timeAgo(featured.createdAt)}
                    </div>
                  </div>
                </div>
              </Panel>
            )}

            <Panel title="My Tasks" icon="ListChecks" tone="blue" className="lg:col-span-2">
              <ul className="space-y-3">
                {upcoming.length === 0 && <EmptyRow>Nothing assigned to you right now.</EmptyRow>}
                {upcoming.map((t) => {
                  const Icon = statusIcon[t.status] || Circle
                  return (
                    <li key={t._id} className="flex items-start gap-2.5">
                      <Icon size={16} className="mt-0.5 shrink-0 opacity-90" />
                      <div className="flex-1 min-w-0">
                        <p className="leading-snug">{t.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                          <span>{t.location}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <StatusDot tone={t.priority} />
                            {capitalize(t.priority)}
                          </span>
                        </div>
                      </div>
                      {t.status === 'assigned' && (
                        <button
                          onClick={() => advanceTask(t._id, 'in-progress')}
                          disabled={busyId === t._id}
                          className="shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-brand-blue hover:bg-brand-blueLight text-white transition-colors disabled:opacity-60"
                        >
                          <Play size={12} /> Start
                        </button>
                      )}
                      {t.status === 'in-progress' && (
                        <button
                          onClick={() => advanceTask(t._id, 'completed')}
                          disabled={busyId === t._id}
                          className="shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-status-safe hover:bg-status-safe/90 text-white transition-colors disabled:opacity-60"
                        >
                          <Flag size={12} /> Complete
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Panel>

            <Panel title="Recent Activity" icon="History" tone="safe">
              <ul className="space-y-2.5">
                {completed.length === 0 && <EmptyRow>Completed tasks will show up here.</EmptyRow>}
                {completed.slice(0, 6).map((t) => (
                  <li key={t._id} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 opacity-90" />
                    <div>
                      <p className="leading-snug">{t.title}</p>
                      <span className="text-xs opacity-70">{timeAgo(t.updatedAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Open Tasks You Can Claim" icon="ClipboardList" tone="neutral" className="lg:col-span-2">
              <ul className="space-y-3">
                {openTasks.length === 0 && <EmptyRow>No unclaimed tasks right now.</EmptyRow>}
                {openTasks.map((t) => (
                  <li key={t._id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="text-ink-primary truncate">{t.title}</p>
                      <p className="text-xs text-ink-muted">{t.location}</p>
                    </div>
                    <button
                      onClick={() => claimTask(t._id)}
                      disabled={busyId === t._id}
                      className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-brand-blue hover:bg-brand-blueLight text-white transition-colors disabled:opacity-60"
                    >
                      {busyId === t._id ? 'Claiming…' : 'Claim'}
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Resource Levels" icon="Boxes" tone="neutral">
              <ul className="space-y-2.5">
                {resources.length === 0 && <EmptyRow>No resources tracked.</EmptyRow>}
                {resources.slice(0, 6).map((r) => (
                  <li key={r._id} className="flex items-center justify-between text-sm">
                    <span className="text-ink-secondary">{r.name}</span>
                    <span
                      className={`font-mono text-xs ${
                        r.status === 'depleted'
                          ? 'text-status-critical'
                          : r.status === 'low'
                          ? 'text-status-warning'
                          : 'text-status-safe'
                      }`}
                    >
                      {r.quantity} {r.unit}
                    </span>
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
