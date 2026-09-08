import { useCallback } from 'react'
import { MapPin } from 'lucide-react'
import DisasterMap from '../../components/DisasterMap'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import { getVolunteerDashboard, getShelters } from '../../api/endpoints'
import { capitalize } from '../../utils/format'

export default function NavigationPage() {
  const { user } = useAuth()

  const fetchData = useCallback(async () => {
    const [overview, sheltersRes] = await Promise.all([getVolunteerDashboard(), getShelters('?limit=50')])
    return { ...overview.data, shelters: sheltersRes.data }
  }, [])

  const { data, loading, error, refetch } = useApi(fetchData, [])
  const myTasks = (data?.myTasks ?? []).filter((t) => t.status !== 'completed')

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Navigation</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Active incidents and shelters near you, plus your open task addresses.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading field data…" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[420px] rounded-xl overflow-hidden">
            <DisasterMap
              incidents={data?.activeIncidents ?? []}
              shelters={data?.shelters ?? []}
              userLocation={user?.location?.lat ? user.location : undefined}
            />
          </div>

          <div className="rounded-xl border border-base-border bg-base-surface p-4 shadow-panel h-fit">
            <h2 className="text-xs uppercase font-mono text-ink-muted mb-3">Your Task Locations</h2>
            <p className="text-xs text-ink-muted mb-3 leading-relaxed">
              Tasks are recorded with a text address, not map coordinates, so they're listed here rather than
              pinned on the map above.
            </p>
            <div className="space-y-2.5">
              {myTasks.length === 0 && <EmptyRow>No open tasks right now.</EmptyRow>}
              {myTasks.map((t) => (
                <div key={t._id} className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="text-ink-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ink-primary leading-snug">{t.title}</p>
                    <p className="text-xs text-ink-muted">
                      {t.location || 'No address given'} · {capitalize(t.status)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
