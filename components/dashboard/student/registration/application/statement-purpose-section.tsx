"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";

interface StatementPurposeSectionProps {
  motivation: string;
  onMotivationChange: (val: string) => void;
  termsAgreed: boolean;
  onTermsAgreedChange: (val: boolean) => void;
}

export function StatementPurposeSection({
  motivation,
  onMotivationChange,
  termsAgreed,
  onTermsAgreedChange,
}: StatementPurposeSectionProps) {
  return (
    <GlassCard className="p-6 md:p-7 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-white/10">
        <BookOpen className="size-4 text-purple-400" />
        <h2 className="font-display text-base font-bold text-ink">
          4. Statement of Purpose / Academic Motivation
        </h2>
      </div>

      <div>
        <label className="block text-xs text-ink-faint font-medium mb-1.5">
          Briefly describe why you are taking this course and how it fits into your degree plan:
        </label>
        <textarea
          rows={4}
          required
          value={motivation}
          onChange={(e) => onMotivationChange(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-jade/50 leading-relaxed"
        />
      </div>

      <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAgreed}
          onChange={(e) => onTermsAgreedChange(e.target.checked)}
          className="mt-0.5 rounded bg-white/10 border-white/20 text-jade focus:ring-0 cursor-pointer"
        />
        <span className="text-xs text-ink-muted leading-snug">
          I certify that all attached academic transcripts and credentials are genuine and true. I understand that the course registration request will be routed to the <b>Admin & Registrar Office</b> for verification before tuition payment is unlocked.
        </span>
      </label>
    </GlassCard>
  );
}
