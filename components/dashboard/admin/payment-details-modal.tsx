"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Receipt,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  User,
} from "lucide-react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { StatusPill } from "@/components/dashboard/status-pill";
import { formatTaka, formatTimeAgo } from "@/lib/format";
import type { PaymentTransaction } from "@/lib/app-types";
import { cn } from "@/lib/utils";

interface PaymentDetailsModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (id: string) => void;
  onRefund: (id: string) => void;
}

export function PaymentDetailsModal({
  transaction,
  isOpen,
  onClose,
  onVerify,
  onRefund,
}: PaymentDetailsModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleRequery = async () => {
    setIsVerifying(true);
    setTimeout(() => {
      onVerify(transaction.id);
      setIsVerifying(false);
      toast.success(`Transaction ${transaction.id} verified with gateway`);
      onClose();
    }, 600);
  };

  const handleIssueRefund = async () => {
    setIsRefunding(true);
    setTimeout(() => {
      onRefund(transaction.id);
      setIsRefunding(false);
      toast.success(`Refund of ${formatTaka(transaction.amount)} processed`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-md sm:rounded-lg border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "size-9 rounded-md border flex items-center justify-center shrink-0",
                transaction.status === "success"
                  ? "bg-jade/15 border-jade/30 text-jade"
                  : transaction.status === "pending"
                  ? "bg-marigold/15 border-marigold/30 text-marigold"
                  : transaction.status === "refunded"
                  ? "bg-orchid/15 border-orchid/30 text-orchid"
                  : "bg-rose/15 border-rose/30 text-rose"
              )}
            >
              <Receipt className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                Transaction Ledger Entry
              </h3>
              <p className="text-xs text-ink-faint font-mono mt-0.5">
                {transaction.id} · Ref: {transaction.ref}
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto grow">
          {/* Key Amount & Status Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-md bg-white/[0.03] border border-white/10">
              <span className="text-[0.68rem] text-ink-faint block uppercase tracking-wider font-semibold">
                Captured Amount
              </span>
              <p className="font-mono font-bold text-lg text-ink mt-0.5">
                {formatTaka(transaction.amount)}
              </p>
            </div>
            <div className="p-3 rounded-md bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <span className="text-[0.68rem] text-ink-faint block uppercase tracking-wider font-semibold">
                Gateway Status
              </span>
              <div className="mt-0.5">
                <StatusPill
                  tone={
                    transaction.status === "success"
                      ? "ok"
                      : transaction.status === "pending"
                      ? "warn"
                      : transaction.status === "refunded"
                      ? "info"
                      : "bad"
                  }
                >
                  {transaction.status}
                </StatusPill>
              </div>
            </div>
          </div>

          {/* Detailed Transaction Breakdown */}
          <div className="p-3.5 rounded-md bg-white/[0.025] border border-white/10 space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-ink-faint flex items-center gap-1.5">
                <User className="size-3.5 text-ink-faint" />
                <span>Student Name</span>
              </span>
              <span className="font-semibold text-ink">{transaction.student}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-ink-faint">Student ID</span>
              <span className="font-mono font-semibold text-ink">{transaction.sid}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-ink-faint flex items-center gap-1.5">
                <CreditCard className="size-3.5 text-ink-faint" />
                <span>Payment Method</span>
              </span>
              <span className="font-semibold text-jade">{transaction.method}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-ink-faint flex items-center gap-1.5">
                <Clock className="size-3.5 text-ink-faint" />
                <span>Timestamp</span>
              </span>
              <span className="font-mono text-ink-muted">{formatTimeAgo(transaction.at)}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-ink-faint">Gateway Reference</span>
              <span className="font-mono text-xs text-ink-muted truncate max-w-[200px]">
                {transaction.ref}
              </span>
            </div>
          </div>

          {/* Webhook Security Badge */}
          <div className="p-3 rounded-md bg-white/[0.02] border border-white/10 text-xs text-ink-faint flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="size-4 text-jade shrink-0 mt-0.5" />
            <p>
              Webhook verification is cryptographically signed by the payment aggregator. Direct status modification is prevented by HMAC SHA-256 signature verification.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {transaction.status === "pending" && (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleRequery}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-marigold/15 text-marigold hover:bg-marigold/25 border border-marigold/30 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={cn("size-3.5", isVerifying && "animate-spin")} />
                <span>{isVerifying ? "Querying..." : "Re-query Gateway"}</span>
              </button>
            )}

            {transaction.status === "success" && (
              <button
                type="button"
                disabled={isRefunding}
                onClick={handleIssueRefund}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-rose/15 text-rose hover:bg-rose/25 border border-rose/30 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={cn("size-3.5", isRefunding && "animate-spin")} />
                <span>{isRefunding ? "Refunding..." : "Issue Refund"}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
