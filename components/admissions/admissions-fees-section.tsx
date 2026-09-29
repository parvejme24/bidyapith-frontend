"use client";

import { useState } from "react";
import { EnrolmentDonut, IntakeBarChart } from "@/components/home/campus-charts";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { FeeRowSkeleton } from "@/components/site/skeletons";
import { formatTaka } from "@/lib/format";
import {
  displayClass,
  leadClass,
  numClass,
  sectionClass,
  shellClass,
  tableClass,
  tableScrollClass,
  tdClass,
  thClass,
  trClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ChartPoint, EnrolmentSlice, FeeRow } from "@/lib/types";

const FEE_LABELS = ["CSE", "EEE", "Civil", "BBA", "LL.B.", "Pharm"];

interface AdmissionsFeesSectionProps {
  fees?: FeeRow[];
  enrolmentData?: EnrolmentSlice[];
  isLoading?: boolean;
}

export function AdmissionsFeesSection({
  fees,
  enrolmentData,
  isLoading,
}: AdmissionsFeesSectionProps) {
  const [chartView, setChartView] = useState<"distribution" | "tuition">("distribution");

  const feeChart =
    fees?.map((fee, index) => ({
      label: FEE_LABELS[index] || fee.program.slice(0, 6),
      value: fee.semester,
    })) ?? [];

  const totalSeats = (enrolmentData ?? []).reduce((acc, s) => acc + s.value, 0).toLocaleString();

  return (
    <section className={sectionClass} id="fees">
      <div className={shellClass}>
        <Reveal>
          <div className="max-w-2xl mb-9">
            <h2 className={displayClass.d2}>Fees you can plan for</h2>
            <p className={cn(leadClass, "mt-4")}>
              No mid-year fee rises. What you pay in semester one is what you pay in semester eight.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">
          <Reveal>
            <GlassCard className="p-2 sm:p-4">
              <div className={tableScrollClass}>
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>Programme</th>
                      <th className={cn(thClass, "text-center")}>Terms</th>
                      <th className={cn(thClass, "text-right")}>Admission</th>
                      <th className={cn(thClass, "text-right")}>Per term</th>
                      <th className={cn(thClass, "text-right")}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading
                      ? Array.from({ length: 6 }).map((_, i) => <FeeRowSkeleton key={i} />)
                      : (fees ?? []).map((fee) => (
                          <tr key={fee.program} className={trClass}>
                            <td className={cn(tdClass, "font-semibold")}>{fee.program}</td>
                            <td className={cn(tdClass, numClass, "text-center")}>8</td>
                            <td className={cn(tdClass, numClass, "text-right")}>
                              {formatTaka(fee.admission)}
                            </td>
                            <td className={cn(tdClass, numClass, "text-right")}>
                              {formatTaka(fee.semester)}
                            </td>
                            <td className={cn(tdClass, numClass, "text-right font-bold text-jade")}>
                              {formatTaka(fee.total)}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={90}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className={displayClass.d3}>Visual breakdown</h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {chartView === "distribution" ? "Fall 2026 intake capacity" : "Per-semester tuition (BDT)"}
                  </p>
                </div>
                <div className="inline-flex rounded-xl bg-white/[0.04] p-1 border border-white/8 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setChartView("distribution")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                      chartView === "distribution" ? "bg-jade text-night-900 shadow-sm" : "text-ink-muted hover:text-ink"
                    )}
                  >
                    Seats
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartView("tuition")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                      chartView === "tuition" ? "bg-jade text-night-900 shadow-sm" : "text-ink-muted hover:text-ink"
                    )}
                  >
                    Tuition
                  </button>
                </div>
              </div>

              {chartView === "distribution" ? (
                enrolmentData ? (
                  <>
                    <div className="max-w-[210px] mx-auto my-2">
                      <EnrolmentDonut data={enrolmentData} centerValue={totalSeats} centerLabel="seats" />
                    </div>
                    <ul className="mt-4 divide-y divide-white/5 text-xs">
                      {enrolmentData.map((slice) => (
                        <li key={slice.label} className="flex items-center justify-between py-1.5">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: slice.color }} />
                            <span className="text-ink-muted">{slice.label}</span>
                          </span>
                          <span className={cn(numClass, "font-semibold")}>{slice.value}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
                )
              ) : feeChart.length > 0 ? (
                <div className="pt-2">
                  <IntakeBarChart data={feeChart.map((f) => ({ label: f.label, value: f.value / 1000 }))} />
                  <p className="text-right text-[0.68rem] text-ink-faint mt-2 font-mono">Values in thousands (k BDT)</p>
                </div>
              ) : null}
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
