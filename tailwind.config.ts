import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "oklch(0.985 0.012 155)",
          100: "oklch(0.96 0.025 155)",
          200: "oklch(0.92 0.045 155)",
          300: "oklch(0.86 0.07 155)",
          400: "oklch(0.78 0.09 155)",
          500: "oklch(0.68 0.11 155)",
          600: "oklch(0.55 0.11 155)",
          700: "oklch(0.42 0.09 155)",
        },
        ink: {
          100: "#f1f3f1",
          200: "#e5e9e6",
          300: "#c5ccc7",
          400: "#9aa39e",
          500: "#6b7570",
          700: "#3a423d",
          900: "#1a201c",
        },
        warm: {
          blush: "#f5e8e0",
          cream: "#fdf9f3",
        },
        gold: "#b8945a",
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
