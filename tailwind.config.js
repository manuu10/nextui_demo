const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#e33636",
              foreground: "#000000",
              50: "#ffe5e5",
              100: "#fbbaba",
              200: "#f18e8e",
              300: "#ea6161",
              400: "#e33636",
              500: "#c91c1c",
              600: "#9e1415",
              700: "#710d0f",
              800: "#460506",
              900: "#1e0000",
            },
            focus: "#e33636",
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#e33636",
              foreground: "#000000",
            },
            focus: "#e33636",
          },
        },
      },
    }),
  ],
};
