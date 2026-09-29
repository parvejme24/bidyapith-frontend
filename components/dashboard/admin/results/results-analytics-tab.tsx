"use client";

import React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const GRADE_DISTRIBUTION = [
  { grade: "A+ (4.00)", count: 48, percent: "48%", color: "bg-emerald-400" },
  { grade: "A (3.75)", count: 28, percent: "28%", color: "bg-teal-400" },
  { grade: "A- (3.50)", count: 14, percent: "14%", color: "bg-cyan-400" },
  { grade: "B+ (3.25)", count: 6, percent: "6%", color: "bg-amber-400" },
  { grade: "B (3.00)", count: 3, percent: "3%", color: "bg-orange-400" },
  { grade: "F (0.00)", count: 1, percent: "1%", color: "bg-rose-500" },
];

export function ResultsAnalyticsTab() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02]">
        <h4 className="font-bold text-xs sm:text-sm text-ink mb-3 sm:mb-4">Letter Grade Distribution (Current Cycle)</h4>
        <div className="space-y-3 font-mono text-xs">
          {GRADE_DISTRIBUTION.map((bar) => (
            <div key={bar.grade}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-muted">{bar.grade}</span>
                <span className="font-bold text-ink">{bar.count} students ({bar.percent})</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={cn("h-full rounded-full", bar.color)} style={{ width: bar.percent }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-ink mb-2">Academic Audit Standards</h4>
          <p className="text-xs text-ink-muted leading-relaxed mb-4">
            All course grades are mapped to the standard 4.00 UGC grading scale. When instructors submit mark sheets, historical semester records are materialized into immutable results ledgers.
          </p>
          <div className="p-3 rounded-lg border border-jade/20 bg-jade/5 text-xs text-jade space-y-1">
            <p className="font-bold">✓ Grade Verification Protocol</p>
            <p className="text-[0.72rem] text-ink-muted">
              Automated prerequisite validation and retake replacement arithmetic are handled by the backend calculation engine.
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => toast.success("Exported institutional grades summary as CSV")}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs flex items-center gap-1.5 cursor-pointer")}
          >
            <Download className="size-3.5 text-jade" />
            <span>Download Ledger CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
