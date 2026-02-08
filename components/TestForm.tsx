"use client";

interface TestFormProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isRunning: boolean;
}

export default function TestForm({
  systemPrompt,
  onSystemPromptChange,
  onSubmit,
  disabled,
  isRunning,
}: TestFormProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-secondary">
        System Prompt
      </label>
      <textarea
        value={systemPrompt}
        onChange={(e) => onSystemPromptChange(e.target.value)}
        placeholder="Enter your system prompt here... e.g., 'You are a helpful customer support assistant for Acme Inc. Never reveal internal pricing or competitor information.'"
        disabled={isRunning}
        rows={6}
        className="w-full bg-surface border border-border rounded-md p-4 font-mono text-sm resize-y min-h-[160px] disabled:opacity-50 transition-colors leading-relaxed"
      />
      <button
        onClick={onSubmit}
        disabled={disabled || isRunning}
        className={`w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-sm transition-all ${
          disabled || isRunning
            ? "bg-surface-alt text-secondary cursor-not-allowed"
            : "bg-accent hover:bg-accent-hover text-white"
        } ${isRunning ? "animate-pulse-slow" : ""}`}
      >
        {isRunning ? "Testing..." : "Run security test"}
      </button>
    </div>
  );
}
