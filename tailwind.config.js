/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-elevated': 'hsl(var(--surface-elevated) / <alpha-value>)',
        'surface-muted': 'hsl(var(--surface-muted) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        'border-strong': 'hsl(var(--border-strong) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-soft': 'hsl(var(--accent-soft) / <alpha-value>)',
        critical: 'hsl(var(--critical) / <alpha-value>)',
        high: 'hsl(var(--high) / <alpha-value>)',
        medium: 'hsl(var(--medium) / <alpha-value>)',
        low: 'hsl(var(--low) / <alpha-value>)',
        verified: 'hsl(var(--verified) / <alpha-value>)',
        partial: 'hsl(var(--partial) / <alpha-value>)',
        pending: 'hsl(var(--pending) / <alpha-value>)',
      },
      boxShadow: {
        report: '0 18px 55px rgba(15, 23, 42, 0.08)',
        'report-soft': '0 10px 30px rgba(15, 23, 42, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};
