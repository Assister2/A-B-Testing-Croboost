/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.{html,html.erb,erb}",
    "./app/frontend/entrypoints/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#F5F5F5",
        label: "363636",
        "text-input": "#CBCBCB",
        button: "#158370",
      },
    },
  },
  plugins: [],
};
