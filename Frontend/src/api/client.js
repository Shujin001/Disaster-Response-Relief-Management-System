// Thin fetch wrapper around the Express API. Handles the base URL, attaching
// the JWT (from sessionStorage) on authenticated requests, and turning
// non-2xx responses / network failures into a single Error type the UI can
// catch and display.

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const TOKEN_KEY = 'drms_token'

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    throw new ApiError(
      `Could not reach the API at ${API_URL}. Is the backend running? (${err.message})`,
      0
    )
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      // Non-JSON response (e.g. an HTML error page from a proxy) — leave data null.
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed with status ${res.status}`, res.status)
  }

  return data
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}

export default api
