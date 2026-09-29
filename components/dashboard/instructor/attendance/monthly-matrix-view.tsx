"use client";

import React, { useRef, useState } from "react";
import { GlassCard } from "@/components/site/glass-card";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoveHorizontal,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import type { AttendanceStats, MonthDayInfo } from "./attendance-types";
import { MONTH_NAMES, resolveStudentMark } from "./attendance-utils";

interface MonthlyMatrixViewProps {
  roster: RosterStudent[];
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  activeMonth: number;
  activeYear: number;
  studentStatsMap: Record<string, AttendanceStats>;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
  onToggleDayMark: (studentId: string, dateKey: string, mark: "P" | "L" | "A") => void;
  onSelectStudentForModal: (student: RosterStudent) => void;
}

export function MonthlyMatrixView({
  roster,
  currentSection,
  monthDays,
  activeMonth,
  activeYear,
  studentStatsMap,
  attendanceStore,
  onToggleDayMark,
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <GlassCard className="p-3 rounded-lg">
          <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
            <span>Enrolled Students</span>
            <Users className="size-3.5 text-jade" />
          </div>
          <p className="font-display text-base sm:text-lg lg:text-xl font-bold text-ink">{roster.length}</p>
          <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Section {currentSection?.section}</p>
        </GlassCard>

        <GlassCard className="p-3 rounded-lg">
          <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
            <span>Class Sessions</span>
            <CalendarDays className="size-3.5 text-sky-400" />
          </div>
          <p className="font-display text-base sm:text-lg lg:text-xl font-bold text-ink">
            {totalHeldSessions}{" "}
            <span className="text-[0.68rem] text-ink-faint font-normal font-sans">
              / {monthlyClassDays.length}
            </span>
          </p>
          <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Held in {MONTH_NAMES[activeMonth]}</p>
        </GlassCard>

        <GlassCard className="p-3 rounded-lg">
          <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
            <span>Avg. Attendance</span>
            <CheckCircle2 className="size-3.5 text-jade" />
          </div>
          <p className="font-display text-base sm:text-lg lg:text-xl font-bold text-jade">
            {avgSectionAttendance}%
          </p>
          <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Real section average</p>
        </GlassCard>

        <GlassCard className="p-3 rounded-lg">
          <div className="flex items-center justify-between text-ink-faint text-[0.7rem] mb-1">
            <span>At Risk (&lt; 75%)</span>
            <AlertTriangle className="size-3.5 text-rose" />
          </div>
          <p
            className={cn(
              "font-display text-base sm:text-lg lg:text-xl font-bold",
              atRiskCount > 0 ? "text-rose" : "text-jade"
            )}
          >
            {atRiskCount}{" "}
            <span className="text-[0.68rem] text-ink-faint font-normal font-sans">students</span>
          </p>
          <p className="text-[0.68rem] text-ink-muted mt-0.5 truncate">Below 75% requirement</p>
        </GlassCard>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 grow">
          <div className="relative w-full sm:w-56">
            <Search className="size-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-white/15 bg-white/[0.04] text-xs text-ink placeholder:text-ink-faint focus:border-jade/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-md bg-white/[0.04] border border-white/10 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-2 py-1 rounded text-[0.68rem] sm:text-xs font-medium transition-colors cursor-pointer grow sm:grow-0 text-center",
                statusFilter === "all"
                  ? "bg-white/15 text-ink font-semibold"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              All ({roster.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("atRisk")}
              className={cn(
                "px-2 py-1 rounded text-[0.68rem] sm:text-xs font-medium transition-colors cursor-pointer grow sm:grow-0 text-center",
                statusFilter === "atRisk"
                  ? "bg-rose/20 text-rose font-bold"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              Low ({atRiskCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("good")}
              className={cn(
                "px-2 py-1 rounded text-[0.68rem] sm:text-xs font-medium transition-colors cursor-pointer grow sm:grow-0 text-center",
                statusFilter === "good"
                  ? "bg-jade/20 text-jade font-semibold"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              Good ({roster.length - atRiskCount})
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[0.68rem] text-ink-muted">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-jade inline-block" /> P (1.0)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-marigold inline-block" /> L (0.5)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-rose inline-block" /> A (0)
          </span>
          <span className="flex items-center gap-1 text-ink-faint">
            <span className="size-2 rounded-full bg-white/20 inline-block" /> Off
          </span>
        </div>
      </GlassCard>

      {/* Horizontal Pan Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 text-xs">
        <div className="flex items-center gap-2 text-ink-muted">
          <MoveHorizontal className="size-3.5 text-jade shrink-0" />
          <span className="font-semibold text-ink text-[0.72rem]">Horizontal Pan:</span>
          <span className="text-[0.68rem] text-ink-faint hidden sm:inline">Drag with mouse/touch</span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleScrollBy(-260)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-ink-muted hover:text-ink hover:bg-white/10 text-[0.68rem] sm:text-[0.72rem] font-semibold transition-colors cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="size-3.5" />
            <span>Left</span>
          </button>

          <button
            type="button"
            onClick={handleScrollToToday}
            className="px-2 py-1 rounded-md bg-jade/15 border border-jade/30 text-jade hover:bg-jade/25 text-[0.68rem] sm:text-[0.72rem] font-bold transition-colors cursor-pointer"
            title="Jump to Today"
          >
            Today (27 Sep)
          </button>

          <button
            type="button"
            onClick={() => handleScrollBy(260)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-ink-muted hover:text-ink hover:bg-white/10 text-[0.68rem] sm:text-[0.72rem] font-semibold transition-colors cursor-pointer"
            title="Scroll Right"
          >
            <span>Right</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Scrollbar Track */}
      <div
        ref={topScrollRef}
        onScroll={handleTopScroll}
        className="overflow-x-auto overflow-y-hidden h-2 rounded bg-white/[0.04] border border-white/8 mx-1 scrollbar-thin scrollbar-thumb-jade/40 scrollbar-track-transparent cursor-ew-resize"
      >
        <div style={{ width: `${170 + monthDays.length * 36 + 230}px`, height: "1px" }} />
      </div>

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
                  <th
                    key={day.dayNumber}
                    className={cn(
                      "px-1 py-1.5 text-center min-w-[32px] border-r border-white/5 transition-colors select-none",
                      day.isToday && "bg-jade/15 border-jade/30",
                      day.isWeekend && "bg-white/[0.015] text-ink-faint opacity-60"
                    )}
                  >
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
                  </th>
                ))}

                <th className="px-2 py-2 text-center min-w-[34px] text-jade font-bold border-l border-white/10 bg-night-900/90 text-[0.7rem]">
                  P
                </th>
                <th className="px-2 py-2 text-center min-w-[34px] text-marigold font-bold bg-night-900/90 text-[0.7rem]">
                  L
                </th>
                <th className="px-2 py-2 text-center min-w-[34px] text-rose font-bold bg-night-900/90 text-[0.7rem]">
                  A
                </th>
                <th className="px-2 py-2 text-right min-w-[65px] font-bold text-jade bg-night-900/90 border-l border-white/10 text-[0.7rem]">
                  Month %
                </th>
                <th className="sticky right-0 z-20 bg-night-900/98 backdrop-blur-md px-2.5 py-2 text-right min-w-[70px] font-bold text-ink border-l border-white/10 text-[0.7rem]">
                  Total %
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-mono">
              {filteredRoster.map((st) => {
                const stats = studentStatsMap[st.id];

                return (
                  <tr key={st.id} className="hover:bg-white/[0.035] transition-colors group/row">
                    <td className="sticky left-0 z-10 bg-night-900/98 group-hover/row:bg-night-800/98 backdrop-blur-md px-3 py-1.5 border-r border-white/10 font-sans select-none">
                      <button
                        type="button"
                        onClick={() => onSelectStudentForModal(st)}
                        className="flex items-center gap-2 text-left w-full cursor-pointer hover:text-jade transition-colors"
                        title="Click to view student month breakdown"
                      >
                        <UserAvatar
                          name={st.name}
                          avatar={st.avatar}
                          size="xs"
                          colorScheme="jade"
                        />

                        <div className="min-w-0">
                          <p className="text-[0.72rem] sm:text-xs font-semibold text-ink truncate group-hover/row:text-jade transition-colors">
                            {st.name}
                          </p>
                          <p className="text-[0.62rem] sm:text-[0.68rem] font-mono text-ink-faint truncate">{st.id}</p>
                        </div>
                      </button>
                    </td>

                    {monthDays.map((day) => {
                      const mark = resolveStudentMark(st, currentSection, day, attendanceStore);

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
                            className={cn("px-0.5 py-1 text-center border-r border-white/5", day.isToday && "bg-jade/5")}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                className="size-5 sm:size-6 rounded font-bold text-[0.68rem] text-ink-muted/60 border border-dashed border-white/20 hover:border-jade/60 hover:text-jade hover:bg-jade/10 flex items-center justify-center mx-auto transition-all cursor-pointer"
                                title={`Click to add attendance mark for ${day.dateKey} (${day.weekday})`}
                              >
                                -
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="center"
                                className="w-[130px] rounded-lg border border-white/15 bg-night-900/98 p-1 shadow-2xl backdrop-blur-xl z-50 text-xs"
                              >
                                <div className="px-2 py-1 text-[0.68rem] text-ink-faint border-b border-white/10 mb-1">
                                  {day.dayNumber} {MONTH_NAMES[activeMonth]} ({day.weekday})
                                </div>
                                <DropdownMenuItem
                                  onClick={() => onToggleDayMark(st.id, day.dateKey, "P")}
                                  className="flex items-center gap-2 px-2 py-1 text-jade hover:bg-jade/15 rounded cursor-pointer font-bold text-xs"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                  <span>Present (P)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onToggleDayMark(st.id, day.dateKey, "L")}
                                  className="flex items-center gap-2 px-2 py-1 text-marigold hover:bg-marigold/15 rounded cursor-pointer font-bold text-xs"
                                >
                                  <Clock className="size-3.5" />
                                  <span>Late (L)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onToggleDayMark(st.id, day.dateKey, "A")}
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
                          className={cn("px-0.5 py-1 text-center border-r border-white/5", day.isToday && "bg-jade/5")}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className={cn(
                                "size-5 sm:size-6 rounded font-bold text-[0.68rem] flex items-center justify-center mx-auto transition-all cursor-pointer",
                                mark === "P" && "bg-jade/20 text-jade hover:bg-jade/30 border border-jade/30",
                                mark === "L" && "bg-marigold/20 text-marigold hover:bg-marigold/30 border border-marigold/30",
                                mark === "A" && "bg-rose/20 text-rose hover:bg-rose/30 border border-rose/30"
                              )}
                              title={`${day.dateKey} (${day.weekday}): ${mark}`}
                            >
                              {mark}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="center"
                              className="w-[130px] rounded-lg border border-white/15 bg-night-900/98 p-1 shadow-2xl backdrop-blur-xl z-50 text-xs"
                            >
                              <div className="px-2 py-1 text-[0.68rem] text-ink-faint border-b border-white/10 mb-1">
                                {day.dayNumber} {MONTH_NAMES[activeMonth]} ({day.weekday})
                              </div>
                              <DropdownMenuItem
                                onClick={() => onToggleDayMark(st.id, day.dateKey, "P")}
                                className="flex items-center gap-2 px-2 py-1 text-jade hover:bg-jade/15 rounded cursor-pointer font-bold text-xs"
                              >
                                <CheckCircle2 className="size-3.5" />
                                <span>Present (P)</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onToggleDayMark(st.id, day.dateKey, "L")}
                                className="flex items-center gap-2 px-2 py-1 text-marigold hover:bg-marigold/15 rounded cursor-pointer font-bold text-xs"
                              >
                                <Clock className="size-3.5" />
                                <span>Late (L)</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onToggleDayMark(st.id, day.dateKey, "A")}
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
                    <td className="px-2 py-1.5 text-right font-bold border-l border-white/10 text-[0.7rem]">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[0.68rem] font-bold inline-block",
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
                    <td className="sticky right-0 z-10 bg-night-900/98 group-hover/row:bg-night-800/98 backdrop-blur-md px-2.5 py-1.5 text-right border-l border-white/10">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[0.68rem] sm:text-xs font-bold inline-block",
                          st.att >= 75
                            ? "bg-jade/15 text-jade border border-jade/30"
                            : "bg-rose/15 text-rose border border-rose/30"
                        )}
                        title={`Cumulative all-months semester rate: ${st.att}%`}
                      >
                        {st.att}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
