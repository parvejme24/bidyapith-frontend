"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowDownAZ,
  ArrowDown10,
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronDown,
  Filter,
  GraduationCap,
  RotateCcw,
  Search,
  Users,
  X,
} from "lucide-react";

export type DailyStatusFilter = "all" | "P" | "L" | "A" | "unmarked" | "atRisk";
export type MonthlyStatusFilter = "all" | "good" | "atRisk";
export type SortOption = "id_asc" | "id_desc" | "name_asc" | "att_desc" | "att_asc";

interface AttendanceFilterBarProps {
  viewMode: "daily" | "monthly";
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Batch
  batches: string[];
  batchCounts: Record<string, number>;
  selectedBatch: string;
  onSelectBatch: (batch: string) => void;
  // Daily Status Filter
  dailyStatusFilter: DailyStatusFilter;
  onSelectDailyStatusFilter: (filter: DailyStatusFilter) => void;
  dailyStatusCounts?: {
    total: number;
    present: number;
    late: number;
    absent: number;
    unmarked: number;
    atRisk: number;
  };
  // Monthly Status Filter
  monthlyStatusFilter: MonthlyStatusFilter;
  onSelectMonthlyStatusFilter: (filter: MonthlyStatusFilter) => void;
  // Sorting
  sortBy: SortOption;
  onSelectSortBy: (sort: SortOption) => void;
  // Counts & Quick Actions
  totalStudents: number;
  filteredCount: number;
  onClearFilters: () => void;
  onMarkFilteredPresent?: () => void;
  isHoliday?: boolean;
}

export function AttendanceFilterBar({
  viewMode,
  searchQuery,
  onSearchChange,
  batches,
  batchCounts,
  selectedBatch,
  onSelectBatch,
  dailyStatusFilter,
  onSelectDailyStatusFilter,
  dailyStatusCounts,
  monthlyStatusFilter,
  onSelectMonthlyStatusFilter,
  sortBy,
  onSelectSortBy,
  totalStudents,
  filteredCount,
  onClearFilters,
  onMarkFilteredPresent,
  isHoliday = false,
}: AttendanceFilterBarProps) {
  const isFiltered =
    selectedBatch !== "all" ||
    searchQuery.trim().length > 0 ||
    (viewMode === "daily" ? dailyStatusFilter !== "all" : monthlyStatusFilter !== "all");

  const sortLabels: Record<SortOption, { label: string; icon: React.ReactNode }> = {
    id_asc: { label: "Student ID (Asc)", icon: <ArrowDown10 className="size-3.5" /> },
    id_desc: { label: "Student ID (Desc)", icon: <ArrowDown10 className="size-3.5 rotate-180" /> },
    name_asc: { label: "Name (A-Z)", icon: <ArrowDownAZ className="size-3.5" /> },
    att_desc: { label: "Attendance (High to Low)", icon: <ArrowUpDown className="size-3.5" /> },
    att_asc: { label: "Attendance (Low to High)", icon: <ArrowUpDown className="size-3.5" /> },
  };

  return (
    <GlassCard className="p-3 sm:p-4 rounded-xl space-y-3 border border-white/10 bg-white/[0.02]">
      {/* Top Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative grow max-w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by student name or ID..."
            className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-jade/50 focus:border-jade/50 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer p-0.5"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                selectedBatch !== "all"
                  ? "bg-jade/15 border-jade/40 text-jade font-semibold shadow-xs"
                  : "bg-white/[0.04] border-white/10 text-ink-muted hover:text-ink hover:bg-white/[0.08]"
              )}
            >
              <GraduationCap className="size-3.5 text-jade shrink-0" />
              <span>
                {selectedBatch === "all" ? "All Batches" : `Batch ${selectedBatch}`}
              </span>
              <span className="text-[0.68rem] px-1.5 py-0.2 rounded bg-white/10 font-mono text-ink-muted">
                {selectedBatch === "all"
                  ? totalStudents
                  : batchCounts[selectedBatch] || 0}
              </span>
              <ChevronDown className="size-3 text-ink-faint shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-night-800/95 backdrop-blur-xl border-white/15">
              <DropdownMenuLabel className="text-[0.7rem] uppercase tracking-wider text-ink-muted">
                Filter by Student Batch
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => onSelectBatch("all")}
                className="text-xs cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-ink-muted" />
                  <span>All Batches</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[0.7rem] font-mono text-ink-muted">({totalStudents})</span>
                  {selectedBatch === "all" && <Check className="size-3.5 text-jade" />}
                </div>
              </DropdownMenuItem>

              {batches.map((b) => (
                <DropdownMenuItem
                  key={b}
                  onClick={() => onSelectBatch(b)}
                  className="text-xs cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-3.5 text-jade" />
                    <span>Batch {b}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.7rem] font-mono text-ink-muted">
                      ({batchCounts[b] || 0})
                    </span>
                    {selectedBatch === b && <Check className="size-3.5 text-jade" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter (Daily vs Monthly) */}
          {viewMode === "daily" ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                  dailyStatusFilter !== "all"
                    ? "bg-orchid/15 border-orchid/40 text-orchid font-semibold shadow-xs"
                    : "bg-white/[0.04] border-white/10 text-ink-muted hover:text-ink hover:bg-white/[0.08]"
                )}
              >
                <Filter className="size-3 text-orchid shrink-0" />
                <span>
                  {dailyStatusFilter === "all"
                    ? "All Status"
                    : dailyStatusFilter === "P"
                    ? "Present"
                    : dailyStatusFilter === "L"
                    ? "Late"
                    : dailyStatusFilter === "A"
                    ? "Absent"
                    : dailyStatusFilter === "unmarked"
                    ? "Unmarked"
                    : "At Risk (<75%)"}
                </span>
                <ChevronDown className="size-3 text-ink-faint shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-night-800/95 backdrop-blur-xl border-white/15">
                <DropdownMenuLabel className="text-[0.7rem] uppercase tracking-wider text-ink-muted">
                  Daily Attendance Filter
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => onSelectDailyStatusFilter("all")}
                  className="text-xs cursor-pointer flex items-center justify-between"
                >
                  <span>All Students</span>
                  {dailyStatusFilter === "all" && <Check className="size-3.5 text-jade" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectDailyStatusFilter("P")}
                  className="text-xs cursor-pointer flex items-center justify-between text-jade"
                >
                  <span>Present (P)</span>
                  <div className="flex items-center gap-1.5">
                    {dailyStatusCounts && (
                      <span className="font-mono text-[0.7rem]">({dailyStatusCounts.present})</span>
                    )}
                    {dailyStatusFilter === "P" && <Check className="size-3.5 text-jade" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectDailyStatusFilter("L")}
                  className="text-xs cursor-pointer flex items-center justify-between text-marigold"
                >
                  <span>Late (L)</span>
                  <div className="flex items-center gap-1.5">
                    {dailyStatusCounts && (
                      <span className="font-mono text-[0.7rem]">({dailyStatusCounts.late})</span>
                    )}
                    {dailyStatusFilter === "L" && <Check className="size-3.5 text-marigold" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectDailyStatusFilter("A")}
                  className="text-xs cursor-pointer flex items-center justify-between text-rose"
                >
                  <span>Absent (A)</span>
                  <div className="flex items-center gap-1.5">
                    {dailyStatusCounts && (
                      <span className="font-mono text-[0.7rem]">({dailyStatusCounts.absent})</span>
                    )}
                    {dailyStatusFilter === "A" && <Check className="size-3.5 text-rose" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectDailyStatusFilter("unmarked")}
                  className="text-xs cursor-pointer flex items-center justify-between text-ink-muted"
                >
                  <span>Unmarked</span>
                  <div className="flex items-center gap-1.5">
                    {dailyStatusCounts && (
                      <span className="font-mono text-[0.7rem]">({dailyStatusCounts.unmarked})</span>
                    )}
                    {dailyStatusFilter === "unmarked" && <Check className="size-3.5 text-jade" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => onSelectDailyStatusFilter("atRisk")}
                  className="text-xs cursor-pointer flex items-center justify-between text-rose font-medium"
                >
                  <span>Overall At Risk (&lt;75%)</span>
                  <div className="flex items-center gap-1.5">
                    {dailyStatusCounts && (
                      <span className="font-mono text-[0.7rem]">({dailyStatusCounts.atRisk})</span>
                    )}
                    {dailyStatusFilter === "atRisk" && <Check className="size-3.5 text-rose" />}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                  monthlyStatusFilter !== "all"
                    ? "bg-orchid/15 border-orchid/40 text-orchid font-semibold shadow-xs"
                    : "bg-white/[0.04] border-white/10 text-ink-muted hover:text-ink hover:bg-white/[0.08]"
                )}
              >
                <Filter className="size-3 text-orchid shrink-0" />
                <span>
                  {monthlyStatusFilter === "all"
                    ? "All Rates"
                    : monthlyStatusFilter === "good"
                    ? "Good (≥75%)"
                    : "At Risk (<75%)"}
                </span>
                <ChevronDown className="size-3 text-ink-faint shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-night-800/95 backdrop-blur-xl border-white/15">
                <DropdownMenuLabel className="text-[0.7rem] uppercase tracking-wider text-ink-muted">
                  Monthly Rate Filter
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => onSelectMonthlyStatusFilter("all")}
                  className="text-xs cursor-pointer flex items-center justify-between"
                >
                  <span>All Students</span>
                  {monthlyStatusFilter === "all" && <Check className="size-3.5 text-jade" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectMonthlyStatusFilter("good")}
                  className="text-xs cursor-pointer flex items-center justify-between text-jade"
                >
                  <span>Good Standing (≥75%)</span>
                  {monthlyStatusFilter === "good" && <Check className="size-3.5 text-jade" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectMonthlyStatusFilter("atRisk")}
                  className="text-xs cursor-pointer flex items-center justify-between text-rose font-medium"
                >
                  <span>At Risk (&lt;75%)</span>
                  {monthlyStatusFilter === "atRisk" && <Check className="size-3.5 text-rose" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:bg-white/[0.08] transition-all cursor-pointer"
              title="Sort student list"
            >
              {sortLabels[sortBy].icon}
              <span className="hidden sm:inline">{sortLabels[sortBy].label}</span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown className="size-3 text-ink-faint shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-night-800/95 backdrop-blur-xl border-white/15">
              <DropdownMenuLabel className="text-[0.7rem] uppercase tracking-wider text-ink-muted">
                Sort Students
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onSelectSortBy(key)}
                  className="text-xs cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {sortLabels[key].icon}
                    <span>{sortLabels[key].label}</span>
                  </div>
                  {sortBy === key && <Check className="size-3.5 text-jade" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Batch Quick Filter Pills (Horizontal Bar for easy 1-click access) */}
      {batches.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
          <span className="text-[0.7rem] font-semibold text-ink-faint mr-1 flex items-center gap-1">
            <GraduationCap className="size-3 text-jade" />
            <span>Batches:</span>
          </span>
          <button
            type="button"
            onClick={() => onSelectBatch("all")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[0.7rem] font-semibold transition-all cursor-pointer flex items-center gap-1",
              selectedBatch === "all"
                ? "bg-jade text-night-900 shadow-xs font-bold"
                : "bg-white/[0.04] text-ink-muted hover:bg-white/[0.08] hover:text-ink border border-white/8"
            )}
          >
            <span>All</span>
            <span className={cn("text-[0.65rem] font-mono", selectedBatch === "all" ? "text-night-900/80" : "text-ink-faint")}>
              ({totalStudents})
            </span>
          </button>
          {batches.map((b) => {
            const count = batchCounts[b] || 0;
            const isSelected = selectedBatch === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => onSelectBatch(b)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[0.7rem] font-semibold transition-all cursor-pointer flex items-center gap-1",
                  isSelected
                    ? "bg-jade text-night-900 shadow-xs font-bold"
                    : "bg-white/[0.04] text-ink-muted hover:bg-white/[0.08] hover:text-ink border border-white/8"
                )}
              >
                <span>Batch {b}</span>
                <span className={cn("text-[0.65rem] font-mono", isSelected ? "text-night-900/80" : "text-ink-faint")}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Filter Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-ink-muted">
          <span className="text-[0.72rem]">
            Showing <strong className="text-ink">{filteredCount}</strong> of{" "}
            <strong className="text-ink">{totalStudents}</strong> students
            {selectedBatch !== "all" && (
              <span className="text-jade font-semibold ml-1">
                (Batch {selectedBatch})
              </span>
            )}
            {searchQuery && (
              <span className="text-ink-faint ml-1">
                matching &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[0.7rem] text-rose hover:text-rose-light inline-flex items-center gap-1 font-semibold underline cursor-pointer ml-1"
            >
              <RotateCcw className="size-2.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Quick Batch Action for Daily Mode */}
        {viewMode === "daily" && !isHoliday && onMarkFilteredPresent && filteredCount > 0 && (
          <button
            type="button"
            onClick={onMarkFilteredPresent}
            className="text-[0.7rem] px-2.5 py-1 rounded-md bg-jade/15 text-jade border border-jade/30 hover:bg-jade/25 transition-all font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Mark only currently visible/filtered students as Present"
          >
            <CheckCircle2 className="size-3" />
            <span>
              Mark {selectedBatch !== "all" ? `Batch ${selectedBatch}` : "Visible"} as Present ({filteredCount})
            </span>
          </button>
        )}
      </div>
    </GlassCard>
  );
}
