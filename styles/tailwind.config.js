const colors = require('tailwindcss/colors');
module.exports = {
  purge: {
    content: ["public/**/*.html"],
    options: {
      safelist: [],
    },
  },
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },

    fontFamily: {
      sans: ['Morrison', 'ui-sans-serif', 'system-ui', '-apple-system',
        'BlinkMacSystemFont', 'Roboto', '"Segoe UI"',
        'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#D63A4A'
      },

      spacing: {
        100: '28rem',
      }
    }
  },
  variants: {},
  plugins: [],
};