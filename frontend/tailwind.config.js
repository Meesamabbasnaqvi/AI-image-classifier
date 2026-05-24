/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#adc2ff',
          400: '#7a9cff',
          500: '#476eff',
          600: '#2947f5',
          700: '#1b2fd4',
          800: '#1a27ab',
          900: '#1a2587',
          950: '#101552',
        },
      },
    },
  },
  plugins: [],
}
