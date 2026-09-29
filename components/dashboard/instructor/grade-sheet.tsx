"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardIcon } from "@/components/dashboard/icons";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { computeGrade, getInitials } from "@/lib/app-data";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Lock,
  Plus,
  Save,
  Search,
  Send,
  Unlock,
  UserPlus,
  Users,
  Wand2,
} from "lucide-react";

interface GradeRecord {
  mid: number | null;
  assign: number | null;
  final: number | null;
}

interface SectionStudent extends RosterStudent {
  sectionId?: string;
}

interface GradeSheetProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSubmit: (sectionId: string) => void;
}

export function GradeSheet({ sections, roster, onSubmit }: GradeSheetProps) {
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New Student Form State
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  // Section-wise custom students store
  const [sectionStudents, setSectionStudents] = useState<Record<string, SectionStudent[]>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bidyapith_section_students");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return {};
  });

  // Load persistent marks store from localStorage
  const [marksStore, setMarksStore] = useState<Record<string, Record<string, GradeRecord>>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bidyapith_grade_marks_store");
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return {};
  });

  // Current section marks
  const [currentMarks, setCurrentMarks] = useState<Record<string, GradeRecord>>({});

  const currentSection = sections.find((s) => s.id === selectedSec) || sections[0];

  // Active students in current section
  const currentStudents: SectionStudent[] = useMemo(() => {
    const customList = sectionStudents[selectedSec];
    if (customList && customList.length > 0) {
      return customList;
    }
    // Default from roster
    return roster.map((st, idx) => ({
      ...st,
      sectionId: selectedSec,
      // Distribute variations for different sections
      mid: st.mid ?? (20 + (idx % 10)),
      assign: st.assign ?? (15 + (idx % 5)),
    }));
  }, [selectedSec, sectionStudents, roster]);

  // Sync marks when section changes or store updates
  useEffect(() => {
    const saved = marksStore[selectedSec];
    if (saved && Object.keys(saved).length > 0) {
      setCurrentMarks(saved);
    } else {
      const initial: Record<string, GradeRecord> = {};
      currentStudents.forEach((st) => {
        initial[st.id] = {
          mid: st.mid ?? 24,
          assign: st.assign ?? 18,
          final: st.id.endsWith("1") ? 42 : st.id.endsWith("4") ? 46 : st.id.endsWith("8") ? 38 : null,
        };
      });
      setCurrentMarks(initial);
    }
  }, [selectedSec, marksStore, currentStudents]);

  const handleMarkChange = (
    studentId: string,
    field: "mid" | "assign" | "final",
    valStr: string,
    maxVal: number
  ) => {
    if (valStr === "") {
      setCurrentMarks((prev) => ({
        ...prev,
        [studentId]: { ...(prev[studentId] || { mid: null, assign: null, final: null }), [field]: null },
      }));
      return;
    }
    const val = Number(valStr);
    if (!isNaN(val) && val >= 0 && val <= maxVal) {
      setCurrentMarks((prev) => ({
        ...prev,
        [studentId]: { ...(prev[studentId] || { mid: null, assign: null, final: null }), [field]: val },
      }));
    }
  };

  const handleSaveDraft = () => {
    const updated = { ...marksStore, [selectedSec]: currentMarks };
    setMarksStore(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bidyapith_grade_marks_store", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    toast.success(`Grades saved as draft for ${currentSection?.code || "Course"} (${currentSection?.section || "A"})`);
  };

  const handleConfirmSubmit = () => {
    handleSaveDraft();
    setIsLocked(true);
    setConfirmModalOpen(false);
    onSubmit(selectedSec);
    toast.success(`Grade sheet officially submitted to Registrar for ${currentSection?.code}`);
  };

  // Add a new student to this section roster
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim() || !newStudentName.trim()) {
      toast.error("Please enter valid Student ID and Name");
      return;
    }

    const newStudent: SectionStudent = {
      id: newStudentId.trim(),
      name: newStudentName.trim(),
      prog: "B.Sc. in CSE",
      mid: 25,
      assign: 18,
      final: null,
      att: 100,
      sectionId: selectedSec,
    };

    const updatedList = [newStudent, ...currentStudents];
    const updatedSectionsMap = { ...sectionStudents, [selectedSec]: updatedList };
    setSectionStudents(updatedSectionsMap);

    // Also initialize marks
    const updatedMarks = {
      ...currentMarks,
      [newStudent.id]: { mid: 25, assign: 18, final: null },
    };
    setCurrentMarks(updatedMarks);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bidyapith_section_students", JSON.stringify(updatedSectionsMap));
        localStorage.setItem(
          "bidyapith_grade_marks_store",
          JSON.stringify({ ...marksStore, [selectedSec]: updatedMarks })
        );
      } catch {
        // ignore
      }
    }

    toast.success(`Added ${newStudent.name} (${newStudent.id}) to ${currentSection?.code} Section ${currentSection?.section}`);
    setNewStudentId("");
    setNewStudentName("");
    setNewStudentEmail("");
    setAddStudentModalOpen(false);
  };

  // Autofill full assignments
  const handleAutofillAssignments = () => {
    const updated: Record<string, GradeRecord> = {};
    currentStudents.forEach((st) => {
      const existing = currentMarks[st.id] || { mid: null, assign: null, final: null };
      updated[st.id] = {
        ...existing,
        assign: existing.assign !== null ? existing.assign : 18,
      };
    });
    setCurrentMarks(updated);
    toast.success("Autofilled default assignment marks for empty fields");
  };

  // Filtered student list
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return currentStudents;
    const q = searchQuery.toLowerCase();
    return currentStudents.filter(
      (st) => st.name.toLowerCase().includes(q) || st.id.toLowerCase().includes(q)
    );
  }, [currentStudents, searchQuery]);

  const enteredCount = Object.values(currentMarks).filter(
    (m) => m.mid !== null && m.assign !== null && m.final !== null
  ).length;

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <GlassCard className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 grow">
          <div className="grow sm:grow-0 min-w-[260px]">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Assigned Course & Section
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center justify-between gap-3 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-ink hover:border-jade/50 hover:bg-white/[0.09] transition-all cursor-pointer outline-none shadow-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <BookOpen className="size-4 text-jade shrink-0" />
                  <span className="font-bold text-jade">
                    {currentSection?.code || "Course"}
                  </span>
                  <span className="text-ink-muted">· Section {currentSection?.section}</span>
                  <span className="text-xs text-ink-faint">({currentStudents.length} students)</span>
                </div>
                <ChevronDown className="size-4 text-ink-muted shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[340px] rounded-xl border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl z-50"
              >
                <div className="px-3 py-1.5 text-[0.68rem] font-bold text-ink-faint uppercase tracking-wider">
                  Your Assigned Classes ({sections.length})
                </div>
                {sections.map((s) => {
                  const isSelected = selectedSec === s.id;
                  const count = sectionStudents[s.id]?.length || s.enrolled || roster.length;
                  return (
                    <DropdownMenuItem
                      key={s.id}
                      onClick={() => setSelectedSec(s.id)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold cursor-pointer transition-colors",
                        isSelected
                          ? "bg-jade/15 text-jade"
                          : "text-ink hover:bg-white/[0.08] hover:text-ink"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={cn("font-bold text-sm", isSelected ? "text-jade" : "text-ink")}>
                          {s.code}
                        </span>
                        <span className="text-ink-muted">Section {s.section}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.72rem] text-ink-faint">
                          {count} enrolled
                        </span>
                        {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search bar inside section */}
          <div className="relative grow sm:max-w-xs">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Search Roster
            </span>
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or ID..."
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] pl-9 pr-3 py-2 text-xs font-medium text-ink outline-none focus:border-jade"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isLocked ? (
            <>
              <button
                type="button"
                onClick={() => setAddStudentModalOpen(true)}
                className={cn(
                  buttonClass({ variant: "ghost", size: "sm" }),
                  "text-xs flex items-center gap-1.5 cursor-pointer hover:border-jade/40"
                )}
                title="Add student to this section"
              >
                <UserPlus className="size-3.5 text-jade" />
                <span className="hidden sm:inline">Add Student</span>
              </button>

              <button
                type="button"
                onClick={handleAutofillAssignments}
                className={cn(
                  buttonClass({ variant: "ghost", size: "sm" }),
                  "text-xs flex items-center gap-1.5 cursor-pointer hover:border-jade/40"
                )}
                title="Autofill empty assignment marks"
              >
                <Wand2 className="size-3.5 text-marigold" />
                <span className="hidden sm:inline">Autofill</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className={cn(
                  buttonClass({ variant: "ghost", size: "sm" }),
                  "text-xs flex items-center gap-1.5 cursor-pointer hover:border-jade/40"
                )}
              >
                <Save className="size-3.5 text-jade" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmModalOpen(true)}
                disabled={enteredCount === 0}
                className={cn(
                  buttonClass({ variant: "primary", size: "sm" }),
                  "text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                )}
              >
                <Send className="size-3.5" />
                <span>Submit Grade Sheet</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-jade/15 text-jade border border-jade/30">
                <Lock className="size-3.5" /> Grades Locked & Submitted
              </span>
              <button
                type="button"
                onClick={() => setIsLocked(false)}
                className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs text-ink-muted hover:text-ink")}
              >
                <Unlock className="size-3.5" /> Unlock
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Grade Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3 text-center">Midterm /30</th>
                <th className="px-4 py-3 text-center">Assign /20</th>
                <th className="px-4 py-3 text-center">Final Exam /50</th>
                <th className="px-4 py-3 text-center">Total /100</th>
                <th className="px-4 py-3 text-right">Letter Grade (GP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const marks = currentMarks[st.id] || { mid: null, assign: null, final: null };
                  const midVal = marks.mid;
                  const assignVal = marks.assign;
                  const finalVal = marks.final;

                  const hasAllMarks = midVal !== null && assignVal !== null && finalVal !== null;
                  const total = hasAllMarks ? (midVal ?? 0) + (assignVal ?? 0) + (finalVal ?? 0) : null;
                  const [grade, point] = total !== null ? computeGrade(total) : ["—", 0];

                  return (
                    <tr key={st.id} className="hover:bg-white/[0.035] transition-colors">
                      <td className="px-4 py-3 font-sans">
                        <div className="flex items-center gap-2.5">
                          <span className="size-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620] font-display text-[0.65rem] font-bold shrink-0">
                            {getInitials(st.name)}
                          </span>
                          <span className="font-semibold text-ink">{st.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-faint">{st.id}</td>

                      {/* Midterm Input (/30) */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          disabled={isLocked}
                          value={midVal ?? ""}
                          onChange={(e) => handleMarkChange(st.id, "mid", e.target.value, 30)}
                          placeholder="—"
                          className="w-14 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-center font-bold text-ink outline-none focus:border-jade disabled:opacity-50"
                        />
                      </td>

                      {/* Assignment Input (/20) */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          disabled={isLocked}
                          value={assignVal ?? ""}
                          onChange={(e) => handleMarkChange(st.id, "assign", e.target.value, 20)}
                          placeholder="—"
                          className="w-14 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-center font-bold text-ink outline-none focus:border-jade disabled:opacity-50"
                        />
                      </td>

                      {/* Final Exam Input (/50) */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          disabled={isLocked}
                          value={finalVal ?? ""}
                          onChange={(e) => handleMarkChange(st.id, "final", e.target.value, 50)}
                          placeholder="—"
                          className="w-14 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1 text-center font-bold text-ink outline-none focus:border-jade disabled:opacity-50"
                        />
                      </td>

                      {/* Total (/100) */}
                      <td className="px-4 py-3 text-center font-bold text-ink text-sm">
                        {total !== null ? total : "—"}
                      </td>

                      {/* Letter Grade */}
                      <td className="px-4 py-3 text-right">
                        {total !== null ? (
                          <StatusPill
                            tone={
                              point >= 3.7
                                ? "ok"
                                : point >= 3.0
                                ? "info"
                                : point >= 2.0
                                ? "warn"
                                : "bad"
                            }
                          >
                            {grade} ({point.toFixed(2)})
                          </StatusPill>
                        ) : (
                          <span className="text-ink-faint">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                    No students found matching "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/8 text-xs text-ink-faint">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink-muted">
              {enteredCount} of {currentStudents.length} complete marks entered
            </span>
            <span>·</span>
            <span>Section: {currentSection?.code} ({currentSection?.section})</span>
          </div>
          <span>
            {isLocked
              ? "Grade sheet is locked and submitted to the registrar"
              : "Draft marks auto-sync locally; submit when grades are final."}
          </span>
        </div>
      </GlassCard>

      {/* Add Student Modal */}
      <Dialog open={addStudentModalOpen} onOpenChange={setAddStudentModalOpen}>
        <DialogContent className="border border-white/20 bg-night-900/98 p-6 rounded-2xl shadow-2xl backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <UserPlus className="size-5 text-jade" />
              Add Student to {currentSection?.code} (Sec {currentSection?.section})
            </DialogTitle>
            <DialogDescription className="text-xs text-ink-muted">
              Manually enroll or append a registered student to this class section mark sheet.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStudent} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Student ID *
              </label>
              <input
                type="text"
                required
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                placeholder="e.g. 2024-BSC-CSE-1035"
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs font-mono text-ink outline-none focus:border-jade"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="e.g. Shakil Ahmed"
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs text-ink outline-none focus:border-jade"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                University Email (Optional)
              </label>
              <input
                type="email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                placeholder="student@bidyapith.edu"
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs text-ink outline-none focus:border-jade"
              />
            </div>

            <DialogFooter className="mt-5 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAddStudentModalOpen(false)}
                className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs cursor-pointer")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs cursor-pointer shadow-md")}
              >
                Add to Roster
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Submission Confirmation Dialog */}
      <AlertDialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <AlertDialogContent className="border border-white/20 bg-night-900/98 p-6 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-2xl max-w-md">
          <AlertDialogHeader>
            <div className="size-12 rounded-full bg-jade/15 text-jade flex items-center justify-center mb-3">
              <AlertTriangle className="size-6 text-jade" />
            </div>
            <AlertDialogTitle className="font-display text-lg font-bold text-ink">
              Submit Grade Sheet to Registrar?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-ink-muted leading-relaxed mt-2">
              Are you sure you want to finalize and submit the grade sheet for{" "}
              <b className="text-ink font-semibold">{currentSection?.code} (Section {currentSection?.section})</b>?
              <br /><br />
              Once submitted, all calculated letter grades will be officially recorded and published to student portals.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-5 flex gap-2 justify-end">
            <AlertDialogCancel
              onClick={() => setConfirmModalOpen(false)}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs cursor-pointer")}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs cursor-pointer shadow-md")}
            >
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
