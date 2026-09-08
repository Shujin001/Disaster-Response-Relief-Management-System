import { AlertTriangle, Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base text-ink-muted text-sm gap-2">
      <Loader2 size={16} className="animate-spin" />
      {label}
    </div>
  )
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2 rounded-lg border border-status-critical/40 bg-status-critical/10 px-3 py-2.5 text-sm text-status-critical">
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-1 underline underline-offset-2 text-xs">
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyRow({ children }) {
  return <p className="text-sm text-ink-muted italic py-2">{children}</p>
}
