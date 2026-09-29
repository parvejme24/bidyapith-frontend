"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/site/glass-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { formatTaka } from "@/lib/format";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  Lock,
  Sparkles,
  Unlock,
  User,
} from "lucide-react";
import type { DegreeProgram, SemesterCurriculum } from "@/lib/app-types";
import { useApp } from "@/lib/app-context";
import { SemesterPayModal } from "./semester-pay-modal";

interface SemesterAccordionProps {
  program?: DegreeProgram;
  onUnlockSemester?: (semesterNum: number, method: string) => void;
}

export function SemesterAccordion(props: SemesterAccordionProps) {
  const router = useRouter();
  const { currentProgram: ctxProgram, unlockSemester: ctxUnlockSemester } = useApp();
  const program = props.program || ctxProgram;
  const onUnlockSemester = props.onUnlockSemester || ctxUnlockSemester;

  const [openSemesters, setOpenSemesters] = useState<Record<number, boolean>>({
    1: true,
    5: true, // Open current
  });

  const [paySemester, setPaySemester] = useState<SemesterCurriculum | null>(null);

  if (!program) {
    return null;
  }



  const toggleSemester = (semNum: number) => {
    setOpenSemesters((prev) => ({ ...prev, [semNum]: !prev[semNum] }));
  };

  const totalCredits = program.semesters.reduce((acc, sem) => {
    return acc + sem.courses.reduce((cAcc, c) => cAcc + c.credits, 0);
  }, 0);

  const completedCredits = program.semesters
    .filter((s) => s.status === "completed")
    .reduce((acc, sem) => acc + sem.courses.reduce((cAcc, c) => cAcc + c.credits, 0), 0);

  const completionPct = Math.round((completedCredits / (program.totalCredits || totalCredits || 140)) * 100);

  return (
    <div className="space-y-4">
      {/* Program Header Overview Card */}
      <GlassCard className="p-5 sm:p-6 rounded-2xl border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-jade px-2.5 py-0.5 rounded-md bg-jade/15 border border-jade/30">
              {program.code}
            </span>
            <span className="text-xs font-semibold text-ink-muted">
              {program.degreeType} Program · {program.totalSemesters} Semesters · {program.totalCredits} Credits
            </span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
            {program.title}
          </h2>
          <p className="text-xs text-ink-faint max-w-2xl">{program.description}</p>
        </div>

        {/* Overall Curriculum Progress */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 min-w-[200px] space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-faint">Curriculum Progress:</span>
            <span className="font-mono font-bold text-jade">{completionPct}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7CE9CB] to-[#2ED3A7] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[0.68rem] text-ink-faint font-mono">
            <span>{completedCredits} Cr Completed</span>
            <span>{program.totalCredits} Cr Total</span>
          </div>
        </div>
      </GlassCard>

      {/* Semesters List */}
      <div className="space-y-3">
        {program.semesters.map((sem) => {
          const isOpen = openSemesters[sem.semesterNumber];
          const isCompleted = sem.status === "completed";
          const isCurrent = sem.status === "current";
          const isLocked = sem.status === "locked";
          const semCredits = sem.courses.reduce((acc, c) => acc + c.credits, 0);

          return (
            <GlassCard
              key={sem.semesterNumber}
              className={cn(
                "p-0 rounded-xl overflow-hidden border transition-all",
                isCurrent
                  ? "border-jade/40 bg-jade/[0.03] shadow-md ring-1 ring-jade/20"
                  : isCompleted
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-white/8 bg-white/[0.015] opacity-75 hover:opacity-100"
              )}
            >
              {/* Semester Accordion Header */}
              <div
                onClick={() => toggleSemester(sem.semesterNumber)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-8 sm:size-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border",
                      isCompleted
                        ? "bg-jade/20 border-jade/40 text-jade"
                        : isCurrent
                        ? "bg-marigold/20 border-marigold/40 text-marigold"
                        : "bg-white/5 border-white/10 text-ink-muted"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="size-4" /> : isCurrent ? "NOW" : <Lock className="size-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-sm sm:text-base font-bold text-ink">
                        {sem.title}
                      </h3>
                      {sem.termName && (
                        <span className="text-[0.68rem] px-2 py-0.5 rounded bg-white/5 font-mono text-ink-muted border border-white/8">
                          {sem.termName}
                        </span>
                      )}
                      <StatusPill tone={isCompleted ? "ok" : isCurrent ? "warn" : "mute"}>
                        {isCompleted ? "COMPLETED" : isCurrent ? "CURRENT ACTIVE" : "LOCKED"}
                      </StatusPill>
                    </div>
                    <p className="text-xs text-ink-faint mt-0.5 font-mono">
                      {sem.courses.length} Courses · {semCredits} Credits · Tuition: {formatTaka(sem.tuitionFee)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isLocked && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/student/checkout?semester=${sem.semesterNumber}&amount=${sem.tuitionFee}&title=${encodeURIComponent(sem.title)}`
                        );
                      }}
                      className={cn(
                        buttonClass({ variant: "primary", size: "sm" }),
                        "text-xs px-3.5 flex items-center gap-1.5 shadow-sm cursor-pointer bg-jade text-night-900 font-bold hover:bg-jade/90"
                      )}
                    >
                      <Unlock className="size-3.5" />
                      <span>Unlock ({formatTaka(sem.tuitionFee)})</span>
                    </button>
                  )}

                  <div className="p-1 text-ink-muted">
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </div>
              </div>

              {/* Semester Courses Table Breakdown */}
              {isOpen && (
                <div className="border-t border-white/8 bg-black/20 p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[580px]">
                    <thead>
                      <tr className="border-b border-white/10 text-ink-faint uppercase tracking-wider font-semibold text-[0.68rem]">
                        <th className="pb-2 px-2">Course Code</th>
                        <th className="pb-2 px-2">Subject Title</th>
                        <th className="pb-2 px-2">Credits</th>
                        <th className="pb-2 px-2">Type</th>
                        <th className="pb-2 px-2">Faculty Instructor</th>
                        <th className="pb-2 px-2 text-right">Schedule / Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sem.courses.map((course) => (
                        <tr key={course.code} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 px-2 font-mono font-bold text-jade">
                            {course.code}
                          </td>
                          <td className="py-2.5 px-2 font-semibold text-ink">
                            <span>{course.title}</span>
                            {course.prereq && (
                              <span className="block text-[0.65rem] text-marigold font-mono">
                                Prereq: {course.prereq}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-ink-faint">
                            {course.credits} Cr
                          </td>
                          <td className="py-2.5 px-2">
                            <span
                              className={cn(
                                "text-[0.65rem] font-bold px-1.5 py-0.5 rounded uppercase",
                                course.type === "Core"
                                  ? "bg-jade/15 text-jade"
                                  : course.type === "Lab"
                                  ? "bg-sky-400/15 text-sky-400"
                                  : course.type === "Thesis"
                                  ? "bg-orchid/15 text-orchid"
                                  : "bg-white/10 text-ink-muted"
                              )}
                            >
                              {course.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-ink-muted">
                            {course.instructor || "Department Faculty"}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-ink-faint">
                            {course.room ? `${course.room} · ${course.schedule || "TBA"}` : "Scheduled by Office"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Pay & Unlock Semester Modal */}
      {paySemester && (
        <SemesterPayModal
          isOpen={!!paySemester}
          onClose={() => setPaySemester(null)}
          semester={paySemester}
          programTitle={program.title}
          onUnlock={onUnlockSemester}
        />
      )}
    </div>
  );
}
