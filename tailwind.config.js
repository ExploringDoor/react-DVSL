/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'dvsl-bg':      '#0d0f14',
        'dvsl-surface': '#13161e',
        'dvsl-card':    '#1a1e29',
        'dvsl-border':  '#252a38',
        'dvsl-text':    '#efefef',
        'dvsl-muted':   '#6b7280',
        'dvsl-lime':    '#a3e635',
        'dvsl-gold':    '#f59e0b',
        'dvsl-blue':    '#3b82f6',
        'dvsl-red':     '#ef4444',
        'dvsl-green':   '#22c55e',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
