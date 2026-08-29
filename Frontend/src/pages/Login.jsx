import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldAlert, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { orgInfo } from '../data/mockData'

const roleHome = { admin: '/government', citizen: '/citizen', volunteer: '/volunteer' }

const emptyRegisterForm = {
  name: '',
  email: '',
  password: '',
  role: 'citizen',
  phone: '',
  address: '',
}

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectAfterAuth = (user) => {
    const from = location.state?.from?.pathname
    navigate(from || roleHome[user.role] || '/', { replace: true })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(loginForm.email.trim(), loginForm.password)
      redirectAfterAuth(user)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        role: registerForm.role,
        phone: registerForm.phone.trim() || undefined,
        location: registerForm.address.trim()
          ? { address: registerForm.address.trim() }
          : undefined,
      })
      redirectAfterAuth(user)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-[11px] font-mono tracking-wide text-brand-crimson uppercase">
            {orgInfo.country}
          </p>
          <h1 className="font-display font-semibold text-ink-primary text-xl mt-1">
            {orgInfo.department}
          </h1>
          <p className="text-xs text-ink-muted mt-1">{orgInfo.location}</p>
        </div>

        <div className="rounded-xl border border-base-border bg-base-surface shadow-panel p-6">
          <div className="flex rounded-lg bg-base p-1 mb-6 text-sm">
            <button
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors ${
                mode === 'login'
                  ? 'bg-base-raised text-ink-primary font-medium'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <LogIn size={14} /> Sign in
            </button>
            <button
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors ${
                mode === 'register'
                  ? 'bg-base-raised text-ink-primary font-medium'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <UserPlus size={14} /> Create account
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-status-critical/40 bg-status-critical/10 px-3 py-2.5 text-sm text-status-critical">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="Email">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </Field>
              <button type="submit" disabled={submitting} className={submitClass}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
              <p className="text-xs text-ink-muted text-center leading-relaxed">
                Seeded demo accounts (password <code className="text-ink-secondary">password123</code>):
                <br />
                admin@ndrm.gov.np · citizen@example.com · volunteer@example.com
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="Full name">
                <input
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className={inputClass}
                  placeholder="Anita Shrestha"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className={inputClass}
                  placeholder="At least 6 characters"
                />
              </Field>
              <Field label="I am a">
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  className={inputClass}
                >
                  <option value="citizen">Citizen</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </Field>
              <Field label="Phone (optional)">
                <input
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className={inputClass}
                  placeholder="+977-98..."
                />
              </Field>
              <Field label="Address (optional)">
                <input
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                  className={inputClass}
                  placeholder="Ward 12, Kathmandu"
                />
              </Field>
              <button type="submit" disabled={submitting} className={submitClass}>
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-base-border bg-base px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-blueLight'

const submitClass =
  'w-full rounded-lg bg-brand-blue hover:bg-brand-blueLight transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-ink-muted mb-1.5">{label}</span>
      {children}
    </label>
  )
}
