"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import type { AttendanceStats } from "./attendance-types";
import { formatDateDMY } from "./attendance-utils";

interface DailyRosterViewProps {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  selectedDate?: Date;
  dailyAttendance: Record<string, "P" | "L" | "A">;
  studentStatsMap: Record<string, AttendanceStats>;
  onMarkDaily: (studentId: string, status: "P" | "L" | "A") => void;
  onSelectStudentForModal: (student: RosterStudent) => void;
}

export function DailyRosterView({
  roster,
  currentSection,
  selectedDate,
  dailyAttendance,
  studentStatsMap,
  onMarkDaily,
  onSelectStudentForModal,
}: DailyRosterViewProps) {
  const presentCount = Object.values(dailyAttendance).filter((v) => v === "P").length;
  const lateCount = Object.values(dailyAttendance).filter((v) => v === "L").length;
  const absentCount = Object.values(dailyAttendance).filter((v) => v === "A").length;
  const unmarkedCount = roster.length - Object.keys(dailyAttendance).length;

  return (
    <GlassCard className="p-3.5 sm:p-5 rounded-xl space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-sm sm:text-base lg:text-lg font-semibold text-ink">
              Student Roster ({roster.length} students)
            </h3>
            <span className="text-[0.68rem] px-2 py-0.5 rounded-md bg-jade/15 text-jade font-semibold">
              Session: {selectedDate ? formatDateDMY(selectedDate) : "Today"}
            </span>
          </div>
          <p className="text-[0.72rem] text-ink-faint mt-0.5">
            {currentSection.code} · Section {currentSection.section} · {currentSection.room} ·
            Click student to view month
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {unmarkedCount > 0 && (
            <span className="text-ink-muted bg-white/5 px-2 py-0.5 rounded-md border border-white/10 font-sans text-[0.7rem]">
              {unmarkedCount} Unmarked
            </span>
          )}
          <span className="text-jade font-semibold bg-jade/10 px-2 py-0.5 rounded-md border border-jade/20 text-[0.7rem]">
            {presentCount} P
          </span>
          <span className="text-marigold font-semibold bg-marigold/10 px-2 py-0.5 rounded-md border border-marigold/20 text-[0.7rem]">
            {lateCount} L
          </span>
          <span className="text-rose font-semibold bg-rose/10 px-2 py-0.5 rounded-md border border-rose/20 text-[0.7rem]">
            {absentCount} A
          </span>
        </div>
      </div>

      {/* Roster Student List */}
      <div className="grid gap-2">
        {roster.map((st) => {
          const currentMark = dailyAttendance[st.id];
          const stats = studentStatsMap[st.id];
          const calculatedRate = stats ? stats.ratePct : st.att;

          return (
            <div
              key={st.id}
              className="group flex items-center justify-between gap-2.5 p-2 sm:p-3 rounded-lg border border-white/8 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045] transition-all"
            >
              {/* Clickable student info opening monthly modal */}
              <button
                type="button"
                onClick={() => onSelectStudentForModal(st)}
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group-hover:translate-x-0.5 transition-transform grow"
                title="Click to view full monthly attendance breakdown"
              >
                <UserAvatar
                  name={st.name}
                  avatar={st.avatar}
                  size="md"
                  colorScheme="jade"
                />

                <div className="min-w-0 grow">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-semibold text-ink truncate group-hover:text-jade transition-colors">
                      {st.name}
                    </p>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[0.68rem] text-jade hidden sm:inline-flex items-center gap-1 font-sans shrink-0">
                      <Eye className="size-3" />
                      <span>Month</span>
                    </span>
                  </div>
                  <p className="text-[0.68rem] sm:text-[0.72rem] font-mono text-ink-faint truncate">
                    {st.id} ·{" "}
                    <span
                      className={cn(
                        "font-bold",
                        calculatedRate < 75 ? "text-rose" : "text-jade"
                      )}
                    >
                      {calculatedRate}% att
                    </span>
                    {stats && (
                      <span className="text-[0.65rem] text-ink-muted ml-1 font-sans hidden sm:inline">
                        ({stats.p}P · {stats.l}L · {stats.a}A)
                      </span>
                    )}
                    {calculatedRate < 75 && (
                      <span className="ml-1 text-[0.62rem] px-1 py-0.2 rounded bg-rose/15 text-rose font-sans font-medium">
                        Low
                      </span>
                    )}
                  </p>
                </div>
              </button>

              {/* Mark Toggle Buttons (P / L / A) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onMarkDaily(st.id, "P")}
                  className={cn(
                    "size-6 sm:size-7 rounded-md text-[0.7rem] sm:text-xs font-bold border transition-all cursor-pointer",
                    currentMark === "P"
                      ? "bg-jade text-night-900 border-jade shadow-sm scale-105"
                      : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                  )}
                  title="Mark Present"
                >
                  P
                </button>
                <button
                  type="button"
                  onClick={() => onMarkDaily(st.id, "L")}
                  className={cn(
                    "size-6 sm:size-7 rounded-md text-[0.7rem] sm:text-xs font-bold border transition-all cursor-pointer",
                    currentMark === "L"
                      ? "bg-marigold text-night-900 border-marigold shadow-sm scale-105"
                      : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                  )}
                  title="Mark Late"
                >
                  L
                </button>
                <button
                  type="button"
                  onClick={() => onMarkDaily(st.id, "A")}
                  className={cn(
                    "size-6 sm:size-7 rounded-md text-[0.7rem] sm:text-xs font-bold border transition-all cursor-pointer",
                    currentMark === "A"
                      ? "bg-rose text-night-900 border-rose shadow-sm scale-105"
                      : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                  )}
                  title="Mark Absent"
                >
                  A
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
