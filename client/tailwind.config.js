/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        surface: '#f8fafc',
        card: '#ffffff',
        border: '#e5e7eb',
        muted: '#6b7280',
        primary: '#0f172a',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 2px 6px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
};