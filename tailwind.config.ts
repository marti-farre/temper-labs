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
        bg: "#111114",
        card: "#1a1a1f",
        "card-hover": "#222228",
        border: "#2a2a32",
        "text-primary": "#f0f0f3",
        "text-secondary": "#a0a0a8",
        "text-tertiary": "#6b6b6b",
        accent: "#22d3ee",
        "accent-hover": "#67e8f9",
        success: "#30a46c",
        fail: "#e5484d",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        container: "1200px",
        content: "800px",
      },
      boxShadow: {
        "glow-accent": "0 0 20px rgba(34, 211, 238, 0.3)",
        "glow-accent-lg": "0 0 40px rgba(34, 211, 238, 0.2)",
        "glow-green": "0 0 20px rgba(48, 164, 108, 0.3)",
        "glow-red": "0 0 20px rgba(229, 72, 77, 0.3)",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(34, 211, 238, 0.5)" },
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
