import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#05080D",
        charcoal: "#081116",
        panel: "#0B151A",
        line: "rgba(218,245,238,0.14)",
        volt: "#E36B37",
        cyan: "#38DFFF",
        amber: "#FFB654",
        ivory: "#F7FBF6",
        clay: "#BD6A39",
        "burnt-clay": "#8F4B2E",
        "court-green": "#061E18",
        "neon-green": "#8CFF6A",
        "electric-blue": "#2C7DFF"
      },
      boxShadow: {
        glow: "0 0 44px rgba(255, 182, 84, 0.20)",
        blueglow: "0 0 42px rgba(56, 223, 255, 0.16)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
