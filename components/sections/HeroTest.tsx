"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Info, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import OrganicDots from "@/components/effects/OrganicDots";
import { ProviderName, providers, getProvider } from "@/lib/providers";
import { EXAMPLE_SYSTEM_PROMPT, attacks } from "@/lib/attacks";
import { useTypingPlaceholder } from "@/hooks/useTypingPlaceholder";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface HeroTestProps {
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
  const [securityModal, setSecurityModal] = useState(false);
  const currentProvider = getProvider(provider);
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
      {/* Organic dots background */}
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
          Your prompt has holes.
          <br />
          <span className="text-accent">
            Let&apos;s find them.
          </span>
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
            {/* Attack preview overlay during testing */}
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

        {/* Inline config row */}
        <motion.div variants={fadeUp} className="mt-5">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <Select
              options={providers.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              value={provider}
              onChange={(v) => {
                const p = v as ProviderName;
                onProviderChange(p);
                const first = getProvider(p).models[0];
                if (first) onModelChange(first.id);
              }}
              compact
              className="sm:w-36"
            />
            <Select
              options={currentProvider.models.map((m) => ({
                value: m.id,
                label: m.name,
              }))}
              value={model}
              onChange={onModelChange}
              compact
              className="sm:w-44"
            />
            <div className="flex-1 flex items-center gap-2">
              <Input
                masked
                icon={<Lock className="w-3.5 h-3.5" />}
                placeholder={currentProvider.keyPlaceholder}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                disabled={isRunning}
                compact
              />
              <button
                type="button"
                onClick={() => setSecurityModal(true)}
                className="flex-shrink-0 p-2 text-text-tertiary hover:text-text-secondary transition-colors"
                title="How we protect your key"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end">
            <a
              href={currentProvider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent/70 hover:text-accent transition-colors"
            >
              Get an API key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
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
              Enter your API key and system prompt to start
            </p>
          )}
        </motion.div>

        {/* Progress bar during test */}
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
          Works with OpenAI &middot; Anthropic &middot; Mistral
        </motion.p>
      </motion.div>

      {/* Security Modal */}
      <Modal
        open={securityModal}
        onClose={() => setSecurityModal(false)}
        title="Your API key is safe"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-text-primary text-sm font-medium">
                Stays in your browser
              </p>
              <p className="text-text-tertiary text-xs mt-0.5">
                Your key is sent directly to {currentProvider.name}&apos;s API
                from your browser. It passes through our server only to avoid
                CORS restrictions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-text-primary text-sm font-medium">
                Never stored or logged
              </p>
              <p className="text-text-tertiary text-xs mt-0.5">
                We never store, log, or have access to your API key. It exists
                only in memory during the test.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-text-primary text-sm font-medium">
                Open source
              </p>
              <p className="text-text-tertiary text-xs mt-0.5">
                Our entire codebase is open source. Verify our security
                practices yourself.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
