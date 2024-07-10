/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF5500",
        secondary: "#F2F2F2",
        black: "#000000",
        white: "#FFFFFF",
        customGray: "#333333",
        customOrange: "#FF5500",
        footer: "#333333",
        button: {
          a: "#0000FF",
          b: "#FF0000"
        }
      },
      fontFamily: {
        body: ["Roboto"]
      }
    }
  },
  plugins: []
};
