"use client";

import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-container mx-auto flex items-center justify-between">
        <p className="text-text-tertiary text-xs">
          Built by{" "}
          <span className="text-text-secondary">Mart&iacute;</span>
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/marti-farre"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/marti-farre/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
