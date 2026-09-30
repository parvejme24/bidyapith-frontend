import type { InstructorSection } from "@/lib/app-types";

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

export interface AttendanceRosterHeaderProps {
  viewMode: "daily" | "monthly";
  onViewModeChange: (mode: "daily" | "monthly") => void;
  sections: InstructorSection[];
  selectedSec: string;
  onSelectSection: (secId: string) => void;
  currentSection: InstructorSection;
  // Daily props
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  calendarOpen: boolean;
  onCalendarOpenChange: (open: boolean) => void;
  isHoliday: boolean;
  hasUnsavedChanges: boolean;
  batchLabel?: string;
  onMarkAllPresent: () => void;
  onSaveDaily: () => void;
  // Monthly props
  activeMonth: number;
  activeYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onExportMonth: () => void;
}
