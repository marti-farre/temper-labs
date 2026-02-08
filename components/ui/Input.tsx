"use client";

import { forwardRef, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  masked?: boolean;
  compact?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, masked, compact = false, className, type, ...props }, ref) => {
    const [showValue, setShowValue] = useState(false);

    return (
      <div className={clsx(!compact && "flex flex-col gap-1.5", compact && "w-full")}>
        {label && (
          <label className="text-sm text-text-secondary font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={clsx(
              "absolute top-1/2 -translate-y-1/2 text-text-tertiary",
              compact ? "left-2.5" : "left-3"
            )}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={masked && !showValue ? "password" : type || "text"}
            className={clsx(
              "w-full bg-card border border-transparent rounded-lg",
              "text-text-primary placeholder:text-text-tertiary",
              "focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20",
              "transition-colors duration-200 font-mono",
              compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
              icon && (compact ? "pl-8" : "pl-10"),
              masked && (compact ? "pr-8" : "pr-10"),
              error && "border-fail focus:border-fail focus:ring-fail/30",
              className
            )}
            {...props}
          />
          {masked && (
            <button
              type="button"
              onClick={() => setShowValue(!showValue)}
              className={clsx(
                "absolute top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors",
                compact ? "right-2" : "right-3"
              )}
            >
              {showValue ? (
                <EyeOff className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
              ) : (
                <Eye className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-fail">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
