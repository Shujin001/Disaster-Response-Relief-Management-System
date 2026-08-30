import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Siren, TriangleAlert, HandHeart, UserSearch } from 'lucide-react'
import StatCard from '../../components/StatCard'
import Panel from '../../components/Panel'
import StatusDot from '../../components/StatusDot'
import DisasterMap from '../../components/DisasterMap'
import { LoadingState, ErrorBanner, EmptyRow } from '../../components/AsyncState'
import { useAuth } from '../../context/AuthContext'
import { useApi } from '../../hooks/useApi'
import { getCitizenDashboard } from '../../api/endpoints'
import { timeAgo, formatDate, labelize } from '../../utils/format'

export default function CitizenDashboard() {
  const { user } = useAuth()

  const fetchAll = useCallback(async () => {
    const res = await getCitizenDashboard()
    return res.data
  }, [])

  const { data, loading, error, refetch } = useApi(fetchAll, [])

  if (loading) return <LoadingState label="Loading your dashboard…" />

  const alerts = data?.activeAlerts ?? []
  const myReports = data?.myReports ?? []
  const shelters = data?.openShelters ?? []
  const nearbyIncidents = data?.nearbyIncidents ?? []

  const stats = [
    { label: 'Active Alerts', value: alerts.length, tone: alerts.length > 0 ? 'critical' : 'safe' },
    {
      label: 'My Reports',
      value: myReports.length,
      delta: `${myReports.filter((r) => r.status !== 'resolved').length} open`,
      tone: 'warning',
    },
    { label: 'Open Shelters', value: shelters.length, tone: 'info' },
    { label: 'Nearby Incidents', value: nearbyIncidents.length, tone: 'idle' },
  ]

  return (
    <>
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-muted mt-0.5">Stay informed and get help fast during emergencies.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Disaster Map" icon="Map" tone="critical" size="lg" className="lg:col-span-2">
          <div className="h-[320px]">
            <DisasterMap
              incidents={nearbyIncidents}
              shelters={shelters}
              userLocation={user?.location?.lat ? user.location : undefined}
            />
          </div>
        </Panel>

        <Panel title="Emergency Alerts" icon="BellRing" tone="blue">
          <ul className="space-y-2.5">
            {alerts.length === 0 && <EmptyRow>No active alerts right now.</EmptyRow>}
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

        <Panel title="Quick Actions" icon="Zap" tone="safe">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/citizen/sos"
              className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
            >
              <Siren size={18} />
              <span className="text-xs leading-tight">Send Emergency SOS</span>
            </Link>
            <Link
              to="/citizen/report"
              className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
            >
              <TriangleAlert size={18} />
              <span className="text-xs leading-tight">Report a Disaster</span>
            </Link>
            <Link
              to="/citizen/relief"
              className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
            >
              <HandHeart size={18} />
              <span className="text-xs leading-tight">Request Relief</span>
            </Link>
            <Link
              to="/citizen/missing"
              className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
            >
              <UserSearch size={18} />
              <span className="text-xs leading-tight">Report Missing Person</span>
            </Link>
          </div>
        </Panel>

        <Panel title="My Reports" icon="Inbox" tone="neutral">
          <ul className="space-y-3">
            {myReports.length === 0 && <EmptyRow>You haven't reported anything yet.</EmptyRow>}
            {myReports.slice(0, 6).map((r) => (
              <li key={r._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-ink-primary">{labelize(r.type)}</p>
                  <p className="text-xs text-ink-muted font-mono">{formatDate(r.createdAt)}</p>
                </div>
                <span
                  className={`text-xs font-mono px-2 py-1 rounded-full border ${
                    r.status === 'resolved'
                      ? 'border-status-safe/40 text-status-safe'
                      : 'border-status-warning/40 text-status-warning'
                  }`}
                >
                  {labelize(r.status)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Nearby Shelters" icon="Home" tone="neutral">
          <ul className="space-y-3">
            {shelters.length === 0 && <EmptyRow>No open shelters listed.</EmptyRow>}
            {shelters.map((s) => (
              <li key={s._id} className="text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-ink-primary">{s.name}</p>
                  <span
                    className={`text-xs font-mono ${
                      s.occupancy >= s.capacity ? 'text-status-critical' : 'text-status-safe'
                    }`}
                  >
                    {s.occupancy >= s.capacity ? 'Full' : 'Open'}
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  {s.location?.address} • {s.occupancy} / {s.capacity} occupied
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Nearby Incidents" icon="Megaphone" tone="neutral">
          <ul className="space-y-3">
            {nearbyIncidents.length === 0 && <EmptyRow>No unresolved incidents nearby.</EmptyRow>}
            {nearbyIncidents.slice(0, 6).map((inc) => (
              <li key={inc._id} className="text-sm">
                <p className="text-ink-primary leading-snug">
                  {labelize(inc.type)} — {inc.location?.address}
                </p>
                <span className="text-xs text-ink-muted">{timeAgo(inc.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
