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
      "We run 20 adversarial attacks against your system prompt. For each attack, we send the attack prompt to your model, then use the same model to judge whether the attack was blocked or succeeded. Your score is the number of attacks successfully blocked out of 20.",
  },
  {
    question: "What attacks do you test?",
    answer:
      "We test 20 attacks across 6 categories: Prompt Injection (4), Prompt Leaking (4), Jailbreaking (4), Context Manipulation (3), Encoding (3), and Emotional Manipulation (2). These represent the most common real-world adversarial techniques used against production LLMs.",
  },
  {
    question: "How much does it cost?",
    answer:
      "TemperLLM itself is free. You only pay for the API calls to your chosen provider. Each test run makes approximately 40 API calls (20 attacks + 20 judge evaluations). With GPT-4o-mini, a full test costs roughly $0.02\u2013$0.05. With larger models, it may cost $0.15\u2013$0.40.",
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
