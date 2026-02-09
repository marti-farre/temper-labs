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
        bg: "#faf8f5",
        "bg-subtle": "#f5f2ed",
        card: "#ffffff",
        "card-hover": "#f9f7f4",
        code: "#f0ede8",
        border: "#e5e2dd",
        "border-hover": "#d1cdc6",
        "text-primary": "#1a1a1a",
        "text-secondary": "#525252",
        "text-tertiary": "#9ca3af",
        accent: "#2d5a3d",
        "accent-hover": "#3d7a52",
        "accent-muted": "rgba(45, 90, 61, 0.1)",
        success: "#2d5a3d",
        warning: "#b45309",
        fail: "#b91c1c",
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
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
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
