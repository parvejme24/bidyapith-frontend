"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { enGB } from "date-fns/locale";
import { IntakeBarChart } from "@/components/home/campus-charts";
import { AdmissionCountdown } from "@/components/site/admission-countdown";
import { Chip, type ChipTone } from "@/components/site/chip";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal, Rise } from "@/components/site/motion";
import {
  useAdmissionSteps,
  useFaqs,
  useFees,
  useKeyDates,
  useMeta,
  useScholarships,
} from "@/hooks/use-data";
import { formatTaka } from "@/lib/format";
import {
  buttonClass,
  displayClass,
  leadClass,
  numClass,
  ruleClass,
  sectionClass,
  shellClass,
  tableClass,
  tableScrollClass,
  tdClass,
  thClass,
  trClass,
} from "@/lib/styles";
import type { KeyDate } from "@/lib/types";
import { cn } from "@/lib/utils";

const FEE_LABELS = ["CSE", "EEE", "Civil", "BBA", "LL.B.", "Pharm"];

const ELIGIBILITY = [
  "You have passed HSC, A-Levels or an equivalent examination.",
  "Your combined SSC and HSC GPA is 7.00 or above (7.50 for Engineering and Pharmacy).",
  "You sat Mathematics and Physics at HSC, for engineering programmes.",
];

function dateStatus(status: KeyDate["status"]): { tone: ChipTone; label: string } {
  if (status === "live") return { tone: "jade", label: "Open now" };
  if (status === "done") return { tone: "default", label: "Done" };
  return { tone: "gold", label: "Upcoming" };
}

function formatClosesAt(iso?: string) {
  if (!iso) return "15 October 2026, 11:59 PM";
  return format(parseISO(iso), "d MMMM yyyy, h:mm a", { locale: enGB }).replace(
    /\b(am|pm)\b/i,
    (match) => match.toUpperCase(),
  );
}

export function AdmissionsPage() {
  const meta = useMeta();
  const steps = useAdmissionSteps();
  const keyDates = useKeyDates();
  const fees = useFees();
  const scholarships = useScholarships();
  const faqs = useFaqs();

  const closesAt = meta.data?.admissionCloses ?? "2026-10-15T23:59:00";
  const feeChart =
    fees.data?.map((fee, index) => ({
      label: FEE_LABELS[index] || fee.program.slice(0, 6),
      value: fee.semester,
    })) ?? [];

  return (
    <main id="main">
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
                <Link href="/register" className={buttonClass({ variant: "primary" })}>
                  Start your application
                </Link>
                <a href="#fees" className={buttonClass({ variant: "ghost" })}>
                  Jump to fees
                </a>
              </div>
            </Rise>
          </div>

          <Rise delay={3}>
            <GlassCard strong className="p-7">
              <p className="text-sm text-ink-muted mb-1">Applications close</p>
              <p className="font-display text-2xl mb-5">{formatClosesAt(closesAt)}</p>
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
          <ol className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {(steps.data ?? []).map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 60}>
                  <GlassCard className="p-6 h-full">
                    <span className={cn("font-display text-jade text-sm", numClass)}>Step {index + 1}</span>
                    <h3 className="font-display text-[1.08rem] mt-2 leading-snug">{step.title}</h3>
                    <p className="text-sm text-ink-muted mt-2">{step.text}</p>
                  </GlassCard>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-4 lg:grid-cols-2")}>
          <Reveal>
            <GlassCard className="p-7 h-full">
              <h2 className={cn(displayClass.d3, "mb-5")}>Key dates for this cycle</h2>
              <ul>
                {(keyDates.data ?? []).map((item) => {
                  const status = dateStatus(item.status);
                  return (
                    <li
                      key={item.label}
                      className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-white/6 last:border-0"
                    >
                      <span className="font-semibold">{item.label}</span>
                      <span className="flex items-center gap-3">
                        <span className={cn("text-sm text-ink-muted", numClass)}>{item.date}</span>
                        <Chip tone={status.tone}>{status.label}</Chip>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </GlassCard>
          </Reveal>

          <Reveal delay={90}>
            <GlassCard className="p-7 h-full">
              <h2 className={cn(displayClass.d3, "mb-2")}>Paying the fee</h2>
              <p className="text-sm text-ink-muted mb-6">
                Payments run through a licensed gateway. Your application only moves forward once
                the gateway confirms the transaction back to us — never pay anyone in cash.
              </p>
              <ul className="grid sm:grid-cols-3 gap-3">
                <li>
                  <GlassCard quiet className="p-4 text-center">
                    <p className="font-display text-lg">bKash</p>
                    <p className="text-xs text-ink-faint mt-1">Mobile wallet</p>
                  </GlassCard>
                </li>
                <li>
                  <GlassCard quiet className="p-4 text-center">
                    <p className="font-display text-lg">SSLCommerz</p>
                    <p className="text-xs text-ink-faint mt-1">Cards &amp; bank</p>
                  </GlassCard>
                </li>
                <li>
                  <GlassCard quiet className="p-4 text-center">
                    <p className="font-display text-lg">Stripe</p>
                    <p className="text-xs text-ink-faint mt-1">International cards</p>
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

      <section className={sectionClass} id="fees">
        <div className={shellClass}>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
              <div className="max-w-xl">
                <h2 className={displayClass.d2}>What it costs</h2>
                <p className={cn(leadClass, "mt-4")}>
                  Published in full, per programme. Tuition is billed by semester and can be split
                  into two instalments.
                </p>
              </div>
              <Chip tone="gold">No hidden charges</Chip>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Reveal>
              <GlassCard className="p-2 sm:p-4">
                <div className={tableScrollClass}>
                  <table className={tableClass}>
                    <thead>
                      <tr>
                        <th className={thClass}>Programme</th>
                        <th className={cn(thClass, "text-right")}>Admission</th>
                        <th className={cn(thClass, "text-right")}>Per credit</th>
                        <th className={cn(thClass, "text-right")}>Per semester</th>
                        <th className={cn(thClass, "text-right")}>Full degree</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(fees.data ?? []).map((fee) => (
                        <tr key={fee.program} className={trClass}>
                          <td className={cn(tdClass, "font-semibold")}>{fee.program}</td>
                          <td className={cn(tdClass, numClass, "text-right")}>{formatTaka(fee.admission)}</td>
                          <td className={cn(tdClass, numClass, "text-right")}>{formatTaka(fee.perCredit)}</td>
                          <td className={cn(tdClass, numClass, "text-right")}>{formatTaka(fee.semester)}</td>
                          <td className={cn(tdClass, numClass, "text-right font-semibold")}>{formatTaka(fee.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={90}>
              <GlassCard className="p-6 h-full">
                <h3 className="text-sm font-bold mb-1">Semester tuition compared</h3>
                <p className="text-xs text-ink-faint mb-4">Bangladeshi taka, Fall 2026</p>
                {feeChart.length ? (
                  <IntakeBarChart data={feeChart} color="#FFB454" unit=" BDT" />
                ) : (
                  <div className="h-[250px] animate-pulse rounded-2xl bg-white/5" />
                )}
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <div className="max-w-2xl mb-9">
              <h2 className={displayClass.d2}>Help paying for it</h2>
              <p className={cn(leadClass, "mt-4")}>
                About one student in four holds a waiver or scholarship. You apply once and it is
                reviewed every year.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(scholarships.data ?? []).map((item, index) => (
              <Reveal key={item.name} delay={index * 60}>
                <GlassCard lift className="p-6 h-full">
                  <Chip tone={item.accent}>{item.cover}</Chip>
                  <h3 className="font-display text-[1.15rem] mt-4">{item.name}</h3>
                  <p className="text-sm text-ink-muted mt-2">{item.who}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-9 lg:grid-cols-[0.8fr_1.2fr]")}>
          <Reveal>
            <h2 className={displayClass.d2}>Questions we get every year</h2>
            <p className={cn(leadClass, "mt-4")}>
              Still stuck? The admission office answers the phone between 9 AM and 5 PM, Sunday to
              Thursday.
            </p>
            <Link href="/contact" className={cn(buttonClass({ variant: "ghost" }), "mt-6")}>
              Contact admissions
            </Link>
          </Reveal>
          <Reveal delay={90}>
            <GlassCard className="p-7">
              {faqs.data ? <FaqAccordion faqs={faqs.data} /> : null}
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
