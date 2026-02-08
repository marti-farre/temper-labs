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
}

export default function Select({
  label,
  options,
  value,
  onChange,
  icon,
  className,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
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
            "w-full appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10",
            "text-text-primary text-sm",
            "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
            "transition-colors duration-200 cursor-pointer",
            icon && "pl-10",
            className
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
      </div>
    </div>
  );
}
