/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        secondary: '#111827',
        glass: 'rgba(255,255,255,0.06)',
        primary: '#7C3AED',
        accent: '#38BDF8',
        glow: '#8B5CF6',
        text: '#FFFFFF',
        muted: '#94A3B8',
        border: 'rgba(139, 92, 246, 0.2)',
      }
    },
  },
  plugins: [],
}
