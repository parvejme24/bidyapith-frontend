"use client";

import React from "react";
import { StatTile } from "@/components/dashboard/stat-tile";

interface CourseStatsProps {
  totalSections: number;
  totalCapacity: number;
  totalEnrolled: number;
  fullCount: number;
  fillPct: number;
  termName?: string;
}

export function CourseStats({
  totalSections,
  totalCapacity,
  totalEnrolled,
  fullCount,
  fillPct,
  termName = "Fall 2026",
}: CourseStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatTile
        label="Scheduled Sections"
        value={totalSections}
        detail={`${termName} catalog`}
        tone="up"
      />
      <StatTile
        label="Seat Utilization"
        value={`${fillPct}%`}
        detail={`${totalEnrolled} / ${totalCapacity} filled`}
        tone={fillPct > 80 ? "up" : ""}
      />
      <StatTile
        label="Full Sections"
        value={fullCount}
        detail="Zero open seats remaining"
        tone={fullCount > 0 ? "gold" : ""}
      />
      <StatTile
        label="Available Capacity"
        value={Math.max(0, totalCapacity - totalEnrolled)}
        detail="Open seats across campus"
        tone="up"
      />
    </div>
  );
}
