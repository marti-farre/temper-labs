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
    question: "Which models are supported?",
    answer:
      "We support OpenAI (GPT-4o, GPT-4o Mini, GPT-4 Turbo), Anthropic (Claude 3.5 Sonnet, Claude 3.5 Haiku), and Mistral (Mistral Large, Mistral Small). You can test any model your API key has access to.",
  },
  {
    question: "How does the scoring work?",
    answer:
      "We run 15 adversarial attacks against your system prompt. For each attack, we send the attack prompt to your model, then use the same model to judge whether the attack was blocked or succeeded. Your score is the number of attacks successfully blocked out of 15.",
  },
  {
    question: "What attacks do you test?",
    answer:
      "We test 15 attacks across 6 categories: Prompt Injection (3), Jailbreaking (3), Prompt Leaking (3), Role Manipulation (3), Encoding Tricks (1), and Emotional Manipulation (2). These represent the most common real-world adversarial techniques used against production LLMs.",
  },
  {
    question: "How much does it cost?",
    answer:
      "TemperLLM itself is free. You only pay for the API calls to your chosen provider. Each test run makes approximately 30 API calls (15 attacks + 15 judge evaluations). With GPT-4o-mini, a full test costs roughly $0.01–$0.03. With larger models, it may cost $0.10–$0.30.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion items={faqItems} />
        </motion.div>
      </div>
    </section>
  );
}
