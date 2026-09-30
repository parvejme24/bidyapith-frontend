"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { InstructorSection } from "@/lib/app-types";
import type { GradeRecord, GradeSheetProps, SectionStudent } from "./grading/grade-types";
import { GradeControlBar } from "./grading/grade-control-bar";
import { GradeTable } from "./grading/grade-table";
import { GradeSubmitConfirmDialog } from "./grading/grade-submit-confirm-dialog";

const EMPTY_SECTION: InstructorSection = {
  id: "",
  code: "",
  title: "No assigned course sections",
  section: "—",
  room: "—",
  slots: [],
  enrolled: 0,
  capacity: 0,
  avgAttendance: 0,
  gradesSubmitted: false,
};

export function GradeSheet({ sections, roster, onSaveDraft, onSubmit }: GradeSheetProps) {
  const [selectedSec, setSelectedSec] = useState<string>(sections[0]?.id || "S1");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMarks, setCurrentMarks] = useState<Record<string, GradeRecord>>({});

  useEffect(() => {
    if (!sections.some((section) => section.id === selectedSec) && sections[0]) {
      setSelectedSec(sections[0].id);
    }
  }, [sections, selectedSec]);

  const currentSection = sections.find((s) => s.id === selectedSec) || sections[0] || EMPTY_SECTION;

  // Active students in current section
  const currentStudents: SectionStudent[] = useMemo(() => {
    return roster.filter((student) => !student.sectionId || student.sectionId === selectedSec).map((st) => ({
      ...st,
      sectionId: selectedSec,
    }));
  }, [selectedSec, roster]);

  useEffect(() => {
    const initial: Record<string, GradeRecord> = {};
    currentStudents.forEach((student) => {
      initial[student.id] = {
        mid: student.mid,
        assign: student.assign,
        final: student.final,
      };
    });
    setCurrentMarks(initial);
  }, [selectedSec, currentStudents]);

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

  const handleSaveDraft = async () => {
    await onSaveDraft(selectedSec, currentMarks);
  };

  const handleConfirmSubmit = async () => {
    const submitted = await onSubmit(selectedSec, currentMarks);
    if (!submitted) return;
    setIsLocked(true);
    setConfirmModalOpen(false);
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
        roster={currentStudents}
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
