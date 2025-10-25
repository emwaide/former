const nativewind = require('nativewind/preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [nativewind],
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './theme/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E5EDF2',
        charcoal: '#111827',
        graphite: '#4B5563',
        muted: '#6B7280',
        mutedOverlay: '#6B728099',
        teal: '#37D0B4',
        tealBright: '#42E2B8',
        cyan: '#69E0DA',
        positive: '#0EC4A6',
        negative: '#F87171',
        highlight: '#E9FAF6',
        navy: '#0B2545',
        accentTeal: '#A8DADC',
        accentTealBorder: '#90C9C7',
        accentPink: '#FFE3EC',
        accentPinkBorder: '#F8C9D8',
        accentPinkText: '#7A2E3A',
        accentBlueGrey: '#DDE7F2',
        accentBlueGreyBorder: '#C4D3E0',
        accentMint: '#C7F9CC',
        accentMintBorder: '#A6EFB1',
        frost: '#E8ECF6',
        slateSurface: '#F1F5F9',
        slateBorder: '#E2E8F0',
        slateText: '#334155',
        placeholder: '#9CA3AF',
      },
      fontSize: {
        heading: '20px',
        subheading: '18px',
        body: '16px',
        caption: '13px',
        metric: '36px',
      },
      lineHeight: {
        relaxed: '1.5',
      },
      borderRadius: {
        soft: '12px',
        card: '16px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(15, 23, 42, 0.06)',
        card: '0 10px 24px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
