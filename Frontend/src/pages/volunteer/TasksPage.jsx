import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Clock, Play, Flag } from 'lucide-react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import StatusDot from '../../components/StatusDot'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import { getVolunteerTasks, claimVolunteerTask, updateVolunteerTask } from '../../api/endpoints'
import { timeAgo, capitalize } from '../../utils/format'

const statusIcon = { completed: CheckCircle2, 'in-progress': Clock, assigned: Circle, open: Circle }

export default function TasksPage() {
  const { user } = useAuth()
  const [busyId, setBusyId] = useState(null)

  const fetchTasks = useCallback(async () => {
    const [mineRes, openRes] = await Promise.all([
      getVolunteerTasks(`?assignedTo=${user._id}&limit=100`),
      getVolunteerTasks('?status=open&limit=50'),
    ])
    return { mine: mineRes.data, open: openRes.data }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  const { data, loading, error, refetch } = useApi(fetchTasks, [user?._id])

  const act = async (id, fn) => {
    setBusyId(id)
    try {
      await fn(id)
      await refetch()
    } finally {
      setBusyId(null)
    }
  }

  const mine = data?.mine ?? []
  const open = data?.open ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Assigned Tasks</h1>
        <p className="text-sm text-ink-muted mt-0.5">Everything assigned to you, plus open tasks you can claim.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading tasks…" />
      ) : (
        <>
          <section className="space-y-2">
            <h2 className="text-xs uppercase font-mono text-ink-muted">My Tasks ({mine.length})</h2>
            {mine.length === 0 && <EmptyRow>Nothing assigned to you yet — claim an open task below.</EmptyRow>}
            {mine.map((t) => {
              const Icon = statusIcon[t.status] || Circle
              return (
                <div
                  key={t._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-base-border bg-base-surface p-4 shadow-panel"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Icon size={16} className="mt-0.5 shrink-0 text-ink-secondary" />
                    <div className="min-w-0">
                      <Link to={`/volunteer/tasks/${t._id}`} className="text-ink-primary hover:underline">
                        {t.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                        <span>{t.location}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <StatusDot tone={t.priority} /> {capitalize(t.priority)}
                        </span>
                        <span>· {timeAgo(t.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {t.status === 'assigned' && (
                    <button
                      onClick={() => act(t._id, (id) => updateVolunteerTask(id, { status: 'in-progress' }))}
                      disabled={busyId === t._id}
                      className="shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-brand-blue hover:bg-brand-blueLight text-white transition-colors disabled:opacity-60"
                    >
                      <Play size={12} /> Start
                    </button>
                  )}
                  {t.status === 'in-progress' && (
                    <button
                      onClick={() => act(t._id, (id) => updateVolunteerTask(id, { status: 'completed' }))}
                      disabled={busyId === t._id}
                      className="shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-status-safe hover:bg-status-safe/90 text-white transition-colors disabled:opacity-60"
                    >
                      <Flag size={12} /> Complete
                    </button>
                  )}
                  {t.status === 'completed' && (
                    <span className="shrink-0 text-xs text-status-safe flex items-center gap-1">
                      <CheckCircle2 size={13} /> Done
                    </span>
                  )}
                </div>
              )
            })}
          </section>

          <section className="space-y-2">
            <h2 className="text-xs uppercase font-mono text-ink-muted">Open Tasks You Can Claim ({open.length})</h2>
            {open.length === 0 && <EmptyRow>No unclaimed tasks right now.</EmptyRow>}
            {open.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-base-border bg-base-surface p-4 shadow-panel"
              >
                <div className="min-w-0">
                  <Link to={`/volunteer/tasks/${t._id}`} className="text-ink-primary hover:underline">
                    {t.title}
                  </Link>
                  <p className="text-xs text-ink-muted mt-1">{t.location}</p>
                </div>
                <button
                  onClick={() => act(t._id, claimVolunteerTask)}
                  disabled={busyId === t._id}
                  className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-brand-blue hover:bg-brand-blueLight text-white transition-colors disabled:opacity-60"
                >
                  {busyId === t._id ? 'Claiming…' : 'Claim'}
                </button>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
