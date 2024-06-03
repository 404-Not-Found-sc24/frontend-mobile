// @types {import('tailwindcss').Config}
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-green-color': '#5E8D5A',
        'main-red-color': '#FF9A9A',
      },
    },
    fontFamily: {
      'Dongle-Regular': 'Dongle-Regular',
      BMJUA: 'BMJUA',
      BMHANNAPro: 'BMHANNAPro',
    },
  },
  plugins: [],
};
