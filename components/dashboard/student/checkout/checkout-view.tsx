"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Lock,
  QrCode,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Smartphone,
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
type SslChannel = "BKASH" | "NAGAD" | "ROCKET" | "CARDS" | "NET_BANKING";

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentProgram, user, unlockSemester, addAuditLog, term } = useApp();

  // URL search params
  const semesterParam = searchParams.get("semester");
  const amountParam = searchParams.get("amount");
  const titleParam = searchParams.get("title");

  const semesterNum = semesterParam ? parseInt(semesterParam, 10) : 6;
  const targetSemester =
    currentProgram?.semesters.find((s) => s.semesterNumber === semesterNum) ||
    currentProgram?.semesters[0];

  const baseTuition = amountParam
    ? parseInt(amountParam, 10)
    : targetSemester?.tuitionFee || 45000;
  const labAndResourceFee = 2500;
  const examTechFee = 500;
  const totalPayable = baseTuition;

  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>("SSLCOMMERZ");
  const [sslChannel, setSslChannel] = useState<SslChannel>("BKASH");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex">("visa");

  // Form Fields
  const [mobileWalletNumber, setMobileWalletNumber] = useState(user.phone || "01712445566");
  const [walletPin, setWalletPin] = useState("");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");

  // Gateway Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStageIndex, setProcessingStageIndex] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const stages = [
    { title: "Initializing Gateway Session", desc: `Handshaking with ${selectedGateway} secure payment server...` },
    { title: "Dispatching IPN Webhook", desc: "Posting transaction payload to /api/v1/payments/initiate..." },
    { title: "Verifying HMAC Signature & 3DS", desc: "Authenticating tokenized transaction & customer funds..." },
    { title: "Clearing Tuition & Unlocking Term", desc: "Updating academic registry and granting full course access..." },
  ];

  // Gateway webhook simulation & redirect workflow
  const handleProceedToPayment = () => {
    setIsProcessing(true);
    setProcessingStageIndex(0);

    const txn = `TXN-${selectedGateway}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const rec = `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setTransactionRef(txn);
    setReceiptNumber(rec);
    setPaymentDate(now);

    setTimeout(() => setProcessingStageIndex(1), 1100);
    setTimeout(() => setProcessingStageIndex(2), 2300);
    setTimeout(() => setProcessingStageIndex(3), 3500);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      unlockSemester(semesterNum, selectedGateway);

      addAuditLog({
        actor: user.name,
        role: "student",
        action: "payment.webhook.success",
        target: `Semester ${semesterNum} Tuition`,
        detail: `Cleared ${formatTaka(totalPayable)} via ${selectedGateway} (Txn: ${txn})`,
        tone: "orchid",
      });

      toast.success(
        `Payment of ${formatTaka(totalPayable)} successfully verified! Semester ${semesterNum} is now unlocked.`
      );
    }, 4700);
  };

  const handleDownloadReceipt = () => {
    try {
      const receiptWindow = window.open("", "_blank");
      if (!receiptWindow) {
        toast.error("Please allow popups to download your official receipt");
        return;
      }

      const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Tuition_Receipt_${receiptNumber}_${user.id}</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 20px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0F172A; padding-bottom: 16px; }
            .brand { font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
            .brand-sub { font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 2px; }
            .receipt-title { text-align: right; }
            .receipt-badge { background: #DCFCE7; color: #166534; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 999px; display: inline-block; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
            .box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px; font-size: 12px; }
            .box h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #64748B; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
            th { text-align: left; background: #F1F5F9; padding: 10px 12px; border-bottom: 1px solid #CBD5E1; font-size: 11px; text-transform: uppercase; }
            td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; }
            .total-row { font-weight: bold; font-size: 15px; background: #F8FAFC; }
            .footer { margin-top: 40px; border-top: 1px dashed #CBD5E1; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #64748B; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Bidyapith University</div>
              <div class="brand-sub">Office of the Comptroller & Student Accounts</div>
              <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">Dhaka, Bangladesh · support@bidyapith.edu</p>
            </div>
            <div class="receipt-title">
              <span class="receipt-badge">PAID & VERIFIED</span>
              <h2 style="margin: 6px 0 2px; font-size: 20px;">Official Tuition Receipt</h2>
              <p style="margin: 0; font-size: 12px; font-family: monospace; color: #64748B;">Receipt #: ${receiptNumber}</p>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <h4>Student Information</h4>
              <p style="margin: 2px 0;"><b>Name:</b> ${user.name}</p>
              <p style="margin: 2px 0;"><b>Student ID:</b> ${user.id}</p>
              <p style="margin: 2px 0;"><b>Program:</b> ${currentProgram?.title || "B.Sc. in CSE"}</p>
              <p style="margin: 2px 0;"><b>Email:</b> ${user.email}</p>
            </div>
            <div class="box">
              <h4>Payment Clearance Details</h4>
              <p style="margin: 2px 0;"><b>Date:</b> ${paymentDate}</p>
              <p style="margin: 2px 0;"><b>Gateway:</b> ${selectedGateway} (Webhook IPN)</p>
              <p style="margin: 2px 0;"><b>Transaction Ref:</b> ${transactionRef}</p>
              <p style="margin: 2px 0;"><b>Academic Term:</b> Semester ${semesterNum} (${term.name})</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Academic Items</th>
                <th style="text-align: right;">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Semester ${semesterNum} Course Tuition Fee</b><br><span style="font-size: 11px; color: #64748B;">Full credit registration & syllabus access</span></td>
                <td>${targetSemester?.courses.length || 5} Courses (${targetSemester?.courses.reduce((s, c) => s + c.credits, 0) || 18} Credits)</td>
                <td style="text-align: right;">${formatTaka(baseTuition - 3000)}</td>
              </tr>
              <tr>
                <td><b>Laboratory, Cloud & Computing Infrastructure</b><br><span style="font-size: 11px; color: #64748B;">Specialized lab slots & IDE resources</span></td>
                <td>Laboratory Practicum</td>
                <td style="text-align: right;">${formatTaka(labAndResourceFee)}</td>
              </tr>
              <tr>
                <td><b>Examination & Digital Registry Fee</b><br><span style="font-size: 11px; color: #64748B;">Official transcript logging & seat plan allocation</span></td>
                <td>Institutional Registry</td>
                <td style="text-align: right;">${formatTaka(examTechFee)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">TOTAL AMOUNT SETTLED</td>
                <td style="text-align: right; color: #059669;">${formatTaka(totalPayable)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <div>
              <b>Status:</b> Cleared by Automated Payment Webhook<br>
              <b>Verification:</b> bidyapith.edu/verify/receipt/${receiptNumber}
            </div>
            <div style="text-align: right;">
              <b>University Digital Signature:</b><br>
              <span style="font-family: monospace;">0x${transactionRef.replace(/[^0-9a-fA-F]/g, "").slice(0, 24)}</span>
            </div>
          </div>

          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;

      receiptWindow.document.open();
      receiptWindow.document.write(receiptHtml);
      receiptWindow.document.close();
      toast.success("Generating official printable tuition receipt...");
    } catch {
      toast.error("Unable to generate receipt. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/8">
        <button
          type="button"
          onClick={() => router.push("/student/courses?role=student")}
          className="flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer group w-fit"
        >
          <ArrowLeft className="size-4 text-jade group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Degree Curriculum</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[0.72rem] text-jade font-mono bg-jade/10 px-3 py-1 rounded-full border border-jade/30 shadow-xs">
            <ShieldCheck className="size-3.5" />
            <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
          </div>
        </div>
      </div>

      {paymentCompleted ? (
        /* ========================================================================= */
        /* ==================== WORLD-CLASS PAYMENT SUCCESS VIEW ==================== */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Main Success Hero Receipt */}
          <GlassCard className="p-6 sm:p-10 rounded-2xl border-jade/40 bg-gradient-to-b from-jade/[0.08] via-night-900 to-night-950 shadow-2xl relative overflow-hidden text-center space-y-6">
            {/* Background Watermark Crest */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <GraduationCap className="size-96 text-jade" />
            </div>

            {/* Checkmark Animation Icon */}
            <div className="relative z-10 size-20 rounded-full bg-gradient-to-tr from-jade/20 via-jade/40 to-jade border-2 border-jade text-night-950 flex items-center justify-center mx-auto shadow-xl ring-8 ring-jade/10">
              <CheckCircle2 className="size-10 text-night-900 stroke-[2.5]" />
            </div>

            {/* Title & Congratulations */}
            <div className="space-y-2 relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-jade/20 text-jade border border-jade/40 font-mono">
                <Sparkles className="size-3.5" />
                <span>Tuition Clearance Confirmed</span>
              </span>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
                Semester {semesterNum} Unlocked Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
                Your payment of <b className="text-jade font-mono text-base">{formatTaka(totalPayable)}</b> has been cleared via <b className="text-ink">{selectedGateway}</b>. Your course routine and laboratory slots are now active.
              </p>
            </div>

            {/* Itemized Clearance Card */}
            <div className="relative z-10 max-w-2xl mx-auto rounded-xl border border-white/10 bg-black/40 p-5 sm:p-6 text-left space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-mono">Official Receipt</p>
                  <p className="font-mono text-sm font-bold text-ink">{receiptNumber}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[0.68rem] text-ink-faint uppercase tracking-wider font-mono">Cleared Timestamp</p>
                  <p className="font-mono text-xs text-ink-muted">{paymentDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-ink-faint block text-[0.68rem]">Student ID</span>
                  <span className="font-bold text-jade">{user.id}</span>
                </div>
                <div>
                  <span className="text-ink-faint block text-[0.68rem]">Program</span>
                  <span className="font-semibold text-ink">{currentProgram?.code || "BSC-CSE"}</span>
                </div>
                <div>
                  <span className="text-ink-faint block text-[0.68rem]">Gateway</span>
                  <span className="font-semibold text-ink">{selectedGateway}</span>
                </div>
                <div>
                  <span className="text-ink-faint block text-[0.68rem]">Payment Status</span>
                  <span className="text-jade font-bold">● SETTLED</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-ink-faint">
                <span className="truncate">Transaction Hash: <b className="text-ink">{transactionRef}</b></span>
                <span className="text-jade font-semibold shrink-0">100% Institutional Receipt</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className={cn(
                  buttonClass({ variant: "ghost", size: "default" }),
                  "w-full sm:w-auto px-6 text-xs flex items-center justify-center gap-2 border border-white/20 hover:border-jade/40 cursor-pointer"
                )}
              >
                <Download className="size-4 text-jade" />
                <span>Download Official PDF Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/student/courses?role=student")}
                className={cn(
                  buttonClass({ variant: "primary", size: "default" }),
                  "w-full sm:w-auto px-8 text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                )}
              >
                <BookOpen className="size-4" />
                <span>View My Enrolled Courses & Routine</span>
              </button>
            </div>
          </GlassCard>
        </div>
      ) : (
        /* ========================================================================= */
        /* ===================== PROFESSIONAL CHECKOUT INTERFACE =================== */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Gateway Selector & Payment Authorizer (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Payment Gateway Selector */}
            <GlassCard className="p-6 space-y-6">
              <div>
                <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-jade">
                  Step 2 of 2
                </span>
                <h2 className="font-display text-xl font-bold text-ink mt-0.5 flex items-center gap-2">
                  <CreditCard className="size-5 text-jade" />
                  <span>Select Payment Gateway</span>
                </h2>
                <p className="text-xs text-ink-faint mt-0.5">
                  Choose a verified payment provider. Both channels support real-time IPN webhook confirmation.
                </p>
              </div>

              {/* Gateway Cards Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* 1. SSLCommerz Tile */}
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
                      <span className="inline-block text-[0.62rem] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Bangladesh Local
                      </span>
                      <h3 className="font-display text-base font-bold text-ink mt-1.5">
                        SSLCommerz Hub
                      </h3>
                      <p className="text-[0.72rem] text-ink-faint mt-0.5">
                        Direct Mobile Banking & Local Bank Gateways
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
                      {selectedGateway === "SSLCOMMERZ" && (
                        <CheckCircle2 className="size-3.5 stroke-[3]" />
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/8 flex flex-wrap items-center gap-1.5 text-[0.65rem] font-mono text-ink-muted">
                    <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 font-bold">bKash</span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-300 font-bold">Nagad</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold">Rocket</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-bold">Local Cards</span>
                  </div>
                </div>

                {/* 2. Stripe Tile */}
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
                      <span className="inline-block text-[0.62rem] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        International
                      </span>
                      <h3 className="font-display text-base font-bold text-ink mt-1.5">
                        Stripe Payments
                      </h3>
                      <p className="text-[0.72rem] text-ink-faint mt-0.5">
                        Visa, Mastercard, Amex & Apple Pay
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
                      {selectedGateway === "STRIPE" && (
                        <CheckCircle2 className="size-3.5 stroke-[3]" />
                      )}
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

              {/* Dynamic Interactive Channel Details */}
              {selectedGateway === "SSLCOMMERZ" ? (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <Smartphone className="size-4 text-jade" />
                      <span>Select SSLCommerz Channel</span>
                    </span>
                    <span className="text-[0.68rem] text-jade font-mono font-bold">
                      ● Live Sandbox Connected
                    </span>
                  </div>

                  {/* Channel Switcher Buttons */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs font-medium">
                    {[
                      { id: "BKASH", name: "bKash" },
                      { id: "NAGAD", name: "Nagad" },
                      { id: "ROCKET", name: "Rocket" },
                      { id: "CARDS", name: "Cards" },
                      { id: "NET_BANKING", name: "Bank" },
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSslChannel(ch.id as SslChannel)}
                        className={cn(
                          "py-2 px-1 rounded-lg border text-center transition-all cursor-pointer text-xs font-mono",
                          sslChannel === ch.id
                            ? "bg-jade/20 border-jade text-jade font-bold shadow-xs"
                            : "bg-white/[0.02] border-white/10 text-ink-muted hover:text-ink"
                        )}
                      >
                        {ch.name}
                      </button>
                    ))}
                  </div>

                  {/* Wallet Mobile Number & Pin */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[0.72rem] text-ink-faint font-medium">
                        Mobile Wallet Number
                      </label>
                      <input
                        type="tel"
                        value={mobileWalletNumber}
                        onChange={(e) => setMobileWalletNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-xs font-mono text-ink focus:border-jade outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[0.72rem] text-ink-faint font-medium">
                        Wallet PIN (Simulated Sandbox)
                      </label>
                      <input
                        type="password"
                        value={walletPin}
                        onChange={(e) => setWalletPin(e.target.value)}
                        placeholder="•••••"
                        maxLength={5}
                        className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-xs font-mono text-ink focus:border-jade outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <CreditCard className="size-4 text-jade" />
                      <span>Stripe 256-Bit SSL Card Entry</span>
                    </span>
                    <span className="text-[0.68rem] text-jade font-mono font-bold">
                      ● 3D Secure 2.0
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[0.72rem] text-ink-faint font-medium">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8892"
                        className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-xs font-mono text-ink focus:border-jade outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[0.72rem] text-ink-faint font-medium">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-xs font-mono text-ink focus:border-jade outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[0.72rem] text-ink-faint font-medium">
                          Security CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          maxLength={4}
                          className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-xs font-mono text-ink focus:border-jade outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Webhook & Auto-Redirection Progress or Trigger Button */}
              {isProcessing ? (
                <div className="p-5 rounded-xl border border-jade/40 bg-jade/[0.06] space-y-4 shadow-lg animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="size-4 animate-spin text-jade" />
                      <span className="text-xs font-bold text-ink">
                        {stages[processingStageIndex]?.title}
                      </span>
                    </div>
                    <span className="text-[0.68rem] font-mono text-jade font-bold">
                      {Math.round(((processingStageIndex + 1) / stages.length) * 100)}%
                    </span>
                  </div>

                  {/* Progress Meter Bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-jade transition-all duration-700 ease-out"
                      style={{
                        width: `${((processingStageIndex + 1) / stages.length) * 100}%`,
                      }}
                    />
                  </div>

                  <p className="text-[0.72rem] text-ink-muted font-mono animate-pulse">
                    {stages[processingStageIndex]?.desc}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className={cn(
                    buttonClass({ variant: "primary", size: "default" }),
                    "w-full py-4 text-sm font-bold shadow-xl flex items-center justify-center gap-2 bg-jade text-night-900 hover:bg-jade/90 cursor-pointer"
                  )}
                >
                  <ExternalLink className="size-4" />
                  <span>
                    Pay {formatTaka(totalPayable)} via {selectedGateway}
                  </span>
                </button>
              )}
            </GlassCard>
          </div>

          {/* RIGHT COLUMN: Order Summary & Institutional Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <GlassCard className="p-6 space-y-5">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[0.68rem] uppercase tracking-wider font-mono font-bold text-jade">
                  Step 1 of 2
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                  Semester {semesterNum} Tuition Invoice
                </h3>
                <p className="text-xs text-ink-faint mt-0.5">
                  {titleParam || targetSemester?.title || `${currentProgram?.name || "B.Sc. in CSE"}`}
                </p>
              </div>

              {/* Student Metadata Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-ink-faint">Student:</span>
                  <span className="font-bold text-ink font-sans">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Student ID:</span>
                  <span className="text-jade font-bold">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Degree Program:</span>
                  <span className="text-ink font-sans">{currentProgram?.code || "BSC-CSE"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Academic Term:</span>
                  <span className="text-ink font-sans">{term.name}</span>
                </div>
              </div>

              {/* Course items breakdown preview */}
              {targetSemester && targetSemester.courses.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-ink-muted font-semibold">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-jade" />
                      <span>Curriculum Subjects ({targetSemester.courses.length})</span>
                    </span>
                    <span className="font-mono text-ink">
                      {targetSemester.courses.reduce((s, c) => s + c.credits, 0)} Credits
                    </span>
                  </div>

                  <div className="max-h-44 overflow-y-auto space-y-1.5 divide-y divide-white/5 pr-1">
                    {targetSemester.courses.map((c) => (
                      <div key={c.code} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <span className="font-mono text-jade font-bold text-[0.72rem] mr-1.5">{c.code}</span>
                          <span className="text-ink-muted text-[0.75rem] truncate">{c.title}</span>
                        </div>
                        <span className="text-ink-faint font-mono text-[0.68rem] shrink-0">{c.credits} cr</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transparent Fee Breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-ink-muted">
                  <span>Semester Core Tuition</span>
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
                    <span className="text-[0.68rem] text-ink-faint">Institutional VAT & Tech fees inclusive</span>
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
