/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#060606',
        ink: '#0b0b0c',
        bone: '#f4f1e9',
        gold: {
          DEFAULT: '#c9a24b',
          bright: '#f0d58a',
          dim: '#8f7135',
        },
        stadium: '#7c1f28',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Manrope Variable', 'Manrope', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      screens: {
        xs: '480px',
        '3xl': '1800px',
      },
    },
  },
  plugins: [],
}
