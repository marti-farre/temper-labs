"use client";

import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({
  children,
  className,
  hover = false,
  gradient = false,
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-card border border-transparent rounded-xl p-6",
        "transition-all duration-300",
        hover &&
          "hover:border-accent/30 hover:shadow-glow-accent cursor-pointer",
        gradient && "gradient-border border-transparent",
        className
      )}
    >
      {children}
    </div>
  );
}
