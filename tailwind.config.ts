import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Outfit"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        '2xl': ['1.5rem', {
          lineHeight: '2rem',
          letterSpacing: '-0.02em',
          fontWeight: '600',
        }],
        '3xl': ['1.875rem', {
          lineHeight: '2.25rem',
          letterSpacing: '-0.02em',
          fontWeight: '600',
        }],
        '4xl': ['2.25rem', {
          lineHeight: '2.5rem',
          letterSpacing: '-0.02em',
          fontWeight: '700',
        }],
      },
    },
  },
  plugins: [],
} satisfies Config;
