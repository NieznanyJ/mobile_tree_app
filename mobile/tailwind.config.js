/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5CE7A0",
        secondary: "#00964A",
        accent: "#05DF72",
        background: {
          DEFAULT: "#FFFFFF", // Light mode background
          dark: "#030712", // Dark mode background
        },
        textPrimary: {
          DEFAULT: "#030712", // Light mode text
          dark: "#FFFFFF", // Dark mode text
        },
        textGray: "#737373",
      },
      fontFamily: {
        sans: ["Roboto-Regular"],
        medium: ["Roboto-Medium"],
        bold: ["Roboto-Bold"],
      },
    },
  },
  plugins: [],
};
