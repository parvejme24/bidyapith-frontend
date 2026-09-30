"use client";

import Link from "next/link";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { buttonClass, displayClass, leadClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const CAMPUS_FACTS = [
  { label: "Campus", value: "22 acres", numeric: false },
  { label: "Library seats", value: "640", numeric: true },
  { label: "Laboratories", value: "38", numeric: true },
  { label: "Student clubs", value: "27", numeric: true },
] as const;

export function AboutCampusFacts() {
  return (
    <section className={cn(sectionClass, "pt-0")}>
      <div className={shellClass}>
        <Reveal>
          <GlassCard
            strong
            className="p-8 md:p-12 grid gap-8 md:grid-cols-[1.2fr_1fr] items-center"
          >
            <div>
              <h2 className={displayClass.d2}>Come and look around</h2>
              <p className={cn(leadClass, "mt-4")}>
                Campus tours run every Thursday at 11 AM. Bring a friend or a parent — no booking
                needed, just come to the main gate.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link href="/contact" className={cn(buttonClass({ variant: "primary" }), "w-full sm:w-auto text-center justify-center")}>
                  Plan a visit
                </Link>
                <Link href="/admissions" className={cn(buttonClass({ variant: "ghost" }), "w-full sm:w-auto text-center justify-center")}>
                  Admission details
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {CAMPUS_FACTS.map((fact) => (
                <GlassCard key={fact.label} quiet className="p-3.5 sm:p-4">
                  <dt className="text-xs text-ink-faint">{fact.label}</dt>
                  <dd className={cn("font-display text-xl mt-1", fact.numeric && numClass)}>
                    {fact.value}
                  </dd>
                </GlassCard>
              ))}
            </dl>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
