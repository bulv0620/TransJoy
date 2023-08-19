/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      height:{
        list: 'calc(100vh - 187px)',
        content: 'calc(100vh - 171px)'
      }
    },
  },
  plugins: [],
}

