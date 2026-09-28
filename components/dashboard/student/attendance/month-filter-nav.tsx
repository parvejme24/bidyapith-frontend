"use client";

import React from "react";
import { Calendar, Layers } from "lucide-react";
import type { MonthSummary } from "./attendance-types";

interface MonthFilterNavProps {
  months: MonthSummary[];
  selectedMonthIndex: number; // 0 for All Months, 1..4 for individual month
  onSelectMonth: (monthIndex: number) => void;
  isLockedSemester: boolean;
}

export function MonthFilterNav({
  months,
  selectedMonthIndex,
  onSelectMonth,
  isLockedSemester,
}: MonthFilterNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-lg">
      {/* All Months Option */}
      <button
        type="button"
        onClick={() => onSelectMonth(0)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
          selectedMonthIndex === 0
            ? "bg-jade text-ink-base shadow-sm font-bold"
            : "text-ink hover:text-white hover:bg-white/[0.05]"
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>All Months (Full Term)</span>
      </button>

      {/* Individual Month Pills */}
      {months.map((m) => {
        const isSelected = selectedMonthIndex === m.monthIndex;

        return (
          <button
            key={m.monthIndex}
            type="button"
            onClick={() => onSelectMonth(m.monthIndex)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs transition-all duration-200 ${
              isSelected
                ? "bg-white/15 text-white border border-white/20 font-bold shadow-sm"
                : "text-ink-faint hover:text-ink hover:bg-white/[0.04]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-ink-faint" />
            <span>
              Month {m.monthIndex} <span className="font-mono opacity-70">({m.monthName})</span>
            </span>

            {!isLockedSemester && m.totalHeld > 0 && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  m.pct >= 75
                    ? isSelected
                      ? "bg-jade/30 text-jade"
                      : "bg-jade/15 text-jade"
                    : "bg-rose/20 text-rose"
                }`}
              >
                {m.pct}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
