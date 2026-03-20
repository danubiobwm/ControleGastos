/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark-bg": "#0f172a",
        "brand-dark-card": "#1e293b",
        "brand-purple-btn": "#7e22ce",
        "brand-blue-accent": "#38bdf8",
      },
    },
  },
  plugins: [],
};
