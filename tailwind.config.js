/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0b0d0d',
        surface: '#121616',
        'surface-2': '#171c1b',
        mint: {
          DEFAULT: '#abf5c0',
          deep: '#5dbf80',
          hover: '#cdfad8',
          glow: 'rgba(171, 245, 192, 0.15)',
        },
        fog: '#e5eee8',
        muted: '#82918c',
        orange: '#ff9d4a',
        rose: '#ff8f84',
        border: 'rgba(217, 234, 224, 0.13)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['DM Mono', 'JetBrains Mono', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
