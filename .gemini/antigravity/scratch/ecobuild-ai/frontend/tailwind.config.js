/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10291A",
        ink2: "#2C4434",
        mist: "#E7EBE8",
        paper: "#F6F7F4",
        lime: "#C6F35C",
        lime2: "#A9DD3A",
        forest: "#153322",
        forestDark: "#0B1D12",
        emeraldGreen: "#2D6A4F",
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(198, 243, 92, 0.35)',
        'glass': '0 8px 32px 0 rgba(16, 41, 26, 0.08)',
      }
    },
  },
  plugins: [],
}
