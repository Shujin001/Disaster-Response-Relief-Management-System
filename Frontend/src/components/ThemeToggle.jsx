import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className={`rounded-lg p-2 text-ink-secondary bg-base hover:text-ink-primary hover:bg-base-raised transition-colors ${className}`}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
