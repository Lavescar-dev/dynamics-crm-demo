/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0078d4',
          hover: '#106ebe',
          dark: '#005a9e',
        },
        success: '#107c10',
        warning: '#ffd335',
        error: '#d13438',
        info: '#0078d4',
        background: '#f3f2f1',
        surface: '#ffffff',
        border: {
          DEFAULT: '#e1dfdd',
          light: '#edebe9',
        },
        text: {
          primary: '#323130',
          secondary: '#605e5c',
          tertiary: '#8a8886',
          disabled: '#a19f9d',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.25rem',
        lg: '0.5rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 2px 4px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
        xl: '0 8px 16px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
