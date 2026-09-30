"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Eye, Sparkles, Sun, Umbrella, X } from "lucide-react";
import type { AttendanceStats, DayOverrideInfo } from "./attendance-types";
import { formatDateDMY } from "./attendance-utils";

interface DailyRosterViewProps {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  selectedDate?: Date;
  dailyAttendance: Record<string, "P" | "L" | "A">;
  studentStatsMap: Record<string, AttendanceStats>;
  scheduleOverrides?: Record<string, DayOverrideInfo>;
  onMarkDaily: (studentId: string, status: "P" | "L" | "A") => void;
  onSetDaySchedule?: (dateKey: string, type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY", reason?: string) => void;
  onSelectStudentForModal: (student: RosterStudent) => void;
}

export function DailyRosterView({
  roster,
  currentSection,
  selectedDate,
  dailyAttendance,
  studentStatsMap,
  scheduleOverrides = {},
  onMarkDaily,
  onSetDaySchedule,
  onSelectStudentForModal,
}: DailyRosterViewProps) {
  const dateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "2026-09-27";

  const dayIndex = selectedDate ? selectedDate.getDay() : 0;
  const isWeekend = dayIndex === 5 || dayIndex === 6;
  const currentOverride = scheduleOverrides[dateKey];
  const isSpecialClass = currentOverride?.type === "SPECIAL_CLASS";
  const isHoliday = currentOverride?.type === "HOLIDAY";

  const presentCount = Object.values(dailyAttendance).filter((v) => v === "P").length;
  const lateCount = Object.values(dailyAttendance).filter((v) => v === "L").length;
  const absentCount = Object.values(dailyAttendance).filter((v) => v === "A").length;
  const unmarkedCount = roster.length - Object.keys(dailyAttendance).length;

  return (
    <GlassCard className="p-3.5 sm:p-5 rounded-xl space-y-3.5">
      {/* Schedule Override Banner */}
      {isSpecialClass ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-lg bg-jade/15 border border-jade/30 text-xs">
          <div className="flex items-center gap-2 text-jade">
            <Sparkles className="size-4 shrink-0" />
            <span className="font-bold">Special / Makeup Class Scheduled</span>
            <span className="text-ink-muted">· Attendance recording enabled for this weekend/date</span>
          </div>
          {onSetDaySchedule && (
            <button
              type="button"
              onClick={() => onSetDaySchedule(dateKey, "REGULAR")}
              className="text-xs text-ink-muted hover:text-ink underline cursor-pointer"
            >
              Reset to regular schedule
            </button>
          )}
        </div>
      ) : isHoliday ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-lg bg-marigold/15 border border-marigold/30 text-xs">
          <div className="flex items-center gap-2 text-marigold">
            <Umbrella className="size-4 shrink-0" />
            <span className="font-bold">Holiday / No Class Declared ({currentOverride?.reason || "Campus Occasion"})</span>
            <span className="text-ink-muted">· Class excused & not counted against student attendance</span>
          </div>
          {onSetDaySchedule && (
            <button
              type="button"
              onClick={() => onSetDaySchedule(dateKey, "REGULAR")}
              className="text-xs text-ink-muted hover:text-ink underline cursor-pointer"
            >
              Resume class
            </button>
          )}
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-sm sm:text-base lg:text-lg font-semibold text-ink">
              Student Roster ({roster.length} students)
            </h3>
            <span className="text-[0.68rem] px-2 py-0.5 rounded-md bg-jade/15 text-jade font-semibold">
              Session: {selectedDate ? formatDateDMY(selectedDate) : "Today"}
            </span>
            {isWeekend && !isSpecialClass && !isHoliday && (
              <span className="text-[0.68rem] px-2 py-0.5 rounded-md bg-white/10 text-ink-muted font-semibold">
                Academic Weekend
              </span>
            )}
          </div>
          <p className="text-[0.72rem] text-ink-faint mt-0.5">
            {currentSection?.code || "Course"} · Section {currentSection?.section || "1"} · {currentSection?.room || "Classroom"} ·
            Click student to view month
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Direct Schedule Option Toggle Buttons */}
          {onSetDaySchedule && (
            <div className="flex items-center gap-1.5 font-sans">
              {/* Holiday Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (isHoliday) {
                    onSetDaySchedule(dateKey, "REGULAR");
                  } else {
                    onSetDaySchedule(dateKey, "HOLIDAY", "Declared Holiday / No Class");
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.72rem] font-semibold transition-all cursor-pointer border shadow-2xs",
                  isHoliday
                    ? "bg-marigold/20 text-marigold border-marigold/50 hover:bg-marigold/30 ring-1 ring-marigold/30"
                    : "bg-white/[0.04] text-ink-muted border-white/15 hover:text-marigold hover:border-marigold/40 hover:bg-marigold/10"
                )}
                title={isHoliday ? "Click to remove holiday and resume session" : "Click to declare today as a holiday / no class"}
              >
                <Umbrella className={cn("size-3.5 shrink-0", isHoliday ? "text-marigold" : "text-ink-muted")} />
                <span>{isHoliday ? "Remove Today Holiday" : "Declare Today Holiday"}</span>
              </button>

              {/* Weekend Makeup Class Toggle Button */}
              {isWeekend && !isHoliday && (
                <button
                  type="button"
                  onClick={() => {
                    if (isSpecialClass) {
                      onSetDaySchedule(dateKey, "REGULAR");
                    } else {
                      onSetDaySchedule(dateKey, "SPECIAL_CLASS", "Weekend Makeup Lecture");
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.72rem] font-semibold transition-all cursor-pointer border shadow-2xs",
                    isSpecialClass
                      ? "bg-jade/20 text-jade border-jade/50 hover:bg-jade/30 ring-1 ring-jade/30"
                      : "bg-white/[0.04] text-ink-muted border-white/15 hover:text-jade hover:border-jade/40 hover:bg-jade/10"
                  )}
                  title={isSpecialClass ? "Click to cancel special makeup class" : "Click to arrange a makeup lecture on this weekend"}
                >
                  <Sparkles className={cn("size-3.5 shrink-0", isSpecialClass ? "text-jade" : "text-ink-muted")} />
                  <span>{isSpecialClass ? "Cancel Makeup Class" : "Arrange Makeup Class"}</span>
                </button>
              )}
            </div>
          )}

          {!isHoliday && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Roster Student List */}
      {roster.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/10 space-y-2 bg-white/[0.01]">
          <AlertCircle className="size-7 text-ink-muted mx-auto" />
          <p className="text-sm font-semibold text-ink">No students match the current filters</p>
          <p className="text-xs text-ink-muted">
            Try adjusting or resetting your search, batch, or attendance status filter.
          </p>
        </div>
      ) : (
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-ink truncate group-hover:text-jade transition-colors">
                        {st.name}
                      </p>
                      {st.batch && (
                        <span className="text-[0.62rem] px-1.5 py-0.2 rounded bg-white/[0.08] text-jade font-sans font-medium shrink-0">
                          Batch {st.batch}
                        </span>
                      )}
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

              {/* Mark Toggle Buttons (P / L / A) or Holiday Status Badge */}
              {isHoliday ? (
                <span className="text-[0.68rem] px-2.5 py-1 rounded-md bg-marigold/10 text-marigold border border-marigold/20 font-sans font-semibold inline-flex items-center gap-1 shrink-0">
                  <Umbrella className="size-3" />
                  <span>Holiday / No Class</span>
                </span>
              ) : (
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
              )}
            </div>
          );
        })}
      </div>
      )}
    </GlassCard>
  );
}
