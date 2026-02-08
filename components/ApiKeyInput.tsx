"use client";

import { useState } from "react";

interface ApiKeyInputProps {
  apiKey: string;
  rememberKey: boolean;
  onApiKeyChange: (key: string) => void;
  onRememberChange: (remember: boolean) => void;
  disabled: boolean;
}

export default function ApiKeyInput({
  apiKey,
  rememberKey,
  onApiKeyChange,
  onRememberChange,
  disabled,
}: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-secondary">
        OpenAI API Key
      </label>
      <div className="relative">
        <input
          type={showKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-..."
          disabled={disabled}
          className="w-full bg-surface border border-border rounded-md px-3 py-2.5 font-mono text-sm pr-20 disabled:opacity-50 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-secondary hover:text-foreground px-2 py-1 transition-colors"
        >
          {showKey ? "Hide" : "Show"}
        </button>
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={rememberKey}
          onChange={(e) => onRememberChange(e.target.checked)}
          className="w-3.5 h-3.5 accent-accent"
        />
        <span className="text-sm text-secondary">Remember my key</span>
      </label>
    </div>
  );
}
