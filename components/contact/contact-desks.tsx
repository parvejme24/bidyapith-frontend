"use client";

import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { sectionTightClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const DESKS = [
  {
    title: "Admission office",
    blurb: "Applications, eligibility, admission test",
    email: "admission@bidyapith.edu.bd",
  },
  {
    title: "Registrar",
    blurb: "Registration, transcripts, certificates",
    email: "registrar@bidyapith.edu.bd",
  },
  {
    title: "Accounts",
    blurb: "Fees, instalments, payment problems",
    email: "accounts@bidyapith.edu.bd",
  },
  {
    title: "Student affairs",
    blurb: "Halls, clubs, counselling, welfare",
    email: "students@bidyapith.edu.bd",
  },
] as const;

export function ContactDesks() {
  return (
    <section className={sectionTightClass}>
      <div className={cn(shellClass, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
        {DESKS.map((desk, index) => (
          <Reveal key={desk.email} delay={index * 70}>
            <GlassCard lift className="p-6 h-full">
              <h2 className="font-display text-[1.05rem]">{desk.title}</h2>
              <p className="text-sm text-ink-muted mt-2">{desk.blurb}</p>
              <a
                href={`mailto:${desk.email}`}
                className="text-sm text-jade mt-3 inline-block break-all"
              >
                {desk.email}
              </a>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
