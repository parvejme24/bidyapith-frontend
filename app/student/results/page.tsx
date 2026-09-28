"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { AreaTrendChart } from "@/components/dashboard/charts/area-trend-chart";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { computeGrade } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function StudentResultsPage() {
  const { student, term } = useApp();
  const [selectedTermIdx, setSelectedTermIdx] = useState(0);

  const currentTermData = student.transcript[selectedTermIdx] || student.transcript[0];

  return (
    <DashboardLayout
      title="Results & Transcript"
      subtitle={`CGPA ${student.cgpa.toFixed(2)} · ${student.creditsDone} credits earned`}
      requiredRole="student"
      crumb="Student / Results"
      actions={
        <button
          onClick={() => toast.success("Academic transcript downloaded successfully")}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs cursor-pointer hover:border-jade/40")}
        >
          <DashboardIcon name="download" className="size-3.5 text-jade" />
          <span>Download transcript</span>
        </button>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Cumulative CGPA"
          value={student.cgpa.toFixed(2)}
          detail={student.standing}
          tone="up"
        />
        <StatTile
          label="Latest Term GPA"
          value={student.transcript[0]?.gpa.toFixed(2) || "3.79"}
          detail={student.transcript[0]?.term || "Fall 2025"}
        />
        <StatTile
          label="Credits Earned"
          value={student.creditsDone}
          detail={`of ${student.creditsNeeded} total`}
        />
        <StatTile
          label="Terms Completed"
          value={student.transcript.length + 3}
          detail="Since January 2022"
        />
      </div>

      {/* GPA Trend Chart */}
      <GlassCard className="p-6">
        <h3 className="font-display text-lg font-semibold text-ink mb-1">
          Term GPA Trend
        </h3>
        <p className="text-xs text-ink-faint mb-4">
          Each point represents the GPA achieved in that specific semester.
        </p>
        <AreaTrendChart data={student.gpaHistory} color="#FFB454" />
      </GlassCard>

      {/* Term Switcher Segmented Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 w-fit">
        {student.transcript.map((t, idx) => (
          <button
            key={t.term}
            onClick={() => setSelectedTermIdx(idx)}
            className={cn(
              "px-3.5 sm:px-4 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer",
              selectedTermIdx === idx
                ? "bg-white/10 text-ink shadow-sm"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            {t.term}
          </button>
        ))}
      </div>

      {/* Selected Term Grade Sheet Table */}
      <GlassCard className="overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {currentTermData.term}
            </h3>
            <p className="text-xs text-ink-faint font-mono mt-0.5">
              {currentTermData.credits} credits completed · GPA {currentTermData.gpa.toFixed(2)}
            </p>
          </div>
          <StatusPill tone="ok">Published & Verified</StatusPill>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Course Title</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Letter Grade</th>
                <th className="px-4 py-3 text-right">Grade Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {currentTermData.rows.map((r) => (
                <tr key={r.code} className="hover:bg-white/[0.035] transition-colors">
                  <td className="px-4 py-3 text-jade font-bold">{r.code}</td>
                  <td className="px-4 py-3 font-sans font-semibold text-ink">{r.title}</td>
                  <td className="px-4 py-3 text-ink">{r.credits}</td>
                  <td className="px-4 py-3 font-sans">
                    <StatusPill
                      tone={
                        r.point >= 3.7 ? "ok" : r.point >= 3.0 ? "info" : "warn"
                      }
                    >
                      {r.grade}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-ink">
                    {r.point.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Ongoing Running Marks Projection */}
      <GlassCard className="p-6 space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {term.name} — Running Marks & Projections
          </h3>
          <p className="text-xs text-ink-faint mt-0.5">
            Internal assessments computed up to week {term.week}.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-2.5">Code</th>
                <th className="px-4 py-2.5">Course</th>
                <th className="px-4 py-2.5">Evaluated Marks</th>
                <th className="px-4 py-2.5 text-right">Projected Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {student.enrolled.map((c) => {
                const [grade, point] = computeGrade(c.marks);
                return (
                  <tr key={c.code} className="hover:bg-white/[0.035] transition-colors">
                    <td className="px-4 py-2.5 text-jade font-bold">{c.code}</td>
                    <td className="px-4 py-2.5 font-sans text-ink">{c.title}</td>
                    <td className="px-4 py-2.5 text-ink">{c.marks} / 100</td>
                    <td className="px-4 py-2.5 text-right font-sans">
                      <StatusPill tone={point >= 3.7 ? "ok" : point >= 3.0 ? "info" : "warn"}>
                        {grade} ({point.toFixed(1)})
                      </StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[0.7rem] text-ink-faint">
          * Projection assumes performance in final exam matches continuous evaluation. Not an official grade sheet.
        </p>
      </GlassCard>
    </DashboardLayout>
  );
}
