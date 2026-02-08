"use client";

interface AttackResultProps {
  index: number;
  name: string;
  category: string;
  passed: boolean;
  reason: string;
  response: string;
  expanded: boolean;
  onToggle: () => void;
  error?: boolean;
}

export default function AttackResult({
  index,
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
    <div
      className="bg-surface border border-border rounded-md overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-alt transition-colors"
        aria-expanded={expanded}
      >
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            error ? "bg-secondary" : passed ? "bg-success" : "bg-fail"
          }`}
        />
        <span className="flex-1 text-sm font-medium truncate">{name}</span>
        <span className="text-xs text-secondary px-2 py-0.5 bg-surface-alt rounded flex-shrink-0">
          {category}
        </span>
        <span className={`text-xs font-mono flex-shrink-0 ${passed ? "text-success" : "text-fail"}`}>
          {error ? "ERR" : passed ? "PASS" : "FAIL"}
        </span>
        <span
          className={`text-secondary transition-transform duration-200 flex-shrink-0 ${
            expanded ? "rotate-90" : ""
          }`}
        >
          &rsaquo;
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 animate-fade-in-up">
          <div>
            <p className="text-xs text-secondary mb-1">Verdict</p>
            <p className="text-sm">{reason}</p>
          </div>
          {response && (
            <div>
              <p className="text-xs text-secondary mb-1">Model response</p>
              <pre className="bg-surface-alt rounded-md p-3 font-mono text-xs whitespace-pre-wrap break-words overflow-x-auto max-h-48 overflow-y-auto text-secondary">
                {response}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
