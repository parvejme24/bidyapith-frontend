"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { formatTaka } from "@/lib/format";
import {
  GatewaySelector,
  type PaymentGatewayType,
  type SslChannel,
} from "./gateway-selector";
import { OrderSummary } from "./order-summary";
import { ReceiptCard } from "./receipt-card";
import type { ReceiptData } from "./receipt-exporter";

interface CheckoutViewProps {
  onPaymentSuccess?: () => void;
}

export function CheckoutView(props: CheckoutViewProps) {
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
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

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

    const coursesCount = targetSemester?.courses.length || 5;
    const totalCredits = targetSemester?.courses.reduce((s, c) => s + c.credits, 0) || 18;

    const data: ReceiptData = {
      receiptNumber: rec,
      transactionRef: txn,
      studentName: user.name,
      studentId: user.id,
      studentEmail: user.email,
      programTitle: currentProgram?.title || "B.Sc. in Computer Science & Engineering",
      programCode: currentProgram?.code || "BSC-CSE",
      semesterNum,
      termName: term.name,
      baseTuition,
      labFee: labAndResourceFee,
      examFee: examTechFee,
      totalPaid: totalPayable,
      gateway: selectedGateway,
      paymentDate: now,
      coursesCount,
      totalCredits,
    };

    setReceiptData(data);

    setTimeout(() => setProcessingStageIndex(1), 1100);
    setTimeout(() => setProcessingStageIndex(2), 2300);
    setTimeout(() => setProcessingStageIndex(3), 3500);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      props.onPaymentSuccess?.();
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status Navigation (Only on Checkout, Hidden on Success) */}
      {!paymentCompleted && (
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
      )}

      {paymentCompleted && receiptData ? (
        /* Reusable Receipt Card with PDF & PNG Exporters and Dismiss */
        <ReceiptCard
          data={receiptData}
          onDismiss={() => router.push("/student/courses?role=student")}
        />
      ) : (
        /* Two Column Checkout Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Gateway Selector */}
          <div className="lg:col-span-7 space-y-5">
            <GatewaySelector
              selectedGateway={selectedGateway}
              onSelectGateway={setSelectedGateway}
              sslChannel={sslChannel}
              onSelectSslChannel={setSslChannel}
              mobileWalletNumber={mobileWalletNumber}
              onMobileWalletChange={setMobileWalletNumber}
              walletPin={walletPin}
              onWalletPinChange={setWalletPin}
              cardNumber={cardNumber}
              onCardNumberChange={setCardNumber}
              cardExpiry={cardExpiry}
              onCardExpiryChange={setCardExpiry}
              cardCvc={cardCvc}
              onCardCvcChange={setCardCvc}
              isProcessing={isProcessing}
              processingStageIndex={processingStageIndex}
              stages={stages}
              totalPayable={totalPayable}
              onProceed={handleProceedToPayment}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-5">
            <OrderSummary
              semesterNum={semesterNum}
              titleParam={titleParam}
              targetSemester={targetSemester}
              currentProgram={currentProgram}
              userName={user.name}
              userId={user.id}
              termName={term.name}
              baseTuition={baseTuition}
              labFee={labAndResourceFee}
              examFee={examTechFee}
              totalPayable={totalPayable}
            />
          </div>
        </div>
      )}
    </div>
  );
}
