"use client";

import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  hover = false,
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-card border border-border rounded-xl p-6 shadow-card",
        "transition-all duration-300",
        hover &&
          "hover:border-border-hover hover:shadow-card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
