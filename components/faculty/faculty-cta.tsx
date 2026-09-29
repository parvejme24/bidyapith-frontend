"use client";

import Link from "next/link";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { buttonClass, displayClass, leadClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function FacultyCta() {
  return (
    <section className={cn(sectionClass, "pt-0")}>
      <div className={shellClass}>
        <Reveal>
          <GlassCard strong className="p-8 md:p-11 text-center">
            <h2 className={cn(displayClass.d2, "max-w-xl mx-auto")}>Teaching and research posts open</h2>
            <p className={cn(leadClass, "mx-auto mt-4 text-center")}>
              We hire twice a year across all six schools. Send a CV, a short research statement
              and two references to the registrar&apos;s office.
            </p>
            <Link href="/contact" className={cn(buttonClass({ variant: "primary" }), "mt-7")}>
              See open positions
            </Link>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
