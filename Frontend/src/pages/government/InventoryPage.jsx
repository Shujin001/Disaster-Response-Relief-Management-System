import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getResources, createResource, updateResource } from '../../api/endpoints'
import { capitalize } from '../../utils/format'

const CATEGORIES = ['food', 'water', 'medical', 'shelter-supplies', 'clothing', 'equipment', 'other']
const emptyForm = { name: '', category: 'other', quantity: '', unit: 'units', location: '' }

export default function InventoryPage() {
  const fetchResources = useCallback(async () => {
    const res = await getResources('?limit=200')
    return res.data
  }, [])

  const { data: resources, loading, error, refetch } = useApi(fetchResources, [])

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await createResource({
        name: form.name.trim(),
        category: form.category,
        quantity: Number(form.quantity) || 0,
        unit: form.unit.trim() || 'units',
        location: form.location.trim() || undefined,
      })
      setForm(emptyForm)
      setShowForm(false)
      refetch()
    } catch (err) {
      setFormError(err.message || 'Could not add resource.')
    } finally {
      setSubmitting(false)
    }
  }

  const changeQuantity = async (id, quantity) => {
    setUpdatingId(id)
    try {
      await updateResource(id, { quantity })
      await refetch()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-primary">Inventory</h1>
          <p className="text-sm text-ink-muted mt-0.5">Track supply levels across all categories.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium px-3.5 py-2 shrink-0"
        >
          <Plus size={15} /> New Resource
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
            <span className="block text-xs text-ink-muted mb-1.5">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Bottled water (1L)"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {capitalize(c.replace('-', ' '))}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Unit</span>
            <input
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="units, boxes, liters…"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Quantity</span>
            <input
              required
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Location (optional)</span>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60"
          >
            {submitting ? 'Adding…' : 'Add resource'}
          </button>
        </form>
      )}

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading inventory…" />
      ) : (
        <div className="rounded-xl border border-base-border bg-base-surface shadow-panel overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-ink-muted text-xs uppercase font-mono border-b border-base-border">
                <th className="font-normal py-2.5 px-4">Name</th>
                <th className="font-normal py-2.5 px-4">Category</th>
                <th className="font-normal py-2.5 px-4">Quantity</th>
                <th className="font-normal py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {(resources ?? []).map((r) => (
                <tr key={r._id} className="border-b border-base-border last:border-0 hover:bg-base-raised/60">
                  <td className="py-2.5 px-4">{r.name}</td>
                  <td className="py-2.5 px-4 text-ink-secondary">{capitalize(r.category.replace('-', ' '))}</td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        defaultValue={r.quantity}
                        disabled={updatingId === r._id}
                        onBlur={(e) => {
                          const val = Number(e.target.value)
                          if (val !== r.quantity) changeQuantity(r._id, val)
                        }}
                        className="w-20 rounded border border-base-border bg-base px-1.5 py-0.5 text-xs text-ink-primary focus:outline-none focus:ring-1 focus:ring-brand-blueLight"
                      />
                      <span className="text-xs text-ink-muted">{r.unit}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`text-xs font-mono ${
                        r.status === 'depleted'
                          ? 'text-status-critical'
                          : r.status === 'low'
                          ? 'text-status-warning'
                          : 'text-status-safe'
                      }`}
                    >
                      {capitalize(r.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(resources ?? []).length === 0 && (
            <div className="p-4">
              <EmptyRow>No resources tracked yet.</EmptyRow>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
