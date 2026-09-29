"use client";

import React from "react";
import type { ColumnDef } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { getInitials } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";
import type { StudentGradeRecord } from "./results-types";

interface GetResultsColumnsOptions {
  onInspectTranscript: (studentId: string, studentName: string) => void;
}

export function getResultsColumns({
  onInspectTranscript,
}: GetResultsColumnsOptions): ColumnDef<StudentGradeRecord>[] {
  return [
    {
      key: "studentName",
      label: "Student Profile",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <span className="size-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620] font-display text-[0.65rem] font-bold shrink-0">
            {getInitials(r.studentName)}
          </span>
          <div>
            <p className="font-semibold text-ink leading-tight">{r.studentName}</p>
            <p className="text-[0.72rem] text-ink-faint font-mono">{r.studentId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "courseCode",
      label: "Course & Section",
      sortable: true,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-jade">{r.courseCode}</span>
            <span className="text-[0.72rem] text-ink-faint">Sec {r.section}</span>
          </div>
          <p className="text-[0.72rem] text-ink-muted truncate max-w-[160px]">{r.courseTitle}</p>
        </div>
      ),
    },
    {
      key: "instructorName",
      label: "Instructor",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-ink-muted">{r.instructorName}</span>
      ),
    },
    {
      key: "midterm",
      label: "Mid /30",
      className: "text-center",
      render: (r) => <span className="font-mono text-xs text-ink">{r.midterm}</span>,
    },
    {
      key: "assignment",
      label: "Assign /20",
      className: "text-center",
      render: (r) => <span className="font-mono text-xs text-ink">{r.assignment}</span>,
    },
    {
      key: "finalExam",
      label: "Final /50",
      className: "text-center",
      render: (r) => <span className="font-mono text-xs text-ink">{r.finalExam}</span>,
    },
    {
      key: "total",
      label: "Total /100",
      className: "text-center",
      sortable: true,
      render: (r) => <span className="font-mono text-xs font-bold text-ink">{r.total}</span>,
    },
    {
      key: "letterGrade",
      label: "Letter Grade",
      sortable: true,
      render: (r) => (
        <StatusPill tone={r.gradePoint >= 3.7 ? "ok" : r.gradePoint >= 3.0 ? "info" : "warn"}>
          {r.letterGrade} ({r.gradePoint.toFixed(2)})
        </StatusPill>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <span
          className={cn(
            "text-[0.68rem] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
            r.status === "published"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          )}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r) => (
        <button
          type="button"
          onClick={() => onInspectTranscript(r.studentId, r.studentName)}
          className={cn(
            buttonClass({ variant: "ghost", size: "sm" }),
            "h-7 px-2.5 text-xs text-jade hover:border-jade/40 cursor-pointer inline-flex items-center gap-1"
          )}
          title="Inspect full academic transcript"
        >
          <Award className="size-3.5" />
          <span className="hidden sm:inline">Transcript</span>
        </button>
      ),
    },
  ];
}
