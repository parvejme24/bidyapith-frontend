"use client";

import React from "react";
import { StatTile } from "@/components/dashboard/stat-tile";

interface StudentStatsProps {
  totalCount: number;
  activeCount: number;
  graduatedCount: number;
  avgCgpa?: string | number;
}

export function StudentStats({
  totalCount,
  activeCount,
  graduatedCount,
  avgCgpa = "3.68",
}: StudentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatTile
        label="Enrolled Students"
        value={totalCount}
        detail="Active cohort batch"
        tone="up"
      />
      <StatTile
        label="Good Standing"
        value={activeCount}
        detail="CGPA ≥ 3.00 standing"
        tone="up"
      />
      <StatTile
        label="Alumni / Graduated"
        value={graduatedCount || 12}
        detail="Degree completed"
      />
      <StatTile
        label="Avg Cohort CGPA"
        value={avgCgpa}
        detail="University-wide avg"
        tone="up"
      />
    </div>
  );
}
