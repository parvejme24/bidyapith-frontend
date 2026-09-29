"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ShieldCheck, Lock, Clock, Award } from "lucide-react";
import type { SemesterResultRecord } from "./results-types";

interface SemesterGradeSheetTableProps {
  record?: SemesterResultRecord | null;
}

export function SemesterGradeSheetTable({ record }: SemesterGradeSheetTableProps) {
  if (!record) {
    return (
      <GlassCard className="p-8 text-center text-ink-faint">
        <p className="text-sm">No semester grade record available for this selection.</p>
      </GlassCard>
    );
  }

  const isCompleted = record.status === "completed";
  const isCurrent = record.status === "current";
  const isLocked = record.status === "locked";

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-white/10 gap-3 bg-white/[0.02]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink">
              {record.semesterTitle} · {isCompleted ? "Official Grade Sheet" : isCurrent ? "Active Evaluation & Running Marks" : "Curriculum & Course Outline"}
            </h3>
            {isCompleted && (
              <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-jade/15 text-jade border border-jade/25">
                GPA {record.gpa.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-xs text-ink-faint font-mono mt-1">
            {record.totalCredits} Credits Total · {record.courses.length} Courses {record.publishedDate ? `· Published on ${record.publishedDate}` : ""}
          </p>
        </div>

        <div>
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-jade/10 text-jade border border-jade/20 text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-jade" /> Published & Verified
            </span>
          )}
          {isCurrent && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-marigold/10 text-marigold border border-marigold/20 text-xs font-bold font-mono">
              <Clock className="w-3.5 h-3.5 text-marigold" /> Continuous Assessment
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 text-ink-faint border border-white/10 text-xs font-semibold font-mono">
              <Lock className="w-3.5 h-3.5 text-ink-faint" /> Scheduled Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Grade Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-3.5">Course Code</th>
              <th className="px-4 py-3.5">Course Title</th>
              <th className="px-4 py-3.5 text-center">Type</th>
              <th className="px-4 py-3.5 text-center">Credits</th>
              {isCurrent && <th className="px-4 py-3.5 text-center">Evaluated Marks</th>}
              <th className="px-4 py-3.5 text-center">Letter Grade</th>
              <th className="px-4 py-3.5 text-right">Grade Point</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-xs">
            {record.courses.map((r) => (
              <tr key={r.code} className="hover:bg-white/[0.035] transition-colors">
                <td className="px-4 py-3.5 font-bold text-jade">{r.code}</td>
                <td className="px-4 py-3.5 font-sans font-medium text-ink">{r.title}</td>
                <td className="px-4 py-3.5 text-center font-sans">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-ink-faint uppercase font-bold">
                    {r.type || "Core"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center text-ink">{r.credits}</td>
                {isCurrent && (
                  <td className="px-4 py-3.5 text-center text-ink">
                    {r.marks ? `${r.marks} / 100` : "—"}
                  </td>
                )}
                <td className="px-4 py-3.5 text-center font-sans">
                  {isLocked ? (
                    <span className="text-ink-faint text-xs">—</span>
                  ) : (
                    <StatusPill
                      tone={
                        r.point >= 3.75
                          ? "ok"
                          : r.point >= 3.0
                          ? "info"
                          : r.point >= 2.0
                          ? "warn"
                          : "bad"
                      }
                    >
                      {r.grade}
                    </StatusPill>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right font-bold text-ink">
                  {isLocked ? "—" : r.point.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer Notes */}
      <div className="p-3.5 bg-white/[0.01] border-t border-white/5 text-[11px] text-ink-faint flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>
          {isCompleted
            ? "Official grade record signed and verified by Office of the Controller of Examinations."
            : isCurrent
            ? "* Projected grade points reflect continuous assessment and internal evaluations."
            : "Enrollment and seat registration open upon semester unlocking."}
        </span>
        {isCompleted && (
          <span className="font-mono text-jade font-semibold">
            Term Total Quality Points: {(record.gpa * record.totalCredits).toFixed(1)}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
