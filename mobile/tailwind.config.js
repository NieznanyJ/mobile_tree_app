/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5CE7A0",
        secondary: "#00964A",
        accent: "#05DF72",
        background: "#FFFFFF",
        textPrimary: "#030712",
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
