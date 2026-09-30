"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { AttendanceRosterHeader } from "./attendance/attendance-roster-header";
import { AttendanceFilterBar } from "./attendance/attendance-filter-bar";
import { DailyRosterView } from "./attendance/daily-roster-view";
import { MonthlyMatrixView } from "./attendance/monthly-matrix-view";
import { StudentMonthlyDialog } from "./attendance/student-monthly-dialog";
import {
  exportMonthlyMatrixCsv,
  exportStudentMonthlyCsv,
} from "./attendance/utils";
import type { AttendanceRosterProps } from "./attendance/types";
import { useAttendanceSchedule } from "./attendance/use-attendance-schedule";
import { useAttendanceSession } from "./attendance/use-attendance-session";
import { useAttendanceFilter } from "./attendance/use-attendance-filter";

export type { AttendanceRosterProps };

const DEFAULT_FALLBACK_SECTION: InstructorSection = {
  id: "",
  code: "",
  title: "No assigned sections",
  section: "—",
  room: "—",
  slots: [],
  enrolled: 0,
  capacity: 0,
  avgAttendance: 0,
  gradesSubmitted: false,
};

export function AttendanceRoster({ sections, roster, onSave }: AttendanceRosterProps) {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<RosterStudent | null>(null);

  // Auto-sync selected section if invalid or changed
  useEffect(() => {
    if (!sections.some((section) => section.id === selectedSec) && sections[0]) {
      setSelectedSec(sections[0].id);
    }
  }, [sections, selectedSec]);

  // Current section's enrolled student list
  const currentRoster = useMemo(
    () => roster.filter((student) => !student.sectionId || student.sectionId === selectedSec),
    [roster, selectedSec],
  );

  const currentSection =
    sections.find((s) => s.id === selectedSec) ||
    sections[0] ||
    { ...DEFAULT_FALLBACK_SECTION, enrolled: currentRoster.length };

  // 1. Schedule & Calendar Navigation
  const schedule = useAttendanceSchedule(selectedSec);

  // 2. Attendance Session & Marks Store
  const session = useAttendanceSession({
    sections,
    currentSection,
    selectedSec,
    currentRoster,
    monthDays: schedule.monthDays,
    onSave,
  });

  // 3. Teacher Filtering & Batch Selection
  const filter = useAttendanceFilter({
    currentRoster,
    viewMode,
    dailyAttendance: session.dailyAttendance,
    studentStatsMap: session.studentStatsMap,
  });

  // Section Change Handler
  const handleSectionChange = (sectionId: string) => {
    setSelectedSec(sectionId);
    session.setDailyAttendance({});
    session.setHasUnsavedChanges(false);
    filter.setSelectedBatch("");
    filter.handleClearFilters();
  };

  // Mark all filtered batch students as present
  const handleMarkFilteredPresent = () => {
    const next = { ...session.dailyAttendance };
    filter.filteredRoster.forEach((st) => {
      next[st.id] = "P";
    });
    session.setDailyAttendance(next);
    session.setHasUnsavedChanges(true);
  };

  // Mark all active batch students as present
  const handleMarkAllDaily = (status: "P" | "L" | "A") => {
    const next: Record<string, "P" | "L" | "A"> = { ...session.dailyAttendance };
    filter.filteredRoster.forEach((st) => {
      next[st.id] = status;
    });
    session.setDailyAttendance(next);
    session.setHasUnsavedChanges(true);
  };

  const isCurrentDateHoliday = schedule.currentSectionOverrides[session.dateKey]?.type === "HOLIDAY";
  const activeBatchLabel = filter.selectedBatch
    ? `Batch ${filter.selectedBatch}`
    : filter.availableBatches[0]
    ? `Batch ${filter.availableBatches[0]}`
    : undefined;

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Top View Mode Switcher & Section Toolbar */}
      <AttendanceRosterHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sections={sections}
        selectedSec={selectedSec}
        onSelectSection={handleSectionChange}
        currentSection={currentSection}
        selectedDate={session.selectedDate}
        onSelectDate={session.handleDateChange}
        calendarOpen={session.calendarOpen}
        onCalendarOpenChange={session.setCalendarOpen}
        isHoliday={isCurrentDateHoliday}
        hasUnsavedChanges={session.hasUnsavedChanges}
        batchLabel={activeBatchLabel}
        onMarkAllPresent={() => handleMarkAllDaily("P")}
        onSaveDaily={session.handleSaveDailyAttendance}
        activeMonth={schedule.activeMonth}
        activeYear={schedule.activeYear}
        onPrevMonth={schedule.handlePrevMonth}
        onNextMonth={schedule.handleNextMonth}
        onExportMonth={() =>
          exportMonthlyMatrixCsv({
            roster: filter.filteredRoster,
            currentSection,
            monthDays: schedule.monthDays,
            activeMonth: schedule.activeMonth,
            activeYear: schedule.activeYear,
            studentStatsMap: session.studentStatsMap,
            attendanceStore: session.effectiveAttendanceStore,
          })
        }
      />

      {/* Teacher Filter Toolbar: Batch, Search, Attendance Status, and Sort */}
      <AttendanceFilterBar
        viewMode={viewMode}
        searchQuery={filter.searchQuery}
        onSearchChange={filter.setSearchQuery}
        batches={filter.availableBatches}
        batchCounts={filter.batchCounts}
        selectedBatch={filter.selectedBatch}
        onSelectBatch={filter.setSelectedBatch}
        dailyStatusFilter={filter.dailyStatusFilter}
        onSelectDailyStatusFilter={filter.setDailyStatusFilter}
        dailyStatusCounts={filter.dailyStatusCounts}
        monthlyStatusFilter={filter.monthlyStatusFilter}
        onSelectMonthlyStatusFilter={filter.setMonthlyStatusFilter}
        sortBy={filter.sortBy}
        onSelectSortBy={filter.setSortBy}
        totalStudents={currentRoster.length}
        filteredCount={filter.filteredRoster.length}
        onClearFilters={filter.handleClearFilters}
        onMarkFilteredPresent={handleMarkFilteredPresent}
        isHoliday={isCurrentDateHoliday}
      />

      {/* MODE 1: Daily Session View */}
      {viewMode === "daily" && (
        <DailyRosterView
          roster={filter.filteredRoster}
          currentSection={currentSection}
          selectedDate={session.selectedDate}
          dailyAttendance={session.dailyAttendance}
          studentStatsMap={session.studentStatsMap}
          scheduleOverrides={schedule.currentSectionOverrides}
          onMarkDaily={session.handleMarkDaily}
          onSetDaySchedule={schedule.handleSetDaySchedule}
          onSelectStudentForModal={setSelectedStudentForModal}
        />
      )}

      {/* MODE 2: Monthly Matrix View */}
      {viewMode === "monthly" && (
        <MonthlyMatrixView
          roster={filter.filteredRoster}
          currentSection={currentSection}
          monthDays={schedule.monthDays}
          activeMonth={schedule.activeMonth}
          activeYear={schedule.activeYear}
          studentStatsMap={session.studentStatsMap}
          attendanceStore={session.effectiveAttendanceStore}
          scheduleOverrides={schedule.currentSectionOverrides}
          onToggleDayMark={session.handleToggleDayMark}
          onSetDaySchedule={schedule.handleSetDaySchedule}
          onSelectStudentForModal={setSelectedStudentForModal}
        />
      )}

      {/* Student Monthly Modal Dialog */}
      <StudentMonthlyDialog
        selectedStudent={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        currentSection={currentSection}
        monthDays={schedule.monthDays}
        studentStatsMap={session.studentStatsMap}
        activeYear={schedule.activeYear}
        activeMonth={schedule.activeMonth}
        attendanceStore={session.effectiveAttendanceStore}
        onPrevMonth={schedule.handlePrevMonth}
        onNextMonth={schedule.handleNextMonth}
        onToggleDayMark={session.handleToggleDayMark}
        onExportStudentMonthly={(student) =>
          exportStudentMonthlyCsv({
            student,
            currentSection,
            monthDays: schedule.monthDays,
            activeMonth: schedule.activeMonth,
            activeYear: schedule.activeYear,
            attendanceStore: session.effectiveAttendanceStore,
          })
        }
      />
    </div>
  );
}
