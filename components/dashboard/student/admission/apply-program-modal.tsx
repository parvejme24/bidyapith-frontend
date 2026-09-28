"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import type { AdmissionApplication, DegreeProgram } from "@/lib/app-types";
import { useApp } from "@/lib/app-context";

interface ApplyProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs?: DegreeProgram[];
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  onSubmit?: (data: Omit<AdmissionApplication, "id" | "status" | "submittedAt" | "isPaid">) => void;
}

export function ApplyProgramModal(props: ApplyProgramModalProps) {
  const { programs: ctxPrograms, user, submitAdmissionApplication } = useApp();

  const {
    isOpen,
    onClose,
    programs = ctxPrograms,
    studentName = user.name,
    studentEmail = user.email,
    studentPhone = user.phone || "+880 1712 445566",
    onSubmit = submitAdmissionApplication,
  } = props;

  const [selectedProgId, setSelectedProgId] = useState<string>(programs[0]?.id || "prog-bsc-cse");
  const [degreeTier, setDegreeTier] = useState<"all" | "B.Sc." | "M.Sc.">("all");
  const [previousDegree, setPreviousDegree] = useState("Higher Secondary Certificate (HSC) Science");
  const [previousCgpa, setPreviousCgpa] = useState("5.00 / 5.00");
  const [phone, setPhone] = useState(studentPhone || "+880 1712 445566");
  const [notes, setNotes] = useState("");


  const selectedProg = programs.find((p) => p.id === selectedProgId) || programs[0];

  const filteredPrograms = programs.filter((p) => {
    if (degreeTier === "all") return true;
    return p.degreeType === degreeTier;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProg) return;

    onSubmit({
      studentName,
      email: studentEmail,
      phone,
      programId: selectedProg.id,
      programTitle: selectedProg.title,
      degreeType: selectedProg.degreeType === "M.Sc." ? "M.Sc." : "B.Sc.",
      previousDegree,
      previousCgpa,
      admissionFee: selectedProg.admissionFee,
      notes,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[94vw] p-0 overflow-hidden rounded-xl border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink max-h-[90vh] flex flex-col">
        <DialogHeader className="p-5 pb-3 border-b border-white/10 bg-white/[0.03] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-jade/15 border border-jade/30 flex items-center justify-center text-jade">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-base sm:text-lg font-bold text-ink">
                Degree Program Admission Application
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-faint">
                Select your academic degree program (B.Sc. or M.Sc.) for enrollment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 grow">
          {/* Degree Tier Filter: All vs B.Sc. vs M.Sc. */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-faint">Filter by Degree:</span>
            <div className="flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setDegreeTier("all")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors cursor-pointer",
                  degreeTier === "all" ? "bg-white/15 text-ink font-bold" : "text-ink-muted hover:text-ink"
                )}
              >
                All Programs ({programs.length})
              </button>
              <button
                type="button"
                onClick={() => setDegreeTier("B.Sc.")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors cursor-pointer",
                  degreeTier === "B.Sc." ? "bg-jade/20 text-jade font-bold" : "text-ink-muted hover:text-ink"
                )}
              >
                Undergraduate (B.Sc. / BBA)
              </button>
              <button
                type="button"
                onClick={() => setDegreeTier("M.Sc.")}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors cursor-pointer",
                  degreeTier === "M.Sc." ? "bg-orchid/20 text-orchid font-bold" : "text-ink-muted hover:text-ink"
                )}
              >
                Graduate (M.Sc.)
              </button>
            </div>
          </div>

          {/* Program Selection Grid */}
          <div className="grid gap-2.5">
            {filteredPrograms.map((prog) => {
              const isSelected = selectedProgId === prog.id;
              return (
                <div
                  key={prog.id}
                  onClick={() => setSelectedProgId(prog.id)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3",
                    isSelected
                      ? "border-jade bg-jade/[0.08] shadow-md ring-1 ring-jade/30"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  )}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-jade">{prog.code}</span>
                      <span className="text-[0.68rem] px-2 py-0.5 rounded bg-white/5 font-semibold text-ink-muted border border-white/10">
                        {prog.degreeType} · {prog.totalSemesters} Semesters ({prog.totalCredits} Credits)
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-ink truncate">{prog.title}</h4>
                    <p className="text-[0.72rem] text-ink-faint line-clamp-2">{prog.description}</p>
                    <div className="flex items-center gap-4 text-xs font-mono text-ink-muted pt-1">
                      <span>Admission: <b className="text-ink">{formatTaka(prog.admissionFee)}</b></span>
                      <span>Tuition: <b className="text-ink">{formatTaka(prog.semesterTuition)}/sem</b></span>
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center transition-colors",
                        isSelected ? "border-jade bg-jade text-night-900" : "border-white/20"
                      )}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Academic Background Form */}
          <GlassCard className="p-4 rounded-xl space-y-3 border-white/10 bg-white/[0.02]">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Previous Academic Credentials
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <label className="block space-y-1">
                <span className="text-ink-muted font-medium">Previous Degree / Qualification *</span>
                <input
                  type="text"
                  value={previousDegree}
                  onChange={(e) => setPreviousDegree(e.target.value)}
                  placeholder="e.g. HSC Science / B.Sc. in CSE"
                  className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-ink focus:border-jade outline-none"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-ink-muted font-medium">Previous CGPA / GPA Result *</span>
                <input
                  type="text"
                  value={previousCgpa}
                  onChange={(e) => setPreviousCgpa(e.target.value)}
                  placeholder="e.g. 5.00 / 5.00 or 3.80 / 4.00"
                  className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-ink focus:border-jade outline-none"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-ink-muted font-medium">Contact Phone *</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-ink focus:border-jade outline-none font-mono"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-ink-muted font-medium">Additional Academic Notes</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Specialization interest, scholarships"
                  className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-ink focus:border-jade outline-none"
                />
              </label>
            </div>
          </GlassCard>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10 shrink-0">
            <span className="text-[0.68rem] text-ink-faint">
              Application submitted to University Admissions Office for review
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={cn(
                  buttonClass({ variant: "primary", size: "sm" }),
                  "text-xs px-5 shadow-md cursor-pointer"
                )}
              >
                Submit Application
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
