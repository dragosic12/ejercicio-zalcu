import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(32, 201, 151, 0.25), 0 14px 30px rgba(2, 16, 22, 0.42)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 550ms ease forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;

