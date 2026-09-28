/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF4EE',
          100: '#FFE7DC',
          200: '#FFCEB9',
          300: '#FFAF8D',
          400: '#FF8757',
          500: '#FF5B26',
          600: '#E04815',
          700: '#BC360B',
          800: '#952C0C',
          900: '#79260E',
        },
        taxi: {
          400: '#FF8757',
          500: '#FF5B26',
          600: '#E04815',
        },
        brand: {
          orange: '#FF5B26',
          dark: '#0A0D17',
          card: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,24,40,0.1), 0 1px 2px rgba(16,24,40,0.06)',
        dropdown: '0 4px 6px -2px rgba(16,24,40,0.05), 0 12px 16px -4px rgba(16,24,40,0.08)',
        modal: '0 20px 25px -5px rgba(16,24,40,0.1), 0 10px 10px -5px rgba(16,24,40,0.04)',
      },
      borderRadius: { card: '12px' },
    },
  },
  plugins: [],
};