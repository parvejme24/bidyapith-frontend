"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";

interface MonthlyMatrixPanControlsProps {
  onScrollBy: (amount: number) => void;
  onScrollToToday: () => void;
  topScrollRef: React.RefObject<HTMLDivElement | null>;
  onTopScroll: () => void;
  totalWidth: number;
}

export function MonthlyMatrixPanControls({
  onScrollBy,
  onScrollToToday,
  topScrollRef,
  onTopScroll,
  totalWidth,
}: MonthlyMatrixPanControlsProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 text-xs">
        <div className="flex items-center gap-2 text-ink-muted">
          <MoveHorizontal className="size-3.5 text-jade shrink-0" />
          <span className="font-semibold text-ink text-[0.72rem]">Horizontal Pan:</span>
          <span className="text-[0.68rem] text-ink-faint hidden sm:inline">
            Drag or click day headers to adjust schedule (Special Class / Holiday)
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onScrollBy(-260)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-ink-muted hover:text-ink hover:bg-white/10 text-[0.68rem] sm:text-[0.72rem] font-semibold transition-colors cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="size-3.5" />
            <span>Left</span>
          </button>

          <button
            type="button"
            onClick={onScrollToToday}
            className="px-2 py-1 rounded-md bg-jade/15 border border-jade/30 text-jade hover:bg-jade/25 text-[0.68rem] sm:text-[0.72rem] font-bold transition-colors cursor-pointer"
            title="Jump to Today"
          >
            Today (27 Sep)
          </button>

          <button
            type="button"
            onClick={() => onScrollBy(260)}
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
        onScroll={onTopScroll}
        className="overflow-x-auto overflow-y-hidden h-2 rounded bg-white/[0.04] border border-white/8 mx-1 scrollbar-thin scrollbar-thumb-jade/40 scrollbar-track-transparent cursor-ew-resize"
      >
        <div style={{ width: `${totalWidth}px`, height: "1px" }} />
      </div>
    </>
  );
}
