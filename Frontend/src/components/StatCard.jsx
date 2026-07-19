import StatusDot from './StatusDot'

export default function StatCard({ label, value, delta, tone = 'idle' }) {
  return (
    <div className="rounded-xl border border-base-border bg-base-surface px-4 py-3.5 flex flex-col gap-1.5 shadow-panel">
      <div className="flex items-center gap-2">
        <StatusDot tone={tone} pulse={tone === 'critical'} />
        <span className="text-xs text-ink-muted uppercase tracking-wide font-mono">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-display font-semibold text-ink-primary">{value}</span>
      </div>
      {delta && <span className="text-xs text-ink-secondary">{delta}</span>}
    </div>
  )
}
