import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./app/**/layout.{js,ts,jsx,tsx,mdx}",
    // "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1025px',
      // => @media (min-width: 1024px) { ... }

      'lg-1': '1101px',

      'lg-m': '1201px',

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      'xl-s1': '1301px',

      'xl-s2': '1401px',

      'xl-1': '1501px',

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      'menu-ms-1': '1051px',
      'cmq-1': '992px'
    },
    extend: {
      colors: {
        'theme-color-1': "#2e3192",
        'theme-color-1-hover-dark': "#23267e",
        'theme-color-2': "#00af4f",
        'theme-color-2-hover-dark': "#00803a",
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
        noto_sans: ['Noto Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
