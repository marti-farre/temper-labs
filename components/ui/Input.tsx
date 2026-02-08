"use client";

import { forwardRef, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  masked?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, masked, className, type, ...props }, ref) => {
    const [showValue, setShowValue] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm text-text-secondary font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={masked && !showValue ? "password" : type || "text"}
            className={clsx(
              "w-full bg-card border border-border rounded-lg px-4 py-2.5",
              "text-text-primary placeholder:text-text-tertiary",
              "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
              "transition-colors duration-200 font-mono text-sm",
              icon && "pl-10",
              masked && "pr-10",
              error && "border-fail focus:border-fail focus:ring-fail/30",
              className
            )}
            {...props}
          />
          {masked && (
            <button
              type="button"
              onClick={() => setShowValue(!showValue)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              {showValue ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
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
