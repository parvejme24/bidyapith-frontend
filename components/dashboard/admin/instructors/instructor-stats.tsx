"use client";

import React from "react";
import { StatTile } from "@/components/dashboard/stat-tile";

interface InstructorStatsProps {
  totalCount: number;
  activeCount: number;
  deptsCount: number;
  avgStudentLoad?: number | string;
}

export function InstructorStats({
  totalCount,
  activeCount,
  deptsCount,
  avgStudentLoad = 74,
}: InstructorStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatTile
        label="Total Faculty"
        value={totalCount}
        detail="Active faculty members"
        tone="up"
      />
      <StatTile
        label="Active Teaching"
        value={activeCount}
        detail="Assigned to Fall 2026"
      />
      <StatTile
        label="Departments"
        value={deptsCount}
        detail="Academic faculties"
      />
      <StatTile
        label="Avg Student Load"
        value={avgStudentLoad}
        detail="Students per faculty"
        tone="up"
      />
    </div>
  );
}
