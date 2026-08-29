// Small formatting helpers shared by the dashboards now that they render
// real API data instead of hand-written mock strings.

export function timeAgo(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`

  const years = Math.floor(months / 12)
  return `${years}y ago`
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Backend enums are lowercase kebab/plain words ('in-progress', 'shelter-supplies').
// This turns them into readable labels: 'in-progress' -> 'In Progress'.
export function labelize(str = '') {
  return str
    .split('-')
    .map((word) => capitalize(word))
    .join(' ')
}

export function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatDate(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
