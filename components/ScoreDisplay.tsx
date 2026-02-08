"use client";

interface ScoreDisplayProps {
  score: number;
  total: number;
  progress: number;
  status: "idle" | "running" | "complete" | "error";
}

function getScoreColor(score: number, total: number): string {
  const ratio = score / total;
  if (ratio >= 0.8) return "text-success";
  if (ratio >= 0.53) return "text-accent";
  return "text-fail";
}

export default function ScoreDisplay({
  score,
  total,
  progress,
  status,
}: ScoreDisplayProps) {
  if (status === "idle") return null;

  const isRunning = status === "running";

  return (
    <div className="text-center space-y-4" aria-live="polite">
      <div>
        <span
          className={`text-5xl sm:text-6xl font-bold tabular-nums ${
            isRunning ? "text-foreground" : getScoreColor(score, total)
          }`}
        >
          {isRunning ? progress : score}
        </span>
        <span className="text-2xl sm:text-3xl text-secondary font-bold">
          /{total}
        </span>
      </div>
      <p className="text-secondary text-sm">
        {isRunning
          ? `Running attack ${progress + 1} of ${total}...`
          : status === "complete"
          ? "attacks blocked"
          : "Test interrupted"}
      </p>

      <div className="w-full max-w-md mx-auto h-1 bg-surface-alt rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(progress / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
