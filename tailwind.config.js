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
        background: '#090a0f',
        panel: '#12151e',
        'panel-subtle': '#171b26',
        border: '#1e2230',
        'border-highlight': '#2e354a',
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
