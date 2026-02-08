"use client";

import { motion } from "framer-motion";
import {
  Eye,
  UserCog,
  Theater,
  Binary,
  TrendingUp,
  SearchCode,
  Heart,
} from "lucide-react";
import { CATEGORIES } from "@/lib/attacks";

const iconMap: Record<string, React.ElementType> = {
  Eye,
  UserCog,
  Theater,
  Binary,
  TrendingUp,
  SearchCode,
  Heart,
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AttackCategories() {
  return (
    <section id="attacks" className="py-12 px-6 md:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-tertiary text-xs uppercase tracking-widest mb-4"
        >
          25 attacks, 7 categories
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Eye;
            return (
              <motion.div
                key={cat.name}
                variants={itemVariants}
                className="group relative flex flex-col items-center gap-2 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors cursor-default"
                title={cat.description}
              >
                <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-text-secondary text-xs text-center leading-tight">
                  {cat.name}
                </span>
                <span className="text-text-tertiary text-[10px] font-mono">
                  {cat.count}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
