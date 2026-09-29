"use client";

import React from "react";
import { Award, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { STUDENT_HISTORICAL_TRANSCRIPTS } from "./results-dataset";

interface ResultsStudentTranscriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: { id: string; name: string } | null;
}

export function ResultsStudentTranscriptModal({
  open,
  onOpenChange,
  student,
}: ResultsStudentTranscriptModalProps) {
  const transcripts =
    (student && STUDENT_HISTORICAL_TRANSCRIPTS[student.id]) ||
    STUDENT_HISTORICAL_TRANSCRIPTS["2024-BSC-CSE-1001"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-white/20 bg-night-900/98 p-5 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-2xl max-w-3xl max-h-[85vh] overflow-y-auto text-ink">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                <Award className="size-5 text-jade" />
                Official Academic Transcript
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-muted mt-1">
                Student: <span className="font-bold text-ink">{student?.name}</span> ({student?.id})
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className={cn(
                buttonClass({ variant: "ghost", size: "sm" }),
                "text-xs flex items-center gap-1.5 cursor-pointer"
              )}
            >
              <Printer className="size-3.5 text-jade" />
              <span>Print</span>
            </button>
          </div>
        </DialogHeader>

        {/* Transcript Semesters List */}
        <div className="space-y-4 sm:space-y-5 mt-4">
          {transcripts.map((termData) => (
            <div key={termData.term} className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/8">
                <span className="font-bold text-xs sm:text-sm text-jade">{termData.term}</span>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-ink-faint">Credits: {termData.credits}</span>
                  <span className="font-bold text-ink">Term GPA: {termData.gpa.toFixed(2)}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono min-w-[480px]">
                  <thead>
                    <tr className="text-ink-faint text-[0.68rem] uppercase tracking-wider">
                      <th className="py-1">Course Code</th>
                      <th className="py-1">Course Title</th>
                      <th className="py-1 text-center">Credits</th>
                      <th className="py-1 text-center">Grade</th>
                      <th className="py-1 text-right">Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {termData.courses.map((c) => (
                      <tr key={c.code}>
                        <td className="py-2 text-jade font-bold">{c.code}</td>
                        <td className="py-2 font-sans text-ink">{c.title}</td>
                        <td className="py-2 text-center text-ink-faint">{c.credits.toFixed(1)}</td>
                        <td className="py-2 text-center font-bold text-ink">{c.grade}</td>
                        <td className="py-2 text-right text-ink-muted">{c.point.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-jade/10 border border-jade/30 mt-4">
          <div>
            <p className="text-xs text-ink-faint">Cumulative Standing</p>
            <p className="font-bold text-xs sm:text-sm text-ink">Total Earned Credits: 56.5 / 140 Cr</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-faint">Cumulative CGPA</p>
            <p className="font-display text-lg sm:text-2xl font-bold text-jade">3.85 / 4.00</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
