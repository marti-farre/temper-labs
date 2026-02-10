"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
    >
      {/* Logo */}
      <a href="#" className="flex items-center">
        <span className="font-serif text-2xl">
          <span className="text-text-primary">Temper</span>
          {" "}
          <span className="text-accent">Labs</span>
        </span>
      </a>

      {/* Navigation */}
      <nav className="hidden sm:flex items-center gap-6">
        <a
          href="#attacks"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          How it works
        </a>
        <a
          href="#attacks"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Attacks
        </a>
        <a
          href="https://github.com/marti-farre/temper-llm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1"
        >
          GitHub
          <ExternalLink className="w-3 h-3" />
        </a>
      </nav>
    </motion.header>
  );
}
