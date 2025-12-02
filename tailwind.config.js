/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#101010',
        surface: '#181818',
        primary: '#9E7FFF',
        'primary-focus': '#8668e6',
        secondary: '#38bdf8',
        accent: '#f472b6',
        text: '#e5e5e5',
        'text-secondary': '#a3a3a3',
        border: '#2f2f2f',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        urgent: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: `1rem`,
        md: `calc(1rem - 2px)`,
        sm: `calc(1rem - 4px)`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
