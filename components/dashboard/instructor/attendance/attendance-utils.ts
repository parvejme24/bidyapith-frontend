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
  referenceDate: Date = new Date(),
  scheduleOverrides: Record<string, { type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY"; reason?: string }> = {}
): MonthDayInfo[] {
  const daysCount = new Date(year, month + 1, 0).getDate();
  const result: MonthDayInfo[] = [];

  const refDayOnly = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  for (let d = 1; d <= daysCount; d++) {
    const current = new Date(year, month, d);
    const dayIndex = current.getDay();
    // Friday (5) and Saturday (6) are academic weekends
    const isWeekend = dayIndex === 5 || dayIndex === 6;

    const yStr = current.getFullYear();
    const mStr = String(current.getMonth() + 1).padStart(2, "0");
    const dStr = String(current.getDate()).padStart(2, "0");
    const dateKey = `${yStr}-${mStr}-${dStr}`;

    const override = scheduleOverrides[dateKey];
    const isHoliday = override?.type === "HOLIDAY";
    const isSpecialClass = override?.type === "SPECIAL_CLASS";
    // Class day: If Holiday -> false, If Special Class -> true (even on weekend), Else -> not weekend
    const isClassDay = isHoliday ? false : (isSpecialClass ? true : !isWeekend);

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
      isSpecialClass,
      isHoliday,
      holidayReason: override?.reason,
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
): "P" | "L" | "A" | "OFF" | "UNMARKED" | "HOLIDAY" {
  if (dayInfo.isHoliday) {
    return "HOLIDAY";
  }

  if (!dayInfo.isClassDay) {
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

  // Special makeup classes start unmarked if not yet recorded
  if (dayInfo.isSpecialClass) {
    return "UNMARKED";
  }

  // Deterministic realistic hash simulation for past days per month & year
  const m = dayInfo.date.getMonth(); // 0..11
  const y = dayInfo.date.getFullYear();
  const studentSeed = student.id.split("").reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
  const hash = Math.abs(studentSeed ^ (m * 269) ^ (y * 811) ^ (dayInfo.dayNumber * 37) ^ (dayInfo.weekdayIndex * 13));

  // Base profile per student: realistic monthly variance
  const monthlyVariance = ((studentSeed + m * 17) % 21) - 10; // -10% to +10% variance per month
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
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>
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
  const ratePct = held > 0 ? Math.round((effectivePresent / held) * 100) : 0;

  return { held, p, l, a, effectivePresent, ratePct };
}
