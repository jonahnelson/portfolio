// tailwind.config.js
const colors = require('tailwindcss/colors')
module.exports = {
  purge: [],
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      blue: colors.blue,
      gray: colors.gray,
      yellow: colors.yellow,
      white: colors.white,
      green: colors.green,
      red: colors.red,
      black: colors.black
    },
    extend: {
      fontFamily: {
          sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
