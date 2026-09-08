import { useCallback, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getIncidents, getVolunteerTasks, getResources } from '../../api/endpoints'
import { labelize } from '../../utils/format'

const SEVERITY_COLOR = { critical: '#E63946', warning: '#F5A524', safe: '#1FAA59', info: '#3B82F6' }

function groupBy(items, key) {
  const counts = {}
  for (const item of items) counts[item[key]] = (counts[item[key]] || 0) + 1
  return Object.entries(counts).map(([k, count]) => ({ key: k, label: labelize(k), count }))
}

export default function ReportsPage() {
  const fetchAll = useCallback(async () => {
    const [incidentsRes, tasksRes, resourcesRes] = await Promise.all([
      getIncidents('?limit=500'),
      getVolunteerTasks('?limit=500'),
      getResources('?limit=200'),
    ])
    return { incidents: incidentsRes.data, tasks: tasksRes.data, resources: resourcesRes.data }
  }, [])

  const { data, loading, error, refetch } = useApi(fetchAll, [])

  const byType = useMemo(() => groupBy(data?.incidents ?? [], 'type').sort((a, b) => b.count - a.count), [data])
  const bySeverity = useMemo(() => groupBy(data?.incidents ?? [], 'severity'), [data])
  const byStatus = useMemo(() => groupBy(data?.incidents ?? [], 'status'), [data])
  const tasksByStatus = useMemo(() => groupBy(data?.tasks ?? [], 'status'), [data])
  const resourcesByCategory = useMemo(
    () => groupBy(data?.resources ?? [], 'category').sort((a, b) => b.count - a.count),
    [data]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">Reports &amp; Analytics</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Live breakdowns computed from current data — not a static snapshot.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Crunching numbers…" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title={`Incidents by Type (${data?.incidents?.length ?? 0} total)`}>
            <BarChart data={byType} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-base-border))" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: 'rgb(var(--color-ink-muted))', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={110}
                tick={{ fill: 'rgb(var(--color-ink-secondary))', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgb(var(--color-base-surface))',
                  border: '1px solid rgb(var(--color-base-border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#2E5CB8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Incidents by Severity">
            <BarChart data={bySeverity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-base-border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'rgb(var(--color-ink-secondary))', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgb(var(--color-ink-muted))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgb(var(--color-base-surface))',
                  border: '1px solid rgb(var(--color-base-border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {bySeverity.map((entry) => (
                  <Cell key={entry.key} fill={SEVERITY_COLOR[entry.key] || '#5B6B8C'} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>

          <ChartCard title="Incidents by Status">
            <BarChart data={byStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-base-border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'rgb(var(--color-ink-secondary))', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgb(var(--color-ink-muted))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgb(var(--color-base-surface))',
                  border: '1px solid rgb(var(--color-base-border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#F5A524" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Volunteer Tasks by Status">
            <BarChart data={tasksByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-base-border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'rgb(var(--color-ink-secondary))', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgb(var(--color-ink-muted))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgb(var(--color-base-surface))',
                  border: '1px solid rgb(var(--color-base-border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#1FAA59" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Resources by Category" className="lg:col-span-2">
            <BarChart data={resourcesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-base-border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'rgb(var(--color-ink-secondary))', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgb(var(--color-ink-muted))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgb(var(--color-base-surface))',
                  border: '1px solid rgb(var(--color-base-border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#2E5CB8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>
      )}
    </div>
  )
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-base-border bg-base-surface p-4 shadow-panel ${className}`}>
      <h2 className="text-sm font-medium text-ink-primary mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}
