"use client";

import { useState } from "react";

export default function SecurityExplanation() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-secondary hover:text-foreground transition-colors"
      >
        <span>How we protect your key</span>
        <span
          className={`transition-transform duration-200 ${
            expanded ? "rotate-90" : ""
          }`}
        >
          &rsaquo;
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2 text-sm text-secondary animate-fade-in-up">
          <p>
            Your key is stored only in your browser&apos;s localStorage -- never
            on our servers.
          </p>
          <p>
            Your key is sent directly to OpenAI&apos;s API through our backend
            route. We never log, store, or have access to it.
          </p>
          <p>
            All communication happens over HTTPS. The key exists in server
            memory only during the test execution.
          </p>
          <p>
            Our code is open source -- verify for yourself.
          </p>
        </div>
      )}
    </div>
  );
}
