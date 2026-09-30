import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { SkeletonBox } from "@/components/site/skeletons";

export function AttendanceHeaderSkeleton() {
  return (
    <GlassCard className="p-3 sm:p-4 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <SkeletonBox className="h-9 w-52 rounded-lg" />
        <SkeletonBox className="h-9 w-44 rounded-lg" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonBox className="h-9 w-32 rounded-lg" />
        <SkeletonBox className="h-9 w-36 rounded-lg" />
        <SkeletonBox className="h-9 w-28 rounded-lg" />
      </div>
    </GlassCard>
  );
}
