"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { enGB } from "date-fns/locale";
import { AdmissionCountdown } from "@/components/site/admission-countdown";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Rise } from "@/components/site/motion";
import { buttonClass, displayClass, leadClass, ruleClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const ELIGIBILITY = [
  "You have passed HSC, A-Levels or an equivalent examination.",
  "Your combined SSC and HSC GPA is 7.00 or above (7.50 for Engineering and Pharmacy).",
  "You sat Mathematics and Physics at HSC, for engineering programmes.",
];

function formatClosesAt(iso?: string) {
  if (!iso) return "15 October 2026, 11:59 PM";
  return format(parseISO(iso), "d MMMM yyyy, h:mm a", { locale: enGB }).replace(
    /\b(am|pm)\b/i,
    (match) => match.toUpperCase()
  );
}

interface AdmissionsHeroProps {
  closesAt: string;
}

export function AdmissionsHero({ closesAt }: AdmissionsHeroProps) {
  return (
    <section className="pt-12 pb-6 md:pt-16">
      <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center")}>
        <div>
          <Rise delay={1}>
            <Chip tone="jade" live>
              Fall 2026 applications open
            </Chip>
          </Rise>
          <Rise delay={2}>
            <h1 className={cn(displayClass.d1, "mt-5")}>Twenty minutes, one fee, three choices</h1>
          </Rise>
          <Rise delay={3}>
            <p className={cn(leadClass, "mt-5")}>
              Apply to up to three programmes on a single form. Save your progress and come back —
              nothing is submitted until the ৳1,000 fee is paid and verified.
            </p>
          </Rise>
          <Rise delay={4}>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/register" className={cn(buttonClass({ variant: "primary" }), "w-full sm:w-auto text-center justify-center")}>
                Start your application
              </Link>
              <a href="#fees" className={cn(buttonClass({ variant: "ghost" }), "w-full sm:w-auto text-center justify-center")}>
                Jump to fees
              </a>
            </div>
          </Rise>
        </div>

        <Rise delay={3}>
          <GlassCard strong className="p-5 sm:p-7">
            <p className="text-sm text-ink-muted mb-1">Applications close</p>
            <p className="font-display text-xl sm:text-2xl mb-5">{formatClosesAt(closesAt)}</p>
            <AdmissionCountdown closesAt={closesAt} />
            <hr className={cn(ruleClass, "my-6")} />
            <h2 className="text-sm font-bold mb-3">You are eligible if</h2>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              {ELIGIBILITY.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="text-jade shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Rise>
      </div>
    </section>
  );
}
