"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { apiClient } from "@/lib/api-client";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { AttendanceStats, MonthDayInfo } from "./types";
import {
  calculateStudentAttendanceStats,
  resolveStudentMark,
} from "./utils";

export interface UseAttendanceSessionProps {
  sections: InstructorSection[];
  currentSection: InstructorSection;
  selectedSec: string;
  currentRoster: RosterStudent[];
  monthDays: MonthDayInfo[];
  onSave?: (marksCount: number) => void;
}

export function useAttendanceSession({
  sections,
  currentSection,
  selectedSec,
  currentRoster,
  monthDays,
  onSave,
}: UseAttendanceSessionProps) {
  const { attendanceStore, saveAttendance } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [apiAttendanceStore, setApiAttendanceStore] = useState<Record<string, Record<string, "P" | "L" | "A">>>({});

  const dateKey = useMemo(() => {
    const target = selectedDate || new Date();
    return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}`;
  }, [selectedDate]);

  const effectiveAttendanceStore = useMemo(
    () => ({ ...attendanceStore, ...apiAttendanceStore }),
    [attendanceStore, apiAttendanceStore],
  );

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

  // Load attendance sessions from backend API
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
      // Keep draft editable on API error
    }
  };

  const handleMarkDaily = (studentId: string, status: "P" | "L" | "A") => {
    const updated = { ...dailyAttendance, [studentId]: status };
    setDailyAttendance(updated);
    setHasUnsavedChanges(true);
  };

  const handleToggleDayMark = async (
    studentId: string,
    targetDateKey: string,
    newMark: "P" | "L" | "A",
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
      // Keep existing mark on error
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setDailyAttendance({});
    setHasUnsavedChanges(false);
  };

  return {
    selectedDate,
    setSelectedDate,
    dateKey,
    calendarOpen,
    setCalendarOpen,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    dailyAttendance,
    setDailyAttendance,
    effectiveAttendanceStore,
    studentStatsMap,
    handleSaveDailyAttendance,
    handleMarkDaily,
    handleToggleDayMark,
    handleDateChange,
  };
}
