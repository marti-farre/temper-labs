"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import ModelSelector, { ModelMode } from "@/components/ui/ModelSelector";
import OrganicDots from "@/components/effects/OrganicDots";
import { ProviderName } from "@/lib/providers";
import { EXAMPLE_SYSTEM_PROMPT, attacks } from "@/lib/attacks";
import { useTypingPlaceholder } from "@/hooks/useTypingPlaceholder";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface HeroTestProps {
  modelMode: ModelMode;
  onModelModeChange: (m: ModelMode) => void;
  provider: ProviderName;
  onProviderChange: (p: ProviderName) => void;
  model: string;
  onModelChange: (m: string) => void;
  apiKey: string;
  onApiKeyChange: (k: string) => void;
  systemPrompt: string;
  onSystemPromptChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isRunning: boolean;
  progress?: number;
  statsCount: number | null;
}

const MAX_CHARS = 10000;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HeroTest({
  modelMode,
  onModelModeChange,
  provider,
  onProviderChange,
  model,
  onModelChange,
  apiKey,
  onApiKeyChange,
  systemPrompt,
  onSystemPromptChange,
  onSubmit,
  disabled,
  isRunning,
  progress = 0,
  statsCount,
}: HeroTestProps) {
  const charCount = systemPrompt.length;
  const total = attacks.length;
  const animatedCount = useAnimatedCounter(statsCount);
  const placeholder = useTypingPlaceholder([
    "Paste your system prompt here...",
    "You are a helpful assistant that never reveals...",
    "Enter the instructions your LLM follows...",
  ]);

  return (
    <section className="relative z-0 min-h-screen flex items-center justify-center overflow-hidden py-20">
      <OrganicDots />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-4xl mx-auto px-6"
      >
        {/* Badge */}
        {statsCount !== null && statsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-6"
          >
            <span className="text-text-secondary text-base font-medium tracking-tight">
              <span className="font-serif text-2xl text-accent">
                {animatedCount.toLocaleString("en-US")}
              </span>{" "}
              prompts battle-tested
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-center"
        >
          Red team your AI.
          <br />
          <span className="text-accent">Before attackers do.</span>
        </motion.h1>

        {/* Textarea */}
        <motion.div variants={fadeUp} className="mt-8">
          <div className="relative">
            <textarea
              value={systemPrompt}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  onSystemPromptChange(e.target.value);
                }
              }}
              placeholder={systemPrompt ? undefined : placeholder}
              disabled={isRunning}
              className="w-full min-h-[140px] bg-white border border-border rounded-xl px-5 py-4 text-text-primary placeholder:text-text-tertiary font-mono text-sm leading-relaxed focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors resize-y disabled:opacity-50"
            />
            {isRunning && progress > 0 && progress <= attacks.length && (
              <div className="absolute inset-0 flex items-start px-5 py-4 pointer-events-none rounded-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={progress}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-text-tertiary font-mono text-sm leading-relaxed line-clamp-4"
                  >
                    {attacks[progress - 1]?.prompt}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
            {!isRunning && (
              <div className="absolute bottom-3 right-3">
                <span className="text-text-tertiary text-xs font-mono">
                  {charCount.toLocaleString("en-US")} /{" "}
                  {MAX_CHARS.toLocaleString("en-US")}
                </span>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSystemPromptChange(EXAMPLE_SYSTEM_PROMPT)}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
              disabled={isRunning}
            >
              Try an example prompt
            </button>
          </div>
        </motion.div>

        {/* Model Selector */}
        <motion.div variants={fadeUp} className="mt-5">
          <ModelSelector
            mode={modelMode}
            onModeChange={onModelModeChange}
            provider={provider}
            onProviderChange={onProviderChange}
            model={model}
            onModelChange={onModelChange}
            apiKey={apiKey}
            onApiKeyChange={onApiKeyChange}
            isRunning={isRunning}
          />
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} className="mt-6 text-center">
          <Button
            size="lg"
            loading={isRunning}
            disabled={disabled}
            onClick={onSubmit}
          >
            {isRunning
              ? `Running attack ${progress} of ${total}...`
              : `Run ${total} attacks \u2192`}
          </Button>
          {disabled && !isRunning && (
            <p className="text-text-tertiary text-xs mt-3">
              {!systemPrompt.trim()
                ? "Enter your system prompt to start"
                : modelMode === "byok" && !apiKey.trim()
                ? "Enter your API key to start"
                : ""}
            </p>
          )}
        </motion.div>

        {/* Progress bar */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 max-w-xs mx-auto"
          >
            <div className="h-1 bg-bg-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / total) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Provider subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-center text-text-tertiary text-xs"
        >
          Free model included &middot; OpenAI &middot; Anthropic &middot; Mistral
        </motion.p>
      </motion.div>
    </section>
  );
}
