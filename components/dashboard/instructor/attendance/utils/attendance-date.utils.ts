import type { DayOverrideInfo, MonthDayInfo } from "../types";

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

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(
  year: number,
  month: number,
  referenceDate: Date = new Date(),
  scheduleOverrides: Record<string, DayOverrideInfo> = {},
): MonthDayInfo[] {
  const daysCount = new Date(year, month + 1, 0).getDate();
  const result: MonthDayInfo[] = [];

  const refDayOnly = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  for (let d = 1; d <= daysCount; d++) {
    const current = new Date(year, month, d);
    const dayIndex = current.getDay();
    // Friday (5) and Saturday (6) are academic weekends
    const isWeekend = dayIndex === 5 || dayIndex === 6;

    const dateKey = formatDateKey(current);
    const override = scheduleOverrides[dateKey];
    const isHoliday = override?.type === "HOLIDAY";
    const isSpecialClass = override?.type === "SPECIAL_CLASS";
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
