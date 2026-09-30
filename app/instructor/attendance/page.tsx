"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { InstructorAttendanceSkeleton } from "@/components/dashboard/instructor/attendance/attendance-skeleton";
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
        <InstructorAttendanceSkeleton />
      ) : instructorSections.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-ink">No Teaching Sections Found</p>
          <p className="text-xs text-ink-muted">There are currently no active teaching sections assigned to your faculty profile.</p>
        </div>
      ) : (
        <AttendanceRoster sections={instructorSections} roster={roster} />
      )}
    </DashboardLayout>
  );
}
