/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#070709',
        dark:    '#0d0d11',
        card:    '#141418',
        card2:   '#1a1a1f',
        border:  'rgba(255,255,255,0.08)',
        gold:    '#F5C842',
        'gold-dim': 'rgba(245,200,66,0.10)',
        white:   '#EDEDED',
        muted:   'rgba(237,237,237,0.45)',
        muted2:  'rgba(237,237,237,0.28)',
        red:     '#E03C31',
        green:   '#22c55e',
        blue:    '#60a5fa',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body:    ['"Barlow"', 'sans-serif'],
        oswald:  ['"Oswald"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
