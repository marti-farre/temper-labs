"use client";

import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const faqItems = [
  {
    question: "Is my API key safe?",
    answer:
      "Yes. Your API key is sent directly to your chosen provider (OpenAI, Anthropic, or Mistral) through our server to avoid CORS restrictions. We never store, log, or have access to your key. It exists only in memory for the duration of the test. Our entire codebase is open source so you can verify this yourself.",
  },
  {
    question: "How does the scoring work?",
    answer:
      "We run 25 adversarial attacks against your system prompt. For each attack, we send the attack prompt to your model, then use the same model to judge whether the attack was blocked or succeeded. Your score is the number of attacks successfully blocked out of 25.",
  },
  {
    question: "What attacks do you test?",
    answer:
      "We test 25 attacks across 7 categories: Prompt Leaking (5), Context Manipulation (4), Roleplay (4), Encoding (4), Crescendo (4), Evaluation Exploit (2), and Emotional (2). These are based on 2025\u20132026 adversarial research techniques used against production LLMs.",
  },
  {
    question: "How much does it cost?",
    answer:
      "TemperLLM itself is free. You only pay for the API calls to your chosen provider. Each test run makes approximately 50 API calls (25 attacks + 25 judge evaluations). With GPT-4o-mini, a full test costs roughly $0.03\u2013$0.06. With larger models, it may cost $0.20\u2013$0.50.",
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
