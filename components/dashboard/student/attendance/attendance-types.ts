export interface LectureDailyLog {
  lectureNumber: number;
  date: string;
  dayOfWeek: string;
  time: string;
  topic: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
  room: string;
  verifiedBy: string;
}

export interface CourseMonthlyStats {
  monthIndex: number;
  monthName: string;
  held: number;
  present: number;
  late: number;
  absent: number;
  pct: number;
}

export interface CourseSemesterAttendance {
  code: string;
  title: string;
  credits: number;
  type: "Core" | "Lab" | "General" | "Elective" | "Thesis";
  instructor: string;
  room: string;
  schedule?: string;
  totalHeld: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  pct: number;
  isEligible: boolean;
  monthlyBreakdown: CourseMonthlyStats[];
  lectureLogs: LectureDailyLog[];
}

export interface MonthSummary {
  monthIndex: number;
  monthName: string;
  totalHeld: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  pct: number;
}

export interface SemesterAttendanceRecord {
  semesterNumber: number;
  semesterTitle: string;
  termName: string;
  status: "completed" | "current" | "locked";
  months: MonthSummary[];
  courses: CourseSemesterAttendance[];
  totalHeld: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  overallPct: number;
  isFullyEligible: boolean;
  atRiskCount: number;
}
