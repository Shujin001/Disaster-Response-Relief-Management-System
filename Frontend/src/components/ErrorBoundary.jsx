import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Page crashed:', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-xl border border-status-critical/40 bg-status-critical/10 p-5 text-sm text-ink-primary">
            <div className="flex items-center gap-2 text-status-critical font-medium mb-2">
              <AlertTriangle size={16} />
              This page hit an error
            </div>
            <p className="text-ink-secondary mb-3">{this.state.error.message || String(this.state.error)}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="text-xs underline underline-offset-2 text-ink-secondary hover:text-ink-primary"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
