/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Ou, se você usar a pasta `src`:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "barber-navy": "#002d50",
        "barber-gold": "#d4af37",
        "barber-brown": "#6b4f3b",
        "barber-dark-brown": "#4a2e1a",
        "barber-vanilla": "#faf8f5",
        "barber-cream": "#fefae0",
        "barber-muted": "#64748b",
        "barber-sand": "#f5e4d0",
      },
    },
  },
  plugins: [],
};
