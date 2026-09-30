"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { InstructorSection } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Table as TableIcon,
} from "lucide-react";
import { formatDateDMY, MONTH_NAMES } from "./utils";
import type { AttendanceRosterHeaderProps } from "./types";

export type { AttendanceRosterHeaderProps };

export function AttendanceRosterHeader({
  viewMode,
  onViewModeChange,
  sections,
  selectedSec,
  onSelectSection,
  currentSection,
  selectedDate,
  onSelectDate,
  calendarOpen,
  onCalendarOpenChange,
  isHoliday,
  hasUnsavedChanges,
  batchLabel,
  onMarkAllPresent,
  onSaveDaily,
  activeMonth,
  activeYear,
  onPrevMonth,
  onNextMonth,
  onExportMonth,
}: AttendanceRosterHeaderProps) {
  return (
    <GlassCard className="p-3 sm:p-4 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* View mode toggle */}
        <div className="grid grid-cols-2 sm:flex items-center p-1 rounded-lg bg-white/[0.04] border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => onViewModeChange("daily")}
            className={cn(
              "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
              viewMode === "daily"
                ? "bg-jade text-night-900 shadow-md font-bold"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            <CalendarIcon className="size-3.5 shrink-0" />
            <span className="truncate">Daily Session</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("monthly")}
            className={cn(
              "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
              viewMode === "monthly"
                ? "bg-jade text-night-900 shadow-md font-bold"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            <TableIcon className="size-3.5 shrink-0" />
            <span className="truncate">Monthly Sheet</span>
          </button>
        </div>

        {/* Section Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between gap-2.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink hover:border-jade/50 hover:bg-white/[0.09] transition-all cursor-pointer outline-none shadow-sm w-full sm:w-auto">
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="size-3.5 text-jade shrink-0" />
              <span className="font-bold text-jade">{currentSection?.code || "Course"}</span>
              <span className="text-ink-muted">· Sec {currentSection?.section}</span>
              <span className="text-xs text-ink-faint hidden sm:inline">({currentSection?.room})</span>
            </div>
            <ChevronDown className="size-3.5 text-ink-muted shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[280px] rounded-lg border border-white/15 bg-night-900/95 p-1 shadow-2xl backdrop-blur-xl z-50"
          >
            {sections.map((s) => {
              const isSelected = selectedSec === s.id;
              return (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => onSelectSection(s.id)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition-colors",
                    isSelected
                      ? "bg-jade/15 text-jade"
                      : "text-ink hover:bg-white/[0.08] hover:text-ink"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("font-bold text-sm", isSelected ? "text-jade" : "text-ink")}>
                      {s.code}
                    </span>
                    <span className="text-ink-muted">Section {s.section}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.72rem] text-ink-faint">{s.room}</span>
                    {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mode Specific Controls */}
      {viewMode === "daily" ? (
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker Popover */}
          <Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
            <PopoverTrigger className="flex items-center justify-between gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink hover:border-jade/50 hover:bg-white/[0.09] transition-all cursor-pointer outline-none shadow-sm grow sm:grow-0">
              <div className="flex items-center gap-2 truncate">
                <CalendarIcon className="size-3.5 text-jade shrink-0" />
                <span>{selectedDate ? formatDateDMY(selectedDate) : "Pick date"}</span>
              </div>
              <ChevronDown className="size-3 text-ink-muted shrink-0" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-auto p-2 rounded-xl border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl z-50"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  if (d) {
                    onSelectDate(d);
                    onCalendarOpenChange(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Mark batch present button */}
          <button
            type="button"
            disabled={isHoliday}
            onClick={onMarkAllPresent}
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "text-xs rounded-lg grow sm:grow-0",
              isHoliday && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            {batchLabel ? `Mark ${batchLabel} present` : "Mark batch present"}
          </button>

          {/* Save button */}
          <button
            type="button"
            disabled={!hasUnsavedChanges || isHoliday}
            onClick={onSaveDaily}
            className={cn(
              "text-xs flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 font-semibold transition-all duration-200 grow sm:grow-0",
              hasUnsavedChanges && !isHoliday
                ? "bg-jade text-night-900 shadow-md font-bold hover:brightness-110 cursor-pointer active:scale-95 ring-1 ring-jade/50"
                : "bg-white/[0.05] text-ink-muted/70 border border-white/10 cursor-not-allowed opacity-65"
            )}
          >
            <Check
              className={cn(
                "size-3.5 shrink-0",
                hasUnsavedChanges && !isHoliday ? "text-night-900" : "text-ink-muted/70"
              )}
            />
            <span>
              {isHoliday ? "Holiday / No Class" : hasUnsavedChanges ? "Save attendance" : "Saved ✓"}
            </span>
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {/* Month navigation */}
          <div className="flex items-center justify-between gap-1 rounded-lg border border-white/15 bg-white/[0.05] p-1 shadow-sm grow sm:grow-0">
            <button
              type="button"
              onClick={onPrevMonth}
              aria-label="Previous Month"
              className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-2 text-xs sm:text-sm font-bold text-ink min-w-[100px] text-center">
              {MONTH_NAMES[activeMonth]} {activeYear}
            </span>
            <button
              type="button"
              onClick={onNextMonth}
              aria-label="Next Month"
              className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Export button */}
          <button
            type="button"
            onClick={onExportMonth}
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "text-xs flex items-center justify-center gap-1.5 border border-white/15 hover:border-jade/40 rounded-lg grow sm:grow-0"
            )}
          >
            <Download className="size-3.5 text-jade shrink-0" />
            <span>Export Month (.csv)</span>
          </button>
        </div>
      )}
    </GlassCard>
  );
}
