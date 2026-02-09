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
  status,
}: ScoreRingProps) {
  const getColor = () => {
    if (status === "running") return "text-accent";
    const ratio = total > 0 ? score / total : 0;
    if (ratio > 0.8) return "text-success";
    if (ratio >= 0.4) return "text-warning";
    return "text-fail";
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-baseline gap-1"
      >
        <span className={`font-serif text-7xl md:text-8xl font-normal ${getColor()}`}>
          {score}
        </span>
        <span className="text-text-tertiary text-2xl font-serif">/{total}</span>
      </motion.div>
      <span className="text-text-tertiary text-sm mt-2">
        {status === "running" ? "testing..." : "attacks blocked"}
      </span>
    </div>
  );
}
