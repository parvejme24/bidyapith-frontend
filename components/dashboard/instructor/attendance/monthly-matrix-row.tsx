"use client";

import React from "react";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { AttendanceStats, MonthDayInfo } from "./attendance-types";
import { MONTH_NAMES, resolveStudentMark } from "./attendance-utils";

interface MonthlyMatrixRowProps {
  student: RosterStudent;
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  stats?: AttendanceStats;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
  onToggleDayMark: (studentId: string, dateKey: string, mark: "P" | "L" | "A") => void;
  onSelectStudentForModal: (student: RosterStudent) => void;
}

export function MonthlyMatrixRow({
  student,
  currentSection,
  monthDays,
  activeMonth,
  stats,
  attendanceStore,
  onToggleDayMark,
  onSelectStudentForModal,
}: MonthlyMatrixRowProps) {
  return (
    <tr className="hover:bg-white/[0.035] transition-colors group/row">
      <td className="sticky left-0 z-10 bg-night-900/98 group-hover/row:bg-night-800/98 backdrop-blur-md px-3 py-1.5 border-r border-white/10 font-sans select-none">
        <button
          type="button"
          onClick={() => onSelectStudentForModal(student)}
          className="flex items-center gap-2 text-left w-full cursor-pointer hover:text-jade transition-colors"
          title="Click to view student month breakdown"
        >
          <UserAvatar
            name={student.name}
            avatar={student.avatar}
            size="xs"
            colorScheme="jade"
          />

          <div className="min-w-0">
            <p className="text-[0.72rem] sm:text-xs font-semibold text-ink truncate group-hover/row:text-jade transition-colors">
              {student.name}
            </p>
            <p className="text-[0.62rem] sm:text-[0.68rem] font-mono text-ink-faint truncate">{student.id}</p>
          </div>
        </button>
      </td>

      {monthDays.map((day) => {
        const mark = resolveStudentMark(student, currentSection, day, attendanceStore);

        if (mark === "HOLIDAY" || day.isHoliday) {
          return (
            <td
              key={day.dayNumber}
              className="px-0.5 py-1 text-center border-r border-white/5 bg-purple-950/20"
              title={`Declared Holiday: ${day.holidayReason || "Campus Occasion"} (Excused)`}
            >
              <span className="inline-flex items-center justify-center size-5 sm:size-6 rounded text-[0.65rem] text-purple-300 font-bold bg-purple-500/15 border border-purple-500/30">
                🏖️
              </span>
            </td>
          );
        }

        if (mark === "OFF") {
          return (
            <td
              key={day.dayNumber}
              className="px-1 py-1.5 text-center text-ink-faint text-[0.62rem] opacity-35 border-r border-white/5 bg-white/[0.01]"
            >
              ·
            </td>
          );
        }

        if (mark === "UNMARKED") {
          return (
            <td
              key={day.dayNumber}
              className={cn(
                "px-0.5 py-1 text-center border-r border-white/5",
                day.isToday && "bg-jade/5",
                day.isSpecialClass && "bg-amber-950/20"
              )}
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "size-5 sm:size-6 rounded font-bold text-[0.68rem] flex items-center justify-center mx-auto transition-all cursor-pointer",
                    day.isSpecialClass
                      ? "border border-dashed border-amber-400/50 text-amber-300/80 hover:border-amber-400 hover:bg-amber-400/15"
                      : "border border-dashed border-white/20 text-ink-muted/60 hover:border-jade/60 hover:text-jade hover:bg-jade/10"
                  )}
                  title={`Click to add attendance mark for ${day.dateKey} (${day.weekday})${day.isSpecialClass ? " - Special Class" : ""}`}
                >
                  -
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-[130px] rounded-lg border border-white/15 bg-night-900/98 p-1 shadow-2xl backdrop-blur-xl z-50 text-xs"
                >
                  <div className="px-2 py-1 text-[0.68rem] text-ink-faint border-b border-white/10 mb-1">
                    {day.dayNumber} {MONTH_NAMES[activeMonth]} ({day.weekday})
                    {day.isSpecialClass && <span className="block text-amber-400 font-bold">Special Class</span>}
                  </div>
                  <DropdownMenuItem
                    onClick={() => onToggleDayMark(student.id, day.dateKey, "P")}
                    className="flex items-center gap-2 px-2 py-1 text-jade hover:bg-jade/15 rounded cursor-pointer font-bold text-xs"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Present (P)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggleDayMark(student.id, day.dateKey, "L")}
                    className="flex items-center gap-2 px-2 py-1 text-marigold hover:bg-marigold/15 rounded cursor-pointer font-bold text-xs"
                  >
                    <Clock className="size-3.5" />
                    <span>Late (L)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onToggleDayMark(student.id, day.dateKey, "A")}
                    className="flex items-center gap-2 px-2 py-1 text-rose hover:bg-rose/15 rounded cursor-pointer font-bold text-xs"
                  >
                    <XCircle className="size-3.5" />
                    <span>Absent (A)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          );
        }

        return (
          <td
            key={day.dayNumber}
            className={cn(
              "px-0.5 py-1 text-center border-r border-white/5",
              day.isToday && "bg-jade/5",
              day.isSpecialClass && "bg-amber-950/20"
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "size-5 sm:size-6 rounded font-bold text-[0.68rem] flex items-center justify-center mx-auto transition-all cursor-pointer",
                  mark === "P" && "bg-jade/20 text-jade hover:bg-jade/30 border border-jade/30",
                  mark === "L" && "bg-marigold/20 text-marigold hover:bg-marigold/30 border border-marigold/30",
                  mark === "A" && "bg-rose/20 text-rose hover:bg-rose/30 border border-rose/30"
                )}
                title={`${day.dateKey} (${day.weekday}): ${mark}${day.isSpecialClass ? " (Special Class)" : ""}`}
              >
                {mark}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-[130px] rounded-lg border border-white/15 bg-night-900/98 p-1 shadow-2xl backdrop-blur-xl z-50 text-xs"
              >
                <div className="px-2 py-1 text-[0.68rem] text-ink-faint border-b border-white/10 mb-1">
                  {day.dayNumber} {MONTH_NAMES[activeMonth]} ({day.weekday})
                  {day.isSpecialClass && <span className="block text-amber-400 font-bold">Special Class</span>}
                </div>
                <DropdownMenuItem
                  onClick={() => onToggleDayMark(student.id, day.dateKey, "P")}
                  className="flex items-center gap-2 px-2 py-1 text-jade hover:bg-jade/15 rounded cursor-pointer font-bold text-xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Present (P)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleDayMark(student.id, day.dateKey, "L")}
                  className="flex items-center gap-2 px-2 py-1 text-marigold hover:bg-marigold/15 rounded cursor-pointer font-bold text-xs"
                >
                  <Clock className="size-3.5" />
                  <span>Late (L)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleDayMark(student.id, day.dateKey, "A")}
                  className="flex items-center gap-2 px-2 py-1 text-rose hover:bg-rose/15 rounded cursor-pointer font-bold text-xs"
                >
                  <XCircle className="size-3.5" />
                  <span>Absent (A)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        );
      })}

      <td className="px-2 py-1.5 text-center text-jade font-bold border-l border-white/10 text-[0.7rem]">
        {stats ? stats.p : 0}
      </td>
      <td className="px-2 py-1.5 text-center text-marigold font-bold text-[0.7rem]">
        {stats ? stats.l : 0}
      </td>
      <td className="px-2 py-1.5 text-center text-rose font-bold text-[0.7rem]">
        {stats ? stats.a : 0}
      </td>
      <td className="px-3 py-1.5 text-center font-bold border-l border-white/10 text-[0.7rem] whitespace-nowrap">
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[0.68rem] font-bold inline-block whitespace-nowrap",
            stats && stats.held > 0
              ? stats.ratePct >= 75
                ? "text-jade bg-jade/10 border border-jade/25"
                : "text-rose bg-rose/10 border border-rose/25"
              : "text-ink-faint"
          )}
        >
          {stats && stats.held > 0 ? `${stats.ratePct}%` : "—"}
        </span>
      </td>
      <td className="sticky right-0 z-10 bg-night-900/98 group-hover/row:bg-night-800/98 backdrop-blur-md px-3 py-1.5 text-center border-l border-white/10 whitespace-nowrap">
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[0.68rem] sm:text-xs font-bold inline-block whitespace-nowrap",
            student.att >= 75
              ? "bg-jade/15 text-jade border border-jade/30"
              : "bg-rose/15 text-rose border border-rose/30"
          )}
          title={`Cumulative all-months semester rate: ${student.att}%`}
        >
          {student.att}%
        </span>
      </td>
    </tr>
  );
}
