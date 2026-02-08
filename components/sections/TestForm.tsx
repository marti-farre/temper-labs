"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { EXAMPLE_SYSTEM_PROMPT } from "@/lib/attacks";

interface TestFormProps {
  systemPrompt: string;
  onSystemPromptChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isRunning: boolean;
}

const MAX_CHARS = 10000;

export default function TestForm({
  systemPrompt,
  onSystemPromptChange,
  onSubmit,
  disabled,
  isRunning,
}: TestFormProps) {
  const charCount = systemPrompt.length;

  return (
    <section id="test" className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary">
            Test your system prompt
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Paste the system prompt you use in production
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={systemPrompt}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  onSystemPromptChange(e.target.value);
                }
              }}
              placeholder="Enter your system prompt here...&#10;&#10;Example: You are a helpful customer support assistant..."
              disabled={isRunning}
              className="w-full min-h-[200px] bg-card border border-border rounded-xl px-5 py-4 text-text-primary placeholder:text-text-tertiary font-mono text-sm leading-relaxed focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors resize-y disabled:opacity-50"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <span className="text-text-tertiary text-xs font-mono">
                {charCount.toLocaleString("en-US")} / {MAX_CHARS.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* Try example link */}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSystemPromptChange(EXAMPLE_SYSTEM_PROMPT)}
              className="text-xs text-accent hover:text-orange-400 transition-colors"
              disabled={isRunning}
            >
              Try an example prompt
            </button>
          </div>

          {/* Submit button */}
          <div className="mt-8 text-center">
            <Button
              size="lg"
              glow
              loading={isRunning}
              disabled={disabled}
              icon={!isRunning ? <Zap className="w-4 h-4" /> : undefined}
              onClick={onSubmit}
            >
              {isRunning ? "Running security test..." : "Run security test"}
            </Button>
            {disabled && !isRunning && (
              <p className="text-text-tertiary text-xs mt-3">
                Enter your API key and system prompt to start
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
