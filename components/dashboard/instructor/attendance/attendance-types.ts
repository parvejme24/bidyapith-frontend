import type { InstructorSection, RosterStudent } from "@/lib/app-types";

export interface MonthDayInfo {
  date: Date;
  dayNumber: number;
  dateKey: string;
  weekday: string;
  weekdayFull: string;
  weekdayIndex: number;
  isWeekend: boolean;
  isClassDay: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface AttendanceStats {
  held: number;
  p: number;
  l: number;
  a: number;
  effectivePresent: number;
  ratePct: number;
}
