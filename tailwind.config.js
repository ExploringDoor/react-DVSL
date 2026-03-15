/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dvsl: {
          bg:      '#0a0c0e',
          surface: '#111418',
          card:    '#161b20',
          border:  '#1e2530',
          text:    '#e8edf2',
          muted:   '#5a6472',
          lime:    '#b5e853',
          gold:    '#e8c84a',
          red:     '#e85a4a',
        }
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    }
  },
  plugins: [],
}
