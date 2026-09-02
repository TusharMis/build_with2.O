/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        algo: {
          teal: '#00D1B2',
          blue: '#1A365D',
          dark: '#0B132B',
          card: '#1C2541',
          border: '#3A506B',
        }
      }
    },
  },
  plugins: [],
}
