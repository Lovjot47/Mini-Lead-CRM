/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d8ff',
          300: '#a4bcff',
          400: '#7b96ff',
          500: '#5b72f8',
          600: '#4355ed',
          700: '#3744d3',
          800: '#2f3aaa',
          900: '#2c3686',
          950: '#1a1f52',
        },
        surface: {
          0: '#ffffff',
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e4e8f0',
          300: '#d0d7e4',
          400: '#9ba6bc',
          500: '#6b7891',
          600: '#4d5a72',
          700: '#364054',
          800: '#212b3d',
          900: '#131924',
          950: '#0a0e17',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'modal': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'elevated': '0 16px 48px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}