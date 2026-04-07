/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          hover: '#FF8C42',
          light: '#FFB088',
          dark: '#E55A2B',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          light: '#1A1A1A',
          lighter: '#2A2A2A',
        },
        light: {
          DEFAULT: '#FFFFFF',
          gray: '#F8F9FA',
          border: '#E5E7EB',
          card: '#F3F4F6',
        },
      },
      maxWidth: {
        'container': '1280px',
      },
      spacing: {
        'section': '80px',
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
