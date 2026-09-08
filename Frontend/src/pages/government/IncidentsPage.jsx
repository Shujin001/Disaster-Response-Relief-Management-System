import { useCallback, useState } from 'react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import StatusDot from '../../components/StatusDot'
import { useApi } from '../../hooks/useApi'
import { getIncidents, updateIncident } from '../../api/endpoints'
import { timeAgo, labelize, capitalize } from '../../utils/format'

const STATUSES = ['reported', 'verified', 'in-progress', 'resolved']
const SEVERITIES = ['critical', 'warning', 'safe', 'info']

export default function IncidentsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchIncidents = useCallback(async () => {
    const params = new URLSearchParams({ limit: '200' })
    if (statusFilter) params.set('status', statusFilter)
    if (severityFilter) params.set('severity', severityFilter)
    const res = await getIncidents(`?${params.toString()}`)
    return res.data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, severityFilter])

  const { data: incidents, loading, error, refetch } = useApi(fetchIncidents, [statusFilter, severityFilter])

  const changeStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateIncident(id, { status })
      await refetch()
    } catch {
      // Row stays interactive; refetch reflects last-known state.
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Incident Management</h1>
        <p className="text-sm text-ink-muted mt-0.5">Every reported incident, with live status control.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {labelize(s)}
            </option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
        >
          <option value="">All severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {capitalize(s)}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading incidents…" />
      ) : (
        <div className="rounded-xl border border-base-border bg-base-surface shadow-panel overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-ink-muted text-xs uppercase font-mono border-b border-base-border">
                <th className="font-normal py-2.5 px-4">Type</th>
                <th className="font-normal py-2.5 px-4">Location</th>
                <th className="font-normal py-2.5 px-4">Description</th>
                <th className="font-normal py-2.5 px-4">Severity</th>
                <th className="font-normal py-2.5 px-4">Status</th>
                <th className="font-normal py-2.5 px-4">Reported</th>
              </tr>
            </thead>
            <tbody>
              {(incidents ?? []).map((inc) => (
                <tr key={inc._id} className="border-b border-base-border last:border-0 hover:bg-base-raised/60">
                  <td className="py-2.5 px-4 whitespace-nowrap">{labelize(inc.type)}</td>
                  <td className="py-2.5 px-4 text-ink-secondary">{inc.location?.address}</td>
                  <td className="py-2.5 px-4 text-ink-secondary max-w-xs truncate" title={inc.description}>
                    {inc.description || '—'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <StatusDot tone={inc.severity} />
                      {capitalize(inc.severity)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={inc.status}
                      disabled={updatingId === inc._id}
                      onChange={(e) => changeStatus(inc._id, e.target.value)}
                      className="bg-base border border-base-border rounded px-1.5 py-1 text-xs text-ink-secondary focus:outline-none focus:ring-1 focus:ring-brand-blueLight disabled:opacity-50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {labelize(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-4 text-ink-muted text-xs whitespace-nowrap">{timeAgo(inc.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(incidents ?? []).length === 0 && (
            <div className="p-4">
              <EmptyRow>No incidents match these filters.</EmptyRow>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
