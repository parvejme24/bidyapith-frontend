"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AttendanceRoster } from "@/components/dashboard/instructor/attendance-roster";
import { useApp } from "@/lib/app-context";

export default function InstructorAttendancePage() {
  const { isInstructorDataLoading, instructorSections, roster } = useApp();

  return (
    <DashboardLayout
      title="Take Attendance"
      subtitle="Mark and submit daily class participation for your assigned sections"
      requiredRole="instructor"
      crumb="Instructor / Teaching"
    >
      {isInstructorDataLoading ? (
        <p className="text-sm text-ink-muted">Loading assigned sections from the academic database...</p>
      ) : instructorSections.length === 0 ? (
        <p className="text-sm text-ink-muted">No teaching sections are assigned to this instructor.</p>
      ) : (
        <AttendanceRoster sections={instructorSections} roster={roster} />
      )}
    </DashboardLayout>
  );
}
