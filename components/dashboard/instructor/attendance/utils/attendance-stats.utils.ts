import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type {
  AttendanceMark,
  AttendanceStats,
  AttendanceStoreMap,
  MonthDayInfo,
} from "../types";

export function resolveStudentMark(
  student: RosterStudent,
  section: InstructorSection,
  dayInfo: MonthDayInfo,
  attendanceStore: AttendanceStoreMap,
): AttendanceMark | "OFF" | "UNMARKED" | "HOLIDAY" {
  if (dayInfo.isHoliday) {
    return "HOLIDAY";
  }

  if (!dayInfo.isClassDay) {
    return "OFF";
  }

  // Composite key format: {sectionId}_{dateKey} (e.g. S1_2026-09-27)
  const compositeKey = `${section?.id || "S1"}_${dayInfo.dateKey}`;
  const secRecords = attendanceStore?.[compositeKey];
  if (secRecords && secRecords[student.id]) {
    return secRecords[student.id]!;
  }

  if (dayInfo.isFuture) {
    return "UNMARKED";
  }

  // Special makeup classes start unmarked if not yet recorded
  if (dayInfo.isSpecialClass) {
    return "UNMARKED";
  }

  // Deterministic realistic hash simulation for past days per month & year
  const m = dayInfo.date.getMonth();
  const y = dayInfo.date.getFullYear();
  const studentSeed = student.id.split("").reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
  const hash = Math.abs(
    studentSeed ^ (m * 269) ^ (y * 811) ^ (dayInfo.dayNumber * 37) ^ (dayInfo.weekdayIndex * 13),
  );

  const monthlyVariance = ((studentSeed + m * 17) % 21) - 10;
  const targetMonthlyRate = Math.min(100, Math.max(35, student.att + monthlyVariance));

  const roll = hash % 100;
  if (roll < targetMonthlyRate - 12) {
    return "P";
  } else if (roll < targetMonthlyRate) {
    return "L";
  } else {
    return "A";
  }
}

export function calculateStudentAttendanceStats(
  student: RosterStudent,
  section: InstructorSection,
  monthDays: MonthDayInfo[],
  attendanceStore: AttendanceStoreMap,
): AttendanceStats {
  let p = 0;
  let l = 0;
  let a = 0;

  monthDays.forEach((day) => {
    if (!day.isClassDay || day.isHoliday) return;
    const mark = resolveStudentMark(student, section, day, attendanceStore);
    if (mark === "P") p++;
    else if (mark === "L") l++;
    else if (mark === "A") a++;
  });

  const held = p + l + a;
  const effectivePresent = p + l * 0.5;
  const ratePct = held > 0 ? Math.round((effectivePresent / held) * 100) : student.att;

  return {
    held,
    p,
    l,
    a,
    effectivePresent,
    ratePct,
  };
}
