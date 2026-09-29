"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { Award, CheckCircle2, Layers, TrendingUp } from "lucide-react";

interface ResultsMetricCardsProps {
  totalSubmissions: number;
  publishedCount: number;
  avgGpa: string;
  passRate: string;
}

export function ResultsMetricCards({
  totalSubmissions,
  publishedCount,
  avgGpa,
  passRate,
}: ResultsMetricCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
      <GlassCard className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[0.72rem] sm:text-xs text-ink-faint font-medium">Submitted Sections</span>
          <Layers className="size-3.5 sm:size-4 text-jade" />
        </div>
        <p className="font-display text-xl sm:text-2xl font-bold text-ink">{totalSubmissions}</p>
        <p className="text-[0.68rem] sm:text-[0.72rem] text-jade mt-0.5">100% faculty submission rate</p>
      </GlassCard>

      <GlassCard className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[0.72rem] sm:text-xs text-ink-faint font-medium">Published Grades</span>
          <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-400" />
        </div>
        <p className="font-display text-xl sm:text-2xl font-bold text-ink">{publishedCount}</p>
        <p className="text-[0.68rem] sm:text-[0.72rem] text-ink-faint mt-0.5">
          {publishedCount} of {totalSubmissions} live
        </p>
      </GlassCard>

      <GlassCard className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[0.72rem] sm:text-xs text-ink-faint font-medium">University Avg GPA</span>
          <TrendingUp className="size-3.5 sm:size-4 text-sky-400" />
        </div>
        <p className="font-display text-xl sm:text-2xl font-bold text-jade">{avgGpa}</p>
        <p className="text-[0.68rem] sm:text-[0.72rem] text-ink-faint mt-0.5">Across all departments</p>
      </GlassCard>

      <GlassCard className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[0.72rem] sm:text-xs text-ink-faint font-medium">Pass Rate</span>
          <Award className="size-3.5 sm:size-4 text-marigold" />
        </div>
        <p className="font-display text-xl sm:text-2xl font-bold text-ink">{passRate}%</p>
        <p className="text-[0.68rem] sm:text-[0.72rem] text-emerald-400 mt-0.5">GPA &ge; 2.00 threshold</p>
      </GlassCard>
    </div>
  );
}
