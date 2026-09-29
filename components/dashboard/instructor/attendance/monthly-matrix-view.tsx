"use client";

import React, { useRef, useState } from "react";
import { GlassCard } from "@/components/site/glass-card";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { cn } from "@/lib/utils";
import type { AttendanceStats, DayOverrideInfo, MonthDayInfo } from "./attendance-types";
import { MonthlyMatrixMetrics } from "./monthly-matrix-metrics";
import { MonthlyMatrixToolbar } from "./monthly-matrix-toolbar";
import { MonthlyMatrixPanControls } from "./monthly-matrix-pan-controls";
import { MonthlyMatrixDayHeader } from "./monthly-matrix-day-header";
import { MonthlyMatrixRow } from "./monthly-matrix-row";

interface MonthlyMatrixViewProps {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  activeYear: number;
  studentStatsMap: Record<string, AttendanceStats>;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
  scheduleOverrides?: Record<string, DayOverrideInfo>;
  onToggleDayMark: (studentId: string, dateKey: string, mark: "P" | "L" | "A") => void;
  onSetDaySchedule?: (dateKey: string, type: "REGULAR" | "SPECIAL_CLASS" | "HOLIDAY", reason?: string) => void;
  onSelectStudentForModal: (student: RosterStudent) => void;
}

export function MonthlyMatrixView({
  roster,
  currentSection,
  monthDays,
  activeMonth,
  activeYear: _activeYear,
  studentStatsMap,
  attendanceStore,
  scheduleOverrides = {},
  onToggleDayMark,
  onSetDaySchedule,
  onSelectStudentForModal,
}: MonthlyMatrixViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "atRisk" | "good">("all");

  const tableScrollRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScrollRef = useRef(false);

  const [isMouseDownDragging, setIsMouseDownDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const monthlyClassDays = monthDays.filter((d) => d.isClassDay);
  const totalHeldSessions = monthlyClassDays.filter((d) => !d.isFuture).length;
  const allRates = Object.values(studentStatsMap).map((s) => s.ratePct);
  const avgSectionAttendance =
    allRates.length > 0 ? Math.round(allRates.reduce((a, b) => a + b, 0) / allRates.length) : 0;
  const atRiskCount = Object.values(studentStatsMap).filter((s) => s.ratePct < 75).length;

  const filteredRoster = roster.filter((st) => {
    const stats = studentStatsMap[st.id];
    const rate = stats ? stats.ratePct : st.att;

    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === "atRisk") return rate < 75;
    if (statusFilter === "good") return rate >= 75;
    return true;
  });

  const handleTableScroll = () => {
    if (isSyncingScrollRef.current) return;
    if (tableScrollRef.current && topScrollRef.current) {
      isSyncingScrollRef.current = true;
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
      isSyncingScrollRef.current = false;
    }
  };

  const handleTopScroll = () => {
    if (isSyncingScrollRef.current) return;
    if (tableScrollRef.current && topScrollRef.current) {
      isSyncingScrollRef.current = true;
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      isSyncingScrollRef.current = false;
    }
  };

  const handleScrollBy = (amount: number) => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleScrollToToday = () => {
    if (tableScrollRef.current) {
      const todayIndex = monthDays.findIndex((d) => d.isToday);
      if (todayIndex >= 0) {
        const offset = Math.max(0, todayIndex * 38 - 140);
        tableScrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("a") ||
      target.closest("[role='menuitem']") ||
      target.closest("[data-state]")
    ) {
      return;
    }

    if (!tableScrollRef.current) return;
    isDraggingRef.current = true;
    setIsMouseDownDragging(true);
    startXRef.current = e.pageX - tableScrollRef.current.offsetLeft;
    scrollLeftRef.current = tableScrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !tableScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    tableScrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    if (topScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsMouseDownDragging(false);
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setIsMouseDownDragging(false);
  };

  return (
    <div className="space-y-3 max-w-full overflow-hidden">
      {/* Metric Cards */}
      <MonthlyMatrixMetrics
        rosterCount={roster.length}
        sectionCode={currentSection?.section || "A"}
        totalHeldSessions={totalHeldSessions}
        totalMonthlyClasses={monthlyClassDays.length}
        activeMonth={activeMonth}
        avgSectionAttendance={avgSectionAttendance}
        atRiskCount={atRiskCount}
      />

      {/* Filter & Search Bar */}
      <MonthlyMatrixToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalStudents={roster.length}
        atRiskCount={atRiskCount}
      />

      {/* Horizontal Pan Controls */}
      <MonthlyMatrixPanControls
        onScrollBy={handleScrollBy}
        onScrollToToday={handleScrollToToday}
        topScrollRef={topScrollRef}
        onTopScroll={handleTopScroll}
        totalWidth={170 + monthDays.length * 38 + 230}
      />

      {/* Draggable Matrix Table */}
      <GlassCard
        className={cn(
          "overflow-hidden p-0 rounded-lg border border-white/10 select-none max-w-full",
          isMouseDownDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <div
          ref={tableScrollRef}
          onScroll={handleTableScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5 touch-pan-x"
        >
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="sticky left-0 z-20 bg-night-900/98 backdrop-blur-md px-3 py-2.5 min-w-[150px] sm:min-w-[200px] text-ink-faint font-semibold uppercase tracking-wider text-[0.65rem] sm:text-[0.68rem] border-r border-white/10 select-text">
                  Student ({filteredRoster.length})
                </th>

                {monthDays.map((day) => (
                  <MonthlyMatrixDayHeader
                    key={day.dayNumber}
                    day={day}
                    activeMonth={activeMonth}
                    scheduleOverrides={scheduleOverrides}
                    onSetDaySchedule={onSetDaySchedule}
                  />
                ))}

                <th className="px-2 py-2 text-center min-w-[34px] text-jade font-bold border-l border-white/10 bg-night-900/90 text-[0.7rem] whitespace-nowrap">
                  P
                </th>
                <th className="px-2 py-2 text-center min-w-[34px] text-marigold font-bold bg-night-900/90 text-[0.7rem] whitespace-nowrap">
                  L
                </th>
                <th className="px-2 py-2 text-center min-w-[34px] text-rose font-bold bg-night-900/90 text-[0.7rem] whitespace-nowrap">
                  A
                </th>
                <th className="px-3 py-2 text-center min-w-[84px] font-bold text-jade bg-night-900/90 border-l border-white/10 text-[0.7rem] whitespace-nowrap">
                  Month %
                </th>
                <th className="sticky right-0 z-20 bg-night-900/98 backdrop-blur-md px-3 py-2 text-center min-w-[80px] font-bold text-ink border-l border-white/10 text-[0.7rem] whitespace-nowrap">
                  Total %
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-mono">
              {filteredRoster.map((st) => (
                <MonthlyMatrixRow
                  key={st.id}
                  student={st}
                  currentSection={currentSection}
                  monthDays={monthDays}
                  activeMonth={activeMonth}
                  stats={studentStatsMap[st.id]}
                  attendanceStore={attendanceStore}
                  onToggleDayMark={onToggleDayMark}
                  onSelectStudentForModal={onSelectStudentForModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
