"use client";

import { Reveal } from "@/components/site/motion";
import { displayClass, leadClass, measureClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/lib/types";

interface AboutMilestonesProps {
  milestones?: Milestone[];
}

export function AboutMilestones({ milestones }: AboutMilestonesProps) {
  const milestoneList = milestones ?? [];
  const lastMilestone = milestoneList.length - 1;

  return (
    <section className={sectionClass}>
      <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[0.75fr_1.25fr]")}>
        <Reveal>
          <h2 className={displayClass.d2}>How we got here</h2>
          <p className={cn(leadClass, "mt-4")}>Five moments that changed how the university works.</p>
        </Reveal>
        <Reveal delay={90}>
          <ol>
            {milestoneList.map((item, index) => (
              <li key={item.year} className="relative pl-8 pb-9 last:pb-0">
                <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-jade" />
                {index !== lastMilestone ? (
                  <span className="absolute left-[5px] top-5 bottom-0 w-px bg-white/15" />
                ) : null}
                <span className={cn("font-display text-jade", numClass)}>{item.year}</span>
                <h3 className="font-display text-[1.15rem] mt-1">{item.title}</h3>
                <p className={cn("text-sm text-ink-muted mt-2", measureClass)}>{item.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
