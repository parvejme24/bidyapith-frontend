"use client";

import React, { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { computeGrade, getInitials } from "@/lib/app-data";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface GradeSheetProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSubmit: (sectionId: string) => void;
}

export function GradeSheet({ sections, roster, onSubmit }: GradeSheetProps) {
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [finalMarks, setFinalMarks] = useState<Record<string, number | null>>({
    "2022-1-60-041": 42,
    "2022-1-60-044": 46,
    "2022-1-60-052": 38,
    "2022-1-60-058": 44,
  });

  const [isLocked, setIsLocked] = useState(false);
  const currentSection = sections.find((s) => s.id === selectedSec) || sections[0];

  const handleFinalChange = (id: string, valStr: string) => {
    if (valStr === "") {
      setFinalMarks((prev) => ({ ...prev, [id]: null }));
      return;
    }
    const val = Number(valStr);
    if (!isNaN(val) && val >= 0 && val <= 50) {
      setFinalMarks((prev) => ({ ...prev, [id]: val }));
    }
  };

  const enteredCount = Object.values(finalMarks).filter((v) => v !== null).length;

  const handleSubmit = () => {
    setIsLocked(true);
    onSubmit(selectedSec);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <GlassCard className="p-4 md:p-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3 grow">
          <label className="block grow sm:grow-0 min-w-[240px]">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Course & Section
            </span>
            <select
              value={selectedSec}
              onChange={(e) => setSelectedSec(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade cursor-pointer"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id} className="bg-night-800 text-ink">
                  {s.code} — Section {s.section} ({s.enrolled} enrolled)
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs text-ink-faint max-w-sm pb-1">
            Midterm (30) · Assignments (20) · Final Exam (50). Total out of 100 with dynamic letter grade mapping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLocked || enteredCount === 0}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
          >
            {isLocked ? "Grades Submitted" : "Submit Grade Sheet"}
          </button>
        </div>
      </GlassCard>

      {/* Grade Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Mid /30</th>
                <th className="px-4 py-3">Assign /20</th>
                <th className="px-4 py-3">Final /50</th>
                <th className="px-4 py-3">Total /100</th>
                <th className="px-4 py-3 text-right">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {roster.map((st) => {
                const finalVal = finalMarks[st.id] ?? null;
                const total = finalVal !== null ? st.mid + st.assign + finalVal : null;
                const [grade, point] = total !== null ? computeGrade(total) : ["—", 0];

                return (
                  <tr key={st.id} className="hover:bg-white/[0.035] transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="size-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620] font-display text-[0.65rem] font-bold">
                          {getInitials(st.name)}
                        </span>
                        <span className="font-semibold text-ink">{st.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-faint">{st.id}</td>
                    <td className="px-4 py-3 text-ink">{st.mid}</td>
                    <td className="px-4 py-3 text-ink">{st.assign}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        disabled={isLocked}
                        value={finalVal ?? ""}
                        onChange={(e) => handleFinalChange(st.id, e.target.value)}
                        placeholder="—"
                        className="w-16 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-center font-bold text-ink outline-none focus:border-jade disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-3 font-bold text-ink">
                      {total !== null ? total : "—"}
                    </td>
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
                          {grade} ({point.toFixed(1)})
                        </StatusPill>
                      ) : (
                        <span className="text-ink-faint">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/8 text-xs text-ink-faint">
          <span>
            {enteredCount} of {roster.length} grades entered
          </span>
          <span>Sheet is locked once submitted to the registrar</span>
        </div>
      </GlassCard>
    </div>
  );
}
