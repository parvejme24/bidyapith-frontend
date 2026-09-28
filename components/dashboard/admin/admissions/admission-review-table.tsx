"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Mail,
  Award,
  Clock,
  Sparkles,
  Paperclip,
  Eye,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Send,
} from "lucide-react";
import { StatusPill } from "@/components/dashboard/status-pill";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AdmissionApplication, AttachedDocument } from "@/lib/app-types";

export function AdmissionReviewTable() {
  const { admissionApplications, approveAdmission, rejectAdmission } = useApp();
  const [selectedAppForDocs, setSelectedAppForDocs] = useState<AdmissionApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING_REVIEW" | "APPROVED" | "ENROLLED" | "REJECTED">("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "COURSE_REGISTRATION" | "DEGREE_ADMISSION">("ALL");

  const filteredApps = admissionApplications.filter((a) => {
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesType =
      typeFilter === "ALL" ||
      (typeFilter === "COURSE_REGISTRATION" && (a.applicationType === "COURSE_REGISTRATION" || Boolean(a.courseCode))) ||
      (typeFilter === "DEGREE_ADMISSION" && a.applicationType !== "COURSE_REGISTRATION" && !a.courseCode);
    return matchesStatus && matchesType;
  });

  const pendingCount = admissionApplications.filter((a) => a.status === "PENDING_REVIEW").length;
  const approvedCount = admissionApplications.filter((a) => a.status === "APPROVED").length;
  const enrolledCount = admissionApplications.filter((a) => a.status === "ENROLLED").length;
  const courseAppsCount = admissionApplications.filter((a) => a.applicationType === "COURSE_REGISTRATION" || Boolean(a.courseCode)).length;

  const handleApprove = (app: AdmissionApplication) => {
    approveAdmission(app.id);
    const targetName = app.courseCode || app.programTitle || "Course";
    const studentEmail = app.email || app.studentEmail || "student@bidyapith.edu.bd";

    toast.success(
      <div className="space-y-1">
        <p className="font-bold">✓ Application #{app.id} Verified & Approved</p>
        <p className="text-[11px] text-ink-muted">
          📧 Simulated Email sent to <b>{studentEmail}</b>: &ldquo;Your academic documents for {targetName} are verified. Proceed to pay tuition.&rdquo;
        </p>
      </div>,
      { duration: 6000 }
    );
  };

  const handleReject = (app: AdmissionApplication) => {
    rejectAdmission(app.id);
    toast.error(`Application #${app.id} marked as Rejected.`);
  };

  return (
    <div className="space-y-5">
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "ALL" ? "bg-white/10 text-ink shadow-xs" : "text-ink-muted hover:text-ink"
            )}
          >
            All ({admissionApplications.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PENDING_REVIEW")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              statusFilter === "PENDING_REVIEW" ? "bg-amber-400/20 text-amber-300 font-bold" : "text-ink-muted hover:text-ink"
            )}
          >
            <Clock className="size-3 text-amber-400" />
            <span>Pending Review ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("APPROVED")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              statusFilter === "APPROVED" ? "bg-jade/20 text-jade font-bold" : "text-ink-muted hover:text-ink"
            )}
          >
            <CheckCircle2 className="size-3 text-jade" />
            <span>Approved / Ready for Payment ({approvedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("ENROLLED")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              statusFilter === "ENROLLED" ? "bg-sky-400/20 text-sky-300 font-bold" : "text-ink-muted hover:text-ink"
            )}
          >
            <Sparkles className="size-3 text-sky-400" />
            <span>Enrolled & Paid ({enrolledCount})</span>
          </button>
        </div>

        {/* Application Type Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
              typeFilter === "ALL" ? "bg-white/10 text-ink" : "text-ink-faint hover:text-ink"
            )}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("COURSE_REGISTRATION")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1",
              typeFilter === "COURSE_REGISTRATION" ? "bg-jade/20 text-jade font-bold" : "text-ink-faint hover:text-ink"
            )}
          >
            <BookOpen className="size-3" />
            <span>Course Registrations ({courseAppsCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("DEGREE_ADMISSION")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1",
              typeFilter === "DEGREE_ADMISSION" ? "bg-purple-500/20 text-purple-300 font-bold" : "text-ink-faint hover:text-ink"
            )}
          >
            <GraduationCap className="size-3" />
            <span>Degree Admissions</span>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Applicant Profile</th>
                <th className="px-4 py-3">Target Offering / Course</th>
                <th className="px-4 py-3">Academic GPA & Standing</th>
                <th className="px-4 py-3">Documents</th>
                <th className="px-4 py-3">Tuition Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-faint font-sans">
                    No applications match the current filter selection.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const isCourseApp = app.applicationType === "COURSE_REGISTRATION" || Boolean(app.courseCode);
                  const docs = app.attachedDocuments || [
                    {
                      id: "d1",
                      name: "Official_Academic_Transcript.pdf",
                      size: "1.4 MB",
                      type: "Academic Transcript",
                      uploadedAt: app.submittedAt,
                    },
                    {
                      id: "d2",
                      name: "Prerequisite_Grade_Record.pdf",
                      size: "850 KB",
                      type: "Prerequisite Marksheet",
                      uploadedAt: app.submittedAt,
                    },
                  ];

                  return (
                    <tr key={app.id} className="hover:bg-white/[0.035] transition-colors">
                      {/* Applicant Profile */}
                      <td className="px-4 py-3 font-sans">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={app.studentName} size="sm" tone={isCourseApp ? "jade" : "gold"} />
                          <div>
                            <p className="font-semibold text-ink leading-tight">{app.studentName}</p>
                            <p className="text-[0.7rem] text-ink-muted font-mono">{app.email || app.studentEmail}</p>
                            <p className="text-[0.68rem] text-ink-faint font-mono">{app.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Course / Program Title */}
                      <td className="px-4 py-3 font-sans">
                        <div className="flex items-center gap-1.5">
                          {isCourseApp ? (
                            <span className="px-2 py-0.5 rounded text-[0.68rem] font-mono font-bold uppercase bg-jade/15 text-jade border border-jade/30">
                              {app.courseCode || "Course"}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[0.68rem] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              {app.degreeType || "Degree"}
                            </span>
                          )}
                          <span className="font-medium text-ink text-xs line-clamp-1">
                            {app.courseTitle || app.programTitle || app.programName}
                          </span>
                        </div>
                        <p className="text-[0.68rem] text-ink-faint mt-0.5 font-mono">
                          App #{app.id} · Submitted {app.submittedAt}
                        </p>
                      </td>

                      {/* GPA Credentials */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-xs">
                          {app.previousCgpa ? (
                            <span>CGPA: <b className="text-jade">{app.previousCgpa}</b></span>
                          ) : app.hscGpa ? (
                            <span>HSC: <b className="text-jade">{app.hscGpa}</b></span>
                          ) : (
                            <span className="text-jade font-bold">3.82</span>
                          )}
                        </div>
                        <p className="text-[0.68rem] text-ink-faint font-sans truncate max-w-[150px]">
                          {app.previousDegree || app.previousInstitute || "Bidyapith Student"}
                        </p>
                      </td>

                      {/* Attached Documents */}
                      <td className="px-4 py-3 font-sans">
                        <button
                          type="button"
                          onClick={() => setSelectedAppForDocs(app)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-jade border border-white/10 transition-colors cursor-pointer"
                        >
                          <Paperclip className="size-3" />
                          <span>{docs.length} Docs</span>
                          <Eye className="size-3 text-ink-faint ml-0.5" />
                        </button>
                      </td>

                      {/* Tuition Fee */}
                      <td className="px-4 py-3 font-sans">
                        <p className="font-bold text-ink font-mono">{formatTaka(app.admissionFee)}</p>
                        <p className="text-[0.68rem] font-mono">
                          {app.isPaid || app.paymentStatus === "PAID" || app.status === "ENROLLED" ? (
                            <span className="text-jade font-bold">● Paid</span>
                          ) : (
                            <span className="text-amber-400">○ Pending</span>
                          )}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 font-sans">
                        <StatusPill
                          tone={
                            app.status === "ENROLLED"
                              ? "ok"
                              : app.status === "APPROVED"
                              ? "info"
                              : app.status === "REJECTED"
                              ? "bad"
                              : "warn"
                          }
                        >
                          {app.status === "PENDING_REVIEW"
                            ? "Under Review"
                            : app.status === "APPROVED"
                            ? "Approved"
                            : app.status === "ENROLLED"
                            ? "Enrolled"
                            : "Rejected"}
                        </StatusPill>
                      </td>

                      {/* Review Actions */}
                      <td className="px-4 py-3 text-right font-sans">
                        {app.status === "PENDING_REVIEW" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApprove(app)}
                              className={cn(
                                buttonClass({ variant: "primary", size: "sm" }),
                                "h-7 px-2.5 text-xs bg-jade text-night-900 font-bold hover:bg-jade/90 cursor-pointer"
                              )}
                              title="Verify Documents & Approve for Payment"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>Verify & Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(app)}
                              className={cn(
                                buttonClass({ variant: "ghost", size: "sm" }),
                                "h-7 px-2 text-xs text-rose hover:bg-rose/10 hover:border-rose/30 cursor-pointer"
                              )}
                              title="Reject Application"
                            >
                              <XCircle className="size-3.5" />
                            </button>
                          </div>
                        ) : app.status === "APPROVED" ? (
                          <div className="text-right">
                            <span className="text-[0.72rem] text-jade font-medium block">
                              ✓ Verified & Approved
                            </span>
                            <span className="text-[0.68rem] text-ink-faint font-mono">
                              Email Sent · Awaiting Fee
                            </span>
                          </div>
                        ) : app.status === "ENROLLED" ? (
                          <span className="text-[0.72rem] text-sky-400 font-medium">
                            Enrolled & Synced
                          </span>
                        ) : (
                          <span className="text-[0.72rem] text-rose font-medium">
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Document Inspector Modal for Admin */}
      {selectedAppForDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-2xl p-6 space-y-5 border-white/20 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-jade" />
                  <h3 className="font-display font-bold text-ink text-base">
                    Academic Credential & Document Verification
                  </h3>
                </div>
                <p className="text-xs text-ink-faint font-mono mt-0.5">
                  Application #{selectedAppForDocs.id} · Applicant: {selectedAppForDocs.studentName} ({selectedAppForDocs.email || selectedAppForDocs.studentEmail})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForDocs(null)}
                className="text-xs text-ink-faint hover:text-ink cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Target Offering Summary */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Selected Course / Program</span>
                <span className="font-bold text-white font-mono">
                  {selectedAppForDocs.courseCode || selectedAppForDocs.degreeType}: {selectedAppForDocs.courseTitle || selectedAppForDocs.programTitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Cumulative GPA</span>
                <span className="font-bold text-jade font-mono">
                  {selectedAppForDocs.previousCgpa || "3.82 / 4.00"}
                </span>
              </div>
              {selectedAppForDocs.motivationStatement && (
                <div className="pt-2 border-t border-white/8 text-ink-muted">
                  <span className="font-semibold text-ink block mb-0.5">Motivation Statement:</span>
                  <p className="italic text-[11px] leading-relaxed">
                    &ldquo;{selectedAppForDocs.motivationStatement}&rdquo;
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
                {(selectedAppForDocs.attachedDocuments && selectedAppForDocs.attachedDocuments.length > 0
                  ? selectedAppForDocs.attachedDocuments
                  : [
                      {
                        id: "d1",
                        name: "Official_Academic_Transcript_Sem1-4.pdf",
                        size: "1.4 MB",
                        type: "Academic Transcript",
                        uploadedAt: selectedAppForDocs.submittedAt,
                      },
                      {
                        id: "d2",
                        name: "Prerequisite_Marksheet_Verification.pdf",
                        size: "820 KB",
                        type: "Prerequisite Marksheet",
                        uploadedAt: selectedAppForDocs.submittedAt,
                      },
                    ]
                ).map((doc) => (
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
              <span className="text-[11px] text-ink-faint font-mono">
                Registrar Board · Verification Protocol
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppForDocs(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                >
                  Close
                </button>

                {selectedAppForDocs.status === "PENDING_REVIEW" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(selectedAppForDocs);
                      setSelectedAppForDocs(null);
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
      )}
    </div>
  );
}
