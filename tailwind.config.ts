import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { astral: ['Astral', 'system-ui', 'sans-serif'] },
      keyframes: {
        pulseSlow: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-500px 0' }, '100%': { backgroundPosition: '500px 0' } },
      },
      animation: {
        pulseSlow: 'pulseSlow 2s ease-in-out infinite',
        slideUp: 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;