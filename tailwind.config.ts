import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Sunset Ceylon palette — token names kept from the old
           navy/blue system so every existing class re-skins in place */
        navy: "#0D4C54",        // deep lagoon teal (dark sections, headings)
        "navy-2": "#136069",    // lighter lagoon teal (gradient partner)
        blue: "#E8502B",        // sunset coral (primary / CTA / links)
        "blue-light": "#FF8A5C", // light coral (accents on dark teal)
        clay: "#F5A623",        // mango gold (badges, ratings, eyebrows)
        paper: "#FFFDF9",       // warm white
        "paper-2": "#FBEEDD",   // sand cream
        "ink-text": "#2E2A24",  // warm espresso body text
        sea: "#2EC4B6",         // ocean cyan (secondary accent)
        golden: "#FFD166",      // golden hour highlight
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
        stamp: ["var(--font-space-mono)", "monospace"],
        script: ["var(--font-kaushan)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
