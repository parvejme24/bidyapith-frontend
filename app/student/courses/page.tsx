"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Calendar, Download, GraduationCap } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RoutineView } from "@/components/dashboard/student/routine-view";
import { AdmissionStatusCard } from "@/components/dashboard/student/admission/admission-status-card";
import { SemesterAccordion } from "@/components/dashboard/student/curriculum/semester-accordion";
import { useApp } from "@/lib/app-context";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function StudentCoursesPage() {
  const { student, currentProgram } = useApp();
  const [activeTab, setActiveTab] = useState<"curriculum" | "routine">("curriculum");

  const programTitle = currentProgram?.title || currentProgram?.name || "B.Sc. in Computer Science & Engineering";
  const programType = currentProgram?.degreeType || "B.Sc.";
  const totalSemesters = currentProgram?.totalSemesters || currentProgram?.durationSemesters || 8;
  const totalCredits = student.enrolled.reduce((sum, c) => sum + c.credits, 0);

  return (
    <DashboardLayout
      title="Degree Program & Courses"
      subtitle={`${programType}: ${programTitle} · ${currentProgram?.totalCredits || 140} Credits Total`}
      requiredRole="student"
      crumb="Student / Degree Curriculum"
      actions={
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-white/[0.04]">
            <button
              type="button"
              onClick={() => setActiveTab("curriculum")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                activeTab === "curriculum"
                  ? "bg-jade text-night-900 font-bold shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <BookOpen className="size-3.5" />
              <span>All Semesters ({totalSemesters})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("routine")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                activeTab === "routine"
                  ? "bg-jade text-night-900 font-bold shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Calendar className="size-3.5" />
              <span>Weekly Routine</span>
            </button>
          </div>

          <button
            onClick={() => toast.success("Degree syllabus & course roadmap exported successfully")}
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "text-xs cursor-pointer hover:border-jade/40 hidden sm:inline-flex items-center gap-1.5"
            )}
          >
            <Download className="size-3.5 text-jade" />
            <span>Export Syllabus</span>
          </button>
        </div>
      }
    >
      {/* 1. Admission Status Banner (handles PENDING, APPROVED -> Pay Fee, ENROLLED) */}
      <AdmissionStatusCard />

      {/* 2. Content depending on active tab */}
      {activeTab === "curriculum" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                <GraduationCap className="size-5 text-jade" />
                <span>{programTitle} Curriculum Roadmap</span>
              </h2>
              <p className="text-xs text-ink-faint mt-0.5">
                Complete semester progression ({totalSemesters} Semesters) · {currentProgram?.department || "Department of Computer Science"} · {currentProgram?.totalCredits || 140} Cr.
              </p>
            </div>
            <div className="text-xs font-mono text-ink-muted bg-white/[0.03] border border-white/8 px-3 py-1.5 rounded-lg">
              Current Term: <span className="text-jade font-bold">{totalCredits} Enrolled Credits</span>
            </div>
          </div>

          <SemesterAccordion />
        </div>
      ) : (
        <div className="space-y-6">
          <RoutineView enrolled={student.enrolled} />
        </div>
      )}
    </DashboardLayout>
  );
}


