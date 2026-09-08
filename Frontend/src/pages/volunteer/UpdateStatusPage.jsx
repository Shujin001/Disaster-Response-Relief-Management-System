import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCcw } from 'lucide-react'
import { ErrorBanner } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import { getVolunteerTasks, updateVolunteerTask } from '../../api/endpoints'
import { labelize } from '../../utils/format'

const STATUSES = ['assigned', 'in-progress', 'completed']

export default function UpdateStatusPage() {
  const { user } = useAuth()

  const fetchTasks = useCallback(async () => {
    const res = await getVolunteerTasks(`?assignedTo=${user._id}&limit=100`)
    return res.data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  const { data: tasks, refetch } = useApi(fetchTasks, [user?._id])

  const [taskId, setTaskId] = useState('')
  const [status, setStatus] = useState('in-progress')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!taskId) {
      setError('Choose a task first.')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess(false)
    try {
      await updateVolunteerTask(taskId, { status })
      setSuccess(true)
      await refetch()
    } catch (err) {
      setError(err.message || 'Could not update status.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="flex items-center gap-3">
        <RefreshCcw size={22} className="text-ink-primary" />
        <h1 className="font-display text-xl font-semibold text-ink-primary">Update Status</h1>
      </div>
      <p className="text-sm text-ink-muted">Change the status of any task assigned to you.</p>

      <div className="rounded-xl border border-base-border bg-base-surface p-5 shadow-panel">
        {error && <ErrorBanner message={error} />}
        {success && <p className="text-sm text-status-safe mb-4">Status updated.</p>}

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Task</span>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            >
              <option value="">Select a task…</option>
              {(tasks ?? []).map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title} ({labelize(t.status)})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">New status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {labelize(s)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-blue hover:bg-brand-blueLight transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60"
          >
            {submitting ? 'Updating…' : 'Update status'}
          </button>
        </form>
      </div>

      {(tasks ?? []).length === 0 && (
        <p className="text-sm text-ink-muted">
          You have no assigned tasks yet — claim one from{' '}
          <Link to="/volunteer/tasks" className="text-brand-blueLight hover:underline">
            Assigned Tasks
          </Link>
          .
        </p>
      )}
    </div>
  )
}
