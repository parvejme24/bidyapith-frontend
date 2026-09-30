import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { SkeletonBox } from "@/components/site/skeletons";

export function AttendanceRosterListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <GlassCard className="p-3.5 sm:p-5 rounded-xl space-y-3.5">
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-5 w-48 rounded" />
            <SkeletonBox className="h-4 w-28 rounded-md" />
          </div>
          <SkeletonBox className="h-3.5 w-64 rounded" />
        </div>
        <SkeletonBox className="h-7 w-32 rounded-lg" />
      </div>

      <div className="grid gap-2">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-lg border border-white/8 bg-white/[0.025]"
          >
            <div className="flex items-center gap-3">
              <SkeletonBox className="size-9 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <SkeletonBox className="h-4 w-32 rounded" />
                  <SkeletonBox className="h-3.5 w-16 rounded" />
                </div>
                <SkeletonBox className="h-3 w-40 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <SkeletonBox className="size-7 rounded-md" />
              <SkeletonBox className="size-7 rounded-md" />
              <SkeletonBox className="size-7 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
