/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neo: {
          black: '#000000',
          dark: '#080808',
          surface: '#0f0f0f',
          card: '#121212',
          border: '#222222',
          borderHover: '#333333',
          borderLight: '#444444',
          green: '#00ff66',
          greenMuted: '#00cc52',
          greenDim: '#003314',
          red: '#ff3344',
          redDim: '#33080c',
          amber: '#ffaa00',
          amberDim: '#332200',
          cyan: '#00eeff',
          muted: '#888888',
          text: '#ededed',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Geist Mono', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
