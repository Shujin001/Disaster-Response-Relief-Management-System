import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap a dashboard route with this to require a logged-in user (and
// optionally one of a specific set of roles). While the token is being
// verified against /auth/me we show a tiny loading state instead of
// flashing the login page.
export default function ProtectedRoute({ roles, children }) {
  const { user, token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base text-ink-muted text-sm">
        Loading…
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
