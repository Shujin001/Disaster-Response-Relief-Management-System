import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import StatusDot from '../../components/StatusDot'
import { useApi } from '../../hooks/useApi'
import { getVolunteerTasks, createVolunteerTask } from '../../api/endpoints'
import { timeAgo, capitalize, labelize } from '../../utils/format'

const COLUMNS = [
  { status: 'open', label: 'Open' },
  { status: 'assigned', label: 'Assigned' },
  { status: 'in-progress', label: 'In Progress' },
  { status: 'completed', label: 'Completed' },
]

const PRIORITIES = ['critical', 'warning', 'safe', 'info']

export default function RescueTeamsPage() {
  const fetchTasks = useCallback(async () => {
    const res = await getVolunteerTasks('?limit=200')
    return res.data
  }, [])

  const { data: tasks, loading, error, refetch } = useApi(fetchTasks, [])

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', location: '', priority: 'info', dueDate: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await createVolunteerTask({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        location: form.location.trim() || undefined,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      })
      setForm({ title: '', description: '', location: '', priority: 'info', dueDate: '' })
      setShowForm(false)
      refetch()
    } catch (err) {
      setFormError(err.message || 'Could not create task.')
    } finally {
      setSubmitting(false)
    }
  }

  const grouped = COLUMNS.map((col) => ({
    ...col,
    items: (tasks ?? []).filter((t) => t.status === col.status),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-primary">Rescue Team Management</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Volunteer tasks grouped by status — this is how rescue work gets assigned and tracked.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium px-3.5 py-2 shrink-0"
        >
          <Plus size={15} /> New Task
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel grid sm:grid-cols-2 gap-3"
        >
          {formError && (
            <div className="sm:col-span-2">
              <ErrorBanner message={formError} />
            </div>
          )}
          <label className="block sm:col-span-2">
            <span className="block text-xs text-ink-muted mb-1.5">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Distribute water at Sinamangal shelter"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-xs text-ink-muted mb-1.5">Description</span>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight resize-none"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Location</span>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Ward, area, or landmark"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Priority</span>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {capitalize(p)}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-xs text-ink-muted mb-1.5">Due date (optional)</span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create task (starts as Open, any volunteer can claim it)'}
          </button>
        </form>
      )}

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading tasks…" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {grouped.map((col) => (
            <div key={col.status} className="rounded-xl border border-base-border bg-base-surface p-3 shadow-panel">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-xs uppercase font-mono text-ink-muted">{col.label}</h3>
                <span className="text-xs font-mono text-ink-muted">{col.items.length}</span>
              </div>
              <div className="space-y-2">
                {col.items.length === 0 && <EmptyRow>None</EmptyRow>}
                {col.items.map((t) => (
                  <div key={t._id} className="rounded-lg bg-base p-2.5 border border-base-border">
                    <p className="text-sm text-ink-primary leading-snug">{t.title}</p>
                    {t.location && <p className="text-xs text-ink-muted mt-0.5">{t.location}</p>}
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                        <StatusDot tone={t.priority} /> {capitalize(t.priority)}
                      </span>
                      <span className="text-[10px] text-ink-muted">{timeAgo(t.createdAt)}</span>
                    </div>
                    {t.assignedTo?.name && (
                      <p className="text-[11px] text-ink-secondary mt-1">→ {t.assignedTo.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
