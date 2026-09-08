import { useCallback, useState } from 'react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import StatusDot from '../../components/StatusDot'
import { useApi } from '../../hooks/useApi'
import { getIncidents, updateIncident, getResources } from '../../api/endpoints'
import { timeAgo, capitalize } from '../../utils/format'

const STATUSES = ['reported', 'verified', 'in-progress', 'resolved']

export default function ReliefPage() {
  const [updatingId, setUpdatingId] = useState(null)

  const fetchData = useCallback(async () => {
    const [reqRes, resRes] = await Promise.all([
      getIncidents('?type=relief-request&limit=100'),
      getResources('?limit=50'),
    ])
    return { requests: reqRes.data, resources: resRes.data }
  }, [])

  const { data, loading, error, refetch } = useApi(fetchData, [])

  const changeStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateIncident(id, { status })
      await refetch()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Relief Distribution</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Open relief requests, cross-referenced against current stock so you know what's fulfillable.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading relief data…" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            {(data?.requests ?? []).length === 0 && <EmptyRow>No relief requests yet.</EmptyRow>}
            {(data?.requests ?? []).map((r) => (
              <div key={r._id} className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <StatusDot tone={r.severity} className="mt-1.5" />
                    <div>
                      <p className="font-medium text-ink-primary">{r.location?.address}</p>
                      <p className="text-sm text-ink-secondary mt-1 leading-relaxed">{r.description}</p>
                      <p className="text-xs text-ink-muted mt-1.5">
                        {r.reportedBy?.name ? `From ${r.reportedBy.name} · ` : ''}
                        {timeAgo(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <select
                    value={r.status}
                    disabled={updatingId === r._id}
                    onChange={(e) => changeStatus(r._id, e.target.value)}
                    className="bg-base border border-base-border rounded px-2 py-1 text-xs text-ink-secondary focus:outline-none focus:ring-1 focus:ring-brand-blueLight disabled:opacity-50 shrink-0"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {capitalize(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel h-fit">
            <h2 className="text-xs uppercase font-mono text-ink-muted mb-3">Current Stock</h2>
            <div className="space-y-2.5">
              {(data?.resources ?? []).length === 0 && <EmptyRow>No resources tracked.</EmptyRow>}
              {(data?.resources ?? []).map((res) => (
                <div key={res._id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-secondary">{res.name}</span>
                  <span
                    className={`font-mono text-xs ${
                      res.status === 'depleted'
                        ? 'text-status-critical'
                        : res.status === 'low'
                        ? 'text-status-warning'
                        : 'text-status-safe'
                    }`}
                  >
                    {res.quantity} {res.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
