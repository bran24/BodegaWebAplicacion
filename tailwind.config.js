/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:
      {
        primary: '#ff6948',
        primary2:'#ff9179',
        secundary:'#ffffff',
        secundary2:'#f5f5f5',
        secundary3:'#242424',
        secundary4:'#94a3b8',
        
      },

      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        99: '99',
        9: '9',
        1: '1',
      },

      opacity: {
        65: '.65',
      },

      dropShadow: {
        1: '0px 1px 0px #E2E8F0',
        2: '0px 1px 4px rgba(0, 0, 0, 0.12)',
      },
      keyframes: {
        rotating: {
          '0%, 100%': { transform: 'rotate(360deg)' },
          '50%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        'ping-once': 'ping 5s cubic-bezier(0, 0, 0.2, 1)',
        rotating: 'rotating 30s linear infinite',
        'spin-1.5': 'spin 1.5s linear infinite',
        'spin-2': 'spin 2s linear infinite',
        'spin-3': 'spin 3s linear infinite',
      },

   
    },
  },
  plugins: [],
}