import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: "#00ff88",
          dim: "#00cc6a",
          glow: "#00ff8833",
        },
        dark: {
          DEFAULT: "#0a0a0a",
          card: "#111111",
          border: "#1a1a1a",
          muted: "#222222",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px #00ff8866, 0 0 40px #00ff8833",
        "neon-sm": "0 0 10px #00ff8866",
        "neon-lg": "0 0 40px #00ff8866, 0 0 80px #00ff8833",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "grid-scroll": "grid-scroll 20s linear infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "grid-scroll": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(50px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
