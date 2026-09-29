import type { InstructorSection, RosterStudent } from "@/lib/app-types";

export type DayScheduleType = "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY";

export interface DayOverrideInfo {
  type: DayScheduleType;
  reason?: string;
}

export interface MonthDayInfo {
  date: Date;
  dayNumber: number;
  dateKey: string;
  weekday: string;
  weekdayFull: string;
  weekdayIndex: number;
  isWeekend: boolean;
  isClassDay: boolean;
  isSpecialClass?: boolean;
  isHoliday?: boolean;
  holidayReason?: string;
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
