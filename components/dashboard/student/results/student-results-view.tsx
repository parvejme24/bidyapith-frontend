"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { AreaTrendChart } from "@/components/dashboard/charts/area-trend-chart";
import { StatTile } from "@/components/dashboard/stat-tile";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { SemesterResultsTabs } from "./semester-results-tabs";
import { SemesterGradeSheetTable } from "./semester-grade-sheet-table";
import { generateAllSemesterResults, computeGpaTrend } from "./results-generator";
import { Download, Sparkles, Award, TrendingUp } from "lucide-react";

export function StudentResultsView() {
  const { student, currentProgram, programs } = useApp();

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

  const handleDownloadTranscript = () => {
    toast.success("Official Academic Transcript PDF downloaded successfully!");
    window.print();
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-marigold" />
              GPA Progression & Term Trajectory
            </h3>
            <p className="text-xs text-ink-faint mt-0.5">
              Grade Point Average (GPA) evolution across completed semesters.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadTranscript}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-ink hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-jade" />
            <span>Official Transcript</span>
          </button>
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
    </div>
  );
}
