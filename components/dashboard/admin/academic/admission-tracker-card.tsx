"use client";

import React from "react";
import { Users } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";

interface AdmissionTrackerCardProps {
  acceptedCount: number;
  intakeCapacity: number;
  applicantsCount: number;
}

export function AdmissionTrackerCard({
  acceptedCount,
  intakeCapacity,
  applicantsCount,
}: AdmissionTrackerCardProps) {
  const capacityPct = intakeCapacity > 0 ? Math.round((acceptedCount / intakeCapacity) * 100) : 0;

  return (
    <GlassCard className="p-5 sm:p-7">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/8">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Users className="size-4 text-orchid" />
          <span>Undergraduate Admission Intake Tracker</span>
        </h3>
        <span className="text-xs text-jade font-semibold font-mono">
          {capacityPct}% Capacity Reached
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/8">
          <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-semibold">
            Intake Target
          </p>
          <p className="font-mono font-bold text-sm text-ink mt-1">
            {intakeCapacity.toLocaleString()}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/8">
          <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-semibold">
            Total Applicants
          </p>
          <p className="font-mono font-bold text-sm text-orchid mt-1">
            {applicantsCount.toLocaleString()}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/8">
          <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-semibold">
            Accepted & Enrolled
          </p>
          <p className="font-mono font-bold text-sm text-jade mt-1">
            {acceptedCount.toLocaleString()}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
