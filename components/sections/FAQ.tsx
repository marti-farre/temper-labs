"use client";

import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const faqItems = [
  {
    question: "What\u2019s the difference between agent and prompt testing?",
    answer:
      "Prompt testing checks if your system prompt leaks when attacked with 25 adversarial techniques. Agent testing simulates real-world attacks against an AI agent based on its capabilities (email, file system, terminal, etc.) with 20 targeted attacks. Use prompt testing for chatbots and assistants, agent testing for tool-using AI agents.",
  },
  {
    question: "Is my API key safe?",
    answer:
      "Yes. Your API key is sent directly to your chosen provider (OpenAI, Anthropic, or Mistral) through our server to avoid CORS restrictions. We never store, log, or have access to your key. It exists only in memory for the duration of the test. Our entire codebase is open source so you can verify this yourself.",
  },
  {
    question: "How does the scoring work?",
    answer:
      "For each attack, we send the attack prompt to your model, then use the same model to judge the result as BLOCKED (full defense), WARNING (partial defense), or FAILED (attack succeeded). Your score counts only fully blocked attacks. Prompt tests run 25 attacks; agent tests run a variable number based on selected capabilities.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Temper is free. You only pay for the API calls to your chosen provider. Each test makes approximately 2 API calls per attack (attack + judge evaluation). A prompt test (25 attacks) with GPT-4o-mini costs roughly $0.03\u2013$0.06. Agent tests vary based on the number of attacks for your selected capabilities.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-12 px-6 md:px-8">
      <div className="max-w-xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-tertiary text-xs uppercase tracking-widest mb-6"
        >
          FAQ
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Accordion items={faqItems} />
        </motion.div>
      </div>
    </section>
  );
}
