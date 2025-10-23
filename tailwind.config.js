/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./wwwroot/**/*.{html,js}",
    "./wwwroot/js/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#667eea',
          600: '#764ba2',
        },
      },
    },
  },
  plugins: [],
}
