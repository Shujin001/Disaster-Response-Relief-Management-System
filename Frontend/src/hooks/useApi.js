import { useCallback, useEffect, useState } from 'react'

// Fetches `fetcher()` on mount (and whenever `deps` change), exposing
// { data, loading, error, refetch }. `fetcher` should be a stable callback
// (wrap it in useCallback in the caller) so we don't refetch every render.
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}
