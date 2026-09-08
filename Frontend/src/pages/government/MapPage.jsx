import { useCallback } from 'react'
import DisasterMap from '../../components/DisasterMap'
import { ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getIncidents, getShelters } from '../../api/endpoints'

export default function MapPage() {
  const fetchData = useCallback(async () => {
    const [incidentsRes, sheltersRes] = await Promise.all([
      getIncidents('?limit=200'),
      getShelters('?limit=100'),
    ])
    return { incidents: incidentsRes.data, shelters: sheltersRes.data }
  }, [])

  const { data, loading, error, refetch } = useApi(fetchData, [])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="font-display text-xl font-semibold text-ink-primary">Live Disaster Map</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Every incident and shelter currently on record, plotted with real coordinates.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading map data…" />
      ) : (
        <div className="flex-1 min-h-[520px]">
          <DisasterMap incidents={data?.incidents ?? []} shelters={data?.shelters ?? []} />
        </div>
      )}
    </div>
  )
}
