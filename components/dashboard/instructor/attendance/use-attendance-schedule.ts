"use client";

import { useMemo, useState } from "react";
import type { DayOverrideInfo, MonthDayInfo } from "./types";
import { getDaysInMonth } from "./utils";

const EMPTY_SCHEDULE_OVERRIDES: Record<string, DayOverrideInfo> = {};

export function useAttendanceSchedule(selectedSec: string, selectedDate?: Date) {
  const [activeYear, setActiveYear] = useState<number>(() => new Date().getFullYear());
  const [activeMonth, setActiveMonth] = useState<number>(() => new Date().getMonth());

  // Section schedule overrides (makeup class on weekend or declared holidays)
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

  const monthDays: MonthDayInfo[] = useMemo(() => {
    return getDaysInMonth(activeYear, activeMonth, selectedDate || new Date(), currentSectionOverrides);
  }, [activeYear, activeMonth, selectedDate, currentSectionOverrides]);

  const handleSetDaySchedule = (
    dateKey: string,
    type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY",
    reason?: string,
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

  return {
    activeYear,
    activeMonth,
    monthDays,
    currentSectionOverrides,
    handleSetDaySchedule,
    handlePrevMonth,
    handleNextMonth,
  };
}
