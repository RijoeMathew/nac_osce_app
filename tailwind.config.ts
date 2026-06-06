import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          blue: "var(--clinical-blue)",
          teal: "var(--clinical-teal)",
          navy: "var(--clinical-navy)",
          mist: "var(--clinical-mist)",
          line: "var(--clinical-line)"
        }
      },
      boxShadow: {
        panel: "var(--shadow-panel)"
      }
    }
  },
  plugins: []
};

export default config;
