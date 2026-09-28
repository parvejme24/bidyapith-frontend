"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, FileText, Phone, Mail, Award, Clock, Sparkles } from "lucide-react";
import { StatusPill } from "@/components/dashboard/status-pill";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AdmissionApplication } from "@/lib/app-types";

export function AdmissionReviewTable() {
  const { admissionApplications, approveAdmission, rejectAdmission } = useApp();
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING_REVIEW" | "APPROVED" | "ENROLLED" | "REJECTED">("ALL");

  const filteredApps = admissionApplications.filter((a) => {
    if (filter === "ALL") return true;
    return a.status === filter;
  });

  const pendingCount = admissionApplications.filter((a) => a.status === "PENDING_REVIEW").length;
  const approvedCount = admissionApplications.filter((a) => a.status === "APPROVED").length;
  const enrolledCount = admissionApplications.filter((a) => a.status === "ENROLLED").length;

  const handleApprove = (app: AdmissionApplication) => {
    approveAdmission(app.id);
    toast.success(`Application #${app.id} approved! Student is now invited to pay admission fee.`);
    if (selectedApp?.id === app.id) {
      setSelectedApp((prev) => prev ? { ...prev, status: "APPROVED" } : null);
    }
  };

  const handleReject = (app: AdmissionApplication) => {
    rejectAdmission(app.id);
    toast.error(`Application #${app.id} marked as Rejected.`);
    if (selectedApp?.id === app.id) {
      setSelectedApp((prev) => prev ? { ...prev, status: "REJECTED" } : null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mini stats & filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              filter === "ALL" ? "bg-white/10 text-ink shadow-xs" : "text-ink-muted hover:text-ink"
            )}
          >
            All ({admissionApplications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("PENDING_REVIEW")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              filter === "PENDING_REVIEW" ? "bg-amber-400/20 text-amber-300 font-bold" : "text-ink-muted hover:text-ink"
            )}
          >
            <Clock className="size-3 text-amber-400" />
            <span>Pending Review ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("APPROVED")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              filter === "APPROVED" ? "bg-jade/20 text-jade font-bold" : "text-ink-muted hover:text-ink"
            )}
          >
            <CheckCircle2 className="size-3 text-jade" />
            <span>Approved / Awaiting Fee ({approvedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("ENROLLED")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              filter === "ENROLLED" ? "bg-sky-400/20 text-sky-300 font-bold" : "text-ink-muted hover:text-ink"
            )}
          >
            <Sparkles className="size-3 text-sky-400" />
            <span>Enrolled ({enrolledCount})</span>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Selected Degree Course</th>
                <th className="px-4 py-3">Academic GPA</th>
                <th className="px-4 py-3">Admission Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-faint font-sans">
                    No admission applications found for this filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.035] transition-colors">
                    {/* Applicant Profile */}
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={app.studentName} size="sm" tone="jade" />
                        <div>
                          <p className="font-semibold text-ink leading-tight">{app.studentName}</p>
                          <p className="text-[0.7rem] text-ink-muted font-mono">{app.email || app.studentEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Degree Course */}
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[0.68rem] font-mono font-bold uppercase",
                          app.degreeType === "B.Sc." ? "bg-jade/15 text-jade border border-jade/30" : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                        )}>
                          {app.degreeType}
                        </span>
                        <span className="font-medium text-ink text-xs">{app.programTitle || app.programName}</span>
                      </div>
                      <p className="text-[0.68rem] text-ink-faint mt-0.5 font-mono">App #{app.id} · Submitted {app.submittedAt}</p>
                    </td>

                    {/* GPA Credentials */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-xs">
                        {app.previousCgpa ? (
                          <span>CGPA: <b className="text-jade">{app.previousCgpa}</b></span>
                        ) : app.hscGpa ? (
                          <span>HSC: <b className="text-jade">{app.hscGpa}</b></span>
                        ) : null}
                      </div>
                      <p className="text-[0.68rem] text-ink-faint font-sans truncate max-w-[180px]">
                        {app.previousDegree || app.previousInstitute || "College / University"}
                      </p>
                    </td>

                    {/* Fee Status */}
                    <td className="px-4 py-3 font-sans">
                      <p className="font-bold text-ink font-mono">{formatTaka(app.admissionFee)}</p>
                      <p className="text-[0.68rem] font-mono">
                        {app.isPaid || app.paymentStatus === "PAID" ? (
                          <span className="text-jade font-bold">● Paid</span>
                        ) : (
                          <span className="text-amber-400">○ Pending</span>
                        )}
                      </p>
                    </td>

                    {/* Admission Status */}
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
                        {app.status === "PENDING_REVIEW" ? "Under Review" : app.status}
                      </StatusPill>
                    </td>

                    {/* Admin Action Buttons */}
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
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(app)}
                            className={cn(
                              buttonClass({ variant: "ghost", size: "sm" }),
                              "h-7 px-2 text-xs text-rose hover:bg-rose/10 hover:border-rose/30 cursor-pointer"
                            )}
                          >
                            <XCircle className="size-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : app.status === "APPROVED" ? (
                        <span className="text-[0.72rem] text-jade font-medium">
                          Approved · Waiting for student fee
                        </span>
                      ) : app.status === "ENROLLED" ? (
                        <span className="text-[0.72rem] text-sky-400 font-medium">
                          Fully Enrolled
                        </span>
                      ) : (
                        <span className="text-[0.72rem] text-rose font-medium">
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

