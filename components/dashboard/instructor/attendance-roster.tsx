"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { apiClient } from "@/lib/api-client";
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
import {
  AttendanceFilterBar,
  type DailyStatusFilter,
  type MonthlyStatusFilter,
  type SortOption,
} from "./attendance/attendance-filter-bar";

interface AttendanceRosterProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSave?: (marksCount: number) => void;
}

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

const EMPTY_SCHEDULE_OVERRIDES: Record<string, DayOverrideInfo> = {};

export function AttendanceRoster({ sections, roster, onSave }: AttendanceRosterProps) {
  const { attendanceStore, saveAttendance } = useApp();
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [apiAttendanceStore, setApiAttendanceStore] = useState<Record<string, Record<string, "P" | "L" | "A">>>({});
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

  const currentSectionOverrides = scheduleOverrides[selectedSec] || EMPTY_SCHEDULE_OVERRIDES;
  const currentRoster = useMemo(
    () => roster.filter((student) => !student.sectionId || student.sectionId === selectedSec),
    [roster, selectedSec],
  );

  // Batch & Filter states (defaults to teacher's assigned batch)
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dailyStatusFilter, setDailyStatusFilter] = useState<DailyStatusFilter>("all");
  const [monthlyStatusFilter, setMonthlyStatusFilter] = useState<MonthlyStatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("id_asc");

  // Available batches in current section (e.g. 2023, 2024, 2025, 2026)
  const availableBatches = useMemo(() => {
    const set = new Set<string>();
    currentRoster.forEach((student) => {
      const batch = student.batch || student.id.split("-")[0];
      if (batch && /^\d{4}$/.test(batch)) {
        set.add(batch);
      }
    });
    return Array.from(set).sort();
  }, [currentRoster]);

  // Keep selectedBatch synced to the first available batch of the assigned section
  useEffect(() => {
    if (availableBatches.length > 0 && (!selectedBatch || !availableBatches.includes(selectedBatch))) {
      setSelectedBatch(availableBatches[0]);
    }
  }, [availableBatches, selectedBatch]);

  // Batch counts map
  const batchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    currentRoster.forEach((student) => {
      const batch = student.batch || student.id.split("-")[0];
      if (batch) {
        counts[batch] = (counts[batch] || 0) + 1;
      }
    });
    return counts;
  }, [currentRoster]);

  const effectiveAttendanceStore = useMemo(
    () => ({ ...attendanceStore, ...apiAttendanceStore }),
    [attendanceStore, apiAttendanceStore],
  );

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

  useEffect(() => {
    if (!sections.some((section) => section.id === selectedSec) && sections[0]) {
      setSelectedSec(sections[0].id);
    }
  }, [sections, selectedSec]);

  const currentSection =
    sections.find((s) => s.id === selectedSec) ||
    sections[0] ||
    { ...DEFAULT_FALLBACK_SECTION, enrolled: currentRoster.length };

  const [dailyAttendance, setDailyAttendance] = useState<Record<string, "P" | "L" | "A">>(() => {
    const initialKey = `${sections[0]?.id || "S1"}_${dateKey}`;
    return attendanceStore?.[initialKey] || {};
  });

  // Keep daily attendance in sync when section or date changes and reset unsaved flag
  useEffect(() => {
    const compositeKey = `${selectedSec}_${dateKey}`;
    if (hasUnsavedChanges) return;
    setDailyAttendance(
      apiAttendanceStore[compositeKey] ?? attendanceStore?.[compositeKey] ?? {},
    );
    setHasUnsavedChanges(false);
  }, [selectedSec, dateKey, attendanceStore, apiAttendanceStore, hasUnsavedChanges]);

  const monthDays = useMemo(() => {
    return getDaysInMonth(activeYear, activeMonth, selectedDate || new Date(), currentSectionOverrides);
  }, [activeYear, activeMonth, selectedDate, currentSectionOverrides]);

  useEffect(() => {
    if (!sections.some((section) => section.id === selectedSec)) return;
    let cancelled = false;
    const scheduledWeekdays = new Set(currentSection.slots.map((slot) => slot.slice(0, 3)));
    const dates = monthDays.filter(
      (day) =>
        day.dateKey === dateKey ||
        (day.isClassDay &&
          !day.isFuture &&
          (scheduledWeekdays.size === 0 ||
            scheduledWeekdays.has(day.weekday) ||
            day.isSpecialClass)),
    );

    const loadAttendanceSessions = async () => {
      const sessions = await Promise.all(
        dates.map(async (day) => {
          const response = await apiClient.attendance
            .getOfferingSession(selectedSec, day.dateKey)
            .catch(() => null);
          if (!response) return null;

          const marks: Record<string, "P" | "L" | "A"> = {};
          const studentByEnrollment = new Map(
            currentRoster
              .filter(
                (student): student is RosterStudent & { enrollmentId: string } =>
                  Boolean(student.enrollmentId),
              )
              .map((student) => [student.enrollmentId, student.id]),
          );
          for (const record of response.data.records) {
            const studentId = studentByEnrollment.get(record.enrollmentId);
            if (!studentId) continue;
            marks[studentId] =
              record.status === "PRESENT" ? "P" : record.status === "LATE" ? "L" : "A";
          }
          return [`${selectedSec}_${day.dateKey}`, marks] as const;
        }),
      );

      if (cancelled) return;
      setApiAttendanceStore((previous) => ({
        ...previous,
        ...Object.fromEntries(sessions.filter((session) => session !== null)),
      }));
    };

    void loadAttendanceSessions();
    return () => {
      cancelled = true;
    };
  }, [
    selectedSec,
    dateKey,
    activeYear,
    activeMonth,
    currentSection,
    currentRoster,
    monthDays,
    sections,
  ]);

  const studentStatsMap = useMemo(() => {
    const map: Record<string, AttendanceStats> = {};
    currentRoster.forEach((st) => {
      map[st.id] = calculateStudentAttendanceStats(st, currentSection, monthDays, effectiveAttendanceStore);
    });
    return map;
  }, [currentRoster, currentSection, monthDays, effectiveAttendanceStore]);

  // Daily status counts for dropdown badges
  const dailyStatusCounts = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let atRisk = 0;
    currentRoster.forEach((st) => {
      const mark = dailyAttendance[st.id];
      if (mark === "P") present++;
      else if (mark === "L") late++;
      else if (mark === "A") absent++;
      const stats = studentStatsMap[st.id];
      const rate = stats ? stats.ratePct : st.att;
      if (rate < 75) atRisk++;
    });
    const unmarked = currentRoster.length - (present + late + absent);
    return {
      total: currentRoster.length,
      present,
      late,
      absent,
      unmarked,
      atRisk,
    };
  }, [currentRoster, dailyAttendance, studentStatsMap]);

  // Filtered & Sorted student roster (strictly scoped to teacher's assigned batch)
  const filteredRoster = useMemo(() => {
    const activeBatch = selectedBatch || availableBatches[0] || "";
    let list = currentRoster.filter((st) => {
      // 1. Batch filter: strictly show teacher's selected assigned batch
      if (activeBatch) {
        const studentBatch = st.batch || st.id.split("-")[0];
        if (studentBatch !== activeBatch) return false;
      }

      // 2. Search query (name or student ID)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = st.name.toLowerCase().includes(query);
        const matchesId = st.id.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

      // 3. Status filter
      if (viewMode === "daily") {
        const mark = dailyAttendance[st.id];
        const stats = studentStatsMap[st.id];
        const rate = stats ? stats.ratePct : st.att;

        if (dailyStatusFilter === "P" && mark !== "P") return false;
        if (dailyStatusFilter === "L" && mark !== "L") return false;
        if (dailyStatusFilter === "A" && mark !== "A") return false;
        if (dailyStatusFilter === "unmarked" && mark !== undefined) return false;
        if (dailyStatusFilter === "atRisk" && rate >= 75) return false;
      } else {
        const stats = studentStatsMap[st.id];
        const rate = stats ? stats.ratePct : st.att;
        if (monthlyStatusFilter === "good" && rate < 75) return false;
        if (monthlyStatusFilter === "atRisk" && rate >= 75) return false;
      }

      return true;
    });

    // 4. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "id_asc") return a.id.localeCompare(b.id);
      if (sortBy === "id_desc") return b.id.localeCompare(a.id);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "att_desc") {
        const rateA = studentStatsMap[a.id]?.ratePct ?? a.att;
        const rateB = studentStatsMap[b.id]?.ratePct ?? b.att;
        return rateB - rateA;
      }
      if (sortBy === "att_asc") {
        const rateA = studentStatsMap[a.id]?.ratePct ?? a.att;
        const rateB = studentStatsMap[b.id]?.ratePct ?? b.att;
        return rateA - rateB;
      }
      return 0;
    });

    return list;
  }, [
    currentRoster,
    selectedBatch,
    availableBatches,
    searchQuery,
    viewMode,
    dailyStatusFilter,
    dailyAttendance,
    studentStatsMap,
    monthlyStatusFilter,
    sortBy,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setDailyStatusFilter("all");
    setMonthlyStatusFilter("all");
    setSortBy("id_asc");
  };

  const handleMarkFilteredPresent = () => {
    const next = { ...dailyAttendance };
    filteredRoster.forEach((st) => {
      next[st.id] = "P";
    });
    setDailyAttendance(next);
    setHasUnsavedChanges(true);
  };

  const handleMarkDaily = (studentId: string, status: "P" | "L" | "A") => {
    const updated = { ...dailyAttendance, [studentId]: status };
    setDailyAttendance(updated);
    setHasUnsavedChanges(true);
  };

  const handleMarkAllDaily = (status: "P" | "L" | "A") => {
    const next: Record<string, "P" | "L" | "A"> = { ...dailyAttendance };
    filteredRoster.forEach((st) => {
      next[st.id] = status;
    });
    setDailyAttendance(next);
    setHasUnsavedChanges(true);
  };

  const handleSectionChange = (sectionId: string) => {
    setSelectedSec(sectionId);
    setDailyAttendance({});
    setHasUnsavedChanges(false);
    setSelectedBatch("");
    handleClearFilters();
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setDailyAttendance({});
    setHasUnsavedChanges(false);
  };

  const persistAttendance = async (targetDateKey: string, records: Record<string, "P" | "L" | "A">) => {
    await saveAttendance(selectedSec, targetDateKey, records);
    setApiAttendanceStore((previous) => ({
      ...previous,
      [`${selectedSec}_${targetDateKey}`]: records,
    }));
  };

  const handleSaveDailyAttendance = async () => {
    try {
      await persistAttendance(dateKey, dailyAttendance);
      setHasUnsavedChanges(false);
      onSave?.(Object.keys(dailyAttendance).length);
    } catch {
      // Keep the draft editable when the API rejects the save.
    }
  };

  const handleToggleDayMark = async (
    studentId: string,
    targetDateKey: string,
    newMark: "P" | "L" | "A"
  ) => {
    const compositeKey = `${selectedSec}_${targetDateKey}`;
    const existingDayRecords = effectiveAttendanceStore[compositeKey] || {};
    const targetDay = monthDays.find((d) => d.dateKey === targetDateKey);

    const updatedRecords: Record<string, "P" | "L" | "A"> = { ...existingDayRecords };

    currentRoster.forEach((st) => {
      if (st.id === studentId) {
        updatedRecords[st.id] = newMark;
      } else if (!updatedRecords[st.id] && targetDay) {
        const currentMark = resolveStudentMark(st, currentSection, targetDay, effectiveAttendanceStore);
        if (currentMark === "P" || currentMark === "L" || currentMark === "A") {
          updatedRecords[st.id] = currentMark;
        }
      }
    });

    try {
      await persistAttendance(targetDateKey, updatedRecords);
    } catch {
      // Keep the existing server-backed mark when the update fails.
    }
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
        onSelectSection={handleSectionChange}
        currentSection={currentSection}
        selectedDate={selectedDate}
        onSelectDate={handleDateChange}
        calendarOpen={calendarOpen}
        onCalendarOpenChange={setCalendarOpen}
        isHoliday={isCurrentDateHoliday}
        hasUnsavedChanges={hasUnsavedChanges}
        batchLabel={selectedBatch ? `Batch ${selectedBatch}` : availableBatches[0] ? `Batch ${availableBatches[0]}` : undefined}
        onMarkAllPresent={() => handleMarkAllDaily("P")}
        onSaveDaily={handleSaveDailyAttendance}
        activeMonth={activeMonth}
        activeYear={activeYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onExportMonth={() =>
          exportMonthlyMatrixCsv({
            roster: filteredRoster,
            currentSection,
            monthDays,
            activeMonth,
            activeYear,
            studentStatsMap,
            attendanceStore: effectiveAttendanceStore,
          })
        }
      />

      {/* Teacher Filter Toolbar: Batch, Search, Attendance Status, and Sort */}
      <AttendanceFilterBar
        viewMode={viewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        batches={availableBatches}
        batchCounts={batchCounts}
        selectedBatch={selectedBatch}
        onSelectBatch={setSelectedBatch}
        dailyStatusFilter={dailyStatusFilter}
        onSelectDailyStatusFilter={setDailyStatusFilter}
        dailyStatusCounts={dailyStatusCounts}
        monthlyStatusFilter={monthlyStatusFilter}
        onSelectMonthlyStatusFilter={setMonthlyStatusFilter}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        totalStudents={currentRoster.length}
        filteredCount={filteredRoster.length}
        onClearFilters={handleClearFilters}
        onMarkFilteredPresent={handleMarkFilteredPresent}
        isHoliday={isCurrentDateHoliday}
      />

      {/* MODE 1: Daily Session View */}
      {viewMode === "daily" && (
        <DailyRosterView
          roster={filteredRoster}
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
          roster={filteredRoster}
          currentSection={currentSection}
          monthDays={monthDays}
          activeMonth={activeMonth}
          activeYear={activeYear}
          studentStatsMap={studentStatsMap}
          attendanceStore={effectiveAttendanceStore}
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
        attendanceStore={effectiveAttendanceStore}
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
            attendanceStore: effectiveAttendanceStore,
          })
        }
      />
    </div>
  );
}
