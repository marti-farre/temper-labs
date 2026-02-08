"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, ChevronDown } from "lucide-react";
import clsx from "clsx";
import Badge from "./Badge";

interface AttackResultProps {
  index: number;
  name: string;
  category: string;
  passed: boolean;
  reason: string;
  response: string;
  attackPrompt?: string;
  expanded: boolean;
  onToggle: () => void;
  error?: boolean;
}

export default function AttackResult({
  name,
  category,
  passed,
  reason,
  response,
  expanded,
  onToggle,
  error,
}: AttackResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-lg overflow-hidden"
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 w-full p-4 text-left hover:bg-card/50 transition-colors"
      >
        {/* Status indicator */}
        <div
          className={clsx(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            passed
              ? "bg-success/10 text-success"
              : "bg-fail/10 text-fail"
          )}
        >
          {passed ? (
            <Shield className="w-4 h-4" />
          ) : (
            <ShieldAlert className="w-4 h-4" />
          )}
        </div>

        {/* Name and category */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-text-primary text-sm font-medium truncate">
              {name}
            </span>
            <Badge variant={passed ? "success" : "fail"}>
              {passed ? "BLOCKED" : error ? "ERROR" : "FAILED"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge>{category}</Badge>
            <span className="text-text-tertiary text-xs truncate">
              {reason}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-text-tertiary" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              {/* Verdict */}
              <div>
                <span className="text-xs text-text-tertiary uppercase tracking-wider">
                  Verdict
                </span>
                <p className="text-sm text-text-secondary mt-1">{reason}</p>
              </div>

              {/* Model response */}
              <div>
                <span className="text-xs text-text-tertiary uppercase tracking-wider">
                  Model Response
                </span>
                <pre className="mt-1 p-3 bg-bg rounded-lg text-xs text-text-secondary font-mono overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {response}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
