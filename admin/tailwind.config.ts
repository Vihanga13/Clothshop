import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        'neo-yellow': '#FFD60A',
        'neo-red': '#FF3B30',
        'neo-blue': '#2F54EB',
        'neo-green': '#00B37E',
        'neo-pink': '#FF69B4',
        'neo-purple': '#8E44AD',
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #000000',
        'neo': '4px 4px 0px #000000',
        'neo-md': '6px 6px 0px #000000',
        'neo-lg': '8px 8px 0px #000000',
        'neo-xl': '12px 12px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};

export default config;
