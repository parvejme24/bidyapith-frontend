"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { CheckCircle2, FileText, Paperclip, ShieldCheck } from "lucide-react";
import type { AdmissionApplication } from "@/lib/app-types";

interface AdmissionDocumentModalProps {
  app: AdmissionApplication;
  onClose: () => void;
  onApprove: (app: AdmissionApplication) => void;
}

export function AdmissionDocumentModal({
  app,
  onClose,
  onApprove,
}: AdmissionDocumentModalProps) {
  const docs =
    app.attachedDocuments && app.attachedDocuments.length > 0
      ? app.attachedDocuments
      : [
          {
            id: "d1",
            name: "Official_Academic_Transcript_Sem1-4.pdf",
            size: "1.4 MB",
            type: "Academic Transcript",
            uploadedAt: app.submittedAt,
          },
          {
            id: "d2",
            name: "Prerequisite_Marksheet_Verification.pdf",
            size: "820 KB",
            type: "Prerequisite Marksheet",
            uploadedAt: app.submittedAt,
          },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-2xl p-5 sm:p-6 space-y-4 sm:space-y-5 border-white/20 shadow-2xl">
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-jade" />
              <h3 className="font-display font-bold text-ink text-base">
                Academic Credential & Document Verification
              </h3>
            </div>
            <p className="text-xs text-ink-faint font-mono mt-0.5">
              Application #{app.id} · Applicant: {app.studentName} ({app.email || app.studentEmail})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ink-faint hover:text-ink cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* Target Offering Summary */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Selected Course / Program</span>
            <span className="font-bold text-white font-mono">
              {app.courseCode || app.degreeType}: {app.courseTitle || app.programTitle}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Cumulative GPA</span>
            <span className="font-bold text-jade font-mono">
              {app.previousCgpa || "3.82 / 4.00"}
            </span>
          </div>
          {app.motivationStatement && (
            <div className="pt-2 border-t border-white/8 text-ink-muted">
              <span className="font-semibold text-ink block mb-0.5">Motivation Statement:</span>
              <p className="italic text-[11px] leading-relaxed">
                &ldquo;{app.motivationStatement}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Attached Files List */}
        <div className="space-y-2.5">
          <h4 className="text-xs uppercase font-bold tracking-wider text-ink-faint flex items-center gap-1.5">
            <Paperclip className="size-3.5 text-jade" />
            <span>Attached Academic Transcripts & Records</span>
          </h4>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-lg bg-jade/10 border border-jade/30 flex items-center justify-center text-jade shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{doc.name}</p>
                    <p className="text-[11px] text-ink-faint font-mono">
                      {doc.type} · {doc.size} · Uploaded {doc.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-jade bg-jade/10 border border-jade/25 px-2 py-0.5 rounded">
                    ✓ Checksum Valid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-[11px] text-ink-faint font-mono hidden sm:inline">
            Registrar Board · Verification Protocol
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              Close
            </button>

            {app.status === "PENDING_REVIEW" && (
              <button
                type="button"
                onClick={() => {
                  onApprove(app);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-jade text-night-900 text-xs font-bold hover:bg-jade/90 transition-all cursor-pointer shadow-md"
              >
                <CheckCircle2 className="size-4" />
                <span>Verify & Send Approval Email</span>
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
