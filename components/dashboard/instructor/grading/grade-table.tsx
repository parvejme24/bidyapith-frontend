"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { computeGrade, getInitials } from "@/lib/format";
import type { InstructorSection } from "@/lib/app-types";
import type { GradeRecord, SectionStudent } from "./grade-types";

interface GradeTableProps {
  filteredStudents: SectionStudent[];
  currentMarks: Record<string, GradeRecord>;
  isLocked: boolean;
  onMarkChange: (
    studentId: string,
    field: "mid" | "assign" | "final",
    valStr: string,
    maxVal: number
  ) => void;
  searchQuery: string;
  enteredCount: number;
  totalStudents: number;
  currentSection: InstructorSection;
}

export function GradeTable({
  filteredStudents,
  currentMarks,
  isLocked,
  onMarkChange,
  searchQuery,
  enteredCount,
  totalStudents,
  currentSection,
}: GradeTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3 text-center">Midterm /30</th>
              <th className="px-4 py-3 text-center">Assign /20</th>
              <th className="px-4 py-3 text-center">Final Exam /50</th>
              <th className="px-4 py-3 text-center">Total /100</th>
              <th className="px-4 py-3 text-right">Letter Grade (GP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-xs">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((st) => {
                const marks = currentMarks[st.id] || { mid: null, assign: null, final: null };
                const midVal = marks.mid;
                const assignVal = marks.assign;
                const finalVal = marks.final;

                const hasAllMarks = midVal !== null && assignVal !== null && finalVal !== null;
                const total = hasAllMarks ? (midVal ?? 0) + (assignVal ?? 0) + (finalVal ?? 0) : null;
                const [grade, point] = total !== null ? computeGrade(total) : ["—", 0];

                return (
                  <tr key={st.id} className="hover:bg-white/[0.035] transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="size-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620] font-display text-[0.65rem] font-bold shrink-0">
                          {getInitials(st.name)}
                        </span>
                        <span className="font-semibold text-ink">{st.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-faint">{st.id}</td>

                    {/* Midterm Input (/30) */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        disabled={isLocked}
                        value={midVal ?? ""}
                        onChange={(e) => onMarkChange(st.id, "mid", e.target.value, 30)}
                        placeholder="—"
                        className="w-14 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-center font-bold text-ink outline-none focus:border-jade disabled:opacity-50"
                      />
                    </td>

                    {/* Assignment Input (/20) */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        disabled={isLocked}
                        value={assignVal ?? ""}
                        onChange={(e) => onMarkChange(st.id, "assign", e.target.value, 20)}
                        placeholder="—"
                        className="w-14 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-center font-bold text-ink outline-none focus:border-jade disabled:opacity-50"
                      />
                    </td>

                    {/* Final Exam Input (/50) */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        disabled={isLocked}
                        value={finalVal ?? ""}
                        onChange={(e) => onMarkChange(st.id, "final", e.target.value, 50)}
                        placeholder="—"
                        className="w-14 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-center font-bold text-ink outline-none focus:border-jade disabled:opacity-50"
                      />
                    </td>

                    {/* Total (/100) */}
                    <td className="px-4 py-3 text-center font-bold text-ink text-sm">
                      {total !== null ? total : "—"}
                    </td>

                    {/* Letter Grade */}
                    <td className="px-4 py-3 text-right">
                      {total !== null ? (
                        <StatusPill
                          tone={
                            point >= 3.7
                              ? "ok"
                              : point >= 3.0
                              ? "info"
                              : point >= 2.0
                              ? "warn"
                              : "bad"
                          }
                        >
                          {grade} ({point.toFixed(2)})
                        </StatusPill>
                      ) : (
                        <span className="text-ink-faint">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                  No students found matching "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/8 text-xs text-ink-faint">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-ink-muted">
            {enteredCount} of {totalStudents} complete marks entered
          </span>
          <span>·</span>
          <span>Section: {currentSection?.code} ({currentSection?.section})</span>
        </div>
        <span>
          {isLocked
            ? "Grade sheet is locked and submitted to the registrar"
            : "Draft marks auto-sync locally; submit when grades are final."}
        </span>
      </div>
    </GlassCard>
  );
}
