import { useState } from 'react'
import { CircleUser, Mail, Shield } from 'lucide-react'
import { ErrorBanner } from '../../components/AsyncState'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/endpoints'
import { capitalize, initialsOf, formatDate } from '../../utils/format'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.location?.address || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: { ...user?.location, address: form.address.trim() },
      })
      updateUser(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-brand-blue flex items-center justify-center text-lg font-display font-semibold text-white shrink-0">
          {initialsOf(user.name)}
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-primary">{user.name}</h1>
          <p className="text-sm text-ink-muted flex items-center gap-1.5">
            <Shield size={13} /> {capitalize(user.role)} · Member since {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-base-border bg-base-surface p-5 shadow-panel">
        {error && <ErrorBanner message={error} />}
        {saved && (
          <p className="text-sm text-status-safe mb-4 flex items-center gap-1.5">
            <CircleUser size={14} /> Profile updated.
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Full name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>

          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5 flex items-center gap-1.5">
              <Mail size={12} /> Email
            </span>
            <input
              disabled
              value={user.email}
              title="Email can't be changed here"
              className="w-full rounded-lg border border-base-border bg-base-raised px-3 py-2.5 text-sm text-ink-muted cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Phone</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+977-98..."
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>

          <label className="block">
            <span className="block text-xs text-ink-muted mb-1.5">Address</span>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ward, area, or landmark"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-brand-blue hover:bg-brand-blueLight transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
