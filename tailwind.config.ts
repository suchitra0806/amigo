import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up':   'slideUp 0.18s ease-out',
        'fade-in':    'fadeIn 0.15s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-sm':  'bounceSm 0.6s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-2px)' },
        },
      },
      boxShadow: {
        'chibi':    '0 4px 16px rgba(0,0,0,0.10)',
        'chibi-lg': '0 8px 32px rgba(0,0,0,0.12)',
        'chibi-xl': '0 16px 48px rgba(0,0,0,0.14)',
        /* keep this key so any stray references don't crash */
        'neon-purple': '0 4px 14px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
