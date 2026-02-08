"use client";

import { motion } from "framer-motion";
import { Settings, Zap, FileCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const steps = [
  {
    icon: Settings,
    number: "1",
    title: "Configure",
    description:
      "Choose your provider and model, paste your API key. It never leaves your browser.",
  },
  {
    icon: Zap,
    number: "2",
    title: "Test",
    description:
      "We run 15 real adversarial attacks against your system prompt automatically.",
  },
  {
    icon: FileCheck,
    number: "3",
    title: "Review",
    description:
      "Get a detailed security report with scores, verdicts, and fix recommendations.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary">
            How it works
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Three steps to test your LLM&apos;s defenses
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={itemVariants}>
              <Card hover className="h-full text-center">
                <Badge variant="accent" className="mb-4">
                  Step {step.number}
                </Badge>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
