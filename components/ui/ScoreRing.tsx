"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  total: number;
  size?: number;
  status: "idle" | "running" | "complete" | "error";
}

export default function ScoreRing({
  score,
  total,
  size = 180,
  status,
}: ScoreRingProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? score / total : 0;

  const getColor = () => {
    if (status === "running") return "#2dd4bf";
    if (score > 15) return "#34d399";
    if (score >= 8) return "#2dd4bf";
    return "#f87171";
  };

  const getGlow = () => {
    if (status === "running") return "0 0 30px rgba(45, 212, 191, 0.3)";
    if (score > 15) return "0 0 30px rgba(52, 211, 153, 0.3)";
    if (score >= 8) return "0 0 30px rgba(45, 212, 191, 0.3)";
    return "0 0 30px rgba(248, 113, 113, 0.3)";
  };

  const color = getColor();

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, filter: `drop-shadow(${getGlow()})` }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1b1f"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - circumference * ratio,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-serif font-medium"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {score}/{total}
        </motion.span>
        <span className="text-text-tertiary text-sm mt-1">
          {status === "running" ? "testing..." : "attacks blocked"}
        </span>
      </div>
    </div>
  );
}
