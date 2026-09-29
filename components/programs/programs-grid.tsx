"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EmptyState } from "@/components/site/empty-state";
import { ProgramCard } from "@/components/site/program-card";
import { ProgramCardSkeleton } from "@/components/site/skeletons";
import type { Program } from "@/lib/types";
import { sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface ProgramsGridProps {
  programs: Program[];
  isLoading: boolean;
  filterKey: string;
}

export function ProgramsGrid({ programs, isLoading, filterKey }: ProgramsGridProps) {
  const reduce = useReducedMotion();

  return (
    <section className={cn(sectionClass, "pt-4")}>
      <div className={shellClass}>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProgramCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {programs.length ? (
              <motion.div
                key={filterKey}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
              >
                {programs.map((program, index) => (
                  <motion.div
                    key={program.code}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.4 }}
                  >
                    <ProgramCard program={program} reveal={false} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState className="md:col-span-2 lg:col-span-3" />
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
