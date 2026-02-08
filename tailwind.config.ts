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
        "text-primary": "#fafafa",
        "text-secondary": "#a1a1a1",
        "text-tertiary": "#6b6b6b",
        accent: "#e5484d",
        "accent-hover": "#f26669",
        success: "#22c55e",
        fail: "#ef4444",
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
        "glow-accent": "0 0 20px rgba(229, 72, 77, 0.3)",
        "glow-accent-lg": "0 0 40px rgba(229, 72, 77, 0.2)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.3)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.3)",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(229, 72, 77, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(229, 72, 77, 0.5)" },
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
