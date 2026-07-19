/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0F1C',
          surface: '#111A2C',
          raised: '#182238',
          border: '#232F47',
        },
        brand: {
          crimson: '#DC143C',
          crimsondeep: '#A30F2C',
          blue: '#0B3D91',
          blueLight: '#2E5CB8',
        },
        status: {
          critical: '#E63946',
          warning: '#F5A524',
          safe: '#1FAA59',
          info: '#3B82F6',
          idle: '#5B6B8C',
        },
        ink: {
          primary: '#E9EDF7',
          secondary: '#A7B1C7',
          muted: '#6B7690',
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
