"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface GraduationAuditProps {
  creditsDone: number;
  creditsNeeded: number;
  cgpa: number;
  programTitle: string;
  isGraduated: boolean;
  onViewCertificate: () => void;
}

export function GraduationAudit({
  creditsDone,
  creditsNeeded,
  cgpa,
  programTitle,
  isGraduated,
  onViewCertificate,
}: GraduationAuditProps) {
  const completionPct = Math.round((creditsDone / creditsNeeded) * 100);
  const isEligible = creditsDone >= creditsNeeded && cgpa >= 2.0;

  return (
    <div className="space-y-4">
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Degree Status"
          value={isGraduated || isEligible ? "Graduated" : "In Progress"}
          detail={isEligible ? "Degree requirements fulfilled" : `${creditsNeeded - creditsDone} credits remaining`}
          tone={isGraduated || isEligible ? "up" : "gold"}
        />
        <StatTile
          label="Credits Completed"
          value={`${creditsDone} / ${creditsNeeded}`}
          detail={`${completionPct}% completed`}
          tone="up"
        />
        <StatTile
          label="Graduation CGPA"
          value={cgpa.toFixed(2)}
          detail={cgpa >= 3.75 ? "Summa Cum Laude" : cgpa >= 3.5 ? "Magna Cum Laude" : "Good Standing"}
          tone="up"
        />
        <StatTile
          label="Degree Clearance"
          value="Cleared"
          detail="Accounts & Library cleared"
          tone="up"
        />
      </div>

      {/* Graduation Eligibility Banner */}
      <GlassCard className="p-5 sm:p-6 rounded-2xl border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="size-12 rounded-xl bg-jade/15 border border-jade/30 flex items-center justify-center text-jade shrink-0 shadow-md">
            <GraduationCap className="size-6" />
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                {programTitle}
              </h3>
              <StatusPill tone="ok">DEGREE CONFERRED</StatusPill>
            </div>
            <p className="text-xs text-ink-faint">
              The Academic Council has confirmed completion of all degree requirements. Your official degree certificate is ready for download and physical printing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewCertificate}
          className={cn(
            buttonClass({ variant: "primary", size: "sm" }),
            "text-xs px-5 shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
          )}
        >
          <Award className="size-3.5" />
          <span>View Degree Certificate</span>
        </button>
      </GlassCard>

      {/* Checklist Audit */}
      <GlassCard className="p-5 sm:p-6 rounded-2xl border-white/10 space-y-3">
        <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
          University Graduation Clearance Checklist
        </h4>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white/[0.025] border border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-jade" />
              <span className="text-ink">140 Minimum Semester Credits</span>
            </div>
            <span className="font-mono font-bold text-jade">{creditsDone} Cr</span>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.025] border border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-jade" />
              <span className="text-ink">Minimum 2.00 Cumulative CGPA</span>
            </div>
            <span className="font-mono font-bold text-jade">{cgpa.toFixed(2)}</span>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.025] border border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-jade" />
              <span className="text-ink">Senior Capstone Thesis Defense</span>
            </div>
            <span className="text-[0.7rem] px-2 py-0.5 rounded bg-jade/15 text-jade font-bold">PASSED (A+)</span>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.025] border border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-jade" />
              <span className="text-ink">University Dues & Library Clearance</span>
            </div>
            <span className="text-[0.7rem] px-2 py-0.5 rounded bg-jade/15 text-jade font-bold">CLEARED</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
