import { useAuth } from '../context/AuthContext'
import { initialsOf, capitalize } from '../utils/format'

// Header/Sidebar were originally built against static mock users shaped like
// { name, role, initials }. The real backend User only has name/email/role,
// so this adapts it once instead of repeating the mapping in every page.
export function useViewUser(roleLabel) {
  const { user } = useAuth()
  if (!user) return { name: '', role: '', initials: '?' }
  return {
    name: user.name,
    role: roleLabel || capitalize(user.role),
    initials: initialsOf(user.name),
  }
}
