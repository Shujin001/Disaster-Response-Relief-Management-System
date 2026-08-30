import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LoadingState, ErrorBanner } from './AsyncState'

// Citizens never see a login form. If there's no session yet (first visit,
// or an expired/cleared one), this silently creates an anonymous guest
// citizen account behind the scenes and proceeds — same as being logged in,
// just with zero friction. Admins/volunteers who navigate here with an
// existing session just pass through unchanged.
export default function CitizenGate({ children }) {
  const { user, loading, loginAsGuest } = useAuth()
  const [error, setError] = useState('')
  const attempted = useRef(false)

  useEffect(() => {
    if (loading || user || attempted.current) return
    attempted.current = true
    loginAsGuest().catch((err) => {
      attempted.current = false
      setError(err.message || 'Could not start a session. Please try again.')
    })
  }, [loading, user, loginAsGuest])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base p-6">
        <div className="max-w-sm w-full">
          <ErrorBanner
            message={error}
            onRetry={() => {
              setError('')
              attempted.current = false
            }}
          />
        </div>
      </div>
    )
  }

  if (loading || !user) {
    return <LoadingState label="Setting things up…" />
  }

  return children
}
