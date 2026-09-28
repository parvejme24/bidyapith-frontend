"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Download,
  FileImage,
  FileText,
  GraduationCap,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  exportReceiptAsPdf,
  exportReceiptAsPng,
  type ReceiptData,
} from "./receipt-exporter";

interface ReceiptCardProps {
  data: ReceiptData;
  onDismiss?: () => void;
}

export function ReceiptCard({ data, onDismiss }: ReceiptCardProps) {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    } else {
      router.push("/student/courses?role=student");
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Main Success Hero Receipt */}
      <GlassCard className="p-6 sm:p-10 rounded-2xl border-jade/40 bg-gradient-to-b from-jade/[0.08] via-night-900 to-night-950 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Top Dismiss/Delete Button */}
        <button
          type="button"
          onClick={handleDismiss}
          title="Dismiss Receipt"
          className="absolute top-4 right-4 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-rose/20 hover:text-rose hover:border-rose/30 text-ink-muted transition-colors cursor-pointer z-20"
        >
          <X className="size-4" />
        </button>

        {/* Background Watermark Crest */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <GraduationCap className="size-96 text-jade" />
        </div>

        {/* Checkmark Animation Icon */}
        <div className="relative z-10 size-20 rounded-full bg-gradient-to-tr from-jade/20 via-jade/40 to-jade border-2 border-jade text-night-950 flex items-center justify-center mx-auto shadow-xl ring-8 ring-jade/10">
          <CheckCircle2 className="size-10 text-night-900 stroke-[2.5]" />
        </div>

        {/* Title & Congratulations */}
        <div className="space-y-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-jade/20 text-jade border border-jade/40 font-mono">
            <Sparkles className="size-3.5" />
            <span>Tuition Clearance Confirmed</span>
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Semester {data.semesterNum} Unlocked Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            Your payment of <b className="text-jade font-mono text-base">{formatTaka(data.totalPaid)}</b> has been cleared via <b className="text-ink">{data.gateway}</b>. Your course routine and laboratory slots are now active.
          </p>
        </div>

        {/* Itemized Clearance Card */}
        <div className="relative z-10 max-w-2xl mx-auto rounded-xl border border-white/10 bg-black/40 p-5 sm:p-6 text-left space-y-4 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-mono">Official Receipt</p>
              <p className="font-mono text-sm font-bold text-ink">{data.receiptNumber}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-mono">Cleared Timestamp</p>
              <p className="font-mono text-xs text-ink-muted">{data.paymentDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-ink-faint block text-[0.68rem]">Student ID</span>
              <span className="font-bold text-jade">{data.studentId}</span>
            </div>
            <div>
              <span className="text-ink-faint block text-[0.68rem]">Program</span>
              <span className="font-semibold text-ink">{data.programCode}</span>
            </div>
            <div>
              <span className="text-ink-faint block text-[0.68rem]">Gateway</span>
              <span className="font-semibold text-ink">{data.gateway}</span>
            </div>
            <div>
              <span className="text-ink-faint block text-[0.68rem]">Payment Status</span>
              <span className="text-jade font-bold">● SETTLED</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-ink-faint">
            <span className="truncate">Transaction Hash: <b className="text-ink">{data.transactionRef}</b></span>
            <span className="text-jade font-semibold shrink-0">100% Institutional Receipt</span>
          </div>
        </div>

        {/* Download Formats & Action Buttons */}
        <div className="relative z-10 pt-2 flex flex-wrap items-center justify-center gap-3">
          {/* 1. PDF Download */}
          <button
            type="button"
            onClick={() => exportReceiptAsPdf(data)}
            className={cn(
              buttonClass({ variant: "ghost", size: "default" }),
              "px-5 text-xs flex items-center justify-center gap-2 border border-white/20 hover:border-jade/40 hover:text-jade cursor-pointer"
            )}
          >
            <FileText className="size-4 text-jade" />
            <span>Download Official PDF</span>
          </button>

          {/* 2. PNG Download */}
          <button
            type="button"
            onClick={() => exportReceiptAsPng(data)}
            className={cn(
              buttonClass({ variant: "ghost", size: "default" }),
              "px-5 text-xs flex items-center justify-center gap-2 border border-white/20 hover:border-jade/40 hover:text-jade cursor-pointer"
            )}
          >
            <FileImage className="size-4 text-jade" />
            <span>Download PNG Image</span>
          </button>

          {/* 3. Continue to Courses */}
          <button
            type="button"
            onClick={() => router.push("/student/courses?role=student")}
            className={cn(
              buttonClass({ variant: "primary", size: "default" }),
              "px-7 text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            )}
          >
            <BookOpen className="size-4" />
            <span>View Courses & Routine</span>
          </button>

          {/* 4. Dismiss Action */}
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              buttonClass({ variant: "ghost", size: "default" }),
              "px-4 text-xs text-ink-faint hover:text-rose hover:bg-rose/10 cursor-pointer"
            )}
            title="Dismiss and close receipt"
          >
            <Trash2 className="size-3.5 mr-1" />
            <span>Close Receipt</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
