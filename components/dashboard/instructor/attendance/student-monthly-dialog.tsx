"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import type { AttendanceStats, MonthDayInfo } from "./attendance-types";
import { calculateStudentAttendanceStats } from "./attendance-utils";
import { StudentMonthlyModalBody } from "./student-monthly-modal";

interface StudentMonthlyDialogProps {
  selectedStudent: RosterStudent | null;
  onClose: () => void;
  currentSection: InstructorSection;
  monthDays: MonthDayInfo[];
  studentStatsMap: Record<string, AttendanceStats>;
  activeYear: number;
  activeMonth: number;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToggleDayMark: (studentId: string, dateKey: string, mark: "P" | "L" | "A") => void;
  onExportStudentMonthly: (student: RosterStudent) => void;
}

export function StudentMonthlyDialog({
  selectedStudent,
  onClose,
  currentSection,
  monthDays,
  studentStatsMap,
  activeYear,
  activeMonth,
  attendanceStore,
  onPrevMonth,
  onNextMonth,
  onToggleDayMark,
  onExportStudentMonthly,
}: StudentMonthlyDialogProps) {
  if (!selectedStudent) return null;

  const modalStats =
    studentStatsMap[selectedStudent.id] ||
    calculateStudentAttendanceStats(
      selectedStudent,
      currentSection,
      monthDays,
      attendanceStore
    );

  return (
    <Dialog open={Boolean(selectedStudent)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl sm:max-w-4xl w-[96vw] p-0 overflow-hidden rounded-md sm:rounded-lg border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink max-h-[92vh] sm:max-h-[88vh] flex flex-col">
        <StudentMonthlyModalBody
          student={selectedStudent}
          section={currentSection}
          monthDays={monthDays}
          modalStats={modalStats}
          activeYear={activeYear}
          activeMonth={activeMonth}
          attendanceStore={attendanceStore}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          onToggleMark={(dateKey, mark) => onToggleDayMark(selectedStudent.id, dateKey, mark)}
          onExport={() => onExportStudentMonthly(selectedStudent)}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
