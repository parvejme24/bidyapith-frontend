"use client";

import React from "react";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import type { SemesterResultRecord } from "./results-types";

interface SemesterResultsTabsProps {
  results: SemesterResultRecord[];
  selectedSemesterNum: number;
  onSelectSemester: (semNum: number) => void;
}

export function SemesterResultsTabs({
  results,
  selectedSemesterNum,
  onSelectSemester,
}: SemesterResultsTabsProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-ink-faint">
            Academic Semesters
          </span>
          <span className="text-[11px] text-ink-faint/80 font-mono">
            ({results.length} Semesters Total)
          </span>
        </div>
        <span className="text-[11px] text-jade/90 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-jade shrink-0" /> Select any semester to view official grade sheet
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {results.map((r) => {
          const isSelected = r.semesterNumber === selectedSemesterNum;
          const isCompleted = r.status === "completed";
          const isCurrent = r.status === "current";
          const isLocked = r.status === "locked";

          return (
            <button
              key={r.semesterNumber}
              type="button"
              onClick={() => onSelectSemester(r.semesterNumber)}
              className={`relative flex flex-col items-start p-2.5 rounded-md border text-left transition-all duration-200 group ${
                isSelected
                  ? "bg-jade/[0.14] border-jade shadow-[0_0_14px_rgba(46,211,167,0.18)] ring-1 ring-jade"
                  : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
              }`}
            >
              {/* Top Row: Number & Status Icon */}
              <div className="w-full flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold font-mono tracking-tight ${
                    isSelected ? "text-jade" : "text-ink"
                  }`}
                >
                  Sem {r.semesterNumber}
                </span>

                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-jade shrink-0" />
                )}
                {isCurrent && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-marigold"></span>
                  </span>
                )}
                {isLocked && (
                  <Lock className="w-3 h-3 text-ink-faint/60 shrink-0" />
                )}
              </div>

              {/* Status or GPA Badge */}
              <div className="w-full flex items-center justify-between mt-0.5">
                {isCompleted && (
                  <span className="text-[11px] font-mono font-bold text-jade">
                    GPA {r.gpa.toFixed(2)}
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] text-marigold font-semibold">Active Term</span>
                )}
                {isLocked && (
                  <span className="text-[10px] text-ink-faint/70 font-medium">Upcoming</span>
                )}
              </div>

              {/* Course count */}
              <div className="mt-1 text-[10px] text-ink-faint font-mono">
                {r.courses.length} Courses · {r.totalCredits} Cr
              </div>

              {isSelected && (
                <div className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-jade rounded-full shadow-[0_0_8px_#2ED3A7]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
