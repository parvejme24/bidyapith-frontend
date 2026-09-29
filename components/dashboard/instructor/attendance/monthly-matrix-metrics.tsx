"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { AlertTriangle, CalendarDays, CheckCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONTH_NAMES } from "./attendance-utils";

interface MonthlyMatrixMetricsProps {
  rosterCount: number;
  sectionCode: string;
  totalHeldSessions: number;
  totalMonthlyClasses: number;
  activeMonth: number;
  avgSectionAttendance: number;
  atRiskCount: number;
}

export function MonthlyMatrixMetrics({
  rosterCount,
  sectionCode,
  totalHeldSessions,
  totalMonthlyClasses,
  activeMonth,
  avgSectionAttendance,
  atRiskCount,
}: MonthlyMatrixMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      <GlassCard className="p-3 rounded-lg">
        <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
          <span>Enrolled Students</span>
          <Users className="size-3.5 text-jade" />
        </div>
        <p className="font-display text-base sm:text-lg lg:text-xl font-bold text-ink">{rosterCount}</p>
        <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Section {sectionCode}</p>
      </GlassCard>

      <GlassCard className="p-3 rounded-lg">
        <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
          <span>Class Sessions</span>
          <CalendarDays className="size-3.5 text-sky-400" />
        </div>
        <p className="font-display text-base sm:text-lg lg:text-xl font-bold text-ink">
          {totalHeldSessions}{" "}
          <span className="text-[0.68rem] text-ink-faint font-normal font-sans">
            / {totalMonthlyClasses}
          </span>
        </p>
        <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Held in {MONTH_NAMES[activeMonth]}</p>
      </GlassCard>

      <GlassCard className="p-3 rounded-lg">
        <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
          <span>Avg. Attendance</span>
          <CheckCircle2 className="size-3.5 text-jade" />
        </div>
        <p className="font-display text-base sm:text-lg lg:text-xl font-bold text-jade">
          {avgSectionAttendance}%
        </p>
        <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Real section average</p>
      </GlassCard>

      <GlassCard className="p-3 rounded-lg">
        <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
          <span>At Risk (&lt; 75%)</span>
          <AlertTriangle className="size-3.5 text-rose" />
        </div>
        <p
          className={cn(
            "font-display text-base sm:text-lg lg:text-xl font-bold",
            atRiskCount > 0 ? "text-rose" : "text-jade"
          )}
        >
          {atRiskCount}{" "}
          <span className="text-[0.68rem] text-ink-faint font-normal font-sans">students</span>
        </p>
        <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Below 75% requirement</p>
      </GlassCard>
    </div>
  );
}
