"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka } from "@/lib/format";
import type { PublicCourseDetails } from "../course-public-details-modal";

interface CourseAppBannerProps {
  course: PublicCourseDetails;
}

export function CourseAppBanner({ course }: CourseAppBannerProps) {
  return (
    <GlassCard className="p-6 md:p-7 border-jade/30 bg-gradient-to-br from-jade/[0.08] via-transparent to-transparent">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-jade px-2.5 py-0.5 rounded-md bg-jade/20 border border-jade/30">
              {course.code}
            </span>
            <span className="text-xs font-mono text-ink-faint">
              {course.department} · {course.credits} Credits ({course.type})
            </span>
            {course.prereq && (
              <span className="text-xs font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                Prereq: {course.prereq}
              </span>
            )}
          </div>

          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-ink-muted max-w-2xl leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-faint font-mono pt-1">
            <span>
              Faculty: <b className="text-ink">{course.instructor}</b>
            </span>
            <span>
              Room: <b className="text-ink">{course.room}</b>
            </span>
            <span>
              Slot: <b className="text-ink">{course.schedule}</b>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-right shrink-0">
          <span className="text-[10px] uppercase font-mono tracking-wider text-ink-faint block">
            Course Tuition Fee
          </span>
          <span className="font-display text-2xl font-bold font-mono text-jade block mt-0.5">
            {formatTaka(course.tuitionFee)}
          </span>
          <span className="text-[10px] text-ink-faint font-mono mt-1 block">
            Payable upon Admin approval
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
