/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas-rgb) / <alpha-value>)',
        surface: 'var(--surface)',
        elevated: 'rgb(var(--elevated-rgb) / <alpha-value>)',
        sidebar: 'var(--sidebar)',
        sidebarHover: 'var(--sidebar-hover)',
        hairline: 'var(--hairline)',
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          subtle: 'var(--ink-subtle)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        success: {
          DEFAULT: 'rgb(var(--success-rgb) / <alpha-value>)',
          soft: 'var(--success-soft)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning-rgb) / <alpha-value>)',
          soft: 'var(--warning-soft)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger-rgb) / <alpha-value>)',
          soft: 'var(--danger-soft)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 0 rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.06)',
        sheet: '0 10px 30px rgba(0, 0, 0, 0.10), 0 0 0 0.5px rgba(0, 0, 0, 0.08)',
        focus: '0 0 0 4px rgba(0, 122, 255, 0.18)',
      },
      borderRadius: {
        macos: '10px',
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '14px' }],
      },
    },
  },
  plugins: [],
}
