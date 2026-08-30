import { useCallback, useMemo, useState } from 'react'
import { ArrowUpRight, Megaphone } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import StatusDot from '../components/StatusDot'
import Modal from '../components/Modal'
import DisasterMap from '../components/DisasterMap'
import { LoadingState, ErrorBanner, EmptyRow } from '../components/AsyncState'
import { govSidebar } from '../data/mockData'
import { useViewUser } from '../hooks/useViewUser'
import { useApi } from '../hooks/useApi'
import {
  getGovernmentDashboard,
  getIncidents,
  getAlerts,
  getVolunteerTasks,
  getResources,
  getShelters,
  createAlert,
  updateIncident,
} from '../api/endpoints'
import { timeAgo, labelize, capitalize } from '../utils/format'

const INCIDENT_STATUSES = ['reported', 'verified', 'in-progress', 'resolved']
const ALERT_SEVERITIES = ['critical', 'warning', 'info', 'safe']

export default function GovernmentDashboard() {
  const [active, setActive] = useState(0)
  const viewUser = useViewUser('District Disaster Officer')

  const fetchAll = useCallback(async () => {
    const [overview, incidentsRes, alertsRes, tasksRes, resourcesRes, sheltersRes] = await Promise.all([
      getGovernmentDashboard(),
      getIncidents('?limit=100'),
      getAlerts('?limit=10'),
      getVolunteerTasks('?status=open&limit=8'),
      getResources('?limit=20'),
      getShelters('?limit=20'),
    ])
    return {
      overview: overview.data,
      incidents: incidentsRes.data,
      alerts: alertsRes.data,
      openTasks: tasksRes.data,
      resources: resourcesRes.data,
      shelters: sheltersRes.data,
    }
  }, [])

  const { data, loading, error, refetch } = useApi(fetchAll, [])

  const incidentsByType = useMemo(() => {
    if (!data?.incidents) return []
    const counts = {}
    for (const inc of data.incidents) {
      counts[inc.type] = (counts[inc.type] || 0) + 1
    }
    return Object.entries(counts)
      .map(([type, count]) => ({ type: labelize(type), count }))
      .sort((a, b) => b.count - a.count)
  }, [data])

  // --- Issue Alert modal ---
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [alertForm, setAlertForm] = useState({ title: '', message: '', severity: 'warning', area: '' })
  const [alertSubmitting, setAlertSubmitting] = useState(false)
  const [alertError, setAlertError] = useState('')

  const submitAlert = async (e) => {
    e.preventDefault()
    setAlertSubmitting(true)
    setAlertError('')
    try {
      await createAlert({
        title: alertForm.title.trim(),
        message: alertForm.message.trim(),
        severity: alertForm.severity,
        area: alertForm.area.trim() || undefined,
        active: true,
      })
      setAlertModalOpen(false)
      setAlertForm({ title: '', message: '', severity: 'warning', area: '' })
      refetch()
    } catch (err) {
      setAlertError(err.message || 'Could not issue alert.')
    } finally {
      setAlertSubmitting(false)
    }
  }

  // --- Inline incident status update ---
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const changeIncidentStatus = async (id, status) => {
    setStatusUpdatingId(id)
    try {
      await updateIncident(id, { status })
      await refetch()
    } catch {
      // Swallow — refetch will show the last-known state; row stays interactive.
    } finally {
      setStatusUpdatingId(null)
    }
  }

  if (loading) return <LoadingState label="Loading command overview…" />

  const overview = data?.overview
  const shelterPct = overview
    ? Math.round((overview.shelters.occupancy / (overview.shelters.capacity || 1)) * 100)
    : 0
  const activeAlerts = (data?.alerts ?? []).filter((a) => a.active)

  const stats = overview
    ? [
        { label: 'Total Incidents', value: overview.totalIncidents, tone: 'info' },
        {
          label: 'Critical Incidents',
          value: overview.criticalIncidents,
          tone: overview.criticalIncidents > 0 ? 'critical' : 'safe',
        },
        { label: 'Active Alerts', value: overview.activeAlerts, tone: 'warning' },
        { label: 'Active Volunteers', value: overview.activeVolunteers, tone: 'safe' },
        {
          label: 'Shelter Occupancy',
          value: `${shelterPct}%`,
          delta: `${overview.shelters.occupancy} / ${overview.shelters.capacity}`,
          tone: shelterPct >= 90 ? 'critical' : 'info',
        },
      ]
    : []

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={viewUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={govSidebar} activeIndex={active} onSelect={setActive} accent="crimson" user={viewUser} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-semibold text-ink-primary">Command Overview</h1>
              <p className="text-sm text-ink-muted mt-0.5">
                Real-time situational awareness across all active operations.
              </p>
            </div>
            <button
              onClick={() => setAlertModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium px-3.5 py-2 shrink-0"
            >
              <Megaphone size={15} /> Issue Alert
            </button>
          </div>

          {error && <ErrorBanner message={error} onRetry={refetch} />}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title="Live Disaster Map" icon="Map" tone="critical" size="lg" className="lg:col-span-2">
              <div className="h-[320px]">
                <DisasterMap incidents={data?.incidents ?? []} shelters={data?.shelters ?? []} />
              </div>
            </Panel>

            <Panel title="Active Alerts" icon="Megaphone" tone="blue">
              <ul className="space-y-2.5">
                {activeAlerts.length === 0 && <EmptyRow>No active alerts right now.</EmptyRow>}
                {activeAlerts.map((a) => (
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

            <Panel title="Incidents Management" icon="FlameKindling" tone="neutral" className="lg:col-span-2">
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm min-w-[620px]">
                  <thead>
                    <tr className="text-left text-ink-muted text-xs uppercase font-mono">
                      <th className="font-normal py-1.5 px-2">Type</th>
                      <th className="font-normal py-1.5 px-2">Location</th>
                      <th className="font-normal py-1.5 px-2">Severity</th>
                      <th className="font-normal py-1.5 px-2">Status</th>
                      <th className="font-normal py-1.5 px-2">Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.incidents ?? []).slice(0, 8).map((inc) => (
                      <tr key={inc._id} className="border-t border-base-border hover:bg-base-raised/60">
                        <td className="py-2 px-2">{labelize(inc.type)}</td>
                        <td className="py-2 px-2 text-ink-secondary">{inc.location?.address}</td>
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center gap-1.5">
                            <StatusDot tone={inc.severity} />
                            {capitalize(inc.severity)}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={inc.status}
                            disabled={statusUpdatingId === inc._id}
                            onChange={(e) => changeIncidentStatus(inc._id, e.target.value)}
                            className="bg-base border border-base-border rounded px-1.5 py-1 text-xs text-ink-secondary focus:outline-none focus:ring-1 focus:ring-brand-blueLight disabled:opacity-50"
                          >
                            {INCIDENT_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {labelize(s)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2 text-ink-muted text-xs">{timeAgo(inc.createdAt)}</td>
                      </tr>
                    ))}
                    {(data?.incidents ?? []).length === 0 && (
                      <tr>
                        <td colSpan={5}>
                          <EmptyRow>No incidents reported yet.</EmptyRow>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Open Volunteer Tasks" icon="Users" tone="neutral">
              <ul className="space-y-3">
                {(data?.openTasks ?? []).length === 0 && <EmptyRow>No unassigned tasks.</EmptyRow>}
                {(data?.openTasks ?? []).map((t) => (
                  <li key={t._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-ink-primary">{t.title}</p>
                      <p className="text-xs text-ink-muted">{t.location}</p>
                    </div>
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded-full border ${
                        t.priority === 'critical'
                          ? 'border-status-critical/40 text-status-critical'
                          : t.priority === 'warning'
                          ? 'border-status-warning/40 text-status-warning'
                          : 'border-status-idle/40 text-status-idle'
                      }`}
                    >
                      {capitalize(t.priority)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Resource Inventory" icon="PackageOpen" tone="neutral" className="lg:col-span-2">
              <div className="space-y-3">
                {(data?.resources ?? []).length === 0 && <EmptyRow>No resources tracked yet.</EmptyRow>}
                {(data?.resources ?? []).slice(0, 6).map((r) => {
                  const statusTone =
                    r.status === 'depleted' ? 'critical' : r.status === 'low' ? 'warning' : 'safe'
                  return (
                    <div key={r._id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink-secondary">{r.name}</span>
                        <span className="font-mono text-ink-muted">
                          {r.quantity.toLocaleString()} {r.unit} • {capitalize(r.status)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-base-raised overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            statusTone === 'critical'
                              ? 'bg-status-critical'
                              : statusTone === 'warning'
                              ? 'bg-status-warning'
                              : 'bg-brand-blueLight'
                          }`}
                          style={{
                            width: `${statusTone === 'critical' ? 100 : statusTone === 'warning' ? 45 : 80}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>

            <Panel title="Incidents By Type" icon="BarChart3" tone="neutral">
              <ul className="space-y-2.5">
                {incidentsByType.length === 0 && <EmptyRow>No data yet.</EmptyRow>}
                {incidentsByType.map((i) => (
                  <li key={i.type} className="flex items-center justify-between text-sm">
                    <span className="text-ink-secondary">{i.type}</span>
                    <span className="font-mono text-ink-primary">{i.count}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Recent Alerts" icon="Megaphone" tone="neutral" className="lg:col-span-3">
              <div className="grid sm:grid-cols-3 gap-3">
                {(data?.alerts ?? []).slice(0, 3).map((a) => (
                  <div key={a._id} className="rounded-lg border border-base-border p-3">
                    <p className="text-sm text-ink-primary leading-snug">{a.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-ink-muted">{timeAgo(a.createdAt)}</span>
                      <ArrowUpRight size={14} className="text-ink-muted" />
                    </div>
                  </div>
                ))}
                {(data?.alerts ?? []).length === 0 && <EmptyRow>No announcements yet.</EmptyRow>}
              </div>
            </Panel>
          </div>
        </main>
      </div>

      {alertModalOpen && (
        <Modal title="Issue Alert" onClose={() => setAlertModalOpen(false)}>
          <form onSubmit={submitAlert} className="space-y-4">
            {alertError && <ErrorBanner message={alertError} />}
            <label className="block">
              <span className="block text-xs text-ink-muted mb-1.5">Title</span>
              <input
                required
                value={alertForm.title}
                onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                placeholder="e.g. Flood Warning: Bagmati River Basin"
                className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
              />
            </label>
            <label className="block">
              <span className="block text-xs text-ink-muted mb-1.5">Message</span>
              <textarea
                required
                rows={3}
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                placeholder="What should people do?"
                className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight resize-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs text-ink-muted mb-1.5">Severity</span>
                <select
                  value={alertForm.severity}
                  onChange={(e) => setAlertForm({ ...alertForm, severity: e.target.value })}
                  className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
                >
                  {ALERT_SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {capitalize(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs text-ink-muted mb-1.5">Area (optional)</span>
                <input
                  value={alertForm.area}
                  onChange={(e) => setAlertForm({ ...alertForm, area: e.target.value })}
                  placeholder="Kathmandu Valley"
                  className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={alertSubmitting}
              className="w-full rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {alertSubmitting ? 'Publishing…' : 'Publish alert'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
