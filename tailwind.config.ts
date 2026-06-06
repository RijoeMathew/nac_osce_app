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
          blue: "#2563eb",
          teal: "#0f9f9a",
          navy: "#153047",
          mist: "#e9f8f7",
          line: "#dbe7ee"
        }
      },
      boxShadow: {
        panel: "0 18px 40px rgba(21, 48, 71, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
