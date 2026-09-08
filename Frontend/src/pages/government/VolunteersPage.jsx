import { useCallback, useState } from 'react'
import { ShieldCheck, ShieldX, ShieldQuestion } from 'lucide-react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getUsers, updateUserStatus } from '../../api/endpoints'
import { formatDate } from '../../utils/format'

const STATUS_META = {
  active: { icon: ShieldCheck, color: 'text-status-safe', label: 'Active' },
  inactive: { icon: ShieldQuestion, color: 'text-status-warning', label: 'Pending' },
  suspended: { icon: ShieldX, color: 'text-status-critical', label: 'Suspended' },
}

export default function VolunteersPage() {
  const fetchVolunteers = useCallback(async () => {
    const res = await getUsers('?role=volunteer')
    return res.data
  }, [])

  const { data: volunteers, loading, error, refetch } = useApi(fetchVolunteers, [])
  const [updatingId, setUpdatingId] = useState(null)

  const setStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateUserStatus(id, status)
      await refetch()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Volunteer Verification</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Approve, hold, or suspend volunteer accounts. New sign-ups start as "Active" by default — mark them
          "Pending" if you want to review before they take tasks.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading volunteers…" />
      ) : (
        <div className="space-y-2">
          {(volunteers ?? []).length === 0 && <EmptyRow>No volunteers registered yet.</EmptyRow>}
          {(volunteers ?? []).map((v) => {
            const meta = STATUS_META[v.status] || STATUS_META.active
            const Icon = meta.icon
            return (
              <div
                key={v._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-base-border bg-base-surface p-4 shadow-panel"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={18} className={`shrink-0 ${meta.color}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-ink-primary truncate">{v.name}</p>
                    <p className="text-xs text-ink-muted truncate">
                      {v.email} {v.phone ? `· ${v.phone}` : ''} · Joined {formatDate(v.createdAt)}
                    </p>
                  </div>
                </div>
                <select
                  value={v.status}
                  disabled={updatingId === v._id}
                  onChange={(e) => setStatus(v._id, e.target.value)}
                  className="bg-base border border-base-border rounded px-2 py-1.5 text-xs text-ink-secondary focus:outline-none focus:ring-1 focus:ring-brand-blueLight disabled:opacity-50 shrink-0"
                >
                  {Object.entries(STATUS_META).map(([value, m]) => (
                    <option key={value} value={value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
