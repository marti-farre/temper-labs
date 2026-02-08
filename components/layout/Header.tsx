"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 z-50 p-4 md:p-6"
    >
      <a href="#" className="flex items-center gap-0.5">
        <span className="font-serif text-lg text-accent">Temper</span>
        <span className="font-sans text-lg text-text-primary font-medium">
          LLM
        </span>
      </a>
    </motion.header>
  );
}
