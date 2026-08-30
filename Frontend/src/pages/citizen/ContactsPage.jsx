import { useCallback } from 'react'
import { Phone, User } from 'lucide-react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getShelters } from '../../api/endpoints'

// National numbers, cross-checked against multiple public sources (Nepal
// Police, U.S. Embassy Kathmandu, National Emergency Operation Centre) as of
// Aug 2026. Always fine to double-check locally — numbers occasionally change.
const NATIONAL_NUMBERS = [
  { label: 'Police', number: '100' },
  { label: 'Emergency (any mobile)', number: '112' },
  { label: 'Ambulance', number: '102' },
  { label: 'Fire Brigade', number: '101' },
  { label: 'Traffic Police', number: '103' },
  { label: 'National Emergency Operation Centre', number: '1149' },
  { label: 'Nepal Red Cross Society', number: '1130' },
]

export default function ContactsPage() {
  const fetchShelters = useCallback(async () => {
    const res = await getShelters('?limit=50')
    return res.data
  }, [])

  const { data: shelters, loading, error, refetch } = useApi(fetchShelters, [])
  const withContact = (shelters ?? []).filter((s) => s.contactPhone)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Emergency Contacts</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          National emergency numbers, verified against multiple public sources — always fine to confirm locally.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {NATIONAL_NUMBERS.map((c) => (
          <a
            key={c.label}
            href={`tel:${c.number}`}
            className="flex items-center justify-between rounded-xl border border-base-border bg-base-surface p-4 shadow-panel hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-status-critical" />
              <span className="text-sm text-ink-primary">{c.label}</span>
            </div>
            <span className="font-mono text-ink-primary font-semibold">{c.number}</span>
          </a>
        ))}
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <div>
        <h2 className="text-xs uppercase font-mono text-ink-muted mb-2">Shelter contacts</h2>
        {loading ? (
          <LoadingState label="Loading shelter contacts…" />
        ) : (
          <div className="space-y-2">
            {withContact.length === 0 && <EmptyRow>No shelter contact numbers on file yet.</EmptyRow>}
            {withContact.map((s) => (
              <a
                key={s._id}
                href={`tel:${s.contactPhone}`}
                className="flex items-center justify-between rounded-xl border border-base-border bg-base-surface p-4 shadow-panel hover:border-white/20 transition-colors"
              >
                <div>
                  <p className="text-sm text-ink-primary">{s.name}</p>
                  {s.contactPerson && (
                    <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                      <User size={11} /> {s.contactPerson}
                    </p>
                  )}
                </div>
                <span className="font-mono text-sm text-ink-secondary shrink-0">{s.contactPhone}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
