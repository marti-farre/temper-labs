"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  const scrollTo = () => {
    document.querySelector("#config")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-accent/[0.03] to-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight">
          Don&apos;t let attackers find your
          <br />
          <span className="text-accent text-glow-accent">
            vulnerabilities first
          </span>
        </h2>
        <p className="mt-6 text-text-secondary text-lg">
          Test your system prompt in 30 seconds. No sign-up required.
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            glow
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={scrollTo}
          >
            Test your prompt now
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
