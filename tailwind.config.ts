import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0B0E14',
          card: '#141B2D',
          input: '#1A2035',
        },
        gold: {
          DEFAULT: '#C9943E',
          hover: '#D4A84B',
          muted: 'rgba(201, 148, 62, 0.3)',
        },
        text: {
          main: '#E8E4DC',
          sub: '#8A8578',
        },
        phase: {
          1: '#2A6B5A',
          2: '#5A4B8A',
          3: '#8A3B3B',
        },
        glass: 'rgba(255, 255, 255, 0.05)',
        error: '#C94040',
        success: '#40C980',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        narrative: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        jp: ['"Noto Serif JP"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 40px rgba(201, 148, 62, 0.1)',
        'gold-glow-strong': '0 0 60px rgba(201, 148, 62, 0.15)',
        'gold-glow-intense': '0 0 80px rgba(201, 148, 62, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
