"use client";

import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal, Rise } from "@/components/site/motion";
import { bnClass, displayClass, leadClass, sectionTightClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const MISSION = [
  {
    title: "What we're for",
    text: "Give students in Bangladesh a degree that holds up abroad, taught by people doing real research, at a price families can plan for.",
  },
  {
    title: "How we teach",
    text: "Small sections, graded coursework rather than one final exam, and a required project, internship or thesis in every programme.",
  },
  {
    title: "What we publish",
    text: "Fees, seat counts, pass rates and placement figures, updated from the same database the registrar uses. No separate marketing numbers.",
  },
] as const;

export function AboutHero() {
  return (
    <>
      <section className="pt-12 pb-6 md:pt-16">
        <div className={shellClass}>
          <div className="max-w-3xl text-left">
            <Rise delay={1}>
              <Chip className={cn(bnClass, "text-base")}>বিদ্যাপীঠ · seat of learning</Chip>
            </Rise>
            <Rise delay={2}>
              <h1 className={cn(displayClass.d1, "mt-5")}>Twenty-eight years, one idea</h1>
            </Rise>
            <Rise delay={3}>
              <p className={cn(leadClass, "mt-5")}>
                Bidyapith opened in 1998 with 240 students in a rented building. The idea has not
                changed: teach well, keep the administration out of the way, and publish what we do.
              </p>
            </Rise>
          </div>
        </div>
      </section>

      <section className={sectionTightClass}>
        <div className={cn(shellClass, "grid gap-4 md:grid-cols-3")}>
          {MISSION.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <GlassCard className="p-7 h-full">
                <h2 className={displayClass.d3}>{item.title}</h2>
                <p className="text-sm text-ink-muted mt-3">{item.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
