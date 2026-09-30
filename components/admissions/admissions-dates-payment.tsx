"use client";

import { Chip, type ChipTone } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { KeyDateSkeleton } from "@/components/site/skeletons";
import { displayClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { KeyDate } from "@/lib/types";

interface AdmissionsDatesPaymentProps {
  keyDates?: KeyDate[];
  isLoading?: boolean;
}

function dateStatus(status: KeyDate["status"]): { tone: ChipTone; label: string } {
  if (status === "live") return { tone: "jade", label: "Open now" };
  if (status === "done") return { tone: "default", label: "Done" };
  return { tone: "gold", label: "Upcoming" };
}

export function AdmissionsDatesPayment({ keyDates, isLoading }: AdmissionsDatesPaymentProps) {
  return (
    <section className={sectionClass}>
      <div className={cn(shellClass, "grid gap-4 lg:grid-cols-2")}>
        <Reveal>
          <GlassCard className="p-5 sm:p-7 h-full">
            <h2 className={cn(displayClass.d3, "mb-5")}>Key dates for this cycle</h2>
            <ul>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <KeyDateSkeleton key={i} />)
              ) : (
                (keyDates ?? []).map((item) => {
                  const status = dateStatus(item.status);
                  return (
                    <li
                      key={item.label}
                      className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 py-3 sm:py-4 border-b border-white/6 last:border-0"
                    >
                      <span className="font-semibold text-sm sm:text-base">{item.label}</span>
                      <span className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
                        <span className={cn("text-xs sm:text-sm text-ink-muted", numClass)}>{item.date}</span>
                        <Chip tone={status.tone}>{status.label}</Chip>
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </GlassCard>
        </Reveal>

        <Reveal delay={90}>
          <GlassCard className="p-5 sm:p-7 h-full">
            <h2 className={cn(displayClass.d3, "mb-2")}>Paying the fee</h2>
            <p className="text-sm text-ink-muted mb-6">
              Payments run through a licensed gateway. Your application only moves forward once
              the gateway confirms the transaction back to us — never pay anyone in cash.
            </p>
            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              <li>
                <GlassCard quiet className="p-2.5 sm:p-4 text-center">
                  <p className="font-display text-base sm:text-lg">bKash</p>
                  <p className="text-[0.65rem] sm:text-xs text-ink-faint mt-0.5 sm:mt-1">Mobile wallet</p>
                </GlassCard>
              </li>
              <li>
                <GlassCard quiet className="p-2.5 sm:p-4 text-center">
                  <p className="font-display text-base sm:text-lg">SSLCommerz</p>
                  <p className="text-[0.65rem] sm:text-xs text-ink-faint mt-0.5 sm:mt-1">Cards &amp; bank</p>
                </GlassCard>
              </li>
              <li>
                <GlassCard quiet className="p-2.5 sm:p-4 text-center">
                  <p className="font-display text-base sm:text-lg">Stripe</p>
                  <p className="text-[0.65rem] sm:text-xs text-ink-faint mt-0.5 sm:mt-1">Intl cards</p>
                </GlassCard>
              </li>
            </ul>
            <GlassCard quiet className="p-4 mt-4">
              <p className="text-sm">
                <span className="text-jade font-semibold">Refunds.</span> The application fee is
                not refundable. Tuition paid at seat confirmation is refunded in full if you
                withdraw before classes begin.
              </p>
            </GlassCard>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
