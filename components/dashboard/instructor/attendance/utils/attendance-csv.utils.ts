import { downloadCsv } from "@/lib/csv-export";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { AttendanceStats, AttendanceStoreMap, MonthDayInfo } from "../types";
import { MONTH_NAMES } from "./attendance-date.utils";
import { resolveStudentMark } from "./attendance-stats.utils";

interface ExportMonthlyMatrixCsvProps {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  activeYear: number;
  studentStatsMap: Record<string, AttendanceStats>;
  attendanceStore: AttendanceStoreMap;
}

export function exportMonthlyMatrixCsv({
  roster,
  currentSection,
  monthDays,
  activeMonth,
  activeYear,
  studentStatsMap,
  attendanceStore,
}: ExportMonthlyMatrixCsvProps) {
  const heldDays = monthDays.filter((d) => d.isClassDay);

  const headers = [
    "StudentID",
    "Name",
    "Section",
    ...heldDays.map((d) => `${d.dayNumber}-${d.weekday}`),
    "Present(P)",
    "Late(L)",
    "Absent(A)",
    "Rate(%)",
  ];

  const rows = roster.map((st) => {
    const stats = studentStatsMap[st.id] || { p: 0, l: 0, a: 0, ratePct: st.att };
    const dayMarks = heldDays.map((d) => {
      const mark = resolveStudentMark(st, currentSection, d, attendanceStore);
      return mark === "P" ? "P" : mark === "L" ? "L" : mark === "A" ? "A" : mark;
    });

    return [
      st.id,
      st.name,
      currentSection?.section || "A",
      ...dayMarks,
      String(stats.p),
      String(stats.l),
      String(stats.a),
      `${stats.ratePct}%`,
    ];
  });

  const filename = `Attendance_${currentSection?.code || "Course"}_Sec${currentSection?.section || "A"}_${MONTH_NAMES[activeMonth]}_${activeYear}.csv`;
  downloadCsv(filename, [headers, ...rows]);
}

interface ExportStudentMonthlyCsvProps {
  student: RosterStudent;
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  activeYear: number;
  attendanceStore: AttendanceStoreMap;
}

export function exportStudentMonthlyCsv({
  student,
  currentSection,
  monthDays,
  activeMonth,
  activeYear,
  attendanceStore,
}: ExportStudentMonthlyCsvProps) {
  const headers = ["Date", "Day", "ClassType", "Status", "Notes"];

  const rows = monthDays.map((day) => {
    const mark = resolveStudentMark(student, currentSection, day, attendanceStore);
    const classType = day.isHoliday
      ? "Holiday"
      : day.isSpecialClass
      ? "Special / Makeup Lecture"
      : day.isWeekend
      ? "Academic Weekend"
      : "Regular Lecture";

    const statusLabel =
      mark === "P"
        ? "Present"
        : mark === "L"
        ? "Late"
        : mark === "A"
        ? "Absent"
        : mark === "OFF"
        ? "No Class"
        : mark === "HOLIDAY"
        ? "Holiday"
        : "Unmarked";

    return [
      day.dateKey,
      day.weekdayFull,
      classType,
      statusLabel,
      day.holidayReason || "",
    ];
  });

  const filename = `Monthly_Attendance_${student.id}_${MONTH_NAMES[activeMonth]}_${activeYear}.csv`;
  downloadCsv(filename, [headers, ...rows]);
}
