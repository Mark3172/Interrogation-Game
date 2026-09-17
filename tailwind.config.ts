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
        dark: "#0a0a0f",
        card: "#14141f",
        chat: "#1a1a2e",
        "accent-red": "#e74c3c",
        "accent-gold": "#f39c12",
        "accent-green": "#2ecc71",
        "text-primary": "#e0e0e0",
        "text-muted": "#888",
        "border-color": "#2a2a3e",
      },
    },
  },
  plugins: [],
};
export default config;
