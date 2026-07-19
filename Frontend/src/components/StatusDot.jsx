const toneMap = {
  critical: 'bg-status-critical',
  warning: 'bg-status-warning',
  safe: 'bg-status-safe',
  info: 'bg-status-info',
  idle: 'bg-status-idle',
}

export default function StatusDot({ tone = 'idle', pulse = false, className = '' }) {
  const color = toneMap[tone] || toneMap.idle
  return (
    <span className={`relative inline-flex h-2.5 w-2.5 ${className}`}>
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-60 animate-pulseRing`}
        />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  )
}
