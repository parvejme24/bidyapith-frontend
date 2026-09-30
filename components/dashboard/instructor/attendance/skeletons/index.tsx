"use client";

import React from "react";
import { AttendanceHeaderSkeleton } from "./attendance-header-skeleton";
import { AttendanceFilterSkeleton } from "./attendance-filter-skeleton";
import { AttendanceRosterListSkeleton } from "./attendance-roster-list-skeleton";

export * from "./attendance-header-skeleton";
export * from "./attendance-filter-skeleton";
export * from "./attendance-roster-list-skeleton";

export function InstructorAttendanceSkeleton() {
  return (
    <div className="space-y-4 max-w-full overflow-hidden animate-in fade-in duration-200">
      <AttendanceHeaderSkeleton />
      <AttendanceFilterSkeleton />
      <AttendanceRosterListSkeleton count={6} />
    </div>
  );
}
