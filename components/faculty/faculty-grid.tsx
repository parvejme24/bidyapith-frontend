"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EmptyState } from "@/components/site/empty-state";
import { FacultyCard } from "@/components/site/faculty-card";
import { FacultyCardSkeleton } from "@/components/site/skeletons";
import type { FacultyMember } from "@/lib/types";

interface FacultyGridProps {
  faculty: FacultyMember[];
  isLoading: boolean;
  filterKey: string;
}

export function FacultyGrid({ faculty, isLoading, filterKey }: FacultyGridProps) {
  const reduce = useReducedMotion();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <FacultyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {faculty.length ? (
        <motion.div
          key={filterKey}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
        >
          {faculty.map((member, index) => (
            <motion.div
              key={`${member.name}-${member.dept}-${member.email}`}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.4 }}
            >
              <FacultyCard faculty={member} index={index} reveal={false} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          className="sm:col-span-2 lg:col-span-3"
          title="No one by that name"
          description='Search by surname or research area — “finance”, “quantum”, “law”.'
        />
      )}
    </AnimatePresence>
  );
}
