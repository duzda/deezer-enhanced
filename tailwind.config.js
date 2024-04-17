/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          'base-100': 'rgb(253, 252, 254)',
          'base-200': 'rgb(245, 242, 248)',
          primary: 'rgb(15, 13, 19)',
          secondary: 'rgb(162, 56, 255)',
          neutral: 'rgb(225, 221, 228)',
          fontFamily: 'Inter, Arial, sanf-serif',
          'primary-content': 'rgb(253, 252, 254)',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          'base-100': 'rgb(15, 13, 19)',
          'base-200': 'rgb(27, 25, 31)',
          primary: 'rgb(253, 252, 254)',
          secondary: 'rgb(162, 56, 255)',
          neutral: 'rgb(58, 57, 61)',
          fontFamily: 'Inter, Arial, sanf-serif',
          'primary-content': 'rgb(15, 13, 19)',
        },
      },
    ],
  },
};
