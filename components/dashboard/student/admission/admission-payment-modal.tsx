"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlassCard } from "@/components/site/glass-card";
import { buttonClass } from "@/lib/styles";
import { formatTaka } from "@/lib/app-data";
import { cn } from "@/lib/utils";
import {
  Building2,
  Check,
  CreditCard,
  GraduationCap,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import type { AdmissionApplication } from "@/lib/app-types";

interface AdmissionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: AdmissionApplication;
  onPay: (appId: string, method: string) => void;
}

export function AdmissionPaymentModal({
  isOpen,
  onClose,
  application,
  onPay,
}: AdmissionPaymentModalProps) {
  const [method, setMethod] = useState<"bkash" | "card" | "bank">("bkash");
  const [mobileNumber, setMobileNumber] = useState("01712445566");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onPay(application.id, method === "bkash" ? "bKash" : method === "card" ? "Credit/Debit Card" : "Bank Transfer");
      setIsProcessing(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[94vw] p-0 overflow-hidden rounded-xl border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink">
        <DialogHeader className="p-5 pb-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-jade/15 border border-jade/30 flex items-center justify-center text-jade">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-base sm:text-lg font-bold text-ink">
                Admission Fee Payment
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-faint">
                {application.programTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Fee Summary Box */}
          <GlassCard className="p-4 rounded-xl border-jade/30 bg-jade/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
                Total Admission Fee
              </span>
              <p className="font-display text-xl font-bold text-jade mt-0.5">
                {formatTaka(application.admissionFee || 15000)}
              </p>
              <p className="text-[0.68rem] text-ink-muted">Includes registration & ID card issuance</p>
            </div>
            <div className="size-8 rounded-full bg-jade/20 text-jade flex items-center justify-center font-bold text-xs">
              ৳
            </div>
          </GlassCard>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-ink-faint">Select Payment Gateway:</span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod("bkash")}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between",
                  method === "bkash"
                    ? "border-jade bg-jade/15 text-jade font-bold shadow-sm"
                    : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink"
                )}
              >
                <div className="flex items-center gap-1.5 font-display text-xs">
                  <Smartphone className="size-3.5 text-jade" />
                  <span>SSLCommerz</span>
                </div>
                <span className="text-[0.65rem] text-ink-faint mt-1">bKash, Nagad, Rocket, Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("card")}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between",
                  method === "card"
                    ? "border-jade bg-jade/15 text-jade font-bold shadow-sm"
                    : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink"
                )}
              >
                <div className="flex items-center gap-1.5 font-display text-xs">
                  <CreditCard className="size-3.5 text-jade" />
                  <span>Stripe Gateway</span>
                </div>
                <span className="text-[0.65rem] text-ink-faint mt-1">Visa, Mastercard, Apple Pay</span>
              </button>
            </div>
          </div>


          {method === "bkash" ? (
            <div className="space-y-3 p-3.5 rounded-lg bg-white/[0.03] border border-white/8">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-ink-muted">bKash Wallet Number</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.05] text-xs text-ink font-mono focus:border-jade outline-none"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-medium text-ink-muted">bKash PIN (Simulated Sandbox)</span>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="•••••"
                  maxLength={5}
                  className="w-full px-3 py-2 rounded-lg border border-white/15 bg-white/[0.05] text-xs text-ink font-mono focus:border-jade outline-none"
                  required
                />
              </label>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/8 text-center space-y-2">
              <ShieldCheck className="size-6 text-jade mx-auto" />
              <p className="text-xs text-ink">Encrypted 256-Bit SSL Payment Gateway</p>
              <p className="text-[0.68rem] text-ink-faint">Instant automatic enrollment upon verification</p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={cn(
                buttonClass({ variant: "primary", size: "sm" }),
                "text-xs px-5 flex items-center gap-1.5 shadow-md cursor-pointer"
              )}
            >
              {isProcessing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Lock className="size-3.5" />
                  <span>Confirm & Pay {formatTaka(application.admissionFee || 15000)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
