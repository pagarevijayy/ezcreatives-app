const { spacing, fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  // mode: "jit",
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", ...fontFamily.sans],
        sans: ["Inter", ...fontFamily.sans],
        merriweather: ["Merriweather", ...fontFamily.serif],
      },
      colors: {
        cyan: colors.cyan,
      },
    },
  },
  variants: {
    extend: {
      textColor: ["active"],
      backgroundColor: ["active"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
