import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f1514",
        "bg-subtle": "#141519",
        card: "#131816",
        "card-hover": "#1c1f1e",
        border: "#ffffff08",
        "text-primary": "#e8e8eb",
        "text-secondary": "#8a8a93",
        "text-tertiary": "#55555e",
        accent: "#2dd4bf",
        "accent-hover": "#5eead4",
        "accent-muted": "rgba(45, 212, 191, 0.2)",
        success: "#34d399",
        warning: "#fbbf24",
        fail: "#f87171",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        container: "1400px",
        content: "800px",
      },
      boxShadow: {
        "glow-accent": "0 0 20px rgba(45, 212, 191, 0.3)",
        "glow-accent-lg": "0 0 40px rgba(45, 212, 191, 0.2)",
        "glow-green": "0 0 20px rgba(52, 211, 153, 0.3)",
        "glow-red": "0 0 20px rgba(248, 113, 113, 0.3)",
        "glow-amber": "0 0 20px rgba(251, 191, 36, 0.3)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(45, 212, 191, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(45, 212, 191, 0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
