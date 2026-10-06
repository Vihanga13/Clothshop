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
        canvas: '#FFF8E7',
        'neo-yellow': '#FFD60A',
        'neo-red': '#FF3B30',
        'neo-blue': '#2F54EB',
        'neo-green': '#00B37E',
        'neo-pink': '#FF69B4',
        'neo-purple': '#8E44AD',
        'neo-orange': '#FF7A00',
        'neo-cyan': '#00D2D3',
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
        'neo-gray': '#EAEAEA',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #000000',
        'neo': '4px 4px 0px #000000',
        'neo-md': '6px 6px 0px #000000',
        'neo-lg': '8px 8px 0px #000000',
        'neo-xl': '12px 12px 0px #000000',
        'neo-none': '0px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        md: '8px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        full: '9999px',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'marquee-fast': 'marquee 15s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
