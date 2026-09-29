"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { GradeRecord, GradeSheetProps, SectionStudent } from "./grading/grade-types";
import { GradeControlBar } from "./grading/grade-control-bar";
import { GradeTable } from "./grading/grade-table";
import { GradeSubmitConfirmDialog } from "./grading/grade-submit-confirm-dialog";

export function GradeSheet({ sections, roster, onSubmit }: GradeSheetProps) {
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load persistent marks store from localStorage
  const [marksStore, setMarksStore] = useState<Record<string, Record<string, GradeRecord>>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bidyapith_grade_marks_store");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return {};
  });

  // Current section marks
  const [currentMarks, setCurrentMarks] = useState<Record<string, GradeRecord>>({});

  const currentSection = sections.find((s) => s.id === selectedSec) || sections[0];

  // Active students in current section
  const currentStudents: SectionStudent[] = useMemo(() => {
    return roster.map((st, idx) => ({
      ...st,
      sectionId: selectedSec,
      mid: st.mid ?? (20 + (idx % 10)),
      assign: st.assign ?? (15 + (idx % 5)),
    }));
  }, [selectedSec, roster]);

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
      } catch {}
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
      <GradeControlBar
        sections={sections}
        selectedSec={selectedSec}
        onSelectSection={setSelectedSec}
        currentSection={currentSection}
        currentStudents={currentStudents}
        roster={roster}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLocked={isLocked}
        onToggleLock={setIsLocked}
        enteredCount={enteredCount}
        onAutofillAssignments={handleAutofillAssignments}
        onSaveDraft={handleSaveDraft}
        onOpenSubmitModal={() => setConfirmModalOpen(true)}
      />

      {/* Grade Table */}
      <GradeTable
        filteredStudents={filteredStudents}
        currentMarks={currentMarks}
        isLocked={isLocked}
        onMarkChange={handleMarkChange}
        searchQuery={searchQuery}
        enteredCount={enteredCount}
        totalStudents={currentStudents.length}
        currentSection={currentSection}
      />

      {/* Submission Confirmation Dialog */}
      <GradeSubmitConfirmDialog
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        currentSection={currentSection}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
