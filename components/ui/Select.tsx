"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  icon,
  className,
  compact = false,
}: SelectProps) {
  return (
    <div className={clsx(!compact && "flex flex-col gap-1.5")}>
      {label && (
        <label className="text-sm text-text-secondary font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            "w-full appearance-none bg-card border border-transparent rounded-lg",
            "text-text-primary",
            "focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20",
            "transition-colors duration-200 cursor-pointer",
            compact ? "px-3 py-2 pr-8 text-xs" : "px-4 py-2.5 pr-10 text-sm",
            icon && (compact ? "pl-8" : "pl-10"),
            className
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className={clsx(
          "absolute top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none",
          compact ? "right-2 w-3.5 h-3.5" : "right-3 w-4 h-4"
        )} />
      </div>
    </div>
  );
}
