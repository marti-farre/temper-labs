"use client";

import { Zap, Key, Lock, Info, ExternalLink, Check } from "lucide-react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import { ProviderName, providers, getProvider, FREE_MODEL_NAME } from "@/lib/providers";

export type ModelMode = "free" | "byok";

interface ModelSelectorProps {
  mode: ModelMode;
  onModeChange: (mode: ModelMode) => void;
  provider: ProviderName;
  onProviderChange: (p: ProviderName) => void;
  model: string;
  onModelChange: (m: string) => void;
  apiKey: string;
  onApiKeyChange: (k: string) => void;
  isRunning: boolean;
}

export default function ModelSelector({
  mode,
  onModeChange,
  provider,
  onProviderChange,
  model,
  onModelChange,
  apiKey,
  onApiKeyChange,
  isRunning,
}: ModelSelectorProps) {
  const [securityModal, setSecurityModal] = useState(false);
  const currentProvider = getProvider(provider);

  return (
    <div className="space-y-2">
      {/* Free option */}
      <button
        type="button"
        onClick={() => onModeChange("free")}
        disabled={isRunning}
        className={`w-full p-3.5 rounded-xl border text-left transition-all disabled:opacity-50 ${
          mode === "free"
            ? "border-accent/40 bg-accent/5"
            : "border-border bg-card hover:border-border-hover"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                mode === "free" ? "bg-accent/10" : "bg-bg-subtle"
              }`}
            >
              <Zap
                className={`w-4 h-4 ${
                  mode === "free" ? "text-accent" : "text-text-tertiary"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  mode === "free" ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                Free ({FREE_MODEL_NAME})
              </p>
              <p className="text-xs text-text-tertiary">
                No API key needed
              </p>
            </div>
          </div>
          {mode === "free" && (
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </button>

      {/* BYOK option */}
      <div
        className={`rounded-xl border transition-all ${
          mode === "byok"
            ? "border-accent/40 bg-accent/5"
            : "border-border bg-card hover:border-border-hover"
        }`}
      >
        <button
          type="button"
          onClick={() => onModeChange("byok")}
          disabled={isRunning}
          className="w-full p-3.5 text-left disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  mode === "byok" ? "bg-accent/10" : "bg-bg-subtle"
                }`}
              >
                <Key
                  className={`w-4 h-4 ${
                    mode === "byok" ? "text-accent" : "text-text-tertiary"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    mode === "byok"
                      ? "text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  Bring your own key
                </p>
                <p className="text-xs text-text-tertiary">
                  OpenAI, Anthropic, Mistral
                </p>
              </div>
            </div>
            {mode === "byok" && (
              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </button>

        {/* Expanded BYOK fields */}
        {mode === "byok" && (
          <div className="px-3.5 pb-3.5">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
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
          </div>
        )}
      </div>

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
    </div>
  );
}
