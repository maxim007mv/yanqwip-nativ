/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        accentMint: '#5EEAD4',
        accentPink: '#F472B6',
        surface: '#111827',
        textPrimary: '#F9FAFB',
      },
      fontFamily: {
        inter: ['Inter_400Regular', 'sans-serif'],
        unbounded: ['Unbounded_600SemiBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
