"use client";

import { motion } from "framer-motion";
import {
  Code,
  Unlock,
  Eye,
  UserCog,
  Binary,
  Heart,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/attacks";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Unlock,
  Eye,
  UserCog,
  Binary,
  Heart,
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AttackCategories() {
  return (
    <section id="attacks" className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary">
            15 attacks across 6 categories
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Real adversarial techniques used against production LLMs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Code;
            return (
              <motion.div key={cat.name} variants={itemVariants}>
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text-primary text-sm">
                          {cat.name}
                        </h3>
                        <Badge variant="accent">{cat.count}</Badge>
                      </div>
                      <p className="text-text-tertiary text-xs leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
