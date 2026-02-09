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
  ShieldAlert,
  Ban,
  Code,
  RefreshCw,
  Search,
} from "lucide-react";
import { CATEGORIES, CategoryInfo } from "@/lib/attacks";

const iconMap: Record<string, React.ElementType> = {
  Eye,
  UserCog,
  Theater,
  Binary,
  TrendingUp,
  SearchCode,
  Heart,
  ShieldAlert,
  Ban,
  Code,
  RefreshCw,
  Search,
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface AttackCategoriesProps {
  categories?: CategoryInfo[];
  subtitle?: string;
}

export default function AttackCategories({
  categories,
  subtitle,
}: AttackCategoriesProps) {
  const cats = categories ?? CATEGORIES;
  const mid = Math.ceil(cats.length / 2);
  const firstRow = cats.slice(0, mid);
  const secondRow = cats.slice(mid);

  const totalAttacks = cats.reduce((sum, c) => sum + c.count, 0);
  const sub = subtitle ?? `${totalAttacks} attacks, ${cats.length} categories`;

  return (
    <section id="attacks" className="py-12 px-6 md:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-tertiary text-xs uppercase tracking-widest mb-4 text-center"
        >
          {sub}
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex justify-center gap-3 flex-wrap">
            {firstRow.map((cat) => {
              const Icon = iconMap[cat.icon] || Eye;
              return (
                <motion.div
                  key={cat.name}
                  variants={itemVariants}
                  className="group relative flex flex-col items-center gap-2 p-3 rounded-lg bg-card border border-border hover:shadow-card-hover transition-all cursor-default w-32"
                  title={cat.description}
                >
                  <div className="w-8 h-8 rounded-md bg-bg-subtle flex items-center justify-center">
                    <Icon className="w-4 h-4 text-text-secondary" />
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
          </div>

          {secondRow.length > 0 && (
            <div className="flex justify-center gap-3 flex-wrap">
              {secondRow.map((cat) => {
                const Icon = iconMap[cat.icon] || Eye;
                return (
                  <motion.div
                    key={cat.name}
                    variants={itemVariants}
                    className="group relative flex flex-col items-center gap-2 p-3 rounded-lg bg-card border border-border hover:shadow-card-hover transition-all cursor-default w-32"
                    title={cat.description}
                  >
                    <div className="w-8 h-8 rounded-md bg-bg-subtle flex items-center justify-center">
                      <Icon className="w-4 h-4 text-text-secondary" />
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
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
