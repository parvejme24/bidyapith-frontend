"use client";

import React from "react";
import { toast } from "sonner";
import { Copy, Mail, UserCheck } from "lucide-react";
import { DashboardIcon } from "@/components/dashboard/icons";

interface CreatedInstructorSummary {
  name: string;
  email: string;
  empId: string;
  otp: string;
  tempPass: string;
}

interface InstructorCreatedSummaryViewProps {
  summary: CreatedInstructorSummary;
  onClose: () => void;
}

export function InstructorCreatedSummaryView({
  summary,
  onClose,
}: InstructorCreatedSummaryViewProps) {
  const handleCopyCredentials = () => {
    const text = `Bidyapith Faculty Portal Access\nName: ${summary.name}\nEmployee ID: ${summary.empId}\nEmail: ${summary.email}\nTemporary Password: ${summary.tempPass}\n6-Digit Login OTP: ${summary.otp}\nLogin Portal: http://localhost:3000/login`;
    navigator.clipboard.writeText(text);
    toast.success("Login credentials & OTP copied to clipboard!");
  };

  return (
    <>
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="size-9 rounded-md bg-jade/20 border border-jade/40 text-jade flex items-center justify-center shrink-0">
            <UserCheck className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
              Faculty Account Created!
            </h3>
            <p className="text-xs text-ink-faint">
              Welcome email, login credentials & security OTP dispatched
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="size-7 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-ink-faint hover:text-ink transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <DashboardIcon name="close" className="size-3.5" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4 overflow-y-auto grow">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-md bg-white/[0.03] border border-white/10">
            <span className="text-[0.68rem] text-ink-faint block uppercase tracking-wider font-semibold">
              Faculty Member
            </span>
            <p className="font-semibold text-ink text-xs sm:text-sm mt-0.5 truncate">
              {summary.name}
            </p>
          </div>
          <div className="p-2.5 rounded-md bg-white/[0.03] border border-white/10">
            <span className="text-[0.68rem] text-ink-faint block uppercase tracking-wider font-semibold">
              Employee ID
            </span>
            <p className="font-mono font-bold text-jade text-xs sm:text-sm mt-0.5">
              {summary.empId}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-md bg-white/[0.025] border border-white/10 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-ink-faint">Assigned Email</span>
            <span className="font-mono text-ink">{summary.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-ink-faint">Temporary Password</span>
            <span className="font-mono text-jade font-bold">{summary.tempPass}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-ink-faint">6-Digit Security OTP</span>
            <span className="font-mono text-marigold font-bold tracking-widest text-sm">
              {summary.otp}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-md bg-jade/10 border border-jade/25 text-xs text-jade flex items-start gap-2.5">
          <Mail className="size-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            A congratulatory email has been dispatched to <strong>{summary.email}</strong> containing their direct portal access link, temporary password, and 6-digit OTP authentication code.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={handleCopyCredentials}
          className="px-3.5 py-2 rounded-md text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-ink border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Copy className="size-3.5 text-jade" />
          <span>Copy Credentials</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 shadow-md transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </>
  );
}
