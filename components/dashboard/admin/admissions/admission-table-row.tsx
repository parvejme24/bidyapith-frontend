"use client";

import React from "react";
import { CheckCircle2, Eye, Paperclip, XCircle } from "lucide-react";
import { StatusPill } from "@/components/dashboard/status-pill";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import { formatTaka } from "@/lib/format";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AdmissionApplication } from "@/lib/app-types";

interface AdmissionTableRowProps {
  app: AdmissionApplication;
  onOpenDocs: (app: AdmissionApplication) => void;
  onApprove: (app: AdmissionApplication) => void;
  onReject: (app: AdmissionApplication) => void;
}

export function AdmissionTableRow({
  app,
  onOpenDocs,
  onApprove,
  onReject,
}: AdmissionTableRowProps) {
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
    <tr className="hover:bg-white/[0.035] transition-colors">
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
          onClick={() => onOpenDocs(app)}
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
              onClick={() => onApprove(app)}
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
              onClick={() => onReject(app)}
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
}
