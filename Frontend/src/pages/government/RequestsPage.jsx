import { useCallback, useState } from 'react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import StatusDot from '../../components/StatusDot'
import { useApi } from '../../hooks/useApi'
import { getIncidents, updateIncident } from '../../api/endpoints'
import { timeAgo, labelize, capitalize } from '../../utils/format'

const STATUSES = ['reported', 'verified', 'in-progress', 'resolved']

export default function RequestsPage() {
  const [updatingId, setUpdatingId] = useState(null)

  const fetchRequests = useCallback(async () => {
    const [reliefRes, missingRes] = await Promise.all([
      getIncidents('?type=relief-request&limit=100'),
      getIncidents('?type=missing-person&limit=100'),
    ])
    return [...reliefRes.data, ...missingRes.data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data: requests, loading, error, refetch } = useApi(fetchRequests, [])

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
        <h1 className="font-display text-xl font-semibold text-ink-primary">Citizen Requests</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Relief requests and missing-person reports submitted directly by citizens.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading requests…" />
      ) : (
        <div className="space-y-2">
          {(requests ?? []).length === 0 && <EmptyRow>No citizen requests yet.</EmptyRow>}
          {(requests ?? []).map((r) => (
            <div key={r._id} className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <StatusDot tone={r.severity} pulse={r.severity === 'critical'} className="mt-1.5" />
                  <div>
                    <p className="font-medium text-ink-primary">
                      {labelize(r.type)} · {r.location?.address}
                    </p>
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
                      {labelize(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
