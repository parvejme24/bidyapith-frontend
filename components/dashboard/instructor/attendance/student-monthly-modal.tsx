"use client";

import React from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  XCircle,
} from "lucide-react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AttendanceStats, MonthDayInfo } from "./attendance-types";
import { MONTH_NAMES, resolveStudentMark } from "./attendance-utils";

export interface StudentMonthlyModalBodyProps {
  student: RosterStudent;
  section: InstructorSection;
  monthDays: MonthDayInfo[];
  modalStats: AttendanceStats;
  activeYear: number;
  activeMonth: number;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleMark: (dateKey: string, mark: "P" | "L" | "A") => void;
  onExport: () => void;
  onClose: () => void;
}

export function StudentMonthlyModalBody({
  student,
  section,
  monthDays,
  modalStats,
  activeYear,
  activeMonth,
  attendanceStore,
  onPrevMonth,
  onNextMonth,
  onToggleMark,
  onExport,
  onClose,
}: StudentMonthlyModalBodyProps) {
  const isGoodStanding = modalStats.ratePct >= 75;

  return (
    <>
      {/* Modal Header */}
      <div className="p-3.5 sm:p-5 border-b border-white/10 bg-white/[0.03] shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar
              name={student.name}
              avatar={student.avatar}
              size="lg"
              colorScheme="jade"
            />

            <div className="min-w-0 grow">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <DialogTitle className="font-display text-sm sm:text-base lg:text-lg font-bold text-ink truncate">
                  {student.name}
                </DialogTitle>
                <span
                  className={cn(
                    "text-[0.68rem] sm:text-xs px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1",
                    isGoodStanding
                      ? "bg-jade/20 text-jade border border-jade/30"
                      : "bg-rose/20 text-rose border border-rose/30"
                  )}
                >
                  {isGoodStanding ? (
                    <>
                      <CheckCircle2 className="size-3 shrink-0" />
                      <span>Good Standing (≥75%)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="size-3 shrink-0" />
                      <span>Low Att (&lt;75%)</span>
                    </>
                  )}
                </span>
              </div>
              <DialogDescription className="text-[0.7rem] sm:text-xs text-ink-faint mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-mono text-ink-muted">{student.id}</span>
                <span>·</span>
                <span>{student.prog}</span>
                <span>·</span>
                <span className="text-jade font-semibold">
                  {section.code} (Sec {section.section})
                </span>
              </DialogDescription>
            </div>
          </div>

          {/* Month Navigator in Modal */}
          <div className="flex items-center justify-between sm:justify-end gap-1 rounded-md border border-white/15 bg-white/[0.05] p-1 shadow-sm w-full sm:w-auto">
            <button
              type="button"
              onClick={onPrevMonth}
              aria-label="Previous Month"
              className="p-1 rounded text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-2 text-xs sm:text-sm font-bold text-ink min-w-[100px] text-center">
              {MONTH_NAMES[activeMonth]} {activeYear}
            </span>
            <button
              type="button"
              onClick={onNextMonth}
              aria-label="Next Month"
              className="p-1 rounded text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Real-time Monthly Attendance Metrics Grid */}
        <div className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-white/8">
          <div className="p-2 sm:p-2.5 rounded bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-[0.62rem] sm:text-[0.68rem] text-ink-faint font-semibold uppercase tracking-wider truncate">
              Classes Held
            </span>
            <p className="font-mono font-bold text-sm sm:text-base text-ink mt-0.5 flex items-baseline gap-1">
              <span>{modalStats.held}</span>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-ink-faint font-normal font-sans">
                sessions
              </span>
            </p>
          </div>

          <div className="p-2 sm:p-2.5 rounded bg-jade/10 border border-jade/25 flex flex-col justify-between">
            <span className="text-[0.62rem] sm:text-[0.68rem] text-jade/90 font-semibold uppercase tracking-wider truncate">
              Present (P)
            </span>
            <p className="font-mono font-bold text-sm sm:text-base text-jade mt-0.5 flex items-baseline gap-1">
              <span>{modalStats.p}</span>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-jade/70 font-normal font-sans">
                days
              </span>
            </p>
          </div>

          <div className="p-2 sm:p-2.5 rounded bg-marigold/10 border border-marigold/25 flex flex-col justify-between">
            <span className="text-[0.62rem] sm:text-[0.68rem] text-marigold/90 font-semibold uppercase tracking-wider truncate">
              Late (L = 0.5)
            </span>
            <p className="font-mono font-bold text-sm sm:text-base text-marigold mt-0.5 flex items-baseline gap-1">
              <span>{modalStats.l}</span>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-marigold/70 font-normal font-sans">
                days
              </span>
            </p>
          </div>

          <div className="p-2 sm:p-2.5 rounded bg-rose/10 border border-rose/25 flex flex-col justify-between">
            <span className="text-[0.62rem] sm:text-[0.68rem] text-rose/90 font-semibold uppercase tracking-wider truncate">
              Absent (A)
            </span>
            <p className="font-mono font-bold text-sm sm:text-base text-rose mt-0.5 flex items-baseline gap-1">
              <span>{modalStats.a}</span>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-rose/70 font-normal font-sans">
                days
              </span>
            </p>
          </div>

          <div className="p-2 sm:p-2.5 rounded bg-white/[0.04] border border-white/15 flex flex-col justify-between">
            <span className="text-[0.62rem] sm:text-[0.68rem] text-ink-faint font-semibold uppercase tracking-wider truncate">
              Month Rate %
            </span>
            <p
              className={cn(
                "font-mono font-bold text-sm sm:text-base mt-0.5 flex items-baseline gap-1",
                modalStats.held > 0
                  ? isGoodStanding
                    ? "text-jade"
                    : "text-rose"
                  : "text-ink-faint"
              )}
            >
              <span>{modalStats.held > 0 ? `${modalStats.ratePct}%` : "—"}</span>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-ink-faint font-normal font-sans hidden min-[420px]:inline">
                this month
              </span>
            </p>
          </div>

          <div className="p-2 sm:p-2.5 rounded bg-jade/[0.08] border border-jade/20 flex flex-col justify-between">
            <span className="text-[0.62rem] sm:text-[0.68rem] text-jade font-semibold uppercase tracking-wider truncate">
              Total Rate %
            </span>
            <p
              className={cn(
                "font-mono font-bold text-sm sm:text-base mt-0.5 flex items-baseline gap-1",
                student.att >= 75 ? "text-jade" : "text-rose"
              )}
            >
              <span>{student.att}%</span>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-ink-faint font-normal font-sans hidden min-[420px]:inline">
                all months
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* List Header and Download Action Bar */}
      <div className="px-3.5 sm:px-5 py-2 bg-white/[0.02] border-b border-white/8 flex items-center justify-between shrink-0">
        <p className="text-[0.68rem] sm:text-xs font-bold text-ink-muted uppercase tracking-wider">
          Day-by-Day Log ({MONTH_NAMES[activeMonth]} {activeYear})
        </p>

        <button
          type="button"
          onClick={onExport}
          className="text-xs text-jade hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Download className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">Download Log (.csv)</span>
          <span className="sm:hidden">CSV</span>
        </button>
      </div>

      {/* Day-by-Day Attendance Breakdown List */}
      <div className="p-3 sm:p-5 overflow-y-auto grow max-h-[50vh] sm:max-h-[55vh] space-y-2">
        {monthDays.map((day) => {
          const mark = resolveStudentMark(student, section, day, attendanceStore);

          return (
            <div
              key={day.dayNumber}
              className={cn(
                "flex items-center justify-between gap-2.5 px-3 py-2 sm:py-2.5 rounded-md border transition-all",
                day.isToday
                  ? "border-jade/50 bg-jade/[0.08] shadow-sm ring-1 ring-jade/30"
                  : day.isClassDay
                  ? "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
                  : "border-white/5 bg-white/[0.01] opacity-60"
              )}
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <span
                  className={cn(
                    "font-mono text-xs sm:text-sm font-bold w-5 sm:w-6 shrink-0",
                    day.isToday ? "text-jade" : "text-ink"
                  )}
                >
                  {String(day.dayNumber).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink flex items-center gap-1.5 truncate">
                    <span>{day.weekdayFull}</span>
                    {day.isToday && (
                      <span className="text-[0.6rem] sm:text-[0.62rem] px-1.5 py-0.2 rounded bg-jade text-night-900 font-bold uppercase tracking-wider shrink-0">
                        Today
                      </span>
                    )}
                  </p>
                  <p className="text-[0.65rem] sm:text-[0.68rem] text-ink-faint font-mono mt-0.5 truncate">
                    {day.dateKey} ·{" "}
                    {day.isClassDay ? (
                      <span className="text-jade font-semibold">Scheduled Class</span>
                    ) : day.isWeekend ? (
                      "Weekend"
                    ) : (
                      "No Class"
                    )}
                  </p>
                </div>
              </div>

              {/* Day Status / Interactive Mark Buttons */}
              {day.isClassDay ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleMark(day.dateKey, "P")}
                    className={cn(
                      "size-6 sm:size-7 rounded-md text-[0.7rem] sm:text-xs font-bold border transition-all cursor-pointer",
                      mark === "P"
                        ? "bg-jade text-night-900 border-jade shadow-sm font-black scale-105"
                        : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                    )}
                    title="Mark Present (1.0 mark)"
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleMark(day.dateKey, "L")}
                    className={cn(
                      "size-6 sm:size-7 rounded-md text-[0.7rem] sm:text-xs font-bold border transition-all cursor-pointer",
                      mark === "L"
                        ? "bg-marigold text-night-900 border-marigold shadow-sm font-black scale-105"
                        : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                    )}
                    title="Mark Late (0.5 mark)"
                  >
                    L
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleMark(day.dateKey, "A")}
                    className={cn(
                      "size-6 sm:size-7 rounded-md text-[0.7rem] sm:text-xs font-bold border transition-all cursor-pointer",
                      mark === "A"
                        ? "bg-rose text-night-900 border-rose shadow-sm font-black scale-105"
                        : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                    )}
                    title="Mark Absent (0.0 mark)"
                  >
                    A
                  </button>
                </div>
              ) : (
                <span className="text-[0.65rem] sm:text-[0.7rem] text-ink-faint font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 shrink-0">
                  Off Day
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Footer */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
        <span className="text-[0.68rem] sm:text-xs text-ink-faint truncate">
          Real-time updates saved to database
        </span>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            buttonClass({ variant: "primary", size: "sm" }),
            "text-xs px-4 sm:px-5 cursor-pointer rounded-lg shrink-0"
          )}
        >
          Done
        </button>
      </div>
    </>
  );
}
