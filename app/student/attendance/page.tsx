"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Meter } from "@/components/dashboard/meter";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { DB } from "@/lib/data";

export default function StudentAttendancePage() {
  const { student, term } = useApp();

  const logWithPct = student.attendanceLog.map((r) => ({
    ...r,
    pct: Math.round((r.present / r.held) * 100),
    title: DB.courses.find((c) => c.code === r.code)?.title || r.code,
  }));

  const totalHeld = logWithPct.reduce((s, r) => s + r.held, 0);
  const totalPresent = logWithPct.reduce((s, r) => s + r.present, 0);
  const totalAbsent = logWithPct.reduce((s, r) => s + r.absent, 0);
  const overallPct = Math.round((totalPresent / totalHeld) * 100);

  const atRisk = logWithPct.filter((r) => r.pct < 75);

  return (
    <DashboardLayout
      title="Attendance Record"
      subtitle={`${term.name} · Counted up to week ${term.week}`}
      requiredRole="student"
      crumb="Student / Attendance"
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Overall Rate"
          value={`${overallPct}%`}
          detail={overallPct >= 75 ? "Eligible to sit finals" : "Below the 75% bar"}
          tone={overallPct >= 75 ? "up" : "down"}
        />
        <StatTile
          label="Classes Held"
          value={totalHeld}
          detail={`Across ${logWithPct.length} courses`}
        />
        <StatTile
          label="Absences"
          value={totalAbsent}
          detail="Late marks count as half"
        />
        <StatTile
          label="At Risk Courses"
          value={atRisk.length}
          detail={atRisk.length ? atRisk.map((r) => r.code).join(", ") : "No course below 75%"}
          tone={atRisk.length ? "down" : "up"}
        />
      </div>

      {/* Warning Box if below 75% */}
      {atRisk.length > 0 && (
        <GlassCard className="p-4 md:p-5 border-marigold/40 bg-marigold/[0.08]">
          <p className="text-xs sm:text-sm text-ink leading-relaxed">
            <b className="text-marigold">Heads up: </b>
            {atRisk.map((r) => r.code).join(" and ")}{" "}
            {atRisk.length > 1 ? "are" : "is"} under the mandatory 75% attendance threshold. Students below the bar are barred from sitting final examinations.
          </p>
        </GlassCard>
      )}

      {/* Attendance Detail Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Held</th>
                <th className="px-4 py-3">Present</th>
                <th className="px-4 py-3">Late</th>
                <th className="px-4 py-3">Absent</th>
                <th className="px-4 py-3 min-w-[180px]">Attendance Rate</th>
                <th className="px-4 py-3 text-right">Exam Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {logWithPct.map((r) => (
                <tr key={r.code} className="hover:bg-white/[0.035] transition-colors">
                  <td className="px-4 py-3 font-sans">
                    <span className="font-mono text-jade font-bold block">{r.code}</span>
                    <span className="text-ink-faint text-[0.75rem]">{r.title}</span>
                  </td>
                  <td className="px-4 py-3 text-ink">{r.held}</td>
                  <td className="px-4 py-3 text-jade font-bold">{r.present}</td>
                  <td className="px-4 py-3 text-marigold">{r.late}</td>
                  <td className="px-4 py-3 text-rose">{r.absent}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Meter
                        value={r.pct}
                        max={100}
                        className="h-2 grow"
                        tone={r.pct < 75 ? "hot" : r.pct < 85 ? "warn" : "jade"}
                      />
                      <span className="w-10 text-right font-bold text-ink">{r.pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-sans">
                    <StatusPill tone={r.pct >= 75 ? "ok" : "bad"}>
                      {r.pct >= 75 ? "Eligible" : "Barred"}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
