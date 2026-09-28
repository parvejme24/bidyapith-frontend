"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/site/glass-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import type { AdmissionApplication } from "@/lib/app-types";
import { useApp } from "@/lib/app-context";
import { AdmissionPaymentModal } from "./admission-payment-modal";
import { ApplyProgramModal } from "./apply-program-modal";

interface AdmissionStatusCardProps {
  application?: AdmissionApplication | null;
  onPayAdmissionFee?: (appId: string, method: string) => void;
  onOpenApplyModal?: () => void;
}

export function AdmissionStatusCard(props: AdmissionStatusCardProps) {
  const { myApplication, payAdmissionFee } = useApp();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const application = props.application !== undefined ? props.application : myApplication;
  const onPayAdmissionFee = props.onPayAdmissionFee || payAdmissionFee;
  const onOpenApplyModal = props.onOpenApplyModal || (() => setApplyModalOpen(true));


  if (!application) {
    return (
      <GlassCard className="p-5 sm:p-6 rounded-2xl border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-xl bg-jade/15 border border-jade/30 flex items-center justify-center text-jade shrink-0">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-ink">
              Ready to Begin Your Degree?
            </h3>
            <p className="text-xs text-ink-faint mt-0.5">
              Select your academic program (B.Sc. or M.Sc.) and submit your admission application.
            </p>
          </div>
        </div>

        {onOpenApplyModal && (
          <button
            type="button"
            onClick={onOpenApplyModal}
            className={cn(
              buttonClass({ variant: "primary", size: "sm" }),
              "text-xs px-5 shrink-0 shadow-md cursor-pointer"
            )}
          >
            <Sparkles className="size-3.5" />
            <span>Apply for Degree Program</span>
          </button>
        )}
      </GlassCard>
    );
  }

  const isPending = application.status === "PENDING_REVIEW";
  const isApproved = application.status === "APPROVED" || application.status === "PAYMENT_PENDING";
  const isEnrolled = application.status === "ENROLLED" || application.status === "GRADUATED";

  return (
    <>
      <GlassCard
        className={cn(
          "p-5 sm:p-6 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4",
          isApproved
            ? "border-marigold/50 bg-marigold/[0.07] shadow-lg ring-1 ring-marigold/30"
            : isEnrolled
            ? "border-jade/30 bg-jade/[0.04]"
            : "border-white/10 bg-white/[0.03]"
        )}
      >
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div
            className={cn(
              "size-12 rounded-xl flex items-center justify-center shrink-0 border shadow-md",
              isApproved
                ? "bg-marigold/20 border-marigold/40 text-marigold"
                : isEnrolled
                ? "bg-jade/20 border-jade/40 text-jade"
                : "bg-white/10 border-white/20 text-ink-muted"
            )}
          >
            {isApproved ? (
              <Sparkles className="size-6 animate-pulse" />
            ) : isEnrolled ? (
              <CheckCircle2 className="size-6" />
            ) : (
              <Clock className="size-6" />
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-ink-muted">
                {application.id}
              </span>
              <StatusPill
                tone={
                  isApproved
                    ? "warn"
                    : isEnrolled
                    ? "ok"
                    : application.status === "REJECTED"
                    ? "bad"
                    : "mute"
                }
              >
                {application.status === "APPROVED"
                  ? "ADMISSION APPROVED (ACTION REQUIRED)"
                  : application.status}
              </StatusPill>
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-ink truncate">
              {application.programTitle}
            </h3>

            <p className="text-xs text-ink-faint">
              {isApproved ? (
                <span className="text-marigold font-semibold">
                  Congratulations! Your application has been approved by the Admissions Committee. Please pay your admission fee to finalize enrollment and receive your official Student ID.
                </span>
              ) : isEnrolled ? (
                <span className="text-jade font-medium">
                  Officially enrolled · Full degree curriculum and semester courses unlocked.
                </span>
              ) : (
                <span>
                  Submitted on {application.submittedAt} · Under review by Admissions Committee.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isApproved && (
            <button
              type="button"
              onClick={() => setPayModalOpen(true)}
              className={cn(
                buttonClass({ variant: "primary", size: "sm" }),
                "text-xs px-5 flex items-center gap-1.5 shadow-lg bg-marigold text-night-900 font-bold hover:bg-marigold/90 cursor-pointer"
              )}
            >
              <CreditCard className="size-3.5" />
              <span>Pay Admission Fee ({formatTaka(application.admissionFee)})</span>
            </button>
          )}

          {isEnrolled && (
            <div className="px-3.5 py-1.5 rounded-xl bg-jade/15 border border-jade/30 text-xs font-semibold text-jade flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              <span>Admission Fee Paid ({formatTaka(application.admissionFee)})</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Payment Modal */}
      {isApproved && (
        <AdmissionPaymentModal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          application={application}
          onPay={onPayAdmissionFee}
        />
      )}

      {/* Apply Program Modal */}
      <ApplyProgramModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </>
  );
}

