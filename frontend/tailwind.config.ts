import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // LocalFind India Primary Reference Palette
          navy: '#132F50',
          'navy-dark': '#0B1E34',
          'navy-light': '#1C4472',
          blue: '#216FC6',
          'blue-hover': '#1A5BA4',
          'blue-light': '#EBF3FC',
          orange: '#F7772B',
          'orange-hover': '#DE6319',
          'orange-light': '#FEF2EA',
          green: '#168865',
          'green-hover': '#127053',
          'green-light': '#E8F5F0',
          bg: '#F5F8FC',
          surface: '#FFFFFF',
          // Backward-compatibility alias
          amber: '#F7772B',
          white: '#FFFFFF',
        },
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(19, 47, 80, 0.08), 0 1px 4px -1px rgba(19, 47, 80, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(19, 47, 80, 0.12), 0 4px 8px -2px rgba(19, 47, 80, 0.06)',
        'dropdown': '0 10px 25px -5px rgba(19, 47, 80, 0.15), 0 8px 10px -6px rgba(19, 47, 80, 0.1)',
      },
      borderRadius: {
        'brand': '14px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
