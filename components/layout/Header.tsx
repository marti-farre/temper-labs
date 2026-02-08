"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Attacks", href: "#attacks" },
  { label: "Test", href: "#test" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-container px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-0.5">
            <span className="font-serif text-xl text-accent">Temper</span>
            <span className="font-sans text-xl text-text-primary font-medium">
              LLM
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              size="sm"
              onClick={() => scrollTo("#config")}
            >
              Start testing
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-border py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left text-sm text-text-secondary hover:text-text-primary py-2"
              >
                {link.label}
              </button>
            ))}
            <Button
              size="sm"
              className="w-full"
              onClick={() => scrollTo("#config")}
            >
              Start testing
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
