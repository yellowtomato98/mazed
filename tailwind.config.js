/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        spaceimg: "url('/img/space.jpg')",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

// font-family: 'Roboto', sans-serif;
