"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StudentResultsView } from "@/components/dashboard/student/results/student-results-view";
import { useApp } from "@/lib/app-context";

export default function StudentResultsPage() {
  const { student, currentProgram } = useApp();

  return (
    <DashboardLayout
      title="Results & Transcript"
      subtitle={`Cumulative CGPA ${student.cgpa.toFixed(2)} · ${currentProgram?.title || "Degree Program"}`}
      requiredRole="student"
      crumb="Student / Results"
    >
      <StudentResultsView />
    </DashboardLayout>
  );
}
