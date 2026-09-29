"use client";

import React from "react";
import { Award, Download, FileImage, Lock, Printer } from "lucide-react";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface CertificateStatusBannerProps {
  isLocked: boolean;
  onDownloadPng: () => void;
  onDownloadPdf: () => void;
}

export function CertificateStatusBanner({
  isLocked,
  onDownloadPng,
  onDownloadPdf,
}: CertificateStatusBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 rounded-lg flex items-center justify-center shrink-0",
            isLocked
              ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
              : "bg-jade/20 border border-jade/40 text-jade"
          )}
        >
          {isLocked ? <Lock className="size-5" /> : <Award className="size-5" />}
        </div>
        <div>
          <h3 className="font-bold text-ink text-sm sm:text-base flex items-center gap-2">
            <span>Official University Degree Certificate</span>
            <span
              className={cn(
                "text-[0.68rem] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider",
                isLocked
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-jade/20 text-jade"
              )}
            >
              {isLocked ? "LOCKED · CLEARANCE PENDING" : "VERIFIED & ISSUED"}
            </span>
          </h3>
          <p className="text-xs text-ink-faint">
            {isLocked
              ? "Certificate unlocks when all semesters, total tuition payments, and passing marks are completed"
              : "Digitally verified and recorded in Bidyapith Open University Registry"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isLocked ? (
          <button
            type="button"
            disabled
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "text-xs px-4 flex items-center gap-2 opacity-60 cursor-not-allowed bg-white/[0.04] border border-white/10 text-ink-muted"
            )}
          >
            <Lock className="size-3.5 text-amber-400" />
            <span>Certificate Locked (Not Downloadable)</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onDownloadPng}
              className={cn(
                buttonClass({ variant: "primary", size: "sm" }),
                "text-xs px-3.5 sm:px-4 flex items-center gap-1.5 shadow-md cursor-pointer bg-jade text-night-900 font-bold hover:bg-jade/90"
              )}
              title="Download high-resolution certificate image in PNG format"
            >
              <FileImage className="size-3.5" />
              <span>Download (.PNG)</span>
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              className={cn(
                buttonClass({ variant: "ghost", size: "sm" }),
                "text-xs px-3.5 sm:px-4 flex items-center gap-1.5 cursor-pointer hover:border-jade/40"
              )}
              title="Print official certificate document"
            >
              <Printer className="size-3.5 text-jade" />
              <span>Print / PDF</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
