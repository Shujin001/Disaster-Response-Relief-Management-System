import { useCallback } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import { getVolunteerTasks } from '../../api/endpoints'
import { timeAgo, formatDate } from '../../utils/format'

export default function ActivityPage() {
  const { user } = useAuth()

  const fetchCompleted = useCallback(async () => {
    const res = await getVolunteerTasks(`?assignedTo=${user._id}&status=completed&limit=200`)
    return res.data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  const { data: tasks, loading, error, refetch } = useApi(fetchCompleted, [user?._id])

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Activity History</h1>
        <p className="text-sm text-ink-muted mt-0.5">Every task you've completed.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading activity…" />
      ) : (
        <div className="space-y-2">
          {(tasks ?? []).length === 0 && <EmptyRow>Nothing completed yet — it'll show up here once you do.</EmptyRow>}
          {(tasks ?? []).map((t) => (
            <div key={t._id} className="flex items-start gap-3 rounded-xl border border-base-border bg-base-surface p-4 shadow-panel">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-status-safe" />
              <div className="flex-1">
                <p className="text-ink-primary">{t.title}</p>
                {t.location && <p className="text-xs text-ink-muted mt-0.5">{t.location}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-ink-muted">{formatDate(t.updatedAt)}</p>
                <p className="text-[11px] text-ink-muted">{timeAgo(t.updatedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
