import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E2B27",
        "ink-2": "#123832",
        "ink-3": "#1A4740",
        gold: "#C99A44",
        "gold-light": "#E4C374",
        clay: "#B8452F",
        paper: "#F6F1E1",
        "paper-2": "#ECE3C9",
        moss: "#4B6350",
        "ink-text": "#1B211F",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
        stamp: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
