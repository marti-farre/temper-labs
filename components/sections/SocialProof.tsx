"use client";

import { motion } from "framer-motion";

const compatibleWith = [
  { name: "OpenAI", logo: "OpenAI" },
  { name: "Anthropic", logo: "Anthropic" },
  { name: "Mistral", logo: "Mistral AI" },
];

export default function SocialProof() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-y border-border bg-card/30"
    >
      <div className="mx-auto max-w-container px-6 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <span className="text-text-tertiary text-sm">Compatible with</span>
          <div className="flex items-center gap-8 sm:gap-12">
            {compatibleWith.map((provider) => (
              <span
                key={provider.name}
                className="text-text-tertiary text-sm font-medium hover:text-text-secondary transition-colors opacity-60 hover:opacity-100"
              >
                {provider.logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
