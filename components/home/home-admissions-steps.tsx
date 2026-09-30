"use client";

import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { AdmissionStepSkeleton } from "@/components/site/skeletons";
import { displayClass, leadClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface HomeAdmissionsStepsProps {
  steps?: { title: string; text: string }[];
}

export function HomeAdmissionsSteps({ steps }: HomeAdmissionsStepsProps) {
  return (
    <section className={sectionClass}>
      <div className={shellClass}>
        <Reveal>
          <div className="max-w-2xl mb-9">
            <h2 className={displayClass.d2}>How admission works</h2>
            <p className={cn(leadClass, "mt-4")}>
              Five steps, all of them in the portal. You can see where your application stands at
              any point.
            </p>
          </div>
        </Reveal>
        <ol className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-stretch">
          {steps ? (
            steps.map((step, index) => (
              <li key={step.title} className="flex flex-col h-full">
                <Reveal delay={index * 70} className="h-full flex flex-col flex-1">
                  <GlassCard className="p-6 flex flex-col h-full min-h-[210px] justify-start flex-1">
                    <span className={cn("font-display text-jade text-sm", numClass)}>
                      Step {index + 1}
                    </span>
                    <h3 className="font-display text-[1.08rem] font-semibold mt-2 leading-snug text-ink">
                      {step.title}
                    </h3>
                    <p className="text-sm text-ink-muted mt-2 leading-relaxed flex-1">
                      {step.text}
                    </p>
                  </GlassCard>
                </Reveal>
              </li>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex flex-col h-full">
                <AdmissionStepSkeleton />
              </li>
            ))
          )}
        </ol>
      </div>
    </section>
  );
}
