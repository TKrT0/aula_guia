import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#003a5c",
        "accent": "#00bcd4",
        "accent-light": "#e0f7fa",
        "background-light": "#ffffff",
        "background-dark": "#0f1c23",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
      }
    },
  },
  plugins: [],
};
export default config;