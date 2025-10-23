/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './theme/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D82B7',
        primaryDark: '#07004D',
        accentSecondary: '#42E2B8',
        neutral100: '#F9FAFB',
        neutral200: '#EEF1F4',
        neutral400: '#CBD5E1',
        neutral700: '#1E293B',
        success: '#6EE7B7',
        warning: '#F3DFBF',
        error: '#EB8A90',
      },
      borderRadius: {
        soft: 12,
        card: 16,
      },
    },
  },
  plugins: [],
};
