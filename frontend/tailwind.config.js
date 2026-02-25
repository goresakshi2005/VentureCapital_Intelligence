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
        background: '#0B0A1A',
        surface: '#14132E',
        'surface-light': '#1E1A3A',
        primary: {
          DEFAULT: '#A855F7',   // lighter purple
          light: '#C084FC',      // even lighter
          dark: '#7E22CE',       // darker for hover
          neon: '#D8B4FE',       // very light for accents
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E0E0E0',
          muted: '#A0A0A0',
          inactive: '#808080',
        },
        border: {
          DEFAULT: '#2A2855',
          light: '#3A3870',
        },
        accent: {
          teal: '#35E0C5',
          green: '#7CFF4F',
          red: '#FF4D4D',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}