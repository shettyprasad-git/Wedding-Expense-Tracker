/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fdf8ff",
        foreground: "#2d1b4d",
        card: "rgba(255, 255, 255, 0.7)",
        "card-border": "rgba(157, 118, 193, 0.2)",
        primary: {
          light: "#E5D1FA",
          DEFAULT: "#9D76C1",
          dark: "#713ABE",
        },
        secondary: {
          light: "#FFF3E2",
          DEFAULT: "#E88D67",
          dark: "#D06224",
        },
        accent: "#D4AF37", // Rose Gold/Gold
      },
      backgroundImage: {
        'wedding-bg': "url('/src/assets/wedding_bg.png')",
        'soft-gradient': 'linear-gradient(135deg, #fdf8ff 0%, #fff3e2 100%)',
      },
    },
  },
  plugins: [],
}
