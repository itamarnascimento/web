/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        gray: {
          900: '#121214',
          800: '#202024',
          600: '#323238',
          300: '#8D8D99',
          100: '#E1E1E6',
        },
        green: {
          500: '#047C3F',
        },
        yellow: {
          500: '#F7DD43',
          600: '#BBA317',
        },
      },
      backgroundImage: {
        app: 'url(/app-bg.png)',
      },
      screens: {
        xs: '478px',
      },
    },
  },
  plugins: [],
};
