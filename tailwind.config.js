/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        primary: {
          DEFAULT: '#8b5cf6', // Neon Purple (Viloet-500 approx)
          hover: '#7c3aed',
        },
        secondary: {
          DEFAULT: '#06b6d4', // Cyber Blue (Cyan-500)
        },
        accent: {
          DEFAULT: '#ec4899', // Hot Pink (Pink-500)
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
