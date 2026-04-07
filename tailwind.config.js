/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        accent: '#06B6D4',
        dark: {
          bg: '#0F0F0F',
          card: '#1A1A1A',
          border: '#2A2A2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
};
