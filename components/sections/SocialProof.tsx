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
      className="py-16"
    >
      <div className="mx-auto max-w-container px-6 md:px-8">
        <div className="flex flex-col items-center gap-6">
          <span className="text-text-tertiary text-xs uppercase tracking-widest">Compatible with</span>
          <div className="flex items-center gap-10 sm:gap-16">
            {compatibleWith.map((provider) => (
              <span
                key={provider.name}
                className="text-text-secondary text-base font-medium opacity-50 hover:opacity-100 transition-opacity"
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
