import { useCallback, useState } from 'react'
import { Siren, TriangleAlert, HandHeart, UserSearch } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import StatusDot from '../components/StatusDot'
import Modal from '../components/Modal'
import DisasterMap from '../components/DisasterMap'
import { LoadingState, ErrorBanner, EmptyRow } from '../components/AsyncState'
import { citizenSidebar } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useViewUser } from '../hooks/useViewUser'
import { useApi } from '../hooks/useApi'
import { getCitizenDashboard, createIncident } from '../api/endpoints'
import { timeAgo, formatDate, labelize } from '../utils/format'

const INCIDENT_TYPES = ['flood', 'earthquake', 'landslide', 'fire', 'storm', 'medical', 'other']

// Each quick action maps to a real Incident `type` on the backend, plus a
// default severity and the label/fields shown in the modal.
const ACTIONS = {
  sos: { title: 'Send Emergency SOS', type: 'other', severity: 'critical', typeChoice: true },
  report: { title: 'Report a Disaster', type: 'other', severity: 'warning', typeChoice: true },
  relief: { title: 'Request Relief', type: 'relief-request', severity: 'warning', typeChoice: false },
  missing: { title: 'Report Missing Person', type: 'missing-person', severity: 'critical', typeChoice: false },
}

export default function CitizenDashboard() {
  const [active, setActive] = useState(0)
  const { user } = useAuth()
  const viewUser = useViewUser()

  const fetchAll = useCallback(async () => {
    const res = await getCitizenDashboard()
    return res.data
  }, [])

  const { data, loading, error, refetch } = useApi(fetchAll, [])

  const [modalMode, setModalMode] = useState(null) // null | 'sos' | 'report' | 'relief' | 'missing'
  const [form, setForm] = useState({
    type: 'other',
    description: '',
    address: user?.location?.address || '',
    personName: '',
    itemsNeeded: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const openModal = (mode) => {
    setForm({
      type: ACTIONS[mode].type,
      description: '',
      address: user?.location?.address || '',
      personName: '',
      itemsNeeded: '',
    })
    setSubmitError('')
    setModalMode(mode)
  }

  const submitIncident = async (e) => {
    e.preventDefault()
    const action = ACTIONS[modalMode]
    setSubmitting(true)
    setSubmitError('')
    try {
      let description = form.description.trim()
      if (modalMode === 'missing') {
        description = `Missing person: ${form.personName.trim()}. ${description}`.trim()
      }
      if (modalMode === 'relief') {
        description = `Items needed: ${form.itemsNeeded.trim()}. ${description}`.trim()
      }

      await createIncident({
        type: action.typeChoice ? form.type : action.type,
        description,
        location: { address: form.address.trim() || 'Location not specified' },
        severity: action.severity,
      })
      setModalMode(null)
      refetch()
    } catch (err) {
      setSubmitError(err.message || 'Could not submit — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingState label="Loading your dashboard…" />

  const alerts = data?.activeAlerts ?? []
  const myReports = data?.myReports ?? []
  const shelters = data?.openShelters ?? []
  const nearbyIncidents = data?.nearbyIncidents ?? []

  const stats = [
    { label: 'Active Alerts', value: alerts.length, tone: alerts.length > 0 ? 'critical' : 'safe' },
    {
      label: 'My Reports',
      value: myReports.length,
      delta: `${myReports.filter((r) => r.status !== 'resolved').length} open`,
      tone: 'warning',
    },
    { label: 'Open Shelters', value: shelters.length, tone: 'info' },
    { label: 'Nearby Incidents', value: nearbyIncidents.length, tone: 'idle' },
  ]

  return (
    <div className="flex h-screen flex-col bg-base">
      <Header user={viewUser} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={citizenSidebar} activeIndex={active} onSelect={setActive} accent="blue" user={viewUser} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-primary">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-ink-muted mt-0.5">
              Stay informed and get help fast during emergencies.
            </p>
          </div>

          {error && <ErrorBanner message={error} onRetry={refetch} />}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel title="Disaster Map" icon="Map" tone="critical" size="lg" className="lg:col-span-2">
              <div className="h-[320px]">
                <DisasterMap
                  incidents={nearbyIncidents}
                  shelters={shelters}
                  userLocation={user?.location?.lat ? user.location : undefined}
                />
              </div>
            </Panel>

            <Panel title="Emergency Alerts" icon="BellRing" tone="blue">
              <ul className="space-y-2.5">
                {alerts.length === 0 && <EmptyRow>No active alerts right now.</EmptyRow>}
                {alerts.map((a) => (
                  <li key={a._id} className="flex items-start gap-2">
                    <StatusDot tone={a.severity} pulse={a.severity === 'critical'} className="mt-1" />
                    <div>
                      <p className="leading-snug">{a.title}</p>
                      <span className="text-xs opacity-70">{timeAgo(a.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Quick Actions" icon="Zap" tone="safe">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openModal('sos')}
                  className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
                >
                  <Siren size={18} />
                  <span className="text-xs leading-tight">Send Emergency SOS</span>
                </button>
                <button
                  onClick={() => openModal('report')}
                  className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
                >
                  <TriangleAlert size={18} />
                  <span className="text-xs leading-tight">Report a Disaster</span>
                </button>
                <button
                  onClick={() => openModal('relief')}
                  className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
                >
                  <HandHeart size={18} />
                  <span className="text-xs leading-tight">Request Relief</span>
                </button>
                <button
                  onClick={() => openModal('missing')}
                  className="flex flex-col items-start gap-2 rounded-lg bg-black/15 hover:bg-black/25 transition-colors p-3 text-left"
                >
                  <UserSearch size={18} />
                  <span className="text-xs leading-tight">Report Missing Person</span>
                </button>
              </div>
            </Panel>

            <Panel title="My Reports" icon="Inbox" tone="neutral">
              <ul className="space-y-3">
                {myReports.length === 0 && <EmptyRow>You haven't reported anything yet.</EmptyRow>}
                {myReports.slice(0, 6).map((r) => (
                  <li key={r._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-ink-primary">{labelize(r.type)}</p>
                      <p className="text-xs text-ink-muted font-mono">{formatDate(r.createdAt)}</p>
                    </div>
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded-full border ${
                        r.status === 'resolved'
                          ? 'border-status-safe/40 text-status-safe'
                          : 'border-status-warning/40 text-status-warning'
                      }`}
                    >
                      {labelize(r.status)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Nearby Shelters" icon="Home" tone="neutral">
              <ul className="space-y-3">
                {shelters.length === 0 && <EmptyRow>No open shelters listed.</EmptyRow>}
                {shelters.map((s) => (
                  <li key={s._id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-ink-primary">{s.name}</p>
                      <span
                        className={`text-xs font-mono ${
                          s.occupancy >= s.capacity ? 'text-status-critical' : 'text-status-safe'
                        }`}
                      >
                        {s.occupancy >= s.capacity ? 'Full' : 'Open'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {s.location?.address} • {s.occupancy} / {s.capacity} occupied
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Nearby Incidents" icon="Megaphone" tone="neutral">
              <ul className="space-y-3">
                {nearbyIncidents.length === 0 && <EmptyRow>No unresolved incidents nearby.</EmptyRow>}
                {nearbyIncidents.slice(0, 6).map((inc) => (
                  <li key={inc._id} className="text-sm">
                    <p className="text-ink-primary leading-snug">
                      {labelize(inc.type)} — {inc.location?.address}
                    </p>
                    <span className="text-xs text-ink-muted">{timeAgo(inc.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </main>
      </div>

      {modalMode && (
        <Modal title={ACTIONS[modalMode].title} onClose={() => setModalMode(null)}>
          <form onSubmit={submitIncident} className="space-y-4">
            {submitError && <ErrorBanner message={submitError} />}

            {ACTIONS[modalMode].typeChoice && (
              <label className="block">
                <span className="block text-xs text-ink-muted mb-1.5">Type</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
                >
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {labelize(t)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {modalMode === 'missing' && (
              <label className="block">
                <span className="block text-xs text-ink-muted mb-1.5">Missing person's name</span>
                <input
                  required
                  value={form.personName}
                  onChange={(e) => setForm({ ...form, personName: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
                />
              </label>
            )}

            {modalMode === 'relief' && (
              <label className="block">
                <span className="block text-xs text-ink-muted mb-1.5">Items needed</span>
                <input
                  required
                  value={form.itemsNeeded}
                  onChange={(e) => setForm({ ...form, itemsNeeded: e.target.value })}
                  placeholder="e.g. Drinking water, blankets, first aid"
                  className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
                />
              </label>
            )}

            <label className="block">
              <span className="block text-xs text-ink-muted mb-1.5">Location</span>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Ward, area, or landmark"
                className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
              />
            </label>

            <label className="block">
              <span className="block text-xs text-ink-muted mb-1.5">
                {modalMode === 'missing' ? 'Description (last seen, appearance, etc.)' : "What's happening?"}
              </span>
              <textarea
                required={modalMode !== 'missing'}
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={modalMode === 'missing' ? 'Last seen wearing... near...' : 'Brief description of the situation'}
                className="w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight resize-none"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-lg text-white text-sm font-medium py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                ACTIONS[modalMode].severity === 'critical'
                  ? 'bg-status-critical hover:bg-status-critical/90'
                  : 'bg-brand-blue hover:bg-brand-blueLight'
              }`}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
