"use client";

import { GlassCard } from "@/components/site/glass-card";
import { tdClass, trClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/10 dark:bg-white/8 relative overflow-hidden",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        className
      )}
    />
  );
}

export function ProgramCardSkeleton() {
  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <SkeletonBox className="h-6 w-32 rounded-full" />
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>

      <SkeletonBox className="h-6 w-3/4 mb-2" />
      <SkeletonBox className="h-4 w-full mb-1.5" />
      <SkeletonBox className="h-4 w-5/6 mb-4" />

      <div className="grid grid-cols-3 gap-3 mt-auto pt-5 border-t border-white/8">
        <div>
          <SkeletonBox className="h-3 w-12 mb-2" />
          <SkeletonBox className="h-6 w-14" />
        </div>
        <div>
          <SkeletonBox className="h-3 w-12 mb-2" />
          <SkeletonBox className="h-6 w-10" />
        </div>
        <div>
          <SkeletonBox className="h-3 w-16 mb-2" />
          <SkeletonBox className="h-6 w-20" />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between items-center mb-1.5">
          <SkeletonBox className="h-3 w-28" />
          <SkeletonBox className="h-3 w-8" />
        </div>
        <SkeletonBox className="h-2 w-full rounded-full" />
      </div>

      <SkeletonBox className="h-9 w-full rounded-xl mt-5" />
    </GlassCard>
  );
}

export function CourseRowSkeleton() {
  return (
    <tr className={trClass}>
      <td className={tdClass}>
        <SkeletonBox className="h-5 w-20" />
      </td>
      <td className={tdClass}>
        <SkeletonBox className="h-5 w-48 mb-1" />
        <SkeletonBox className="h-3.5 w-28" />
      </td>
      <td className={cn(tdClass, "text-center")}>
        <SkeletonBox className="h-5 w-8 mx-auto" />
      </td>
      <td className={tdClass}>
        <SkeletonBox className="h-5 w-16" />
      </td>
      <td className={tdClass}>
        <SkeletonBox className="h-5 w-20" />
      </td>
      <td className={tdClass}>
        <SkeletonBox className="h-5 w-32" />
      </td>
      <td className={tdClass}>
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </td>
    </tr>
  );
}

export function FacultyCardSkeleton() {
  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <SkeletonBox className="size-14 rounded-full shrink-0" />
        <div className="min-w-0 flex-1">
          <SkeletonBox className="h-5 w-36 mb-1.5" />
          <SkeletonBox className="h-3.5 w-24" />
        </div>
      </div>
      <SkeletonBox className="h-4 w-full mb-1" />
      <SkeletonBox className="h-4 w-3/4 mb-4" />
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-auto pt-4 border-t border-white/8">
        <div>
          <SkeletonBox className="h-3 w-16 mb-1" />
          <SkeletonBox className="h-4 w-28" />
        </div>
        <div>
          <SkeletonBox className="h-3 w-16 mb-1" />
          <SkeletonBox className="h-4 w-24" />
        </div>
      </div>
      <SkeletonBox className="h-9 w-full rounded-xl mt-5" />
    </GlassCard>
  );
}

export function NoticeRowSkeleton() {
  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
        <SkeletonBox className="h-6 w-24 rounded-full" />
        <SkeletonBox className="h-4 w-28 ml-auto" />
      </div>
      <SkeletonBox className="h-5 w-3/4 mb-2" />
      <SkeletonBox className="h-4 w-full mb-1" />
      <SkeletonBox className="h-4 w-5/6" />
    </GlassCard>
  );
}

export function AdmissionStepSkeleton() {
  return (
    <GlassCard className="p-6 h-full min-h-[210px] flex flex-col justify-start flex-1">
      <SkeletonBox className="h-4 w-14 mb-2.5" />
      <SkeletonBox className="h-6 w-3/4 mb-3" />
      <SkeletonBox className="h-3.5 w-full mb-1.5" />
      <SkeletonBox className="h-3.5 w-4/5" />
    </GlassCard>
  );
}

export function KeyDateSkeleton() {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-white/6 last:border-0">
      <SkeletonBox className="h-5 w-40" />
      <div className="flex items-center gap-3">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>
    </li>
  );
}

export function FeeRowSkeleton() {
  return (
    <tr className={trClass}>
      <td className={tdClass}>
        <SkeletonBox className="h-5 w-32" />
      </td>
      <td className={cn(tdClass, "text-right")}>
        <SkeletonBox className="h-5 w-20 ml-auto" />
      </td>
      <td className={cn(tdClass, "text-right")}>
        <SkeletonBox className="h-5 w-16 ml-auto" />
      </td>
      <td className={cn(tdClass, "text-right")}>
        <SkeletonBox className="h-5 w-24 ml-auto" />
      </td>
      <td className={cn(tdClass, "text-right")}>
        <SkeletonBox className="h-5 w-24 ml-auto" />
      </td>
    </tr>
  );
}
