import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // neon palette — used as accent tokens
        neon: {
          purple: '#a78bfa',
          cyan:   '#22d3ee',
          green:  '#34d399',
          pink:   '#f472b6',
          amber:  '#fbbf24',
        },
      },
      animation: {
        'slide-up':  'slideUp 0.18s ease-out',
        'fade-in':   'fadeIn 0.15s ease-out',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
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
      },
      boxShadow: {
        'neon-purple': '0 0 18px rgba(139,92,246,0.45)',
        'neon-cyan':   '0 0 18px rgba(34,211,238,0.35)',
        'neon-green':  '0 0 18px rgba(52,211,153,0.35)',
        'neon-pink':   '0 0 18px rgba(244,114,182,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
