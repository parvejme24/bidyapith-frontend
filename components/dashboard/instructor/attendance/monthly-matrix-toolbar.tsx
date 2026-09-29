"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { Search, Sparkles, Umbrella } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyMatrixToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: "all" | "atRisk" | "good";
  onStatusFilterChange: (f: "all" | "atRisk" | "good") => void;
  totalStudents: number;
  atRiskCount: number;
}

export function MonthlyMatrixToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalStudents,
  atRiskCount,
}: MonthlyMatrixToolbarProps) {
  return (
    <GlassCard className="p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 grow">
        <div className="relative w-full sm:w-56">
          <Search className="size-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-white/15 bg-white/[0.04] text-xs text-ink placeholder:text-ink-faint focus:border-jade/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-md bg-white/[0.04] border border-white/10 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            className={cn(
              "px-2 py-1 rounded text-[0.68rem] sm:text-xs font-medium transition-colors cursor-pointer grow sm:grow-0 text-center",
              statusFilter === "all"
                ? "bg-white/15 text-ink font-semibold"
                : "text-ink-muted hover:text-ink"
            )}
          >
            All ({totalStudents})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("atRisk")}
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
            onClick={() => onStatusFilterChange("good")}
            className={cn(
              "px-2 py-1 rounded text-[0.68rem] sm:text-xs font-medium transition-colors cursor-pointer grow sm:grow-0 text-center",
              statusFilter === "good"
                ? "bg-jade/20 text-jade font-semibold"
                : "text-ink-muted hover:text-ink"
            )}
          >
            Good ({totalStudents - atRiskCount})
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[0.68rem] text-ink-muted">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-jade inline-block" /> P (1.0)
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-marigold inline-block" /> L (0.5)
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-rose inline-block" /> A (0)
        </span>
        <span className="flex items-center gap-1 text-amber-400 font-medium">
          <Sparkles className="size-3 text-amber-400" /> Makeup
        </span>
        <span className="flex items-center gap-1 text-purple-300 font-medium">
          <Umbrella className="size-3 text-purple-300" /> Holiday (Excused)
        </span>
        <span className="flex items-center gap-1 text-ink-faint">
          <span className="size-2 rounded-full bg-white/20 inline-block" /> Off
        </span>
      </div>
    </GlassCard>
  );
}
