"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { AttendanceStats, DayOverrideInfo } from "./attendance/attendance-types";
import {
  getDaysInMonth,
  resolveStudentMark,
  calculateStudentAttendanceStats,
} from "./attendance/attendance-utils";
import { AttendanceRosterHeader } from "./attendance/attendance-roster-header";
import { DailyRosterView } from "./attendance/daily-roster-view";
import { MonthlyMatrixView } from "./attendance/monthly-matrix-view";
import { StudentMonthlyDialog } from "./attendance/student-monthly-dialog";
import {
  exportMonthlyMatrixCsv,
  exportStudentMonthlyCsv,
} from "./attendance/attendance-csv-exporter";

interface AttendanceRosterProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSave?: (marksCount: number) => void;
}

const DEFAULT_FALLBACK_SECTION: InstructorSection = {
  id: "S1",
  code: "CSE-3101",
  title: "Operating Systems Principles",
  section: "1",
  room: "AB2-401",
  slots: ["Sun 09:00", "Tue 09:00"],
  enrolled: 0,
  capacity: 40,
  avgAttendance: 92,
  gradesSubmitted: false,
};

export function AttendanceRoster({ sections, roster, onSave }: AttendanceRosterProps) {
  const { attendanceStore, saveAttendance } = useApp();
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Month navigation (default to current month & year)
  const [activeYear, setActiveYear] = useState<number>(() => new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState<number>(() => new Date().getMonth());

  // Selected student for detailed monthly modal
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<RosterStudent | null>(null);

  // Section schedule overrides (special makeup class on Friday/Saturday or Holidays)
  const [scheduleOverrides, setScheduleOverrides] = useState<Record<string, Record<string, DayOverrideInfo>>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bidyapith_schedule_overrides");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return {};
  });

  const currentSectionOverrides = scheduleOverrides[selectedSec] || {};

  const handleSetDaySchedule = (
    dateKey: string,
    type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY",
    reason?: string
  ) => {
    const sectionMap = { ...(scheduleOverrides[selectedSec] || {}) };
    if (type === "REGULAR") {
      delete sectionMap[dateKey];
    } else {
      sectionMap[dateKey] = { type, reason };
    }

    const next = { ...scheduleOverrides, [selectedSec]: sectionMap };
    setScheduleOverrides(next);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bidyapith_schedule_overrides", JSON.stringify(next));
      } catch {}
    }
  };

  const dateKey = useMemo(() => {
    const target = selectedDate || new Date();
    return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}`;
  }, [selectedDate]);

  const currentSection =
    sections.find((s) => s.id === selectedSec) ||
    sections[0] ||
    { ...DEFAULT_FALLBACK_SECTION, enrolled: roster.length };

  const [dailyAttendance, setDailyAttendance] = useState<Record<string, "P" | "L" | "A">>(() => {
    const initialKey = `${sections[0]?.id || "S1"}_${dateKey}`;
    return attendanceStore?.[initialKey] || {};
  });

  // Keep daily attendance in sync when section or date changes and reset unsaved flag
  useEffect(() => {
    const compositeKey = `${selectedSec}_${dateKey}`;
    setDailyAttendance(attendanceStore?.[compositeKey] || {});
    setHasUnsavedChanges(false);
  }, [selectedSec, dateKey, attendanceStore]);

  const monthDays = useMemo(() => {
    return getDaysInMonth(activeYear, activeMonth, selectedDate || new Date(), currentSectionOverrides);
  }, [activeYear, activeMonth, selectedDate, currentSectionOverrides]);

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
    setHasUnsavedChanges(true);
  };

  const handleMarkAllDaily = (status: "P" | "L" | "A") => {
    const next: Record<string, "P" | "L" | "A"> = {};
    roster.forEach((st) => {
      next[st.id] = status;
    });
    setDailyAttendance(next);
    setHasUnsavedChanges(true);
  };

  const handleSaveDailyAttendance = () => {
    saveAttendance(selectedSec, dateKey, dailyAttendance);
    setHasUnsavedChanges(false);
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

  const isCurrentDateHoliday = currentSectionOverrides[dateKey]?.type === "HOLIDAY";

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Top View Mode Switcher & Section Toolbar */}
      <AttendanceRosterHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sections={sections}
        selectedSec={selectedSec}
        onSelectSection={setSelectedSec}
        currentSection={currentSection}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        calendarOpen={calendarOpen}
        onCalendarOpenChange={setCalendarOpen}
        isHoliday={isCurrentDateHoliday}
        hasUnsavedChanges={hasUnsavedChanges}
        onMarkAllPresent={() => handleMarkAllDaily("P")}
        onSaveDaily={handleSaveDailyAttendance}
        activeMonth={activeMonth}
        activeYear={activeYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onExportMonth={() =>
          exportMonthlyMatrixCsv({
            roster,
            currentSection,
            monthDays,
            activeMonth,
            activeYear,
            studentStatsMap,
            attendanceStore,
          })
        }
      />

      {/* MODE 1: Daily Session View */}
      {viewMode === "daily" && (
        <DailyRosterView
          roster={roster}
          currentSection={currentSection}
          selectedDate={selectedDate}
          dailyAttendance={dailyAttendance}
          studentStatsMap={studentStatsMap}
          scheduleOverrides={currentSectionOverrides}
          onMarkDaily={handleMarkDaily}
          onSetDaySchedule={handleSetDaySchedule}
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
          scheduleOverrides={currentSectionOverrides}
          onToggleDayMark={handleToggleDayMark}
          onSetDaySchedule={handleSetDaySchedule}
          onSelectStudentForModal={setSelectedStudentForModal}
        />
      )}

      {/* Student Monthly Modal Dialog */}
      <StudentMonthlyDialog
        selectedStudent={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        currentSection={currentSection}
        monthDays={monthDays}
        studentStatsMap={studentStatsMap}
        activeYear={activeYear}
        activeMonth={activeMonth}
        attendanceStore={attendanceStore}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToggleDayMark={handleToggleDayMark}
        onExportStudentMonthly={(student) =>
          exportStudentMonthlyCsv({
            student,
            currentSection,
            monthDays,
            activeMonth,
            activeYear,
            attendanceStore,
          })
        }
      />
    </div>
  );
}
