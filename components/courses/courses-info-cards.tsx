"use client";

import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { displayClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function CoursesInfoCards() {
  return (
    <section className={cn(sectionClass, "pt-0")}>
      <div className={cn(shellClass, "grid gap-4 md:grid-cols-3")}>
        <Reveal>
          <GlassCard className="p-6 h-full">
            <h3 className={displayClass.d3}>Registration windows</h3>
            <p className="text-sm text-ink-muted mt-3">
              Add and drop stays open for the first two weeks of each semester. After that,
              withdrawal shows on your transcript as a W.
            </p>
          </GlassCard>
        </Reveal>
        <Reveal delay={80}>
          <GlassCard className="p-6 h-full">
            <h3 className={displayClass.d3}>Prerequisites</h3>
            <p className="text-sm text-ink-muted mt-3">
              The portal blocks a registration if the prerequisite is unfinished. Your advisor can
              waive one per semester with a written reason.
            </p>
          </GlassCard>
        </Reveal>
        <Reveal delay={160}>
          <GlassCard className="p-6 h-full">
            <h3 className={displayClass.d3}>Credit load</h3>
            <p className="text-sm text-ink-muted mt-3">
              Twelve to eighteen credits per semester. Anything above eighteen needs a CGPA of
              3.50 and the department head&apos;s approval.
            </p>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
