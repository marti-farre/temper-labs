"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

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
    if (status === "running") return "#e5484d";
    if (ratio >= 0.8) return "#22c55e";
    if (ratio >= 0.53) return "#e5484d";
    return "#ef4444";
  };

  const getGlow = () => {
    if (status === "running") return "0 0 30px rgba(229, 72, 77, 0.3)";
    if (ratio >= 0.8) return "0 0 30px rgba(34, 197, 94, 0.3)";
    if (ratio >= 0.53) return "0 0 30px rgba(229, 72, 77, 0.3)";
    return "0 0 30px rgba(239, 68, 68, 0.3)";
  };

  const getLabel = () => {
    if (ratio >= 0.8) return "Strong";
    if (ratio >= 0.53) return "Moderate";
    return "Weak";
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
          stroke="#2a2a32"
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
        {status === "complete" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={clsx(
              "text-xs font-medium mt-1",
              ratio >= 0.8 && "text-success",
              ratio >= 0.53 && ratio < 0.8 && "text-accent",
              ratio < 0.53 && "text-fail"
            )}
          >
            {getLabel()}
          </motion.span>
        )}
      </div>
    </div>
  );
}
