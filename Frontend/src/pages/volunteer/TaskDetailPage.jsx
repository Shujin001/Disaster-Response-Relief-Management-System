import { useCallback, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Flag, CheckCircle2 } from 'lucide-react'
import { ErrorBanner, LoadingState } from '../../components/AsyncState'
import StatusDot from '../../components/StatusDot'
import { useApi } from '../../hooks/useApi'
import { getVolunteerTask, claimVolunteerTask, updateVolunteerTask } from '../../api/endpoints'
import { timeAgo, formatDate, capitalize, labelize } from '../../utils/format'

export default function TaskDetailPage() {
  const { id } = useParams()
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  const fetchTask = useCallback(async () => {
    const res = await getVolunteerTask(id)
    return res.data
  }, [id])

  const { data: task, loading, error, refetch } = useApi(fetchTask, [id])

  const act = async (fn) => {
    setBusy(true)
    setActionError('')
    try {
      await fn(id)
      await refetch()
    } catch (err) {
      setActionError(err.message || 'Could not update this task.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingState label="Loading task…" />
  if (error) return <ErrorBanner message={error} onRetry={refetch} />
  if (!task) return null

  return (
    <div className="max-w-xl space-y-4">
      <Link to="/volunteer/tasks" className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink-primary">
        <ArrowLeft size={14} /> Back to tasks
      </Link>

      {actionError && <ErrorBanner message={actionError} />}

      <div className="rounded-xl border border-base-border bg-base-surface p-5 shadow-panel">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-xl font-semibold text-ink-primary">{task.title}</h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono shrink-0">
            <StatusDot tone={task.priority} /> {capitalize(task.priority)}
          </span>
        </div>

        {task.description && <p className="text-sm text-ink-secondary mt-3 leading-relaxed">{task.description}</p>}

        <dl className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">Location</dt>
            <dd className="text-ink-primary">{task.location || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Status</dt>
            <dd className="text-ink-primary">{labelize(task.status)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Due date</dt>
            <dd className="text-ink-primary">{task.dueDate ? formatDate(task.dueDate) : '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Created</dt>
            <dd className="text-ink-primary">{timeAgo(task.createdAt)}</dd>
          </div>
          {task.assignedTo?.name && (
            <div>
              <dt className="text-xs text-ink-muted">Assigned to</dt>
              <dd className="text-ink-primary">{task.assignedTo.name}</dd>
            </div>
          )}
          {task.incident && (
            <div>
              <dt className="text-xs text-ink-muted">Related incident</dt>
              <dd className="text-ink-primary">{labelize(task.incident.type || '')}</dd>
            </div>
          )}
        </dl>

        <div className="flex gap-3 mt-6">
          {task.status === 'open' && (
            <button
              onClick={() => act(claimVolunteerTask)}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blueLight transition-colors text-white text-sm font-medium px-4 py-2.5 disabled:opacity-60"
            >
              Claim this task
            </button>
          )}
          {task.status === 'assigned' && (
            <button
              onClick={() => act((id) => updateVolunteerTask(id, { status: 'in-progress' }))}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blueLight transition-colors text-white text-sm font-medium px-4 py-2.5 disabled:opacity-60"
            >
              <Play size={14} /> Start task
            </button>
          )}
          {task.status === 'in-progress' && (
            <button
              onClick={() => act((id) => updateVolunteerTask(id, { status: 'completed' }))}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg bg-status-safe hover:bg-status-safe/90 transition-colors text-white text-sm font-medium px-4 py-2.5 disabled:opacity-60"
            >
              <Flag size={14} /> Mark complete
            </button>
          )}
          {task.status === 'completed' && (
            <span className="flex items-center gap-1.5 text-sm text-status-safe">
              <CheckCircle2 size={16} /> Completed
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
