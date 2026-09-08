import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { ErrorBanner } from '../../components/AsyncState'
import { useAuth } from '../../context/AuthContext'
<<<<<<< HEAD
import { useTheme } from '../../context/ThemeContext'
=======
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
import { createIncident } from '../../api/endpoints'
import { labelize } from '../../utils/format'

const INCIDENT_TYPES = ['flood', 'earthquake', 'landslide', 'fire', 'storm', 'medical', 'other']

const MODES = {
  sos: {
    title: 'Send Emergency SOS',
    subtitle: "Use this when you or someone near you is in immediate danger. It's flagged critical and goes straight to responders.",
    icon: 'Siren',
    tone: 'critical',
    incidentType: 'other',
    severity: 'critical',
    typeChoice: true,
    submitLabel: 'Send SOS',
  },
  report: {
    title: 'Report a Disaster',
    subtitle: 'Tell us what happened and where — this gets logged for government and volunteer response.',
    icon: 'TriangleAlert',
    tone: 'warning',
    incidentType: 'other',
    severity: 'warning',
    typeChoice: true,
    submitLabel: 'Submit report',
  },
  relief: {
    title: 'Request Relief',
    subtitle: 'Ask for supplies — food, water, blankets, medical kits — for yourself or your household/neighborhood.',
    icon: 'HandHeart',
    tone: 'blue',
    incidentType: 'relief-request',
    severity: 'warning',
    typeChoice: false,
    submitLabel: 'Send request',
  },
  missing: {
    title: 'Report Missing Person',
    subtitle: "Flagged critical automatically. Include as much detail as you can — last seen location and appearance help the most.",
    icon: 'UserSearch',
    tone: 'critical',
    incidentType: 'missing-person',
    severity: 'critical',
    typeChoice: false,
    submitLabel: 'Report missing person',
  },
}

<<<<<<< HEAD
const CARD_TONE_DARK = {
=======
const CARD_TONE = {
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
  critical: 'bg-gradient-to-br from-brand-crimson to-brand-crimsondeep text-white',
  warning: 'bg-gradient-to-br from-status-warning to-[#C97F0F] text-base',
  blue: 'bg-gradient-to-br from-brand-blue to-[#0A2E6E] text-white',
}

<<<<<<< HEAD
// In light mode the vivid gradient card becomes a plain neutral card with a
// colored accent border instead — same reasoning as Panel.jsx.
const CARD_ACCENT_LIGHT = {
  critical: 'border-l-status-critical',
  warning: 'border-l-status-warning',
  blue: 'border-l-brand-blueLight',
}

const SUBMIT_BTN_LIGHT = {
  critical: 'bg-status-critical hover:bg-status-critical/90 text-white',
  warning: 'bg-brand-blue hover:bg-brand-blueLight text-white',
  blue: 'bg-brand-blue hover:bg-brand-blueLight text-white',
}

export default function IncidentActionPage({ mode }) {
  const config = MODES[mode]
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const Icon = Icons[config.icon]
  const vivid = theme !== 'light'

  const cardClass = vivid
    ? CARD_TONE_DARK[config.tone]
    : `bg-base-surface border border-base-border border-l-4 ${CARD_ACCENT_LIGHT[config.tone]} text-ink-primary`

  const fieldClass = vivid
    ? 'border-white/20 bg-black/20 placeholder:text-white/40 focus:ring-white/40'
    : 'border-base-border bg-base placeholder:text-ink-muted focus:ring-brand-blueLight'

  const submitClass = vivid
    ? 'bg-white/15 hover:bg-white/25'
    : SUBMIT_BTN_LIGHT[config.tone]
=======
export default function IncidentActionPage({ mode }) {
  const config = MODES[mode]
  const { user } = useAuth()
  const navigate = useNavigate()
  const Icon = Icons[config.icon]
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0

  const [form, setForm] = useState({
    type: config.incidentType,
    description: '',
    address: user?.location?.address || '',
    personName: '',
    itemsNeeded: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      let description = form.description.trim()
      if (mode === 'missing') {
        description = `Missing person: ${form.personName.trim()}. ${description}`.trim()
      }
      if (mode === 'relief') {
        description = `Items needed: ${form.itemsNeeded.trim()}. ${description}`.trim()
      }

      await createIncident({
        type: config.typeChoice ? form.type : config.incidentType,
        description,
        location: { address: form.address.trim() || 'Location not specified' },
        severity: config.severity,
      })
      setSuccess(true)
      setTimeout(() => navigate('/citizen'), 1200)
    } catch (err) {
      setError(err.message || 'Could not submit — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-1">
        {Icon && <Icon size={22} className="text-ink-primary" />}
        <h1 className="font-display text-xl font-semibold text-ink-primary">{config.title}</h1>
      </div>
      <p className="text-sm text-ink-muted mb-6">{config.subtitle}</p>

<<<<<<< HEAD
      <div className={`rounded-xl p-5 shadow-panel ${cardClass}`}>
=======
      <div className={`rounded-xl p-5 shadow-panel ${CARD_TONE[config.tone]}`}>
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
        {success ? (
          <div className="py-6 text-center">
            <p className="text-lg font-medium">Submitted</p>
            <p className="text-sm opacity-80 mt-1">Taking you back to your dashboard…</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 text-ink-primary">
            {error && <ErrorBanner message={error} />}

            {config.typeChoice && (
              <label className="block">
                <span className="block text-xs mb-1.5 opacity-90">Type</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
<<<<<<< HEAD
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${fieldClass}`}
=======
                  className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
                >
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t} value={t} className="text-black">
                      {labelize(t)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {mode === 'missing' && (
              <label className="block">
                <span className="block text-xs mb-1.5 opacity-90">Missing person's name</span>
                <input
                  required
                  value={form.personName}
                  onChange={(e) => setForm({ ...form, personName: e.target.value })}
                  placeholder="Full name"
<<<<<<< HEAD
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${fieldClass}`}
=======
                  className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
                />
              </label>
            )}

            {mode === 'relief' && (
              <label className="block">
                <span className="block text-xs mb-1.5 opacity-90">Items needed</span>
                <input
                  required
                  value={form.itemsNeeded}
                  onChange={(e) => setForm({ ...form, itemsNeeded: e.target.value })}
                  placeholder="e.g. Drinking water, blankets, first aid"
<<<<<<< HEAD
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${fieldClass}`}
=======
                  className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
                />
              </label>
            )}

            <label className="block">
              <span className="block text-xs mb-1.5 opacity-90">Location</span>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Ward, area, or landmark"
<<<<<<< HEAD
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${fieldClass}`}
=======
                className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
              />
            </label>

            <label className="block">
              <span className="block text-xs mb-1.5 opacity-90">
                {mode === 'missing' ? 'Description (last seen, appearance, etc.)' : "What's happening?"}
              </span>
              <textarea
                required={mode !== 'missing'}
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={mode === 'missing' ? 'Last seen wearing... near...' : 'Brief description of the situation'}
<<<<<<< HEAD
                className={`w-full rounded-lg border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 ${fieldClass}`}
=======
                className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
<<<<<<< HEAD
              className={`w-full rounded-lg transition-colors text-sm font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed ${submitClass}`}
=======
              className="w-full rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
>>>>>>> f777fe8277c87931d66a9b1a66f20985ab7a64e0
            >
              {submitting ? 'Submitting…' : config.submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
