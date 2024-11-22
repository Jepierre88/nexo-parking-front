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
          primary: {DEFAULT:'#2196F3', foreground:"#FFF"},
          primaryText: '#FFF',
          primaryHover: '#FFF',
          primaryActive: '#0D47A1',
          secondary: '#673AB7',
          tertiary: '#F44336',
          quaternary: '#FF9800',
          quinary: '#009688',
          senary: '#CDDC39',
          septenary: '#E91E63',
          octonary: '#9C27B0',
          nonary: '#673AB7',
          tentary: '#3F51B5',
          danger: '#F44336',
          background: "#FFF"
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
          primary: {DEFAULT:'#33baff', foreground:"#FFF"},
          primaryHover: '#1976D2',
          primaryActive: '#0D47A1', 
          primaryText: '#FFF', // Un color más claro para texto en botones
          secondary: '#673AB7',
          tertiary: '#EF9A9A',
          quaternary: '#FFB74D',
          quinary: '#4DB6AC',
          senary: '#DCE775',
          septenary: '#F06292',
          octonary: '#BA68C8',
          nonary: '#9575CD',
          tentary: '#7986CB',
          background: "#212121"
        },
        tabs: {
          color: '#fff', // Color de las tabs no seleccionadas en modo oscuro
          activeColor: '#90CAF9', // Color del texto de la tab seleccionada en modo oscuro
        },
      },
      redDark: {
        extend: "dark",
        colors: {
        background: "#300000",
        foreground: "#ffffff",
        primary: {
          50: "#D32F2F",
          100: "#E53935",
          200: "#F44336",
          300: "#EF5350",
          400: "#FF5252",
          500: "#FF4081",
          600: "#FF2D55",
          700: "#FF1744",
          800: "#D50032",
          900: "#C62828",
          DEFAULT: "#F44336",
          foreground: "#ffffff",
        },
        focus: "#FF1744",
        }
      },
    },
  }  
  )],
}
