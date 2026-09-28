"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, UserCheck, CalendarDays, Clock, Lock } from "lucide-react";
import { StatTile } from "@/components/dashboard/stat-tile";
import { Meter } from "@/components/dashboard/meter";
import { GlassCard } from "@/components/site/glass-card";
import type { SemesterAttendanceRecord } from "./attendance-types";

interface AttendanceSummaryBannerProps {
  record: SemesterAttendanceRecord;
  filteredMonthIndex: number; // 0 = all months
}

export function AttendanceSummaryBanner({
  record,
  filteredMonthIndex,
}: AttendanceSummaryBannerProps) {
  const isLocked = record.status === "locked";

  let held = record.totalHeld;
  let present = record.totalPresent;
  let late = record.totalLate;
  let absent = record.totalAbsent;
  let pct = record.overallPct;

  if (filteredMonthIndex > 0) {
    const month = record.months.find((m) => m.monthIndex === filteredMonthIndex);
    if (month) {
      held = month.totalHeld;
      present = month.totalPresent;
      late = month.totalLate;
      absent = month.totalAbsent;
      pct = month.pct;
    }
  }

  const isEligible = pct >= 75;

  return (
    <div className="space-y-4">
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label={filteredMonthIndex === 0 ? "Semester Rate" : `Month ${filteredMonthIndex} Rate`}
          value={isLocked ? "N/A" : `${pct}%`}
          detail={
            isLocked
              ? "Syllabus scheduled"
              : isEligible
              ? "Eligible for final examinations"
              : "Below mandatory 75% threshold"
          }
          tone={isLocked ? "" : isEligible ? "up" : "down"}
        />

        <StatTile
          label="Total Classes Held"
          value={isLocked ? 0 : held}
          detail={`Across ${record.courses.length} courses this term`}
        />

        <StatTile
          label="Present vs Late"
          value={isLocked ? "0 / 0" : `${present} / ${late}`}
          detail="Late entries count as 0.5 present"
          tone={late > 3 ? "down" : ""}
        />

        <StatTile
          label="Finals Clearance"
          value={
            isLocked
              ? "Pending"
              : record.atRiskCount === 0
              ? "All Cleared"
              : `${record.atRiskCount} At Risk`
          }
          detail={
            isLocked
              ? "Enrolment opens in upcoming term"
              : record.atRiskCount === 0
              ? "Meets university 75% attendance bar"
              : "Requires attendance makeup petition"
          }
          tone={isLocked ? "" : record.atRiskCount === 0 ? "up" : "down"}
        />
      </div>

      {/* Month-by-Month Progress Trend Row */}
      {!isLocked && (
        <GlassCard className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-4 h-4 text-jade" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  {record.semesterTitle} · Attendance Progression
                </span>
                <span className="text-xs text-ink-faint font-mono">({record.termName})</span>
              </div>
              <p className="text-xs text-ink-faint">
                Month-by-month attendance progression across all registered courses.
              </p>
            </div>

            {/* Monthly Trend Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:min-w-[420px]">
              {record.months.map((m) => (
                <div
                  key={m.monthIndex}
                  className={`p-2.5 rounded-md border transition-colors ${
                    m.totalHeld === 0
                      ? "bg-white/[0.02] border-white/5 opacity-60"
                      : "bg-white/[0.04] border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="text-ink-faint font-mono">M{m.monthIndex}</span>
                    <span className="text-ink-faint text-[10px]">{m.monthName.split(" ")[0]}</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-ink">
                    {m.totalHeld > 0 ? `${m.pct}%` : "—"}
                  </div>
                  <Meter
                    value={m.totalHeld > 0 ? m.pct : 0}
                    max={100}
                    className="h-1.5 mt-1.5"
                    tone={m.pct < 75 ? "hot" : m.pct < 85 ? "warn" : "jade"}
                  />
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Warning Box if any course below 75% */}
      {record.atRiskCount > 0 && !isLocked && (
        <GlassCard className="p-4 md:p-5 border-amber-500/40 bg-amber-500/[0.08]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-ink leading-relaxed">
              <span className="font-bold text-amber-300">Attendance Warning: </span>
              {record.courses
                .filter((c) => !c.isEligible)
                .map((c) => `${c.code} (${c.pct}%)`)
                .join(", ")}{" "}
              is currently under the mandatory 75% attendance threshold. Students below 75% attendance are disqualified from appearing in the Semester Final Examinations as per Academic Ordinance Sec 4.2.
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
