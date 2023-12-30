/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        "light": "#EAF4F4", 
        "dark": "#181A1A", 
        "accent": "#232538",
        "primary": "#CDE7BE", 
        "pill": "#313333"
      }
    },
  },
  plugins: [],
};
