import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { SkeletonBox } from "@/components/site/skeletons";

export function AttendanceFilterSkeleton() {
  return (
    <GlassCard className="p-3 sm:p-4 rounded-xl space-y-3 border border-white/10 bg-white/[0.02]">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <SkeletonBox className="h-8 w-full md:w-64 rounded-lg" />
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBox className="h-8 w-28 rounded-lg" />
          <SkeletonBox className="h-8 w-24 rounded-lg" />
          <SkeletonBox className="h-8 w-24 rounded-lg" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
        <SkeletonBox className="h-4 w-24 rounded" />
        <SkeletonBox className="h-6 w-20 rounded-md" />
        <SkeletonBox className="h-6 w-20 rounded-md" />
        <SkeletonBox className="h-6 w-20 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <SkeletonBox className="h-4 w-44 rounded" />
        <SkeletonBox className="h-6 w-36 rounded-md" />
      </div>
    </GlassCard>
  );
}
