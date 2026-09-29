"use client";

import React from "react";
import { BookOpen, CheckCircle2, Clock, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdmissionFilterTabsProps {
  statusFilter: "ALL" | "PENDING_REVIEW" | "APPROVED" | "ENROLLED" | "REJECTED";
  onStatusFilterChange: (f: "ALL" | "PENDING_REVIEW" | "APPROVED" | "ENROLLED" | "REJECTED") => void;
  typeFilter: "ALL" | "COURSE_REGISTRATION" | "DEGREE_ADMISSION";
  onTypeFilterChange: (t: "ALL" | "COURSE_REGISTRATION" | "DEGREE_ADMISSION") => void;
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  enrolledCount: number;
  courseAppsCount: number;
}

export function AdmissionFilterTabs({
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  totalCount,
  pendingCount,
  approvedCount,
  enrolledCount,
  courseAppsCount,
}: AdmissionFilterTabsProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => onStatusFilterChange("ALL")}
          className={cn(
            "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
            statusFilter === "ALL" ? "bg-white/10 text-ink shadow-xs" : "text-ink-muted hover:text-ink"
          )}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("PENDING_REVIEW")}
          className={cn(
            "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
            statusFilter === "PENDING_REVIEW" ? "bg-amber-400/20 text-amber-300 font-bold" : "text-ink-muted hover:text-ink"
          )}
        >
          <Clock className="size-3 text-amber-400" />
          <span>Pending Review ({pendingCount})</span>
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("APPROVED")}
          className={cn(
            "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
            statusFilter === "APPROVED" ? "bg-jade/20 text-jade font-bold" : "text-ink-muted hover:text-ink"
          )}
        >
          <CheckCircle2 className="size-3 text-jade" />
          <span>Approved ({approvedCount})</span>
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("ENROLLED")}
          className={cn(
            "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
            statusFilter === "ENROLLED" ? "bg-sky-400/20 text-sky-300 font-bold" : "text-ink-muted hover:text-ink"
          )}
        >
          <Sparkles className="size-3 text-sky-400" />
          <span>Enrolled ({enrolledCount})</span>
        </button>
      </div>

      {/* Application Type Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => onTypeFilterChange("ALL")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
            typeFilter === "ALL" ? "bg-white/10 text-ink" : "text-ink-faint hover:text-ink"
          )}
        >
          All Types
        </button>
        <button
          type="button"
          onClick={() => onTypeFilterChange("COURSE_REGISTRATION")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1",
            typeFilter === "COURSE_REGISTRATION" ? "bg-jade/20 text-jade font-bold" : "text-ink-faint hover:text-ink"
          )}
        >
          <BookOpen className="size-3" />
          <span>Course Registrations ({courseAppsCount})</span>
        </button>
        <button
          type="button"
          onClick={() => onTypeFilterChange("DEGREE_ADMISSION")}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1",
            typeFilter === "DEGREE_ADMISSION" ? "bg-purple-500/20 text-purple-300 font-bold" : "text-ink-faint hover:text-ink"
          )}
        >
          <GraduationCap className="size-3" />
          <span>Degree Admissions</span>
        </button>
      </div>
    </div>
  );
}
