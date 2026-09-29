"use client";

import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { initials } from "@/lib/format";
import { avatarClass, displayClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Leader } from "@/lib/types";

interface AboutLeadershipProps {
  leadership?: Leader[];
}

export function AboutLeadership({ leadership }: AboutLeadershipProps) {
  return (
    <section className={sectionClass}>
      <div className={shellClass}>
        <Reveal>
          <h2 className={cn(displayClass.d2, "mb-9")}>Who runs the university</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(leadership ?? []).map((leader, index) => (
            <Reveal key={leader.name} delay={index * 60}>
              <GlassCard lift className="p-6 text-center h-full">
                <span
                  className={cn(
                    avatarClass({ tone: leader.av }),
                    "size-16 text-xl mx-auto mb-4"
                  )}
                >
                  {initials(leader.name)}
                </span>
                <h3 className="font-display text-[1.05rem] leading-snug">{leader.name}</h3>
                <p className="text-xs text-jade mt-1.5">{leader.role}</p>
                <p className="text-sm text-ink-muted mt-3">{leader.note}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
