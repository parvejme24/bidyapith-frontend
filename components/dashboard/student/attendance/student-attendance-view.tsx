"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { SemesterSelectorTabs } from "./semester-selector-tabs";
import { MonthFilterNav } from "./month-filter-nav";
import { AttendanceSummaryBanner } from "./attendance-summary-banner";
import { MonthlyCourseAttendanceTable } from "./monthly-course-attendance-table";
import { LectureHistoryModal } from "./lecture-history-modal";
import { generateSemesterAttendanceData } from "./attendance-generator";
import type { CourseSemesterAttendance } from "./attendance-types";
import { Download, Printer, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export function StudentAttendanceView() {
  const { currentProgram, programs, student } = useApp();

  // Selected degree program
  const program = currentProgram || programs[0];

  // Default to current semester (e.g. 5) or first semester
  const initialSemNum =
    program.semesters.find((s) => s.status === "current")?.semesterNumber ||
    program.semesters[0]?.semesterNumber ||
    1;

  const [selectedSemesterNum, setSelectedSemesterNum] = useState<number>(initialSemNum);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0); // 0 = all months
  const [activeLectureCourse, setActiveLectureCourse] = useState<CourseSemesterAttendance | null>(null);

  // Generate attendance data for the selected semester
  const semesterRecord = useMemo(() => {
    return generateSemesterAttendanceData(program, selectedSemesterNum);
  }, [program, selectedSemesterNum]);

  // When switching semesters, reset month filter to 0 (All Months)
  const handleSelectSemester = (semNum: number) => {
    setSelectedSemesterNum(semNum);
    setSelectedMonthIndex(0);
  };

  const handleExportPDF = () => {
    toast.success(`Exporting Official Attendance Sheet for ${semesterRecord.semesterTitle}...`);
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Academic Class Attendance & Lecture Records
          </h2>
          <p className="text-xs text-ink-faint mt-1">
            Program: <span className="text-jade font-semibold">{program.title}</span> ({program.code})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-ink hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-jade" />
            <span>Download Attendance Slip</span>
          </button>
        </div>
      </div>

      {/* 1. Semester Selector Tabs */}
      <SemesterSelectorTabs
        semesters={program.semesters}
        selectedSemesterNum={selectedSemesterNum}
        onSelectSemester={handleSelectSemester}
      />

      {/* 2. Month-by-Month Filter Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ink">
            {semesterRecord.semesterTitle}
          </span>
          <span className="text-xs text-ink-faint font-mono">
            · {semesterRecord.termName}
          </span>
        </div>

        <MonthFilterNav
          months={semesterRecord.months}
          selectedMonthIndex={selectedMonthIndex}
          onSelectMonth={setSelectedMonthIndex}
          isLockedSemester={semesterRecord.status === "locked"}
        />
      </div>

      {/* 3. Dynamic Summary Stat Tiles & Progress Bars */}
      <AttendanceSummaryBanner
        record={semesterRecord}
        filteredMonthIndex={selectedMonthIndex}
      />

      {/* 4. Course-by-Course Monthly Breakdown Table */}
      <MonthlyCourseAttendanceTable
        record={semesterRecord}
        filteredMonthIndex={selectedMonthIndex}
        onSelectCourse={setActiveLectureCourse}
      />

      {/* 5. Lecture History Modal */}
      {activeLectureCourse && (
        <LectureHistoryModal
          course={activeLectureCourse}
          semesterTitle={semesterRecord.semesterTitle}
          onClose={() => setActiveLectureCourse(null)}
        />
      )}
    </div>
  );
}
