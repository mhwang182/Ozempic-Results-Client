/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ['transform translate-x-20', 'transform translate-x-0'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-section': 'url(/src/images/drugs-and-ruler.jpeg)'
      },
      boxShadow: {
        'right-only': '7px 0 5px -4px #B7B8BC;'
      },
      height: {
        'screen-minus-nav': 'calc(100vh - 74px)'
      }
    },
  },
  plugins: [],
}

