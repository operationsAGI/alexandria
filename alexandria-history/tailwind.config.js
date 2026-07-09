/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0d0906',
          900: '#150f0a',
          800: '#1c140d',
        },
        wood: {
          900: '#1f150d',
          800: '#2b1d11',
          700: '#3a2716',
          600: '#4f341c',
          500: '#6b4726',
        },
        parchment: {
          400: '#c9b184',
          300: '#ddc79a',
          200: '#ead8b3',
          100: '#f2e6c9',
        },
        white: {
          DEFAULT: '#f8f4e8',
        },
        brown: {
          600: '#8a6a3f',
          500: '#a98352',
          400: '#c9a877',
          300: '#dbc296',
          200: '#e9d8b6',
        },
        amber: {
          700: '#8a5f1f',
          600: '#a8742a',
          500: '#c9922e',
          400: '#e0ab52',
          300: '#eec178',
        },
        ember: {
          500: '#7a3b2e',
          400: '#9c4f3a',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        candle: '0 0 80px rgba(224,171,82,0.18)',
        page: '0 20px 50px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        vignette: 'radial-gradient(ellipse at center, transparent 0%, rgba(9,6,3,0.75) 100%)',
      },
    },
  },
  plugins: [],
}
