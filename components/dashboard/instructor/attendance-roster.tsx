"use client";

import React, { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/site/glass-card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useApp } from "@/lib/app-context";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { downloadCsv } from "@/lib/csv-export";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Table as TableIcon,
} from "lucide-react";
import type { AttendanceStats } from "./attendance/attendance-types";
import {
  formatDateDMY,
  getDaysInMonth,
  MONTH_NAMES,
  resolveStudentMark,
  calculateStudentAttendanceStats,
} from "./attendance/attendance-utils";
import { DailyRosterView } from "./attendance/daily-roster-view";
import { MonthlyMatrixView } from "./attendance/monthly-matrix-view";
import { StudentMonthlyModalBody } from "./attendance/student-monthly-modal";

interface AttendanceRosterProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSave?: (marksCount: number) => void;
}

export function AttendanceRoster({ sections, roster, onSave }: AttendanceRosterProps) {
  const { attendanceStore, saveAttendance } = useApp();
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2026, 8, 27));
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Month navigation (default September 2026)
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [activeMonth, setActiveMonth] = useState<number>(8);

  // Selected student for detailed monthly modal
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<RosterStudent | null>(null);

  const dateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "2026-09-27";

  const currentSection = sections.find((s) => s.id === selectedSec) || sections[0];

  const [dailyAttendance, setDailyAttendance] = useState<Record<string, "P" | "L" | "A">>(() => {
    const compositeKey = `${sections[0]?.id || "S1"}_${dateKey}`;
    return attendanceStore?.[compositeKey] || {};
  });

  // Keep daily attendance in sync when section or date changes
  useEffect(() => {
    const compositeKey = `${selectedSec}_${dateKey}`;
    setDailyAttendance(attendanceStore?.[compositeKey] || {});
  }, [selectedSec, dateKey, attendanceStore]);

  const monthDays = useMemo(() => {
    return getDaysInMonth(activeYear, activeMonth, new Date(2026, 8, 27));
  }, [activeYear, activeMonth]);

  const studentStatsMap = useMemo(() => {
    const map: Record<string, AttendanceStats> = {};
    roster.forEach((st) => {
      map[st.id] = calculateStudentAttendanceStats(st, currentSection, monthDays, attendanceStore);
    });
    return map;
  }, [roster, currentSection, monthDays, attendanceStore]);

  const handleMarkDaily = (studentId: string, status: "P" | "L" | "A") => {
    const updated = { ...dailyAttendance, [studentId]: status };
    setDailyAttendance(updated);
    saveAttendance(selectedSec, dateKey, updated);
  };

  const handleMarkAllDaily = (status: "P" | "L" | "A") => {
    const next: Record<string, "P" | "L" | "A"> = {};
    roster.forEach((st) => {
      next[st.id] = status;
    });
    setDailyAttendance(next);
    saveAttendance(selectedSec, dateKey, next);
  };

  const handleSaveDailyAttendance = () => {
    saveAttendance(selectedSec, dateKey, dailyAttendance);
    if (onSave) {
      onSave(Object.keys(dailyAttendance).length);
    }
  };

  const handleToggleDayMark = (
    studentId: string,
    targetDateKey: string,
    newMark: "P" | "L" | "A"
  ) => {
    const compositeKey = `${selectedSec}_${targetDateKey}`;
    const existingDayRecords = attendanceStore[compositeKey] || {};
    const targetDay = monthDays.find((d) => d.dateKey === targetDateKey);

    const updatedRecords: Record<string, "P" | "L" | "A"> = { ...existingDayRecords };

    roster.forEach((st) => {
      if (st.id === studentId) {
        updatedRecords[st.id] = newMark;
      } else if (!updatedRecords[st.id] && targetDay) {
        const currentMark = resolveStudentMark(st, currentSection, targetDay, attendanceStore);
        if (currentMark === "P" || currentMark === "L" || currentMark === "A") {
          updatedRecords[st.id] = currentMark;
        }
      }
    });

    saveAttendance(selectedSec, targetDateKey, updatedRecords);
  };

  const handlePrevMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear((y) => y - 1);
    } else {
      setActiveMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear((y) => y + 1);
    } else {
      setActiveMonth((m) => m + 1);
    }
  };

  const handleExportMonthlyMatrix = () => {
    const headers = [
      "Student ID",
      "Student Name",
      "Program",
      ...monthDays.map((d) => `${d.dayNumber}-${d.weekday}`),
      "Total Present (P)",
      "Total Late (L)",
      "Total Absent (A)",
      "Month Attendance Rate (%)",
      "Cumulative Total Rate (%)",
    ];

    const rows = roster.map((st) => {
      const stats = studentStatsMap[st.id] || calculateStudentAttendanceStats(st, currentSection, monthDays, attendanceStore);
      const dayMarks = monthDays.map((day) => {
        const mark = resolveStudentMark(st, currentSection, day, attendanceStore);
        return mark === "OFF" ? "OFF" : mark === "UNMARKED" ? "-" : mark;
      });

      return [
        st.id,
        st.name,
        st.prog,
        ...dayMarks,
        stats.p,
        stats.l,
        stats.a,
        stats.held > 0 ? `${stats.ratePct}%` : "N/A",
        `${st.att}%`,
      ];
    });

    const filename = `Attendance_${currentSection?.code || "Course"}_Sec${currentSection?.section || "1"}_${MONTH_NAMES[activeMonth]}_${activeYear}.csv`;
    downloadCsv(filename, [headers, ...rows]);
  };

  const handleExportStudentMonthly = (student: RosterStudent) => {
    const headers = ["Date", "Day", "Session Type", "Attendance Status"];
    const rows = monthDays.map((day) => {
      const mark = resolveStudentMark(student, currentSection, day, attendanceStore);
      let statusText = "Off Day / Weekend";
      if (day.isClassDay) {
        if (mark === "P") statusText = "Present (1.0)";
        else if (mark === "L") statusText = "Late (0.5)";
        else if (mark === "A") statusText = "Absent (0.0)";
        else if (mark === "UNMARKED") statusText = "Upcoming / Not Marked";
      }
      return [day.dateKey, day.weekdayFull, day.isClassDay ? "Scheduled Lecture" : "No Class", statusText];
    });

    const filename = `Attendance_${student.id}_${student.name.replace(/\s+/g, "_")}_${MONTH_NAMES[activeMonth]}_${activeYear}.csv`;
    downloadCsv(filename, [headers, ...rows]);
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Top View Mode Switcher & Section Selector Bar */}
      <GlassCard className="p-3 sm:p-4 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="grid grid-cols-2 sm:flex items-center p-1 rounded-lg bg-white/[0.04] border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("daily")}
              className={cn(
                "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                viewMode === "daily"
                  ? "bg-jade text-night-900 shadow-md font-bold"
                  : "text-ink-muted hover:text-ink hover:bg-white/5"
              )}
            >
              <CalendarIcon className="size-3.5 shrink-0" />
              <span className="truncate">Daily Session</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={cn(
                "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                viewMode === "monthly"
                  ? "bg-jade text-night-900 shadow-md font-bold"
                  : "text-ink-muted hover:text-ink hover:bg-white/5"
              )}
            >
              <TableIcon className="size-3.5 shrink-0" />
              <span className="truncate">Monthly Sheet</span>
            </button>
          </div>

          {/* Section Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between gap-2.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink hover:border-jade/50 hover:bg-white/[0.09] transition-all cursor-pointer outline-none shadow-sm w-full sm:w-auto">
              <div className="flex items-center gap-2 truncate">
                <BookOpen className="size-3.5 text-jade shrink-0" />
                <span className="font-bold text-jade">{currentSection?.code || "Course"}</span>
                <span className="text-ink-muted">· Sec {currentSection?.section}</span>
                <span className="text-xs text-ink-faint hidden sm:inline">({currentSection?.room})</span>
              </div>
              <ChevronDown className="size-3.5 text-ink-muted shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[280px] rounded-lg border border-white/15 bg-night-900/95 p-1 shadow-2xl backdrop-blur-xl z-50"
            >
              {sections.map((s) => {
                const isSelected = selectedSec === s.id;
                return (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => setSelectedSec(s.id)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors",
                      isSelected
                        ? "bg-jade/15 text-jade"
                        : "text-ink hover:bg-white/[0.08] hover:text-ink"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("font-bold text-sm", isSelected ? "text-jade" : "text-ink")}>
                        {s.code}
                      </span>
                      <span className="text-ink-muted">Section {s.section}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.72rem] text-ink-faint">{s.room}</span>
                      {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {viewMode === "daily" ? (
          <div className="flex flex-wrap items-center gap-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger className="flex items-center justify-between gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink hover:border-jade/50 hover:bg-white/[0.09] transition-all cursor-pointer outline-none shadow-sm grow sm:grow-0">
                <div className="flex items-center gap-2 truncate">
                  <CalendarIcon className="size-3.5 text-jade shrink-0" />
                  <span>{selectedDate ? formatDateDMY(selectedDate) : "Pick date"}</span>
                </div>
                <ChevronDown className="size-3 text-ink-muted shrink-0" />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-auto p-2 rounded-xl border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl z-50"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (d) {
                      setSelectedDate(d);
                      setCalendarOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={() => handleMarkAllDaily("P")}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs rounded-lg grow sm:grow-0")}
            >
              Mark all present
            </button>
            <button
              type="button"
              onClick={handleSaveDailyAttendance}
              className={cn(
                buttonClass({ variant: "primary", size: "sm" }),
                "text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5 rounded-lg grow sm:grow-0"
              )}
            >
              <Check className="size-3.5 shrink-0" />
              <span>Save attendance</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center justify-between gap-1 rounded-lg border border-white/15 bg-white/[0.05] p-1 shadow-sm grow sm:grow-0">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-2 text-xs sm:text-sm font-bold text-ink min-w-[100px] text-center">
                {MONTH_NAMES[activeMonth]} {activeYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportMonthlyMatrix}
              className={cn(
                buttonClass({ variant: "ghost", size: "sm" }),
                "text-xs flex items-center justify-center gap-1.5 border border-white/15 hover:border-jade/40 rounded-lg grow sm:grow-0"
              )}
            >
              <Download className="size-3.5 text-jade shrink-0" />
              <span>Export Month (.csv)</span>
            </button>
          </div>
        )}
      </GlassCard>

      {/* MODE 1: Daily View */}
      {viewMode === "daily" && (
        <DailyRosterView
          roster={roster}
          currentSection={currentSection}
          selectedDate={selectedDate}
          dailyAttendance={dailyAttendance}
          studentStatsMap={studentStatsMap}
          onMarkDaily={handleMarkDaily}
          onSelectStudentForModal={setSelectedStudentForModal}
        />
      )}

      {/* MODE 2: Monthly Matrix View */}
      {viewMode === "monthly" && (
        <MonthlyMatrixView
          roster={roster}
          currentSection={currentSection}
          monthDays={monthDays}
          activeMonth={activeMonth}
          activeYear={activeYear}
          studentStatsMap={studentStatsMap}
          attendanceStore={attendanceStore}
          onToggleDayMark={handleToggleDayMark}
          onSelectStudentForModal={setSelectedStudentForModal}
        />
      )}

      {/* Student Monthly Modal */}
      {selectedStudentForModal && (
        <Dialog
          open={!!selectedStudentForModal}
          onOpenChange={(open) => {
            if (!open) setSelectedStudentForModal(null);
          }}
        >
          <DialogContent className="max-w-3xl sm:max-w-4xl w-[96vw] p-0 overflow-hidden rounded-md sm:rounded-lg border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink max-h-[92vh] sm:max-h-[88vh] flex flex-col">
            {(() => {
              const modalStats =
                studentStatsMap[selectedStudentForModal.id] ||
                calculateStudentAttendanceStats(
                  selectedStudentForModal,
                  currentSection,
                  monthDays,
                  attendanceStore
                );

              return (
                <StudentMonthlyModalBody
                  student={selectedStudentForModal}
                  section={currentSection}
                  monthDays={monthDays}
                  modalStats={modalStats}
                  activeYear={activeYear}
                  activeMonth={activeMonth}
                  attendanceStore={attendanceStore}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onToggleMark={(dateKey, mark) =>
                    handleToggleDayMark(selectedStudentForModal.id, dateKey, mark)
                  }
                  onExport={() => handleExportStudentMonthly(selectedStudentForModal)}
                  onClose={() => setSelectedStudentForModal(null)}
                />
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
