"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { useApp } from "@/lib/app-context";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type PaymentGatewayType = "SSLCOMMERZ" | "STRIPE";

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentProgram, user, unlockSemester, addAuditLog, student } = useApp();

  // URL search params
  const semesterParam = searchParams.get("semester");
  const amountParam = searchParams.get("amount");
  const titleParam = searchParams.get("title");

  const semesterNum = semesterParam ? parseInt(semesterParam, 10) : 6;
  const targetSemester = currentProgram?.semesters.find(
    (s) => s.semesterNumber === semesterNum
  ) || currentProgram?.semesters[0];

  const baseTuition = amountParam ? parseInt(amountParam, 10) : (targetSemester?.tuitionFee || 45000);
  const labAndResourceFee = 2500;
  const examTechFee = 500;
  const totalPayable = baseTuition;

  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>("SSLCOMMERZ");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  // Gateway webhook simulation & redirect workflow
  const handleProceedToPayment = () => {
    setIsProcessing(true);
    const txn = `TXN-${selectedGateway}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTransactionRef(txn);

    setProcessingStage(`Connecting to ${selectedGateway} Secure Payment Gateway...`);

    setTimeout(() => {
      setProcessingStage(
        selectedGateway === "SSLCOMMERZ"
          ? "Redirecting to SSLCommerz Hosted Session (bKash, Nagad, Visa, Mastercard)..."
          : "Redirecting to Stripe Checkout (256-bit SSL Card Verification)..."
      );
    }, 1200);

    setTimeout(() => {
      setProcessingStage("Dispatching IPN Webhook to /api/v1/payments/webhook...");
    }, 2400);

    setTimeout(() => {
      setProcessingStage("Verifying Transaction Signature & Clearing Tuition Invoice...");
    }, 3600);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      unlockSemester(semesterNum, selectedGateway);

      addAuditLog({
        actor: user.name,
        role: "student",
        action: "payment.webhook.success",
        target: `Semester ${semesterNum} Tuition`,
        detail: `Settled ${formatTaka(totalPayable)} via ${selectedGateway} (Txn: ${txn})`,
        tone: "orchid",
      });

      toast.success(
        `Payment of ${formatTaka(totalPayable)} verified via ${selectedGateway}! Semester ${semesterNum} is now unlocked.`
      );
    }, 4800);
  };

  const handleReturnToCourses = () => {
    router.push("/student/courses?role=student");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Curriculum Roadmap</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-jade font-mono bg-jade/10 px-3 py-1 rounded-full border border-jade/30">
          <ShieldCheck className="size-3.5" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {paymentCompleted ? (
        /* Success Screen */
        <GlassCard className="p-8 text-center space-y-6 border-jade/40 bg-jade/[0.04]">
          <div className="size-16 rounded-full bg-jade/20 border-2 border-jade text-jade flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="size-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Payment Confirmed & Semester Unlocked!
            </h2>
            <p className="text-sm text-ink-muted max-w-lg mx-auto">
              Your tuition fee of <b className="text-jade">{formatTaka(totalPayable)}</b> has been successfully processed via <b className="text-ink">{selectedGateway}</b>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
            <div className="flex justify-between text-ink-faint">
              <span>Transaction Ref:</span>
              <span className="text-jade font-bold">{transactionRef}</span>
            </div>
            <div className="flex justify-between text-ink-faint">
              <span>Semester:</span>
              <span className="text-ink font-semibold">Semester {semesterNum}</span>
            </div>
            <div className="flex justify-between text-ink-faint">
              <span>Payment Gateway:</span>
              <span className="text-ink font-semibold">{selectedGateway} (IPN Webhook Verified)</span>
            </div>
            <div className="flex justify-between text-ink-faint">
              <span>Status:</span>
              <span className="text-jade font-bold">PAID & ACTIVE</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleReturnToCourses}
              className={cn(
                buttonClass({ variant: "primary", size: "default" }),
                "px-8 bg-jade text-night-900 font-bold hover:bg-jade/90 shadow-lg cursor-pointer"
              )}
            >
              <Sparkles className="size-4" />
              <span>Go to My Enrolled Courses</span>
            </button>
          </div>
        </GlassCard>
      ) : (
        /* Two Column Checkout Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Gateway Selection & Action (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <GlassCard className="p-6 space-y-5">
              <div>
                <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <CreditCard className="size-5 text-jade" />
                  <span>Select Payment Gateway</span>
                </h3>
                <p className="text-xs text-ink-faint mt-0.5">
                  Choose your preferred payment method. You will be automatically connected to the secure gateway webhook.
                </p>
              </div>

              {/* Gateway Selection Tiles */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* 1. SSLCommerz Option */}
                <div
                  onClick={() => !isProcessing && setSelectedGateway("SSLCOMMERZ")}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-3",
                    selectedGateway === "SSLCOMMERZ"
                      ? "border-jade bg-jade/[0.08] shadow-md ring-1 ring-jade/30"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[0.65rem] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Bangladesh Local
                      </span>
                      <h4 className="font-display text-base font-bold text-ink mt-1.5">
                        SSLCommerz
                      </h4>
                      <p className="text-[0.72rem] text-ink-faint mt-0.5">
                        Instant bKash, Nagad, Rocket, Upay & Local Cards
                      </p>
                    </div>

                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                        selectedGateway === "SSLCOMMERZ"
                          ? "border-jade bg-jade text-night-900"
                          : "border-white/20 bg-white/5"
                      )}
                    >
                      {selectedGateway === "SSLCOMMERZ" && <CheckCircle2 className="size-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/8 flex flex-wrap items-center gap-1.5 text-[0.65rem] font-mono text-ink-muted">
                    <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 font-bold">bKash</span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-300 font-bold">Nagad</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold">Rocket</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-bold">Cards</span>
                  </div>
                </div>

                {/* 2. Stripe Option */}
                <div
                  onClick={() => !isProcessing && setSelectedGateway("STRIPE")}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-3",
                    selectedGateway === "STRIPE"
                      ? "border-jade bg-jade/[0.08] shadow-md ring-1 ring-jade/30"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[0.65rem] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        International
                      </span>
                      <h4 className="font-display text-base font-bold text-ink mt-1.5">
                        Stripe Gateway
                      </h4>
                      <p className="text-[0.72rem] text-ink-faint mt-0.5">
                        Visa, Mastercard, Amex, Apple Pay & Google Pay
                      </p>
                    </div>

                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                        selectedGateway === "STRIPE"
                          ? "border-jade bg-jade text-night-900"
                          : "border-white/20 bg-white/5"
                      )}
                    >
                      {selectedGateway === "STRIPE" && <CheckCircle2 className="size-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/8 flex flex-wrap items-center gap-1.5 text-[0.65rem] font-mono text-ink-muted">
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 font-bold">Visa</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 font-bold">Mastercard</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-bold">Amex</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-500/10 text-neutral-300 font-bold">Apple Pay</span>
                  </div>
                </div>
              </div>

              {/* Webhook & Auto-Redirection Callout */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-ink">
                  <Zap className="size-4 text-marigold" />
                  <span>Instant IPN Webhook Verification</span>
                </div>
                <p className="text-ink-muted leading-relaxed">
                  Upon clicking proceed, your payment session is initialized via <b className="text-ink">{selectedGateway}</b>. Once payment is confirmed on the gateway, the backend webhook auto-redirects and instantly unlocks your semester courses.
                </p>
              </div>

              {/* Proceed Button */}
              {isProcessing ? (
                <div className="p-4 rounded-xl border border-jade/30 bg-jade/[0.06] space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-jade">
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Processing Secure Gateway Handshake...</span>
                  </div>
                  <p className="text-xs font-mono text-ink-faint animate-pulse">
                    {processingStage}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className={cn(
                    buttonClass({ variant: "primary", size: "default" }),
                    "w-full py-3.5 text-sm font-bold shadow-xl flex items-center justify-center gap-2 bg-jade text-night-900 hover:bg-jade/90 cursor-pointer"
                  )}
                >
                  <ExternalLink className="size-4" />
                  <span>
                    Proceed with {selectedGateway} ({formatTaka(totalPayable)})
                  </span>
                </button>
              )}
            </GlassCard>
          </div>

          {/* Right Column: Order Summary & Itemized Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <GlassCard className="p-6 space-y-5">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[0.68rem] uppercase tracking-wider font-mono font-bold text-jade">
                  Order Summary
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                  Semester {semesterNum} Tuition
                </h3>
                <p className="text-xs text-ink-faint mt-0.5">
                  {titleParam || targetSemester?.title || `${currentProgram?.name || "B.Sc. in CSE"}`}
                </p>
              </div>

              {/* Student Metadata Box */}
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/8 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-ink-faint">Student:</span>
                  <span className="font-bold text-ink font-sans">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Student ID:</span>
                  <span className="text-jade font-bold">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Program:</span>
                  <span className="text-ink font-sans">{currentProgram?.code || "BSC-CSE"}</span>
                </div>
              </div>

              {/* Course items preview */}
              {targetSemester && targetSemester.courses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-ink-muted font-semibold">
                    <span>Courses Included ({targetSemester.courses.length})</span>
                    <span className="font-mono">
                      {targetSemester.courses.reduce((s, c) => s + c.credits, 0)} Credits
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 divide-y divide-white/5 pr-1">
                    {targetSemester.courses.map((c) => (
                      <div key={c.code} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono text-jade font-bold text-[0.72rem] mr-1.5">{c.code}</span>
                          <span className="text-ink-muted text-[0.75rem]">{c.title}</span>
                        </div>
                        <span className="text-ink-faint font-mono text-[0.7rem] shrink-0 ml-2">{c.credits} cr</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee Breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-ink-muted">
                  <span>Semester Course Tuition</span>
                  <span className="font-mono text-ink font-semibold">{formatTaka(baseTuition - 3000)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Laboratory & Computing Cloud</span>
                  <span className="font-mono text-ink font-semibold">{formatTaka(labAndResourceFee)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Examination & Digital Registry Fee</span>
                  <span className="font-mono text-ink font-semibold">{formatTaka(examTechFee)}</span>
                </div>

                <div className="border-t border-white/15 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="font-display text-base font-bold text-ink block">Total Payable</span>
                    <span className="text-[0.68rem] text-ink-faint">Inclusive of all institutional VAT</span>
                  </div>
                  <span className="font-display text-2xl font-extrabold text-jade font-mono">
                    {formatTaka(totalPayable)}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
