import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        line: "#D9E2E7",
        surface: "#F7FAFC",
        brand: "#0F766E",
        danger: "#B42318"
      }
    }
  },
  plugins: []
};

export default config;
