import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { downloadCsv } from "@/lib/csv-export";
import type { AttendanceStats, MonthDayInfo } from "./attendance-types";
import { MONTH_NAMES, resolveStudentMark, calculateStudentAttendanceStats } from "./attendance-utils";

export function exportMonthlyMatrixCsv({
  roster,
  currentSection,
  monthDays,
  activeMonth,
  activeYear,
  studentStatsMap,
  attendanceStore,
}: {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  activeYear: number;
  studentStatsMap: Record<string, AttendanceStats>;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
}) {
  const headers = [
    "Student ID",
    "Student Name",
    "Program",
    ...monthDays.map((d) => `${d.dayNumber}-${d.weekday}`),
    "Total Present (P)",
    "Total Late (L)",
    "Total Absent (A)",
    "Month Attendance Rate (%)",
    "Cumulative Total Rate (%)",
  ];

  const rows = roster.map((st) => {
    const stats =
      studentStatsMap[st.id] ||
      calculateStudentAttendanceStats(st, currentSection, monthDays, attendanceStore);

    const dayMarks = monthDays.map((day) => {
      const mark = resolveStudentMark(st, currentSection, day, attendanceStore);
      return mark === "OFF" ? "OFF" : mark === "UNMARKED" ? "-" : mark;
    });

    return [
      st.id,
      st.name,
      st.prog,
      ...dayMarks,
      stats.p,
      stats.l,
      stats.a,
      stats.held > 0 ? `${stats.ratePct}%` : "N/A",
      `${st.att}%`,
    ];
  });

  const filename = `Attendance_${currentSection?.code || "Course"}_Sec${currentSection?.section || "1"}_${MONTH_NAMES[activeMonth]}_${activeYear}.csv`;
  downloadCsv(filename, [headers, ...rows]);
}

export function exportStudentMonthlyCsv({
  student,
  currentSection,
  monthDays,
  activeMonth,
  activeYear,
  attendanceStore,
}: {
  student: RosterStudent;
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  activeYear: number;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
}) {
  const headers = ["Date", "Day", "Session Type", "Attendance Status"];
  const rows = monthDays.map((day) => {
    const mark = resolveStudentMark(student, currentSection, day, attendanceStore);
    let statusText = "Off Day / Weekend";
    if (day.isClassDay) {
      if (mark === "P") statusText = "Present (1.0)";
      else if (mark === "L") statusText = "Late (0.5)";
      else if (mark === "A") statusText = "Absent (0.0)";
      else if (mark === "UNMARKED") statusText = "Upcoming / Not Marked";
    }
    return [
      day.dateKey,
      day.weekdayFull,
      day.isClassDay ? "Scheduled Lecture" : "No Class",
      statusText,
    ];
  });

  const filename = `Attendance_${student.id}_${student.name.replace(/\s+/g, "_")}_${MONTH_NAMES[activeMonth]}_${activeYear}.csv`;
  downloadCsv(filename, [headers, ...rows]);
}
