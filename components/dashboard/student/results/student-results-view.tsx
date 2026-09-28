"use client";

import React, { useState, useMemo } from "react";
import { AreaTrendChart } from "@/components/dashboard/charts/area-trend-chart";
import { StatTile } from "@/components/dashboard/stat-tile";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { SemesterResultsTabs } from "./semester-results-tabs";
import { SemesterGradeSheetTable } from "./semester-grade-sheet-table";
import { TranscriptModal } from "./transcript-modal";
import { generateAllSemesterResults, computeGpaTrend } from "./results-generator";
import {
  exportTranscriptAsPdf,
  exportTranscriptAsPng,
  type OfficialTranscriptData,
} from "./transcript-exporter";
import { Download, Sparkles, Image as ImageIcon, TrendingUp, Award } from "lucide-react";

export function StudentResultsView() {
  const { student, currentProgram, programs, user } = useApp();

  const program = currentProgram || programs[0];

  // Generate results for all semesters in program
  const semesterResults = useMemo(() => {
    return generateAllSemesterResults(program, student.enrolled);
  }, [program, student.enrolled]);

  // Default to first completed term or current term
  const initialSemNum =
    semesterResults.find((r) => r.status === "current")?.semesterNumber ||
    semesterResults[0]?.semesterNumber ||
    1;

  const [selectedSemesterNum, setSelectedSemesterNum] = useState<number>(initialSemNum);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);

  // Active record
  const activeRecord = useMemo(() => {
    return (
      semesterResults.find((r) => r.semesterNumber === selectedSemesterNum) ||
      semesterResults[0]
    );
  }, [semesterResults, selectedSemesterNum]);

  // Overall CGPA calculation
  const completedTerms = semesterResults.filter((r) => r.status === "completed");
  const totalCompletedCredits = completedTerms.reduce((acc, r) => acc + r.totalCredits, 0);
  const totalQualityPoints = completedTerms.reduce((acc, r) => acc + r.gpa * r.totalCredits, 0);
  const cumulativeCgpa =
    totalCompletedCredits > 0
      ? Number((totalQualityPoints / totalCompletedCredits).toFixed(2))
      : student.cgpa;

  // GPA Trend
  const gpaTrend = useMemo(() => {
    return computeGpaTrend(semesterResults);
  }, [semesterResults]);

  // Construct official transcript data
  const transcriptData: OfficialTranscriptData = useMemo(() => {
    return {
      transcriptNumber: `TRN-2026-${user.id.replace(/[^0-9]/g, "").slice(-4) || "1001"}-88`,
      studentName: user.name || "Rafiul Karim",
      studentId: user.id || "2024-BSC-CSE-1001",
      studentEmail: user.email || "student001@bidyapith.edu",
      programTitle: program.title,
      department: program.department || "Computer Science & Engineering",
      degreeType: program.degreeType || "B.Sc.",
      mediumOfInstruction: "English",
      dateOfAdmission: "January 15, 2024",
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      cgpa: cumulativeCgpa,
      creditsCompleted: totalCompletedCredits || student.creditsDone,
      totalDegreeCredits: program.totalCredits || 140,
      academicStanding: cumulativeCgpa >= 3.75 ? "First Class with Distinction (Honors)" : "First Class Regular",
      terms: semesterResults,
      verificationHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase()}`,
    };
  }, [cumulativeCgpa, program, semesterResults, student.creditsDone, totalCompletedCredits, user]);

  return (
    <div className="space-y-6">
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Cumulative CGPA"
          value={cumulativeCgpa.toFixed(2)}
          detail={student.standing || "Dean's High Honors List"}
          tone="up"
        />
        <StatTile
          label="Latest Completed Term"
          value={completedTerms[completedTerms.length - 1]?.gpa.toFixed(2) || "3.88"}
          detail={`Semester ${completedTerms[completedTerms.length - 1]?.semesterNumber || 4} GPA`}
          tone="up"
        />
        <StatTile
          label="Credits Earned"
          value={totalCompletedCredits || student.creditsDone}
          detail={`of ${program.totalCredits || 140} degree credits`}
        />
        <StatTile
          label="Semesters Completed"
          value={`${completedTerms.length} / ${program.semesters.length}`}
          detail={`Active in Semester ${selectedSemesterNum}`}
          tone="gold"
        />
      </div>

      {/* GPA Progression Trend Chart */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-marigold" />
              GPA Progression & Term Trajectory
            </h3>
            <p className="text-xs text-ink-faint mt-0.5">
              Grade Point Average (GPA) evolution across completed semesters.
            </p>
          </div>

          {/* Transcript Export Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowTranscriptModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-jade/[0.15] hover:bg-jade/[0.22] text-jade border border-jade/30 text-xs font-bold transition-all shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-jade group-hover:scale-110 transition-transform" />
              <span>Official Transcript</span>
            </button>

            <button
              type="button"
              onClick={() => exportTranscriptAsPdf(transcriptData)}
              title="Download PDF directly"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-ink hover:text-white transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-jade" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => exportTranscriptAsPng(transcriptData)}
              title="Download PNG directly"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-ink hover:text-white transition-all shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>PNG</span>
            </button>
          </div>
        </div>

        <AreaTrendChart data={gpaTrend} color="#FFB454" />
      </GlassCard>

      {/* 1. All Academic Semesters Tabs (Sem 1 to 8 / 4) */}
      <div className="space-y-3">
        <SemesterResultsTabs
          results={semesterResults}
          selectedSemesterNum={selectedSemesterNum}
          onSelectSemester={setSelectedSemesterNum}
        />
      </div>

      {/* 2. Selected Semester Grade Sheet Table */}
      <SemesterGradeSheetTable record={activeRecord} />

      {/* 3. Official Academic Transcript Modal Preview */}
      {showTranscriptModal && (
        <TranscriptModal
          data={transcriptData}
          onClose={() => setShowTranscriptModal(false)}
        />
      )}
    </div>
  );
}
