"use client";

import React, { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import { getInitials } from "@/lib/app-data";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface AttendanceRosterProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSave: (marksCount: number) => void;
}

export function AttendanceRoster({ sections, roster, onSave }: AttendanceRosterProps) {
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState<Record<string, "P" | "L" | "A">>({});

  const currentSection = sections.find((s) => s.id === selectedSec) || sections[0];

  const handleMark = (studentId: string, status: "P" | "L" | "A") => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: "P" | "L" | "A") => {
    const next: Record<string, "P" | "L" | "A"> = {};
    roster.forEach((st) => {
      next[st.id] = status;
    });
    setAttendance(next);
  };

  const presentCount = Object.values(attendance).filter((v) => v === "P").length;
  const lateCount = Object.values(attendance).filter((v) => v === "L").length;
  const absentCount = Object.values(attendance).filter((v) => v === "A").length;

  return (
    <div className="space-y-4">
      {/* Filter and Control Bar */}
      <GlassCard className="p-4 md:p-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3 grow">
          <label className="block grow sm:grow-0 min-w-[220px]">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Assigned Section
            </span>
            <select
              value={selectedSec}
              onChange={(e) => setSelectedSec(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade cursor-pointer"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id} className="bg-night-800 text-ink">
                  {s.code} — Section {s.section} ({s.room})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Session Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade"
            />
          </label>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleMarkAll("P")}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
          >
            Mark all present
          </button>
          <button
            type="button"
            onClick={() => onSave(Object.keys(attendance).length || roster.length)}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
          >
            Save attendance
          </button>
        </div>
      </GlassCard>

      {/* Roster & Stats */}
      <GlassCard className="p-5 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/8">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              Student Roster ({roster.length} students)
            </h3>
            <p className="text-xs text-ink-faint">
              {currentSection.code} · Section {currentSection.section} · {currentSection.room}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-jade font-semibold">{presentCount} Present</span>
            <span className="text-marigold font-semibold">{lateCount} Late</span>
            <span className="text-rose font-semibold">{absentCount} Absent</span>
          </div>
        </div>

        {/* Roster Student List */}
        <div className="grid gap-2.5">
          {roster.map((st) => {
            const currentMark = attendance[st.id];

            return (
              <div
                key={st.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620] font-display text-xs font-bold shrink-0">
                    {getInitials(st.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{st.name}</p>
                    <p className="text-xs font-mono text-ink-faint">
                      {st.id} · <span className={st.att < 75 ? "text-rose font-bold" : "text-jade"}>{st.att}% att</span>
                    </p>
                  </div>
                </div>

                {/* Mark Toggle Buttons (P / L / A) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMark(st.id, "P")}
                    className={cn(
                      "size-8 rounded-lg text-xs font-bold border transition-colors",
                      currentMark === "P"
                        ? "bg-jade text-night-900 border-jade shadow-sm"
                        : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                    )}
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMark(st.id, "L")}
                    className={cn(
                      "size-8 rounded-lg text-xs font-bold border transition-colors",
                      currentMark === "L"
                        ? "bg-marigold text-night-900 border-marigold shadow-sm"
                        : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                    )}
                  >
                    L
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMark(st.id, "A")}
                    className={cn(
                      "size-8 rounded-lg text-xs font-bold border transition-colors",
                      currentMark === "A"
                        ? "bg-rose text-night-900 border-rose shadow-sm"
                        : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                    )}
                  >
                    A
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
