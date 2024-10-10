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
  darkMode: "class", // Asegúrate de tener esto bien configurado
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
          danger: '#09f'
        },
        tabs: {
          color: '#fff', // Color de las tabs no seleccionadas en modo oscuro
          activeColor: '#90CAF9', // Color del texto de la tab seleccionada en modo oscuro
        },
        extend:{
        }
      },
      dark: {
        colors: {
          primary: '#4CAF50',   // Un color más claro para texto en botones
          secondary: '#81C784',
          tertiary: '#EF9A9A',
          quaternary: '#FFB74D',
          quinary: '#4DB6AC',
          senary: '#DCE775',
          septenary: '#F06292',
          octonary: '#BA68C8',
          nonary: '#9575CD',
          tentary: '#7986CB',
        },
        tabs: {
          color: '#fff', // Color de las tabs no seleccionadas en modo oscuro
          activeColor: '#90CAF9', // Color del texto de la tab seleccionada en modo oscuro
        },
      }
    },
  }  
  )],
}
