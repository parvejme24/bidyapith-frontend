"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Calendar, Layers, ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, months]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 220);
  };

  // Convert vertical mouse wheel to horizontal scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollRef.current.scrollLeft += e.deltaY;
        checkScroll();
      }
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    if (Math.abs(walk) > 4) {
      setIsDragging(true);
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleItemClick = (monthIdx: number) => {
    if (isDragging) return; // Prevent selection when user was dragging
    onSelectMonth(monthIdx);
  };

  return (
    <div className="flex items-center gap-1.5 w-full lg:w-auto select-none">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        title="Scroll Left"
        className={`p-1.5 rounded-md border text-ink-faint transition-all shrink-0 ${
          canScrollLeft
            ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-sm cursor-pointer"
            : "opacity-25 border-white/5 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontal Mouse Drag Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`overflow-x-auto scrollbar-none py-1 flex items-center max-w-full cursor-grab active:cursor-grabbing transition-colors ${
          isMouseDown ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-white/[0.03] border border-white/10 rounded-lg shrink-0">
          {/* All Months Option */}
          <button
            type="button"
            onClick={() => handleItemClick(0)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 select-none ${
              selectedMonthIndex === 0
                ? "bg-jade text-[#06121E] shadow-md font-extrabold ring-1 ring-white/20"
                : "text-ink-faint hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Layers
              className={`w-3.5 h-3.5 shrink-0 pointer-events-none ${
                selectedMonthIndex === 0 ? "text-[#06121E]" : "text-ink-faint"
              }`}
            />
            <span className={selectedMonthIndex === 0 ? "text-[#06121E] font-bold" : ""}>
              All Months
            </span>
            <span
              className={`hidden md:inline text-[11px] ${
                selectedMonthIndex === 0 ? "text-[#06121E]/80 font-semibold" : "text-ink-faint/70 font-normal"
              }`}
            >
              (Full Term)
            </span>
          </button>

          {/* Individual Month Pills */}
          {months.map((m) => {
            const isSelected = selectedMonthIndex === m.monthIndex;

            return (
              <button
                key={m.monthIndex}
                type="button"
                onClick={() => handleItemClick(m.monthIndex)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs whitespace-nowrap transition-all duration-200 shrink-0 select-none ${
                  isSelected
                    ? "bg-white/15 text-white border border-white/20 font-bold shadow-sm"
                    : "text-ink-faint hover:text-ink hover:bg-white/[0.04]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-ink-faint shrink-0 pointer-events-none" />
                <span>
                  <span className="sm:hidden">M{m.monthIndex}</span>
                  <span className="hidden sm:inline">Month {m.monthIndex}</span>{" "}
                  <span className="font-mono text-[11px] opacity-75">({m.monthName})</span>
                </span>

                {!isLockedSemester && m.totalHeld > 0 && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 pointer-events-none ${
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

      {/* Scroll Right Button */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        title="Scroll Right"
        className={`p-1.5 rounded-md border text-ink-faint transition-all shrink-0 ${
          canScrollRight
            ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-sm cursor-pointer"
            : "opacity-25 border-white/5 cursor-not-allowed"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
