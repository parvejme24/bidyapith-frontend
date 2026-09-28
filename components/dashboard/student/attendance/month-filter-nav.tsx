"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  ArrowUpDown,
} from "lucide-react";
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
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el || orientation === "vertical") {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [orientation, months]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = 180;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 200);
  };

  // Convert vertical mouse wheel scroll to horizontal scroll when in horizontal mode
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (orientation === "horizontal" && scrollRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollRef.current.scrollLeft += e.deltaY;
        checkScroll();
      }
    }
  };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
  };

  return (
    <div className="flex items-center gap-1.5 w-full lg:w-auto">
      {/* Scroll Left Button (in horizontal mode) */}
      {orientation === "horizontal" && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          title="Scroll Left"
          className={`p-1.5 rounded-md border text-ink-faint transition-all shrink-0 ${
            canScrollLeft
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-sm"
              : "opacity-30 border-white/5 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Main Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onWheel={handleWheel}
        className={`transition-all duration-300 ${
          orientation === "horizontal"
            ? "overflow-x-auto scrollbar-none py-0.5 flex items-center gap-1.5 max-w-full"
            : "flex flex-col gap-1.5 w-full p-2 bg-white/[0.02] border border-white/10 rounded-lg max-h-60 overflow-y-auto"
        }`}
      >
        <div
          className={`bg-white/[0.03] border border-white/10 rounded-lg p-1.5 ${
            orientation === "horizontal"
              ? "inline-flex items-center gap-1.5 shrink-0"
              : "flex flex-col gap-1.5 w-full border-0 p-0 bg-transparent"
          }`}
        >
          {/* All Months Option */}
          <button
            type="button"
            onClick={() => onSelectMonth(0)}
            className={`flex items-center justify-between gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
              selectedMonthIndex === 0
                ? "bg-jade text-ink-base shadow-sm font-bold"
                : "text-ink hover:text-white hover:bg-white/[0.05]"
            } ${orientation === "vertical" ? "w-full text-left" : ""}`}
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>All Months</span>
              <span className="hidden md:inline font-normal opacity-80">(Full Term)</span>
            </div>
          </button>

          {/* Individual Month Pills */}
          {months.map((m) => {
            const isSelected = selectedMonthIndex === m.monthIndex;

            return (
              <button
                key={m.monthIndex}
                type="button"
                onClick={() => onSelectMonth(m.monthIndex)}
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? "bg-white/15 text-white border border-white/20 font-bold shadow-sm"
                    : "text-ink-faint hover:text-ink hover:bg-white/[0.04]"
                } ${orientation === "vertical" ? "w-full" : ""}`}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                  <span>
                    <span className="sm:hidden">M{m.monthIndex}</span>
                    <span className="hidden sm:inline">Month {m.monthIndex}</span>{" "}
                    <span className="font-mono text-[11px] opacity-75">({m.monthName})</span>
                  </span>
                </div>

                {!isLockedSemester && m.totalHeld > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
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

      {/* Scroll Right Button (in horizontal mode) */}
      {orientation === "horizontal" && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          title="Scroll Right"
          className={`p-1.5 rounded-md border text-ink-faint transition-all shrink-0 ${
            canScrollRight
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-sm"
              : "opacity-30 border-white/5 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Toggle Orientation Button (Horizontal <-> Vertical Reverse) */}
      <button
        type="button"
        onClick={toggleOrientation}
        title={
          orientation === "horizontal"
            ? "Switch to Vertical Stack View"
            : "Switch to Horizontal Row View"
        }
        className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-ink-faint hover:text-white transition-all shrink-0 flex items-center gap-1 text-[11px] font-mono ml-0.5"
      >
        {orientation === "horizontal" ? (
          <>
            <ArrowUpDown className="w-3.5 h-3.5 text-jade" />
            <span className="hidden xl:inline text-[10px] font-sans">Vertical</span>
          </>
        ) : (
          <>
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline text-[10px] font-sans">Horizontal</span>
          </>
        )}
      </button>
    </div>
  );
}
