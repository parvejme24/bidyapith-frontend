"use client";

import Link from "next/link";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { buttonClass, displayClass, leadClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function ProgramsCta() {
  return (
    <section className={cn(sectionClass, "pt-0")}>
      <div className={shellClass}>
        <Reveal>
          <GlassCard strong className="p-8 md:p-11 grid gap-8 md:grid-cols-[1.3fr_1fr] items-center">
            <div>
              <h2 className={displayClass.d2}>Not sure which one fits?</h2>
              <p className={cn(leadClass, "mt-4")}>
                Come to the open day on 20 September, or send us your results and we will tell you
                which programmes you qualify for. No application fee to ask.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link href="/contact" className={buttonClass({ variant: "primary" })}>
                  Ask an admission officer
                </Link>
                <Link href="/courses" className={buttonClass({ variant: "ghost" })}>
                  Browse the course catalogue
                </Link>
              </div>
            </div>
            <ul className="space-y-4">
              <li>
                <GlassCard quiet className="p-4">
                  <p className="text-xs text-ink-faint">Average class size</p>
                  <p className={cn("font-display text-2xl", numClass)}>32 students</p>
                </GlassCard>
              </li>
              <li>
                <GlassCard quiet className="p-4">
                  <p className="text-xs text-ink-faint">Students per faculty member</p>
                  <p className={cn("font-display text-2xl", numClass)}>30 : 1</p>
                </GlassCard>
              </li>
              <li>
                <GlassCard quiet className="p-4">
                  <p className="text-xs text-ink-faint">Programmes with a required internship</p>
                  <p className={cn("font-display text-2xl", numClass)}>21 of 34</p>
                </GlassCard>
              </li>
            </ul>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
