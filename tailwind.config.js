/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 30%, 98%)',
        text: 'hsl(210, 20%, 20%)',
        muted: 'hsl(210, 20%, 50%)',
        accent: 'hsl(160, 70%, 50%)',
        primary: 'hsl(210, 90%, 55%)',
        surface: 'hsl(0, 0%, 100%)',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'xxl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 30%, 20%, 0.1)',
      },
    },
  },
  plugins: [],
}