"use client";

import Link from "next/link";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { buttonClass, displayClass, leadClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Faq, Scholarship } from "@/lib/types";

interface AdmissionsScholarshipsFaqProps {
  scholarships?: Scholarship[];
  faqs?: Faq[];
}

export function AdmissionsScholarshipsFaq({
  scholarships,
  faqs,
}: AdmissionsScholarshipsFaqProps) {
  return (
    <>
      {/* Scholarships Section */}
      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <div className="max-w-2xl mb-9">
              <h2 className={displayClass.d2}>Scholarships &amp; waivers</h2>
              <p className={cn(leadClass, "mt-4")}>
                Automatic based on your admission score. Applied directly against your semester
                tuition.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {(scholarships ?? []).map((s) => (
              <Reveal key={s.name}>
                <GlassCard className="p-7 h-full flex flex-col justify-between">
                  <div>
                    <span className={cn("font-display text-3xl text-jade", numClass)}>
                      {s.cover}
                    </span>
                    <h3 className="font-display text-lg font-semibold mt-3 text-ink">{s.name}</h3>
                    <p className="text-sm text-ink-muted mt-2">{s.who}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={sectionClass}>
        <div className={shellClass}>
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <h2 className={cn(displayClass.d2, "text-center mb-9")}>Questions applicants ask</h2>
            </Reveal>
            {faqs ? <FaqAccordion faqs={faqs} /> : null}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={cn(sectionClass, "pt-0")}>
        <div className={shellClass}>
          <Reveal>
            <GlassCard strong className="p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className={displayClass.d2}>Ready to begin?</h2>
              <p className={cn(leadClass, "mt-4")}>
                Create your applicant account and fill out your information at your own pace.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link href="/register" className={buttonClass({ variant: "primary" })}>
                  Start application
                </Link>
                <Link href="/contact" className={buttonClass({ variant: "ghost" })}>
                  Ask an advisor
                </Link>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}
