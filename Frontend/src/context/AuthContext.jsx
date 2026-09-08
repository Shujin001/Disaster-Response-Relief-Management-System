import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api, { TOKEN_KEY, getToken } from '../api/client'
import { guestLoginRequest } from '../api/endpoints'

const USER_KEY = 'drms_user'
const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(getToken)
  // Start true whenever we have a stored token, so protected routes wait
  // for the /auth/me check instead of bouncing to /login for a split second.
  const [loading, setLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    let cancelled = false

    async function verify() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await api.get('/auth/me')
        if (cancelled) return
        setUser(res.data)
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.data))
      } catch {
        if (cancelled) return
        clearSession()
        setToken(null)
        setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    verify()
    return () => {
      cancelled = true
    }
    // Only re-verify when the token itself changes (login/logout), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password }, { auth: false })
    persistSession(res.token, res.data)
    setToken(res.token)
    setUser(res.data)
    return res.data
  }, [])

  const register = useCallback(async (payload) => {
    const res = await api.post('/auth/register', payload, { auth: false })
    persistSession(res.token, res.data)
    setToken(res.token)
    setUser(res.data)
    return res.data
  }, [])

  // Silently provisions an anonymous citizen account + JWT so citizens never
  // have to see a login form. Called by CitizenGate the first time someone
  // lands on /citizen with no existing session.
  const loginAsGuest = useCallback(async () => {
    const res = await guestLoginRequest()
    persistSession(res.token, res.data)
    setToken(res.token)
    setUser(res.data)
    return res.data
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUser(null)
  }, [])

  // Lets a page (e.g. Profile) push a freshly-saved user object into context
  // + sessionStorage without a full /auth/me round trip.
  const updateUser = useCallback((updated) => {
    setUser(updated)
    sessionStorage.setItem(USER_KEY, JSON.stringify(updated))
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, loginAsGuest, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>')
  return ctx
}
