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
    <div className="w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
      <div className="inline-flex sm:flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1.5 bg-white/[0.03] border border-white/10 rounded-lg min-w-full sm:min-w-0">
        {/* All Months Option */}
        <button
          type="button"
          onClick={() => onSelectMonth(0)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
            selectedMonthIndex === 0
              ? "bg-jade text-ink-base shadow-sm font-bold"
              : "text-ink hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>All Months</span>
          <span className="hidden md:inline font-normal opacity-80">(Full Term)</span>
        </button>

        {/* Individual Month Pills */}
        {months.map((m) => {
          const isSelected = selectedMonthIndex === m.monthIndex;

          return (
            <button
              key={m.monthIndex}
              type="button"
              onClick={() => onSelectMonth(m.monthIndex)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs whitespace-nowrap transition-all duration-200 shrink-0 ${
                isSelected
                  ? "bg-white/15 text-white border border-white/20 font-bold shadow-sm"
                  : "text-ink-faint hover:text-ink hover:bg-white/[0.04]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-ink-faint shrink-0" />
              <span>
                <span className="sm:hidden">M{m.monthIndex}</span>
                <span className="hidden sm:inline">Month {m.monthIndex}</span>{" "}
                <span className="font-mono text-[11px] opacity-75">({m.monthName})</span>
              </span>

              {!isLockedSemester && m.totalHeld > 0 && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
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
    </div>
  );
}
