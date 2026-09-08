import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Megaphone } from 'lucide-react'
import { ErrorBanner } from '../../components/AsyncState'
import { useTheme } from '../../context/ThemeContext'
import { createAlert } from '../../api/endpoints'
import { capitalize } from '../../utils/format'

const ALERT_SEVERITIES = ['critical', 'warning', 'info', 'safe']

export default function IssueAlertPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const vivid = theme !== 'light'

  const cardClass = vivid
    ? 'bg-gradient-to-br from-brand-crimson to-brand-crimsondeep text-white'
    : 'bg-base-surface border border-base-border border-l-4 border-l-status-critical text-ink-primary'

  const fieldClass = vivid
    ? 'border-white/20 bg-black/20 placeholder:text-white/40 focus:ring-white/40'
    : 'border-base-border bg-base placeholder:text-ink-muted focus:ring-brand-blueLight'

  const cancelBtnClass = vivid
    ? 'border-white/25 hover:bg-white/10'
    : 'border-base-border hover:bg-base-raised text-ink-primary'

  const submitBtnClass = vivid
    ? 'bg-white/15 hover:bg-white/25'
    : 'bg-brand-crimson hover:bg-brand-crimsondeep text-white'

  const [form, setForm] = useState({ title: '', message: '', severity: 'warning', area: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await createAlert({
        title: form.title.trim(),
        message: form.message.trim(),
        severity: form.severity,
        area: form.area.trim() || undefined,
        active: true,
      })
      setSuccess(true)
      setTimeout(() => navigate('/government/announcements'), 1000)
    } catch (err) {
      setError(err.message || 'Could not issue alert.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-1">
        <Megaphone size={22} className="text-ink-primary" />
        <h1 className="font-display text-xl font-semibold text-ink-primary">Issue Alert</h1>
      </div>
      <p className="text-sm text-ink-muted mb-6">
        Published immediately to every citizen and volunteer viewing active alerts.
      </p>

      <div className={`rounded-xl p-5 shadow-panel ${cardClass}`}>
        {success ? (
          <div className="py-6 text-center">
            <p className="text-lg font-medium">Alert published</p>
            <p className="text-sm opacity-80 mt-1">Taking you back to announcements…</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <ErrorBanner message={error} />}

            <label className="block">
              <span className="block text-xs mb-1.5 opacity-90">Title</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Flood Warning: Bagmati River Basin"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${fieldClass}`}
              />
            </label>

            <label className="block">
              <span className="block text-xs mb-1.5 opacity-90">Message</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What should people do?"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 ${fieldClass}`}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs mb-1.5 opacity-90">Severity</span>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${fieldClass}`}
                >
                  {ALERT_SEVERITIES.map((s) => (
                    <option key={s} value={s} className="text-black">
                      {capitalize(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs mb-1.5 opacity-90">Area (optional)</span>
                <input
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="Kathmandu Valley"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${fieldClass}`}
                />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/government/announcements')}
                className={`rounded-lg border transition-colors text-sm font-medium px-4 py-2.5 ${cancelBtnClass}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 rounded-lg transition-colors text-sm font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed ${submitBtnClass}`}
              >
                {submitting ? 'Publishing…' : 'Publish alert'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
