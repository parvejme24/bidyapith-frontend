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
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  Building2,
  Calendar,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Unlock,
} from "lucide-react";
import type { SemesterCurriculum } from "@/lib/app-types";

interface SemesterPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester: SemesterCurriculum;
  programTitle: string;
  onUnlock: (semesterNum: number, method: string) => void;
}

export function SemesterPayModal({
  isOpen,
  onClose,
  semester,
  programTitle,
  onUnlock,
}: SemesterPayModalProps) {
  const [method, setMethod] = useState<"bkash" | "card" | "bank">("bkash");
  const [mobileNumber, setMobileNumber] = useState("01712445566");
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onUnlock(
        semester.semesterNumber,
        method === "bkash" ? "bKash" : method === "card" ? "Credit/Debit Card" : "Bank Transfer"
      );
      setIsProcessing(false);
      onClose();
    }, 1000);
  };

  const totalCredits = semester.courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[94vw] p-0 overflow-hidden rounded-xl border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink">
        <DialogHeader className="p-5 pb-3 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-jade/15 border border-jade/30 flex items-center justify-center text-jade">
              <Calendar className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-base sm:text-lg font-bold text-ink">
                Unlock {semester.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-faint">
                {programTitle} · {totalCredits} Semester Credits
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Fee Summary Box */}
          <GlassCard className="p-4 rounded-xl border-jade/30 bg-jade/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
                Semester Tuition Fee
              </span>
              <p className="font-display text-xl font-bold text-jade mt-0.5">
                {formatTaka(semester.tuitionFee || 45000)}
              </p>
              <p className="text-[0.68rem] text-ink-muted">
                Covers {semester.courses.length} courses & examination registration
              </p>
            </div>
            <div className="size-8 rounded-full bg-jade/20 text-jade flex items-center justify-center font-bold text-xs">
              ৳
            </div>
          </GlassCard>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-ink-faint">Select Payment Method:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod("bkash")}
                className={cn(
                  "p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                  method === "bkash"
                    ? "border-jade bg-jade/15 text-jade font-bold shadow-sm"
                    : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink"
                )}
              >
                <Smartphone className="size-4" />
                <span className="text-xs">bKash</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("card")}
                className={cn(
                  "p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                  method === "card"
                    ? "border-jade bg-jade/15 text-jade font-bold shadow-sm"
                    : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink"
                )}
              >
                <CreditCard className="size-4" />
                <span className="text-xs">Card / Visa</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("bank")}
                className={cn(
                  "p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                  method === "bank"
                    ? "border-jade bg-jade/15 text-jade font-bold shadow-sm"
                    : "border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink"
                )}
              >
                <Building2 className="size-4" />
                <span className="text-xs">Bank Transfer</span>
              </button>
            </div>
          </div>

          {method === "bkash" ? (
            <div className="space-y-3 p-3.5 rounded-lg bg-white/[0.03] border border-white/8">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-ink-muted">bKash Mobile Number</span>
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
                <span className="text-xs font-medium text-ink-muted">PIN (Simulated Sandbox)</span>
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
              <p className="text-[0.68rem] text-ink-faint">Instant semester registration unlock</p>
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
                <span>Unlocking...</span>
              ) : (
                <>
                  <Unlock className="size-3.5" />
                  <span>Pay {formatTaka(semester.tuitionFee || 45000)} & Unlock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
