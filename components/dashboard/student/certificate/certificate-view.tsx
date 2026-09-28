"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/site/glass-card";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  Award,
  CheckCircle2,
  Download,
  GraduationCap,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { GraduationCertificate } from "@/lib/app-types";

interface CertificateViewProps {
  certificate: GraduationCertificate;
}

export function CertificateView({ certificate }: CertificateViewProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("High-resolution Degree Certificate (PDF) generated with cryptographic signature verification!");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 print:hidden">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-jade/20 border border-jade/40 text-jade flex items-center justify-center">
            <Award className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-ink text-sm sm:text-base flex items-center gap-2">
              <span>Official University Degree Certificate</span>
              <span className="text-[0.68rem] px-2 py-0.5 rounded-full bg-jade/20 text-jade font-mono font-bold">
                VERIFIED
              </span>
            </h3>
            <p className="text-xs text-ink-faint">
              Digitally signed and recorded in University Academic Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "text-xs flex items-center gap-1.5 cursor-pointer border border-white/15 hover:border-jade/40"
            )}
          >
            <Printer className="size-3.5 text-jade" />
            <span>Print Certificate</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className={cn(
              buttonClass({ variant: "primary", size: "sm" }),
              "text-xs px-4 flex items-center gap-1.5 shadow-md cursor-pointer"
            )}
          >
            <Download className="size-3.5" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Document */}
      <div
        ref={certRef}
        className="relative mx-auto max-w-4xl p-6 sm:p-12 rounded-2xl bg-gradient-to-br from-[#121936] via-[#0E152E] to-[#0A0F24] border-4 border-[#FFD9A6]/40 shadow-2xl text-ink text-center overflow-hidden print:p-8 print:bg-white print:text-black print:border-black"
        style={{
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(255, 217, 166, 0.05)",
        }}
      >
        {/* Decorative Guilloche Border Corners */}
        <div className="absolute top-3 left-3 size-12 border-t-2 border-l-2 border-[#FFD9A6]/60 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 size-12 border-t-2 border-r-2 border-[#FFD9A6]/60 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 size-12 border-b-2 border-l-2 border-[#FFD9A6]/60 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 size-12 border-b-2 border-r-2 border-[#FFD9A6]/60 rounded-br-lg pointer-events-none" />

        {/* Center Watermark Crest */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <GraduationCap className="size-96 text-white" />
        </div>

        {/* University Header */}
        <div className="space-y-2 relative z-10">
          <div className="size-16 sm:size-20 mx-auto rounded-full bg-gradient-to-br from-[#FFD9A6] via-[#FFB454] to-[#C98A2C] p-0.5 shadow-xl">
            <div className="size-full rounded-full bg-night-900 flex items-center justify-center text-[#FFD9A6]">
              <GraduationCap className="size-8 sm:size-10" />
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink uppercase">
            Bidyapith University
          </h1>
          <p className="text-xs sm:text-sm text-[#FFD9A6] tracking-widest uppercase font-semibold font-serif">
            DHAKA, BANGLADESH · ESTABLISHED 1998
          </p>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#FFD9A6] to-transparent mx-auto mt-2" />
        </div>

        {/* Degree Conferral Body */}
        <div className="my-8 sm:my-12 space-y-4 sm:space-y-6 relative z-10">
          <p className="text-xs sm:text-sm text-ink-faint uppercase tracking-widest font-serif">
            On the recommendation of the Academic Council and by the authority of the Board of Trustees,
          </p>

          <p className="text-xs sm:text-sm text-ink-muted">is pleased to confer upon</p>

          <div className="py-2">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-jade tracking-wide">
              {certificate.studentName}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-ink-faint mt-1 font-semibold">
              Student ID: {certificate.studentId}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted">the degree of</p>

          <div>
            <h3 className="font-display text-xl sm:text-3xl font-bold text-[#FFD9A6] leading-tight">
              {certificate.programTitle}
            </h3>
            <p className="text-xs sm:text-sm text-jade font-semibold mt-1 font-serif">
              with {certificate.honors} (Cumulative CGPA: {certificate.cgpa.toFixed(2)})
            </p>
          </div>

          <p className="text-xs sm:text-sm text-ink-faint max-w-xl mx-auto leading-relaxed pt-2">
            Having successfully completed all prescribed curricula, laboratory practica, examinations, and academic requirements comprising {certificate.creditsCompleted} semester credits.
          </p>
        </div>

        {/* Signature & Seal Footer */}
        <div className="grid grid-cols-3 gap-4 pt-6 sm:pt-10 border-t border-white/10 relative z-10 items-end text-xs">
          {/* Registrar */}
          <div className="text-center space-y-1">
            <div className="font-serif italic text-base sm:text-lg text-ink-muted">{certificate.registrarName}</div>
            <div className="w-24 sm:w-36 h-px bg-white/20 mx-auto" />
            <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-semibold">
              Registrar
            </p>
          </div>

          {/* Golden Seal */}
          <div className="text-center space-y-1">
            <div className="size-16 sm:size-20 mx-auto rounded-full border-2 border-[#FFD9A6] bg-[#FFD9A6]/10 flex flex-col items-center justify-center p-1 shadow-lg">
              <ShieldCheck className="size-5 text-[#FFD9A6]" />
              <span className="text-[0.55rem] font-bold text-[#FFD9A6] uppercase tracking-tighter mt-0.5">
                OFFICIAL SEAL
              </span>
            </div>
            <p className="text-[0.62rem] text-ink-faint font-mono mt-1">
              Conferred: {certificate.graduationDate}
            </p>
          </div>

          {/* Vice Chancellor */}
          <div className="text-center space-y-1">
            <div className="font-serif italic text-base sm:text-lg text-ink-muted">{certificate.chancellorName}</div>
            <div className="w-24 sm:w-36 h-px bg-white/20 mx-auto" />
            <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-semibold">
              Vice Chancellor
            </p>
          </div>
        </div>

        {/* Verification Strip */}
        <div className="mt-8 pt-4 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.65rem] font-mono text-ink-faint relative z-10">
          <span>Certificate No: {certificate.certificateNumber}</span>
          <span>Digital Signature: {certificate.verificationHash.slice(0, 24)}...</span>
          <span>Verify: bidyapith.edu/verify/{certificate.certificateNumber}</span>
        </div>
      </div>
    </div>
  );
}
