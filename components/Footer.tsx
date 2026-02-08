"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, []);

  return (
    <footer className="w-full border-t border-border mt-16">
      <div className="max-w-content mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-secondary">
        {count !== null && (
          <span className="tabular-nums">
            {count.toLocaleString()} prompts tested globally
          </span>
        )}
        <span>
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/marti-farre/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors"
          >
            Marti
          </a>
        </span>
      </div>
    </footer>
  );
}
