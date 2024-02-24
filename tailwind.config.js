/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        "lightest": "#dfebeb",
        "light": "#EAF4F4", 
        "dark": "#181A1A", 
        "contrast": "#272828",
        "accent": "#232538",
        "primary": "#CEFF41", 
        "pill": "#313333"
      }
    },
  },
  plugins: [],
};
