/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        "lightest": "#dfebeb",
        "light": "#FFF", 
        "dark": "#0E0E0E", 
        "contrast": "#272828",
        "accent": "#232538",
        "primary": "#CEFF41", 
        "pill": "#313333",
      }
    },
  },
  plugins: [],
};
