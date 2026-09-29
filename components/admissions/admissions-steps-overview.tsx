"use client";

import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { AdmissionStepSkeleton } from "@/components/site/skeletons";
import { displayClass, leadClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AdmissionStep } from "@/lib/types";

interface AdmissionsStepsOverviewProps {
  steps?: AdmissionStep[];
  isLoading?: boolean;
}

export function AdmissionsStepsOverview({ steps, isLoading }: AdmissionsStepsOverviewProps) {
  return (
    <section className={sectionClass}>
      <div className={shellClass}>
        <Reveal>
          <div className="max-w-2xl mb-9">
            <h2 className={displayClass.d2}>The five steps</h2>
            <p className={cn(leadClass, "mt-4")}>
              Each step updates in your applicant portal, so you always know what is waiting on
              you and what is waiting on us.
            </p>
          </div>
        </Reveal>
        <ol className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 items-stretch">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="h-full flex flex-col">
                <AdmissionStepSkeleton />
              </li>
            ))
          ) : (
            (steps ?? []).map((step, index) => (
              <li key={step.title} className="h-full flex flex-col">
                <Reveal delay={index * 60} className="h-full flex flex-col flex-1">
                  <GlassCard className="p-6 h-full min-h-[210px] flex flex-col justify-start flex-1">
                    <span className={cn("font-display text-jade text-sm", numClass)}>
                      Step {index + 1}
                    </span>
                    <h3 className="font-display text-[1.08rem] mt-2.5 leading-snug min-h-[2.8rem] flex items-center font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="text-sm text-ink-muted mt-2 leading-relaxed flex-1">
                      {step.text}
                    </p>
                  </GlassCard>
                </Reveal>
              </li>
            ))
          )}
        </ol>
      </div>
    </section>
  );
}
