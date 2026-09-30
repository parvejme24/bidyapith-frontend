import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { DayOverrideInfo, MonthDayInfo } from "./attendance-schedule.types";

export type AttendanceMark = "P" | "L" | "A";
export type AttendanceRecordMap = Record<string, AttendanceMark>;
export type AttendanceStoreMap = Record<string, AttendanceRecordMap>;

export interface AttendanceStats {
  held: number;
  p: number;
  l: number;
  a: number;
  effectivePresent: number;
  ratePct: number;
}

export interface AttendanceRosterProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSave?: (marksCount: number) => void;
}

export interface DailyRosterViewProps {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  selectedDate?: Date;
  dailyAttendance: AttendanceRecordMap;
  studentStatsMap: Record<string, AttendanceStats>;
  scheduleOverrides?: Record<string, DayOverrideInfo>;
  onMarkDaily: (studentId: string, status: AttendanceMark) => void;
  onSetDaySchedule?: (
    dateKey: string,
    type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY",
    reason?: string,
  ) => void;
  onSelectStudentForModal: (student: RosterStudent) => void;
}

export interface MonthlyMatrixViewProps {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  activeYear: number;
  studentStatsMap: Record<string, AttendanceStats>;
  attendanceStore: AttendanceStoreMap;
  scheduleOverrides?: Record<string, DayOverrideInfo>;
  onToggleDayMark: (studentId: string, dateKey: string, mark: AttendanceMark) => void;
  onSetDaySchedule?: (
    dateKey: string,
    type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY",
    reason?: string,
  ) => void;
  onSelectStudentForModal: (student: RosterStudent) => void;
}
