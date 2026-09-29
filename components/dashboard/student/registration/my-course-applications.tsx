"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Mail,
  Eye,
  Check,
  ArrowRight,
} from "lucide-react";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { useGetAdmissionsQuery } from "@/lib/redux/api/admissionsApi";
import { formatTaka } from "@/lib/format";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AdmissionApplication, AttachedDocument } from "@/lib/app-types";

export function MyCourseApplications() {
  const router = useRouter();
  const { user, admissionApplications, payAdmissionFee } = useApp();
  const { data: dbAdmissionsRes } = useGetAdmissionsQuery();

  const [selectedAppForPay, setSelectedAppForPay] = useState<AdmissionApplication | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("bKash");
  const [isPaying, setIsPaying] = useState(false);
  const [viewDocsApp, setViewDocsApp] = useState<AdmissionApplication | null>(null);

  const applicationsList: AdmissionApplication[] =
    dbAdmissionsRes?.data && dbAdmissionsRes.data.length > 0
      ? dbAdmissionsRes.data
      : admissionApplications;

  // Filter applications belonging to this student (or all if simulated single student)
  const myApps = applicationsList.filter(
    (a) =>
      !a.email ||
      !user.email ||
      a.email.toLowerCase() === user.email.toLowerCase() ||
      a.studentEmail?.toLowerCase() === user.email.toLowerCase() ||
      a.studentName.toLowerCase() === user.name.toLowerCase() ||
      a.applicationType === "COURSE_REGISTRATION"
  );

  const handlePay = (app: AdmissionApplication) => {
    setSelectedAppForPay(app);
  };

  const confirmPayment = () => {
    if (!selectedAppForPay) return;
    setIsPaying(true);

    setTimeout(() => {
      payAdmissionFee(selectedAppForPay.id, selectedMethod);
      setIsPaying(false);
      setSelectedAppForPay(null);
      toast.success(
        `Tuition fee of ${formatTaka(selectedAppForPay.admissionFee)} confirmed via ${selectedMethod}! You are now fully enrolled in ${selectedAppForPay.courseCode || selectedAppForPay.programTitle}.`
      );
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <div>
          <h3 className="font-display text-base font-bold text-ink">
            My Course Applications & Document Verifications
          </h3>
          <p className="text-xs text-ink-faint mt-0.5">
            Track verification status by Academic Committee and complete tuition payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/student/registration")}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-jade/15 text-jade border border-jade/30 hover:bg-jade/25 transition-all cursor-pointer shrink-0"
        >
          + Register New Course
        </button>
      </div>

      {/* Applications List */}
      {myApps.length === 0 ? (
        <GlassCard className="p-12 text-center text-ink-faint space-y-3">
          <FileText className="size-12 mx-auto text-ink-faint/60" />
          <h4 className="text-base font-bold text-ink">No course applications submitted yet</h4>
          <p className="text-xs max-w-md mx-auto">
            Browse our course catalog, view detailed syllabus modules, and submit your academic documents for admin review.
          </p>
          <button
            type="button"
            onClick={() => router.push("/student/registration")}
            className="mt-2 px-4 py-2 rounded-lg bg-jade text-night-900 text-xs font-bold hover:bg-jade/90 cursor-pointer"
          >
            Explore Course Offerings
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {myApps.map((app) => {
            const isApproved = app.status === "APPROVED";
            const isPending = app.status === "PENDING_REVIEW";
            const isEnrolled = app.status === "ENROLLED";
            const docCount = app.attachedDocuments?.length || 2;

            return (
              <GlassCard
                key={app.id}
                className={cn(
                  "p-5 md:p-6 transition-all duration-200 border-white/10 space-y-4",
                  isApproved && "border-jade/50 bg-jade/[0.04]",
                  isPending && "border-amber-400/30 bg-amber-400/[0.02]"
                )}
              >
                {/* Top Row: Course Code, App ID, Status Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/8">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {app.courseCode ? (
                      <span className="font-mono text-xs font-bold text-jade px-2.5 py-0.5 rounded-md bg-jade/15 border border-jade/30">
                        {app.courseCode}
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-purple-300 px-2.5 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30">
                        Degree Admission
                      </span>
                    )}

                    <span className="font-display text-base font-bold text-ink">
                      {app.courseTitle || app.programTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusPill
                      tone={
                        isEnrolled
                          ? "ok"
                          : isApproved
                          ? "info"
                          : isPending
                          ? "warn"
                          : "bad"
                      }
                    >
                      {isPending
                        ? "Under Admin Review"
                        : isApproved
                        ? "Verified & Approved"
                        : isEnrolled
                        ? "Enrolled (Paid)"
                        : "Rejected"}
                    </StatusPill>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-ink-faint font-sans block">Application Ref</span>
                    <span className="font-bold text-ink">{app.id}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-ink-faint font-sans block">Submitted On</span>
                    <span className="font-bold text-ink">{app.submittedAt}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-ink-faint font-sans block">Academic Credentials</span>
                    <span className="font-bold text-jade">
                      CGPA {app.previousCgpa || "3.82"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-ink-faint font-sans block">Course Fee</span>
                    <span className="font-bold text-jade">
                      {formatTaka(app.admissionFee)}
                    </span>
                  </div>
                </div>

                {/* Motivation snippet if present */}
                {app.motivationStatement && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-ink-muted leading-relaxed">
                    <span className="text-ink-faint font-semibold block mb-0.5">Statement of Purpose:</span>
                    <p className="line-clamp-2">{app.motivationStatement}</p>
                  </div>
                )}

                {/* Status Notice & Action Callout */}
                {isApproved && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-jade/15 via-jade/10 to-transparent border border-jade/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-jade">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>Academic Committee Approved! Email Dispatched to {app.email || user.email}</span>
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed">
                        Your academic documents have been verified by the Registrar. Please proceed to pay the course tuition fee to finalize enrollment into your timetable.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePay(app)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-jade text-night-900 text-xs font-bold hover:bg-jade/90 transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      <CreditCard className="size-4" />
                      <span>Pay Tuition ({formatTaka(app.admissionFee)})</span>
                    </button>
                  </div>
                )}

                {isPending && (
                  <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-start gap-2.5 text-xs text-amber-200">
                    <Clock className="size-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Registrar Verification in Progress</span>
                      <span className="text-ink-muted text-[11px]">
                        The faculty admission panel is reviewing your transcripts and prerequisite records. You will receive an email and system notification once verified.
                      </span>
                    </div>
                  </div>
                )}

                {isEnrolled && (
                  <div className="p-3.5 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-sky-300">
                      <Sparkles className="size-4 text-sky-400 shrink-0" />
                      <span className="font-semibold">Successfully Enrolled & Paid · Added to Routine</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/student/routine")}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-jade hover:underline cursor-pointer"
                    >
                      <span>View Class Schedule</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                )}

                {/* Bottom Action Links */}
                <div className="flex items-center justify-between pt-2 text-xs text-ink-faint">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewDocsApp(app)}
                      className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink cursor-pointer transition-colors"
                    >
                      <FileText className="size-3.5 text-jade" />
                      <span>View {docCount} Attached Academic Documents</span>
                    </button>
                  </div>

                  <span className="font-mono text-[11px] text-ink-faint">
                    Faculty of Science & Engineering
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {selectedAppForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-md p-6 space-y-5 border-white/20 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Complete Course Tuition Payment
                </h3>
                <p className="text-xs text-ink-faint mt-0.5">
                  {selectedAppForPay.courseCode || selectedAppForPay.programTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppForPay(null)}
                className="text-xs text-ink-faint hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Fee summary card */}
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Tuition Fee</span>
                <span className="font-mono font-bold text-ink">
                  {formatTaka(selectedAppForPay.admissionFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Lab & Examination Fee</span>
                <span className="font-mono text-jade">৳0 (Included)</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                <span className="font-bold text-ink">Total Payable</span>
                <span className="font-display font-bold font-mono text-lg text-jade">
                  {formatTaka(selectedAppForPay.admissionFee)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-ink-muted">
                Select Payment Gateway
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                {["bKash", "Nagad", "Rocket", "Visa / Master", "SSLCommerz", "Bank Transfer"].map(
                  (method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                        selectedMethod === method
                          ? "bg-jade/20 border-jade text-jade font-bold"
                          : "bg-white/5 border-white/10 text-ink-muted hover:text-ink hover:bg-white/10"
                      )}
                    >
                      {method}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Simulated Gateway Info */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] text-ink-faint font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-jade">
                <ShieldCheck className="size-3.5" />
                <span className="font-bold">256-Bit SSL Encrypted Payment</span>
              </div>
              <p>Instant enrollment verification will synchronize directly with your student database ledger.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAppForPay(null)}
                className="px-4 py-2 rounded-xl text-xs text-ink-faint hover:text-ink cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPaying}
                onClick={confirmPayment}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-jade text-night-900 text-xs font-bold hover:bg-jade/90 transition-all shadow-md cursor-pointer"
              >
                <Check className="size-4" />
                <span>{isPaying ? "Processing..." : `Pay ${formatTaka(selectedAppForPay.admissionFee)}`}</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* View Attached Documents Modal */}
      {viewDocsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-lg p-6 space-y-4 border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-display font-bold text-ink text-sm">
                  Attached Academic Documents
                </h3>
                <p className="text-[11px] text-ink-faint font-mono mt-0.5">
                  Application #{viewDocsApp.id} · {viewDocsApp.courseCode || viewDocsApp.programTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewDocsApp(null)}
                className="text-xs text-ink-faint hover:text-ink cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(viewDocsApp.attachedDocuments && viewDocsApp.attachedDocuments.length > 0
                ? viewDocsApp.attachedDocuments
                : [
                    {
                      id: "d1",
                      name: "Official_Academic_Transcript.pdf",
                      size: "1.4 MB",
                      type: "Academic Transcript",
                      uploadedAt: viewDocsApp.submittedAt,
                    },
                    {
                      id: "d2",
                      name: "Prerequisite_Marksheet.pdf",
                      size: "820 KB",
                      type: "Prerequisite Marksheet",
                      uploadedAt: viewDocsApp.submittedAt,
                    },
                  ]
              ).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="size-4 text-jade shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate">{doc.name}</p>
                      <p className="text-[11px] text-ink-faint font-mono">
                        {doc.type} · {doc.size}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-jade bg-jade/10 border border-jade/20 px-2 py-0.5 rounded shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewDocsApp(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
