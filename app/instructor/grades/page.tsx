"use client";

import React from "react";
import { toast } from "sonner";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { GradeSheet } from "@/components/dashboard/instructor/grade-sheet";
import { useApp } from "@/lib/app-context";
import { downloadCsv } from "@/lib/csv-export";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function InstructorGradesPage() {
  const {
    isInstructorDataLoading,
    instructorSections,
    roster,
    saveGradeDraft,
    submitGradeSheet,
  } = useApp();

  const handleDownloadTemplate = () => {
    const currentSection = instructorSections[0];
    const sectionCode = currentSection ? `${currentSection.code}-Sec${currentSection.section}` : "No_Assigned_Section";

    const headers = [
      "StudentID",
      "StudentName",
      "CourseCode",
      "Section",
      "Midterm_30",
      "Assignments_20",
      "FinalExam_50",
      "Total_100",
      "LetterGrade",
    ];

    const rows = roster
      .filter((student) => !student.sectionId || student.sectionId === currentSection?.id)
      .map((st) => [
      st.id,
      st.name,
      currentSection?.code || "",
      currentSection?.section || "",
      st.mid ?? "",
      st.assign ?? "",
      "", // Placeholder for final exam input
      "", // Placeholder for total
      "", // Placeholder for letter grade
      ]);

    downloadCsv(`Grade_Template_${sectionCode}.csv`, [headers, ...rows]);
    toast.success(`Downloaded CSV grade template for ${sectionCode}`);
  };

  return (
    <DashboardLayout
      title="Grade Entry"
      subtitle="Input midterm, assignment, and final exam marks to calculate letter grades"
      requiredRole="instructor"
      crumb="Instructor / Teaching"
      actions={
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs cursor-pointer hover:border-jade/40")}
        >
          <DashboardIcon name="download" className="size-3.5 text-jade" />
          <span>CSV template</span>
        </button>
      }
    >
      {isInstructorDataLoading ? (
        <p className="text-sm text-ink-muted">Loading assigned sections from the academic database...</p>
      ) : instructorSections.length === 0 ? (
        <p className="text-sm text-ink-muted">No teaching sections are assigned to this instructor.</p>
      ) : (
        <GradeSheet
          sections={instructorSections}
          roster={roster}
          onSaveDraft={saveGradeDraft}
          onSubmit={submitGradeSheet}
        />
      )}
    </DashboardLayout>
  );
}
