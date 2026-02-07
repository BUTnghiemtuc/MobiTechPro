/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf5ff',
          100: '#d0e2ff',
          200: '#b2cfff',
          300: '#94bcff',
          400: '#76a9ff',
          500: '#2563eb', // Electric Blue (similar to Royal Blue/Apple Blue)
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554', // Deep Navy
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0', // Slate-200
          300: '#cbd5e1', // Slate-300
          400: '#94a3b8', // Slate-400
          500: '#64748b', // Slate-500
          600: '#475569', // Slate-600
          700: '#334155', // Slate-700
          800: '#1e293b', // Slate-800
          900: '#0f172a', // Slate-900 (Deep)
        },
        navy: {
          900: '#0B1120', // Very dark navy for backgrounds/text
          800: '#162032',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Outfit"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
      },
    },
  },
  plugins: [],
}
