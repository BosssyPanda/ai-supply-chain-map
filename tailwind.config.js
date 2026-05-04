/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#020617',
          900: '#07111f',
          850: '#0a1322',
          800: '#101827',
        },
        electric: {
          blue: '#3b82f6',
          teal: '#22d3ee',
          green: '#7ddc55',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          red: '#fb7185',
        },
      },
      boxShadow: {
        glowBlue: '0 0 28px rgba(59, 130, 246, 0.35)',
        glowTeal: '0 0 28px rgba(34, 211, 238, 0.28)',
        glowPurple: '0 0 36px rgba(139, 92, 246, 0.42)',
        glowGreen: '0 0 26px rgba(125, 220, 85, 0.28)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
