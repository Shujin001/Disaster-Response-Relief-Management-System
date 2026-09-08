import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Megaphone } from 'lucide-react'
import StatusDot from '../../components/StatusDot'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getAlerts } from '../../api/endpoints'
import { timeAgo, capitalize } from '../../utils/format'

export default function AnnouncementsPage() {
  const fetchAlerts = useCallback(async () => {
    const res = await getAlerts('?limit=50')
    return res.data
  }, [])

  const { data: alerts, loading, error, refetch } = useApi(fetchAlerts, [])
  const active = (alerts ?? []).filter((a) => a.active)
  const past = (alerts ?? []).filter((a) => !a.active)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-primary">Announcements</h1>
          <p className="text-sm text-ink-muted mt-0.5">Every alert issued, active and past.</p>
        </div>
        <Link
          to="/government/announcements/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium px-3.5 py-2 shrink-0"
        >
          <Megaphone size={15} /> Issue Alert
        </Link>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading announcements…" />
      ) : (
        <>
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
                  <div key={a._id} className="rounded-xl border border-base-border bg-base-surface/50 p-4 opacity-70">
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
        </>
      )}
    </div>
  )
}
