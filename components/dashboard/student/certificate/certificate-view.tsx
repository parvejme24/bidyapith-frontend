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

  const handleDownload = () => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Please allow popups to download the official PDF certificate");
        return;
      }

      const certificateHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bidyapith_Certificate_${certificate.studentId}_${certificate.studentName.replace(/\s+/g, "_")}</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 40px;
              background-color: #0A0F24;
              color: #F8FAFC;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .cert-card {
              position: relative;
              width: 100%;
              max-width: 960px;
              padding: 48px;
              border: 4px solid rgba(255, 217, 166, 0.6);
              border-radius: 20px;
              background: linear-gradient(135deg, #121936 0%, #0E152E 50%, #0A0F24 100%);
              text-align: center;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
              box-sizing: border-box;
            }
            .corner {
              position: absolute;
              width: 40px;
              height: 40px;
              border-color: #FFD9A6;
            }
            .tl { top: 12px; left: 12px; border-top: 3px solid; border-left: 3px solid; border-top-left-radius: 8px; }
            .tr { top: 12px; right: 12px; border-top: 3px solid; border-right: 3px solid; border-top-right-radius: 8px; }
            .bl { bottom: 12px; left: 12px; border-bottom: 3px solid; border-left: 3px solid; border-bottom-left-radius: 8px; }
            .br { bottom: 12px; right: 12px; border-bottom: 3px solid; border-right: 3px solid; border-bottom-right-radius: 8px; }
            .uni-crest {
              width: 64px;
              height: 64px;
              margin: 0 auto 12px;
              border-radius: 50%;
              background: linear-gradient(135deg, #FFD9A6, #FFB454, #C98A2C);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0A0F24;
              font-size: 28px;
              font-weight: bold;
            }
            h1 {
              font-size: 28px;
              margin: 0 0 4px 0;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #F8FAFC;
            }
            .location {
              font-size: 11px;
              letter-spacing: 3px;
              text-transform: uppercase;
              color: #FFD9A6;
              margin: 0 0 16px 0;
            }
            .rule {
              width: 120px;
              height: 2px;
              background: linear-gradient(to right, transparent, #FFD9A6, transparent);
              margin: 0 auto 24px;
            }
            .subtext {
              font-size: 12px;
              color: #94A3B8;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin: 8px 0;
            }
            .student-name {
              font-size: 36px;
              font-weight: 800;
              color: #2ED3A7;
              margin: 12px 0 4px 0;
              letter-spacing: 1px;
            }
            .student-id {
              font-family: monospace;
              font-size: 13px;
              color: #94A3B8;
              margin-bottom: 16px;
            }
            .degree-title {
              font-size: 24px;
              font-weight: bold;
              color: #FFD9A6;
              margin: 8px 0 4px 0;
            }
            .honors {
              font-size: 13px;
              color: #2ED3A7;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .desc {
              font-size: 12px;
              color: #94A3B8;
              max-width: 600px;
              margin: 0 auto 28px;
              line-height: 1.6;
            }
            .footer-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 16px;
              align-items: flex-end;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding-top: 24px;
              margin-top: 16px;
            }
            .sig-name {
              font-style: italic;
              font-size: 16px;
              color: #E2E8F0;
              margin-bottom: 4px;
            }
            .sig-line {
              width: 120px;
              height: 1px;
              background: rgba(255, 255, 255, 0.3);
              margin: 0 auto 6px;
            }
            .sig-title {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748B;
            }
            .seal-box {
              width: 68px;
              height: 68px;
              margin: 0 auto 4px;
              border-radius: 50%;
              border: 2px solid #FFD9A6;
              background: rgba(255, 217, 166, 0.1);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #FFD9A6;
              font-size: 8px;
              font-weight: bold;
            }
            .verify-strip {
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px solid rgba(255, 255, 255, 0.08);
              display: flex;
              justify-content: space-between;
              font-family: monospace;
              font-size: 9px;
              color: #64748B;
            }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>

            <div class="uni-crest">🎓</div>
            <h1>Bidyapith University</h1>
            <div class="location">Dhaka, Bangladesh · Established 1998</div>
            <div class="rule"></div>

            <div class="subtext">On the recommendation of the Academic Council and by the authority of the Board of Trustees,</div>
            <div style="font-size: 11px; color: #64748B; margin: 4px 0;">is pleased to confer upon</div>

            <div class="student-name">${certificate.studentName}</div>
            <div class="student-id">Student ID: ${certificate.studentId}</div>

            <div style="font-size: 11px; color: #64748B;">the degree of</div>
            <div class="degree-title">${certificate.programTitle}</div>
            <div class="honors">with ${certificate.honors} (Cumulative CGPA: ${certificate.cgpa.toFixed(2)})</div>

            <div class="desc">
              Having successfully completed all prescribed curricula, laboratory practica, examinations, and academic requirements comprising ${certificate.creditsCompleted} semester credits.
            </div>

            <div class="footer-grid">
              <div>
                <div class="sig-name">${certificate.registrarName}</div>
                <div class="sig-line"></div>
                <div class="sig-title">Registrar</div>
              </div>

              <div>
                <div class="seal-box">
                  <span style="font-size: 14px;">🛡️</span>
                  <span>OFFICIAL SEAL</span>
                </div>
                <div style="font-size: 9px; color: #64748B; font-family: monospace;">
                  Conferred: ${certificate.graduationDate}
                </div>
              </div>

              <div>
                <div class="sig-name">${certificate.chancellorName}</div>
                <div class="sig-line"></div>
                <div class="sig-title">Vice Chancellor</div>
              </div>
            </div>

            <div class="verify-strip">
              <span>Certificate No: ${certificate.certificateNumber}</span>
              <span>Digital Signature: ${certificate.verificationHash.slice(0, 28)}...</span>
              <span>Verify: bidyapith.edu/verify/${certificate.certificateNumber}</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(certificateHtml);
      printWindow.document.close();
      toast.success("Generating Official Degree Certificate PDF...");
    } catch (err) {
      toast.error("Failed to generate PDF certificate. Please try again.");
    }
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
            onClick={handleDownload}
            className={cn(
              buttonClass({ variant: "primary", size: "sm" }),
              "text-xs px-4 flex items-center gap-1.5 shadow-md cursor-pointer bg-jade text-night-900 font-bold hover:bg-jade/90"
            )}
          >
            <Download className="size-3.5" />
            <span>Download Official PDF Certificate</span>
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
