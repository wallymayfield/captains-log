/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lcars: {
          orange: "#FF9933",
          peach: "#FFCC99",
          pink: "#CC6699",
          violet: "#9999FF",
          blue: "#6699CC",
          tan: "#FFCC66",
          red: "#CC6666",
          bg: "#000000",
        },
      },
      fontFamily: {
        lcars: ['"Antonio"', "Impact", "sans-serif"],
        body: ['"Newsreader"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
