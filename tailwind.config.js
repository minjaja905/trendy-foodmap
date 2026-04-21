/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E3',
        'cream-dark': '#EDE5D0',
        wood: '#C4924A',
        'wood-dark': '#8B5E3C',
        'wood-light': '#D4A96A',
        grass: '#5BAF3C',
        'grass-light': '#7DC85A',
        'grass-dark': '#3D8A28',
        pokered: '#E8453C',
        'pokered-dark': '#C23028',
        sky: '#6EC6E8',
        stone: '#B8B0A0',
        'stone-dark': '#8A8278',
        bark: '#5C3D1E',
      },
      fontFamily: {
        pixel: ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
      boxShadow: {
        poko: '4px 4px 0px #5C3D1E',
        'poko-sm': '2px 2px 0px #5C3D1E',
        'poko-lg': '6px 6px 0px #5C3D1E',
        'poko-red': '4px 4px 0px #C23028',
        'poko-green': '4px 4px 0px #3D8A28',
      },
      borderRadius: {
        poko: '16px',
        'poko-lg': '24px',
      },
    },
  },
  plugins: [],
}
