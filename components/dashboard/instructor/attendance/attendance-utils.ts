import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { AttendanceStats, MonthDayInfo } from "./attendance-types";

export const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDateDMY(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getDaysInMonth(
  year: number,
  month: number,
  referenceDate: Date = new Date(2026, 8, 27)
): MonthDayInfo[] {
  const daysCount = new Date(year, month + 1, 0).getDate();
  const result: MonthDayInfo[] = [];

  const refDayOnly = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  for (let d = 1; d <= daysCount; d++) {
    const current = new Date(year, month, d);
    const dayIndex = current.getDay();
    // Friday (5) and Saturday (6) are academic weekends
    const isWeekend = dayIndex === 5 || dayIndex === 6;
    // Scheduled class days: Sun (0), Tue (2), Thu (4) or all non-weekend days
    const isClassDay = !isWeekend;

    const yStr = current.getFullYear();
    const mStr = String(current.getMonth() + 1).padStart(2, "0");
    const dStr = String(current.getDate()).padStart(2, "0");
    const dateKey = `${yStr}-${mStr}-${dStr}`;

    const currentDayOnly = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    const isToday = currentDayOnly.getTime() === refDayOnly.getTime();
    const isFuture = currentDayOnly.getTime() > refDayOnly.getTime();

    result.push({
      date: current,
      dayNumber: d,
      dateKey,
      weekday: WEEKDAYS_SHORT[dayIndex] ?? "",
      weekdayFull: WEEKDAYS_FULL[dayIndex] ?? "",
      weekdayIndex: dayIndex,
      isWeekend,
      isClassDay,
      isToday,
      isFuture,
    });
  }

  return result;
}

export function resolveStudentMark(
  student: RosterStudent,
  section: InstructorSection,
  dayInfo: MonthDayInfo,
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>
): "P" | "L" | "A" | "OFF" | "UNMARKED" {
  if (dayInfo.isWeekend || !dayInfo.isClassDay) {
    return "OFF";
  }

  // Composite key format: {sectionId}_{dateKey} (e.g. S1_2026-09-27)
  const compositeKey = `${section.id}_${dayInfo.dateKey}`;
  const secRecords = attendanceStore?.[compositeKey];
  if (secRecords && secRecords[student.id]) {
    return secRecords[student.id]!;
  }

  if (dayInfo.isFuture) {
    return "UNMARKED";
  }

  // Deterministic hash simulation for unrecorded past days
  const hash =
    student.id.charCodeAt(student.id.length - 1) * 31 +
    dayInfo.dayNumber * 17 +
    dayInfo.weekdayIndex * 7;

  if (student.att >= 85) {
    if (hash % 10 === 0) return "A";
    if (hash % 7 === 0) return "L";
    return "P";
  } else if (student.att >= 70) {
    if (hash % 4 === 0) return "A";
    if (hash % 5 === 0) return "L";
    return "P";
  } else {
    if (hash % 2 === 0) return "A";
    if (hash % 3 === 0) return "L";
    return "P";
  }
}

export function calculateStudentAttendanceStats(
  student: RosterStudent,
  section: InstructorSection,
  monthDays: MonthDayInfo[],
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>
): AttendanceStats {
  const validHeldDays = monthDays.filter((d) => d.isClassDay && !d.isFuture);
  let p = 0;
  let l = 0;
  let a = 0;

  validHeldDays.forEach((day) => {
    const mark = resolveStudentMark(student, section, day, attendanceStore);
    if (mark === "P") p++;
    else if (mark === "L") l++;
    else if (mark === "A") a++;
  });

  const held = p + l + a;
  const effectivePresent = p + l * 0.5;
  const ratePct = held > 0 ? Math.round((effectivePresent / held) * 100) : student.att;

  return { held, p, l, a, effectivePresent, ratePct };
}
