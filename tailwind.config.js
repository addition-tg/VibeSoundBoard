
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'burgundy': '#BA0F30',
        'purple-haze': '#2F2440',
        'sand-dollar': '#C6B79B',
        'red': '#FF2511',
      }
    },
  },
  plugins: [],
}
