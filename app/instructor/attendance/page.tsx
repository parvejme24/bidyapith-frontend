"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AttendanceRoster } from "@/components/dashboard/instructor/attendance-roster";
import { useApp } from "@/lib/app-context";

export default function InstructorAttendancePage() {
  const { instructorSections, roster, saveAttendance } = useApp();

  return (
    <DashboardLayout
      title="Take Attendance"
      subtitle="Mark and submit daily class participation for your assigned sections"
      requiredRole="instructor"
      crumb="Instructor / Teaching"
    >
      <AttendanceRoster
        sections={instructorSections}
        roster={roster}
        onSave={saveAttendance}
      />
    </DashboardLayout>
  );
}
