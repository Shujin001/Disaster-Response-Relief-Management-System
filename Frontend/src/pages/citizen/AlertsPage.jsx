import { useCallback } from 'react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import StatusDot from '../../components/StatusDot'
import { useApi } from '../../hooks/useApi'
import { getAlerts } from '../../api/endpoints'
import { timeAgo, capitalize } from '../../utils/format'

export default function AlertsPage() {
  const fetchAlerts = useCallback(async () => {
    const res = await getAlerts('?limit=50')
    return res.data
  }, [])

  const { data: alerts, loading, error, refetch } = useApi(fetchAlerts, [])

  if (loading) return <LoadingState label="Loading alerts…" />

  const active = (alerts ?? []).filter((a) => a.active)
  const past = (alerts ?? []).filter((a) => !a.active)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Disaster Alerts</h1>
        <p className="text-sm text-ink-muted mt-0.5">Official alerts issued for your area.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <section>
        <h2 className="text-xs uppercase font-mono text-ink-muted mb-2">Active</h2>
        <div className="space-y-2">
          {active.length === 0 && <EmptyRow>No active alerts right now.</EmptyRow>}
          {active.map((a) => (
            <div key={a._id} className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel">
              <div className="flex items-start gap-2.5">
                <StatusDot tone={a.severity} pulse={a.severity === 'critical'} className="mt-1.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-ink-primary">{a.title}</p>
                    <span className="text-xs text-ink-muted shrink-0">{timeAgo(a.createdAt)}</span>
                  </div>
                  <p className="text-sm text-ink-secondary mt-1 leading-relaxed">{a.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-ink-muted">
                    {a.area && <span>{a.area}</span>}
                    <span>· {capitalize(a.severity)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-xs uppercase font-mono text-ink-muted mb-2">Past</h2>
          <div className="space-y-2">
            {past.map((a) => (
              <div
                key={a._id}
                className="rounded-xl border border-base-border bg-base-surface/50 p-4 opacity-70"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-ink-primary">{a.title}</p>
                  <span className="text-xs text-ink-muted shrink-0">{timeAgo(a.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-secondary mt-1">{a.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
