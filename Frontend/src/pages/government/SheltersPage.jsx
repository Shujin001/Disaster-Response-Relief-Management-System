import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import DisasterMap from '../../components/DisasterMap'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getShelters, createShelter, updateShelter } from '../../api/endpoints'
import { capitalize } from '../../utils/format'

const STATUSES = ['open', 'full', 'closed']

const emptyForm = { name: '', address: '', lat: '', lng: '', capacity: '', contactPerson: '', contactPhone: '' }

export default function SheltersPage() {
  const fetchShelters = useCallback(async () => {
    const res = await getShelters('?limit=100')
    return res.data
  }, [])

  const { data: shelters, loading, error, refetch } = useApi(fetchShelters, [])

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
      await createShelter({
        name: form.name.trim(),
        location: {
          address: form.address.trim(),
          lat: form.lat ? Number(form.lat) : undefined,
          lng: form.lng ? Number(form.lng) : undefined,
        },
        capacity: Number(form.capacity) || 0,
        contactPerson: form.contactPerson.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
      })
      setForm(emptyForm)
      setShowForm(false)
      refetch()
    } catch (err) {
      setFormError(err.message || 'Could not create shelter.')
    } finally {
      setSubmitting(false)
    }
  }

  const changeStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateShelter(id, { status })
      await refetch()
    } finally {
      setUpdatingId(null)
    }
  }

  const changeOccupancy = async (id, occupancy) => {
    setUpdatingId(id)
    try {
      await updateShelter(id, { occupancy })
      await refetch()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-primary">Shelter Management</h1>
          <p className="text-sm text-ink-muted mt-0.5">Create shelters and keep occupancy/status current.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium px-3.5 py-2 shrink-0"
        >
          <Plus size={15} /> New Shelter
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
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-xs text-ink-muted mb-1.5">Address</span>
            <input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Latitude (optional)</span>
            <input
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              placeholder="27.7172"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Longitude (optional)</span>
            <input
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              placeholder="85.3240"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Capacity</span>
            <input
              required
              type="number"
              min="0"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Contact phone (optional)</span>
            <input
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-xs text-ink-muted mb-1.5">Contact person (optional)</span>
            <input
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 rounded-lg bg-brand-crimson hover:bg-brand-crimsondeep transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create shelter'}
          </button>
        </form>
      )}

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading shelters…" />
      ) : (
        <>
          <div className="h-[280px] rounded-xl overflow-hidden">
            <DisasterMap incidents={[]} shelters={shelters ?? []} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(shelters ?? []).length === 0 && <EmptyRow>No shelters yet.</EmptyRow>}
            {(shelters ?? []).map((s) => (
              <div key={s._id} className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-ink-primary">{s.name}</p>
                  <select
                    value={s.status}
                    disabled={updatingId === s._id}
                    onChange={(e) => changeStatus(s._id, e.target.value)}
                    className="bg-base border border-base-border rounded px-1.5 py-1 text-xs text-ink-secondary focus:outline-none focus:ring-1 focus:ring-brand-blueLight disabled:opacity-50 shrink-0"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {capitalize(st)}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-ink-muted mt-1">{s.location?.address}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-ink-secondary">Occupancy:</span>
                  <input
                    type="number"
                    min="0"
                    defaultValue={s.occupancy}
                    disabled={updatingId === s._id}
                    onBlur={(e) => {
                      const val = Number(e.target.value)
                      if (val !== s.occupancy) changeOccupancy(s._id, val)
                    }}
                    className="w-16 rounded border border-base-border bg-base px-1.5 py-0.5 text-xs text-ink-primary focus:outline-none focus:ring-1 focus:ring-brand-blueLight"
                  />
                  <span className="text-xs text-ink-muted">/ {s.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
