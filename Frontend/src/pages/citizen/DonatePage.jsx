import { useCallback } from 'react'
import { Gift, MapPin, Phone } from 'lucide-react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getShelters } from '../../api/endpoints'

export default function DonatePage() {
  const fetchShelters = useCallback(async () => {
    const res = await getShelters('?status=open&limit=20')
    return res.data
  }, [])

  const { data: shelters, loading, error, refetch } = useApi(fetchShelters, [])

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Gift size={22} className="text-ink-primary" />
        <h1 className="font-display text-xl font-semibold text-ink-primary">Donate</h1>
      </div>

      <div className="rounded-xl border border-base-border bg-base-surface p-5 shadow-panel text-sm text-ink-secondary leading-relaxed">
        <p>
          This system doesn't process online payments or track donations — that's a deliberate choice rather than
          a missing feature, since a disaster-response tool shouldn't be the one handling money without a real
          verified payment processor and financial oversight behind it.
        </p>
        <p className="mt-3">
          The most useful way to help right now is to bring physical supplies — non-perishable food, drinking
          water, blankets, first-aid kits, hygiene items — directly to an open shelter below. If you'd rather give
          money, do it through an established, verified organization such as the{' '}
          <a
            href="https://www.nrcs.org/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-blueLight hover:underline"
          >
            Nepal Red Cross Society
          </a>{' '}
          rather than an informal channel.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}
      {loading ? (
        <LoadingState label="Loading open shelters…" />
      ) : (
        <div>
          <h2 className="text-xs uppercase font-mono text-ink-muted mb-2">Drop off supplies at an open shelter</h2>
          <div className="space-y-2">
            {(shelters ?? []).length === 0 && <EmptyRow>No open shelters listed right now.</EmptyRow>}
            {(shelters ?? []).map((s) => (
              <div key={s._id} className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel">
                <p className="font-medium text-ink-primary">{s.name}</p>
                <p className="text-xs text-ink-muted mt-1 flex items-center gap-1.5">
                  <MapPin size={12} /> {s.location?.address}
                </p>
                {s.contactPhone && (
                  <a
                    href={`tel:${s.contactPhone}`}
                    className="text-xs text-ink-secondary mt-1 flex items-center gap-1.5 hover:text-ink-primary w-fit"
                  >
                    <Phone size={12} /> {s.contactPhone}
                    {s.contactPerson ? ` · ${s.contactPerson}` : ''}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
