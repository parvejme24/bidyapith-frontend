"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RotateCcw, Sparkles, Umbrella } from "lucide-react";
import type { DayOverrideInfo, MonthDayInfo } from "./attendance-types";
import { MONTH_NAMES } from "./attendance-utils";

interface MonthlyMatrixDayHeaderProps {
  day: MonthDayInfo;
  activeMonth: number;
  scheduleOverrides?: Record<string, DayOverrideInfo>;
  onSetDaySchedule?: (
    dateKey: string,
    type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY",
    reason?: string
  ) => void;
}

export function MonthlyMatrixDayHeader({
  day,
  activeMonth,
  scheduleOverrides = {},
  onSetDaySchedule,
}: MonthlyMatrixDayHeaderProps) {
  const hasOverride = !!scheduleOverrides[day.dateKey];

  return (
    <th
      className={cn(
        "px-1 py-1.5 text-center min-w-[34px] border-r border-white/5 transition-colors select-none relative group/th",
        day.isToday && "bg-jade/15 border-jade/30",
        day.isHoliday && "bg-purple-950/40 border-purple-800/40",
        day.isSpecialClass && "bg-amber-950/40 border-amber-800/40",
        !day.isClassDay && !day.isHoliday && day.isWeekend && "bg-white/[0.015] text-ink-faint opacity-60"
      )}
    >
      {onSetDaySchedule ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full flex flex-col items-center justify-center p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer group outline-none"
            title={`${day.dateKey} (${day.weekdayFull}): Click to manage schedule`}
          >
            <div className="flex items-center justify-center gap-0.5">
              <span
                className={cn(
                  "font-mono text-[0.7rem] sm:text-xs font-bold",
                  day.isSpecialClass ? "text-amber-300" : day.isHoliday ? "text-purple-300" : "text-ink"
                )}
              >
                {String(day.dayNumber).padStart(2, "0")}
              </span>
              {day.isSpecialClass && <Sparkles className="size-2.5 text-amber-400 shrink-0" />}
              {day.isHoliday && <Umbrella className="size-2.5 text-purple-300 shrink-0" />}
            </div>

            <span
              className={cn(
                "text-[0.6rem] uppercase font-mono mt-0.5",
                day.isHoliday
                  ? "text-purple-300 font-bold"
                  : day.isSpecialClass
                  ? "text-amber-300 font-bold"
                  : day.isClassDay
                  ? "text-jade font-bold"
                  : "text-ink-faint"
              )}
            >
              {day.weekday}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="center"
            className="w-56 rounded-xl border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl z-50 text-xs"
          >
            <DropdownMenuLabel className="px-2 py-1 text-[0.68rem] text-ink-faint border-b border-white/10">
              <span className="font-bold text-ink block">
                {day.weekdayFull}, {day.dayNumber} {MONTH_NAMES[activeMonth]}
              </span>
              <span className="text-[0.62rem] text-ink-muted">
                {day.isHoliday
                  ? `🏖️ Holiday (${day.holidayReason || "Campus Occasion"})`
                  : day.isSpecialClass
                  ? "⚡ Special / Makeup Class"
                  : day.isClassDay
                  ? "Regular Class Day"
                  : "Weekend / Off Day"}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => onSetDaySchedule(day.dateKey, "SPECIAL_CLASS", "Special Makeup Lecture")}
              className="flex items-center gap-2 px-2.5 py-1.5 text-amber-300 hover:bg-amber-500/15 rounded-lg cursor-pointer font-medium text-xs mt-1"
            >
              <Sparkles className="size-3.5 text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="font-bold">Arrange Makeup Class</p>
                <p className="text-[0.62rem] text-ink-muted">Take attendance on this day</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const reason = window.prompt(
                  "Enter Holiday Reason (e.g. Govt Holiday, Campus Occasion, Strike):",
                  "Govt Holiday"
                );
                if (reason !== null) {
                  onSetDaySchedule(day.dateKey, "HOLIDAY", reason.trim() || "Govt Holiday");
                }
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 text-purple-300 hover:bg-purple-500/15 rounded-lg cursor-pointer font-medium text-xs"
            >
              <Umbrella className="size-3.5 text-purple-300 shrink-0" />
              <div className="text-left">
                <p className="font-bold">Declare Holiday / Occasion</p>
                <p className="text-[0.62rem] text-ink-muted">Excuse all students from class</p>
              </div>
            </DropdownMenuItem>

            {hasOverride && (
              <>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem
                  onClick={() => onSetDaySchedule(day.dateKey, "REGULAR")}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-ink-muted hover:text-ink hover:bg-white/10 rounded-lg cursor-pointer font-medium text-xs"
                >
                  <RotateCcw className="size-3.5 shrink-0" />
                  <span>Reset to Default Schedule</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <span className="block font-mono text-[0.7rem] sm:text-xs font-bold text-ink">
            {String(day.dayNumber).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "block text-[0.62rem] uppercase font-mono mt-0.5",
              day.isClassDay ? "text-jade font-bold" : "text-ink-faint"
            )}
          >
            {day.weekday}
          </span>
        </>
      )}
    </th>
  );
}
