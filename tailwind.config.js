/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
