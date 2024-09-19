import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes:{
      light:{
        colors: {
          primary: '#4CAF50',
          secondary: '#4CAF50',
          tertiary: '#F44336',
          quaternary: '#FF9800',
          quinary: '#009688',
          senary: '#CDDC39',
          septenary: '#E91E63',
          octonary: '#9C27B0',
          nonary: '#673AB7',
          tentary: '#3F51B5',
        },
      }
    }
  }  
    )
],
}
