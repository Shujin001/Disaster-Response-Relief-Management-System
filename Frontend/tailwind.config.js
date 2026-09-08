/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Each token reads from a CSS variable (see src/index.css) so the
        // same class names (bg-base, text-ink-primary, etc.) automatically
        // repaint when the `light` class is toggled on <html> — no need to
        // sprinkle dark:/light: variants through every component.
        base: {
          DEFAULT: 'rgb(var(--color-base) / <alpha-value>)',
          surface: 'rgb(var(--color-base-surface) / <alpha-value>)',
          raised: 'rgb(var(--color-base-raised) / <alpha-value>)',
          border: 'rgb(var(--color-base-border) / <alpha-value>)',
        },
        brand: {
          crimson: 'rgb(var(--color-brand-crimson) / <alpha-value>)',
          crimsondeep: 'rgb(var(--color-brand-crimsondeep) / <alpha-value>)',
          blue: 'rgb(var(--color-brand-blue) / <alpha-value>)',
          blueLight: 'rgb(var(--color-brand-bluelight) / <alpha-value>)',
        },
        status: {
          critical: 'rgb(var(--color-status-critical) / <alpha-value>)',
          warning: 'rgb(var(--color-status-warning) / <alpha-value>)',
          safe: 'rgb(var(--color-status-safe) / <alpha-value>)',
          info: 'rgb(var(--color-status-info) / <alpha-value>)',
          idle: 'rgb(var(--color-status-idle) / <alpha-value>)',
        },
        ink: {
          primary: 'rgb(var(--color-ink-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-ink-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      animation: {
        pulseSlow: 'pulseSlow 2.2s ease-in-out infinite',
        pulseRing: 'pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.45 },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: 0.7 },
          '75%, 100%': { transform: 'scale(1.9)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
