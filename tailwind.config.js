/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.edge', './resources/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: {
        'DEFALUT': '1rem',
        'sm': '2rem',
        'md': '3rem',
        'lg': '3rem',
        'xl': '4rem',
        '2xl': '5rem',
      },
    },
  },
  plugins: [],
}
