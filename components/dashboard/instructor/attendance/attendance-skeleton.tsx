"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { SkeletonBox } from "@/components/site/skeletons";

export function InstructorAttendanceSkeleton() {
  return (
    <div className="space-y-4 max-w-full overflow-hidden animate-in fade-in duration-200">
      {/* Header Toolbar Skeleton */}
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

      {/* Filter Bar Skeleton */}
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

      {/* Daily Student Roster List Skeleton */}
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
          {Array.from({ length: 6 }).map((_, idx) => (
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
    </div>
  );
}
