"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StudentAttendanceView } from "@/components/dashboard/student/attendance/student-attendance-view";
import { useApp } from "@/lib/app-context";

export default function StudentAttendancePage() {
  const { currentProgram, term } = useApp();

  return (
    <DashboardLayout
      title="Attendance Record"
      subtitle="Monthly & Course Lecture History"
      requiredRole="student"
      crumb="Student / Attendance"
    >
      <StudentAttendanceView />
    </DashboardLayout>
  );
}
