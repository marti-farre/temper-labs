"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import GravityGrid from "@/components/effects/GravityGrid";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <GravityGrid />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Badge */}
        {count !== null && count > 0 && (
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm text-sm text-text-secondary">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono text-accent">{count.toLocaleString("en-US")}</span>
              {" "}prompts tested
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.1]"
        >
          Red team your LLM{" "}
          <br className="hidden sm:block" />
          <span className="text-accent text-glow-accent">in 30 seconds</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Test your system prompt against 15 adversarial attacks.
          <br className="hidden md:block" />
          Find vulnerabilities before hackers do.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            glow
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => scrollTo("#config")}
          >
            Start testing
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => scrollTo("#how-it-works")}
          >
            See how it works
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
