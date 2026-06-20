import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'DM Serif Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        script: ["'Caveat'", "cursive"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        wedding: {
          "primary": "#2B4530",
          "secondary": "#C4663E",
          "accent": "#E8B04E",
          "neutral": "#16274F",
          "base-100": "#F7F3E9",
          "info": "#8BBDD4",
        },
      },
    ],
  },
}
