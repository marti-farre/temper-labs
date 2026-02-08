"use client";

import { useEffect, useState } from "react";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-container px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + tagline */}
          <div>
            <a href="#" className="flex items-center gap-0.5">
              <span className="font-serif text-lg text-accent">Temper</span>
              <span className="font-sans text-lg text-text-primary font-medium">
                LLM
              </span>
            </a>
            <p className="text-text-tertiary text-sm mt-2">
              Break your AI before hackers do.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <span className="text-text-secondary text-sm font-medium mb-1">
              Links
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary text-sm hover:text-text-primary transition-colors inline-flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary text-sm hover:text-text-primary transition-colors inline-flex items-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
          </div>

          {/* Built by */}
          <div className="flex flex-col gap-2">
            <span className="text-text-secondary text-sm font-medium mb-1">
              About
            </span>
            <p className="text-text-tertiary text-sm">
              Built by{" "}
              <span className="text-text-secondary">Martí</span>
            </p>
            {count !== null && (
              <p className="text-text-tertiary text-sm">
                <span className="text-accent font-mono">
                  {count.toLocaleString("en-US")}
                </span>{" "}
                prompts tested globally
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-text-tertiary text-xs">
            &copy; {new Date().getFullYear()} TemperLLM. Open source security
            testing for LLM applications.
          </p>
        </div>
      </div>
    </footer>
  );
}
