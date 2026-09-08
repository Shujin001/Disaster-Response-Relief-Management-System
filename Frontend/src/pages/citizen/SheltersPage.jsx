import { useCallback } from 'react'
import { Phone, User } from 'lucide-react'
import DisasterMap from '../../components/DisasterMap'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getShelters } from '../../api/endpoints'
import { capitalize } from '../../utils/format'

const STATUS_TONE = { open: 'text-status-safe', full: 'text-status-warning', closed: 'text-status-critical' }

export default function SheltersPage() {
  const fetchShelters = useCallback(async () => {
    const res = await getShelters('?limit=50')
    return res.data
  }, [])

  const { data: shelters, loading, error, refetch } = useApi(fetchShelters, [])

  if (loading) return <LoadingState label="Loading shelters…" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Nearby Shelters</h1>
        <p className="text-sm text-ink-muted mt-0.5">All shelters, whether open, full, or closed.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <div className="h-[320px] rounded-xl overflow-hidden">
        <DisasterMap incidents={[]} shelters={shelters ?? []} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(shelters ?? []).length === 0 && <EmptyRow>No shelters listed yet.</EmptyRow>}
        {(shelters ?? []).map((s) => (
          <div key={s._id} className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-ink-primary">{s.name}</p>
              <span className={`text-xs font-mono shrink-0 ${STATUS_TONE[s.status] || ''}`}>
                {capitalize(s.status)}
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-1">{s.location?.address}</p>
            <p className="text-sm text-ink-secondary mt-2">
              {s.occupancy} / {s.capacity} occupied
            </p>
            {s.resourcesAvailable?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {s.resourcesAvailable.map((r) => (
                  <span key={r} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-base-raised text-ink-muted">
                    {r}
                  </span>
                ))}
              </div>
            )}
            {(s.contactPerson || s.contactPhone) && (
              <div className="mt-3 pt-3 border-t border-base-border space-y-1 text-xs text-ink-secondary">
                {s.contactPerson && (
                  <p className="flex items-center gap-1.5">
                    <User size={12} className="text-ink-muted" /> {s.contactPerson}
                  </p>
                )}
                {s.contactPhone && (
                  <a href={`tel:${s.contactPhone}`} className="flex items-center gap-1.5 hover:text-ink-primary">
                    <Phone size={12} className="text-ink-muted" /> {s.contactPhone}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
