"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka } from "@/lib/format";
import type { DegreeProgram, SemesterCurriculum } from "@/lib/app-types";

interface OrderSummaryProps {
  semesterNum: number;
  titleParam?: string | null;
  targetSemester?: SemesterCurriculum;
  currentProgram: DegreeProgram | null;
  userName: string;
  userId: string;
  termName: string;
  baseTuition: number;
  labFee: number;
  examFee: number;
  totalPayable: number;
}

export function OrderSummary({
  semesterNum,
  titleParam,
  targetSemester,
  currentProgram,
  userName,
  userId,
  termName,
  baseTuition,
  labFee,
  examFee,
  totalPayable,
}: OrderSummaryProps) {
  return (
    <GlassCard className="p-6 space-y-5">
      <div className="border-b border-white/10 pb-4">
        <span className="text-[0.68rem] uppercase tracking-wider font-mono font-bold text-jade">
          Step 1 of 2
        </span>
        <h3 className="font-display text-xl font-bold text-ink mt-0.5">
          Semester {semesterNum} Tuition Invoice
        </h3>
        <p className="text-xs text-ink-faint mt-0.5">
          {titleParam || targetSemester?.title || `${currentProgram?.name || "B.Sc. in CSE"}`}
        </p>
      </div>

      {/* Student Metadata Box */}
      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 text-xs space-y-2 font-mono">
        <div className="flex justify-between">
          <span className="text-ink-faint">Student:</span>
          <span className="font-bold text-ink font-sans">{userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-faint">Student ID:</span>
          <span className="text-jade font-bold">{userId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-faint">Degree Program:</span>
          <span className="text-ink font-sans">{currentProgram?.code || "BSC-CSE"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-faint">Academic Term:</span>
          <span className="text-ink font-sans">{termName}</span>
        </div>
      </div>

      {/* Course items breakdown preview */}
      {targetSemester && targetSemester.courses.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-ink-muted font-semibold">
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-jade" />
              <span>Curriculum Subjects ({targetSemester.courses.length})</span>
            </span>
            <span className="font-mono text-ink">
              {targetSemester.courses.reduce((s, c) => s + c.credits, 0)} Credits
            </span>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1.5 divide-y divide-white/5 pr-1">
            {targetSemester.courses.map((c) => (
              <div key={c.code} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <span className="font-mono text-jade font-bold text-[0.72rem] mr-1.5">{c.code}</span>
                  <span className="text-ink-muted text-[0.75rem] truncate">{c.title}</span>
                </div>
                <span className="text-ink-faint font-mono text-[0.68rem] shrink-0">{c.credits} cr</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transparent Fee Breakdown */}
      <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
        <div className="flex justify-between text-ink-muted">
          <span>Semester Core Tuition</span>
          <span className="font-mono text-ink font-semibold">{formatTaka(baseTuition - 3000)}</span>
        </div>
        <div className="flex justify-between text-ink-muted">
          <span>Laboratory & Computing Cloud</span>
          <span className="font-mono text-ink font-semibold">{formatTaka(labFee)}</span>
        </div>
        <div className="flex justify-between text-ink-muted">
          <span>Examination & Digital Registry Fee</span>
          <span className="font-mono text-ink font-semibold">{formatTaka(examFee)}</span>
        </div>

        <div className="border-t border-white/15 pt-3 flex justify-between items-baseline">
          <div>
            <span className="font-display text-base font-bold text-ink block">Total Payable</span>
            <span className="text-[0.68rem] text-ink-faint">Institutional VAT & Tech fees inclusive</span>
          </div>
          <span className="font-display text-2xl font-extrabold text-jade font-mono">
            {formatTaka(totalPayable)}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
