/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand teal — richer and more premium than the original #008080
        primary: "#0F766E",
        "primary-dark": "#0D6860",
        "primary-light": "#F0FDFA",
      },
      boxShadow: {
        // Subtle card shadow with a slight teal tint on hover state
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 6px 20px 0 rgba(15,118,110,0.12), 0 2px 6px -1px rgba(0,0,0,0.06)",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
