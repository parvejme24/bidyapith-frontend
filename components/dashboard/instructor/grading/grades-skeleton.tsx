"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { SkeletonBox } from "@/components/site/skeletons";

export function InstructorGradesSkeleton() {
  return (
    <div className="space-y-4 max-w-full overflow-hidden animate-in fade-in duration-200">
      {/* Control bar skeleton */}
      <GlassCard className="p-3.5 sm:p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="h-9 w-48 rounded-lg" />
          <SkeletonBox className="h-9 w-36 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-9 w-28 rounded-lg" />
          <SkeletonBox className="h-9 w-32 rounded-lg" />
        </div>
      </GlassCard>

      {/* Table skeleton */}
      <GlassCard className="p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-5 w-40 rounded" />
          <SkeletonBox className="h-8 w-56 rounded-lg" />
        </div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
              <SkeletonBox className="h-4 w-28 rounded" />
              <SkeletonBox className="h-4 w-40 rounded" />
              <SkeletonBox className="h-6 w-16 rounded" />
              <SkeletonBox className="h-6 w-16 rounded" />
              <SkeletonBox className="h-6 w-16 rounded" />
              <SkeletonBox className="h-6 w-12 rounded" />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
