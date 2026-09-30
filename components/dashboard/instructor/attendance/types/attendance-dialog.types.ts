import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { MonthDayInfo } from "./attendance-schedule.types";
import type {
  AttendanceMark,
  AttendanceStats,
  AttendanceStoreMap,
} from "./attendance-session.types";

export interface StudentMonthlyDialogProps {
  selectedStudent: RosterStudent | null;
  onClose: () => void;
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  studentStatsMap: Record<string, AttendanceStats>;
  activeYear: number;
  activeMonth: number;
  attendanceStore: AttendanceStoreMap;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleDayMark: (studentId: string, dateKey: string, mark: AttendanceMark) => void;
  onExportStudentMonthly?: (student: RosterStudent) => void;
}
