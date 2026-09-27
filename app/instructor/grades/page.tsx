"use client";

import React from "react";
import { toast } from "sonner";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { GradeSheet } from "@/components/dashboard/instructor/grade-sheet";
import { useApp } from "@/lib/app-context";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function InstructorGradesPage() {
  const { instructorSections, roster, submitGradeSheet } = useApp();

  return (
    <DashboardLayout
      title="Grade Entry"
      subtitle="Input midterm, assignment, and final exam marks to calculate letter grades"
      requiredRole="instructor"
      crumb="Instructor / Teaching"
      actions={
        <button
          type="button"
          onClick={() => toast.success("CSV grade template downloaded")}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          <DashboardIcon name="download" className="size-3.5" />
          <span>CSV template</span>
        </button>
      }
    >
      <GradeSheet
        sections={instructorSections}
        roster={roster}
        onSubmit={submitGradeSheet}
      />
    </DashboardLayout>
  );
}
