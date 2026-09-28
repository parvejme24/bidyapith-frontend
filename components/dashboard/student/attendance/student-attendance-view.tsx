"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { SemesterSelectorTabs } from "./semester-selector-tabs";
import { MonthFilterNav } from "./month-filter-nav";
import { AttendanceSummaryBanner } from "./attendance-summary-banner";
import { MonthlyCourseAttendanceTable } from "./monthly-course-attendance-table";
import { LectureHistoryModal } from "./lecture-history-modal";
import { AttendanceSlipModal } from "./attendance-slip-modal";
import { generateSemesterAttendanceData } from "./attendance-generator";
import type { CourseSemesterAttendance } from "./attendance-types";
import {
  exportAttendanceSlipAsPdf,
  exportAttendanceSlipAsPng,
  type AttendanceSlipData,
} from "./attendance-slip-exporter";
import { Download, FileText, Image as ImageIcon, Sparkles } from "lucide-react";

export function StudentAttendanceView() {
  const { currentProgram, programs, user } = useApp();

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
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);

  // Generate attendance data for the selected semester
  const semesterRecord = useMemo(() => {
    return generateSemesterAttendanceData(program, selectedSemesterNum);
  }, [program, selectedSemesterNum]);

  // Construct official slip data object
  const slipData: AttendanceSlipData = useMemo(() => {
    return {
      slipNumber: `ATT-2026-SEM${selectedSemesterNum}-${user.id.replace(/[^0-9]/g, "").slice(-4) || "1001"}`,
      studentName: user.name || "Rafiul Karim",
      studentId: user.id || "2024-BSC-CSE-1001",
      studentEmail: user.email || "student001@bidyapith.edu",
      programTitle: program.title,
      department: program.department || "Computer Science & Engineering",
      semesterTitle: semesterRecord.semesterTitle,
      termName: "",
      issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      totalHeld: semesterRecord.totalHeld,
      totalPresent: semesterRecord.totalPresent,
      totalLate: semesterRecord.totalLate,
      totalAbsent: semesterRecord.totalAbsent,
      overallPct: semesterRecord.overallPct,
      isFullyEligible: semesterRecord.isFullyEligible,
      courses: semesterRecord.courses.map((c) => ({
        code: c.code,
        title: c.title,
        type: c.type,
        credits: c.credits,
        instructor: c.instructor,
        room: c.room,
        held: c.totalHeld,
        present: c.totalPresent,
        late: c.totalLate,
        absent: c.totalAbsent,
        pct: c.pct,
        isEligible: c.isEligible,
        monthlyBreakdown: c.monthlyBreakdown.map((m) => ({
          monthName: m.monthName,
          pct: m.pct,
          held: m.held,
          present: m.present,
        })),
      })),
      verificationHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase()}`,
    };
  }, [program, selectedSemesterNum, semesterRecord, user]);

  // When switching semesters, reset month filter to 0 (All Months)
  const handleSelectSemester = (semNum: number) => {
    setSelectedSemesterNum(semNum);
    setSelectedMonthIndex(0);
  };

  return (
    <div className="space-y-5">
      {/* 1. Semester Selector Tabs with Export Actions Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-ink-faint">
              Academic Semesters
            </span>
            <span className="text-[11px] text-ink-faint/80 font-mono">
              ({program.semesters.length} Semesters Total)
            </span>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSlipModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-jade/[0.15] hover:bg-jade/[0.22] text-jade border border-jade/30 text-xs font-bold transition-all shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-jade group-hover:scale-110 transition-transform" />
              <span>Attendance Slip</span>
            </button>

            <button
              type="button"
              onClick={() => exportAttendanceSlipAsPdf(slipData)}
              title="Download PDF directly"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-ink hover:text-white transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-jade" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => exportAttendanceSlipAsPng(slipData)}
              title="Download PNG directly"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-ink hover:text-white transition-all shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>PNG</span>
            </button>
          </div>
        </div>

        <SemesterSelectorTabs
          semesters={program.semesters}
          selectedSemesterNum={selectedSemesterNum}
          onSelectSemester={handleSelectSemester}
        />
      </div>

      {/* 2. Month-by-Month Filter Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink">
            {semesterRecord.semesterTitle}
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

      {/* 6. Official Attendance Slip Modal Preview */}
      {showSlipModal && (
        <AttendanceSlipModal
          data={slipData}
          onClose={() => setShowSlipModal(false)}
        />
      )}
    </div>
  );
}
