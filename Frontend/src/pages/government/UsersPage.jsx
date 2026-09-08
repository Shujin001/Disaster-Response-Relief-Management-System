import { useCallback, useState } from 'react'
import { EmptyRow, ErrorBanner, LoadingState } from '../../components/AsyncState'
import { useApi } from '../../hooks/useApi'
import { getUsers } from '../../api/endpoints'
import { formatDate, capitalize } from '../../utils/format'

const ROLES = ['', 'admin', 'volunteer', 'citizen']

const STATUS_COLOR = { active: 'text-status-safe', inactive: 'text-status-warning', suspended: 'text-status-critical' }

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = useCallback(async () => {
    const res = await getUsers(roleFilter ? `?role=${roleFilter}` : '')
    return res.data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter])

  const { data: users, loading, error, refetch } = useApi(fetchUsers, [roleFilter])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-primary">User Management</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Every account in the system, including anonymous guest citizen sessions.
        </p>
      </div>

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-blueLight"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r ? capitalize(r) : 'All roles'}
          </option>
        ))}
      </select>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <LoadingState label="Loading users…" />
      ) : (
        <div className="rounded-xl border border-base-border bg-base-surface shadow-panel overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-ink-muted text-xs uppercase font-mono border-b border-base-border">
                <th className="font-normal py-2.5 px-4">Name</th>
                <th className="font-normal py-2.5 px-4">Email</th>
                <th className="font-normal py-2.5 px-4">Role</th>
                <th className="font-normal py-2.5 px-4">Status</th>
                <th className="font-normal py-2.5 px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u._id} className="border-b border-base-border last:border-0 hover:bg-base-raised/60">
                  <td className="py-2.5 px-4">{u.name}</td>
                  <td className="py-2.5 px-4 text-ink-secondary">{u.email}</td>
                  <td className="py-2.5 px-4 text-ink-secondary">{capitalize(u.role)}</td>
                  <td className={`py-2.5 px-4 text-xs font-mono ${STATUS_COLOR[u.status] || ''}`}>
                    {capitalize(u.status)}
                  </td>
                  <td className="py-2.5 px-4 text-ink-muted text-xs">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(users ?? []).length === 0 && (
            <div className="p-4">
              <EmptyRow>No users match this filter.</EmptyRow>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
