"use client";

import React from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka, formatTimeAgo } from "@/lib/app-data";
import type { PaymentTransaction } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
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
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <GlassCard className="w-full max-w-lg p-6 md:p-8 shadow-2xl border-white/20">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-ink">
              {formatTaka(transaction.amount)}
            </h3>
            <p className="text-xs text-ink-faint font-mono mt-0.5">
              {transaction.id} · Ref: {transaction.ref}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-faint hover:text-ink"
            aria-label="Close modal"
          >
            <DashboardIcon name="close" className="size-4" />
          </button>
        </div>

        <div className="space-y-3 my-6 text-xs sm:text-sm">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-ink-faint">Student Name</span>
            <span className="font-semibold text-ink">{transaction.student}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-ink-faint">Student ID</span>
            <span className="font-mono text-ink">{transaction.sid}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-ink-faint">Payment Gateway</span>
            <span className="font-semibold text-jade">{transaction.method}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-ink-faint">Timestamp</span>
            <span className="font-mono text-ink-muted">{formatTimeAgo(transaction.at)}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-ink-faint">Verification Status</span>
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

        <p className="text-xs text-ink-faint leading-relaxed mb-6">
          Webhook validation status is cryptographically signed by the payment aggregator. Direct status tampering is prevented by backend HMAC check.
        </p>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/8">
          {transaction.status === "pending" && (
            <button
              onClick={() => {
                onVerify(transaction.id);
                onClose();
              }}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
            >
              Re-query Gateway
            </button>
          )}

          {transaction.status === "success" && (
            <button
              onClick={() => {
                onRefund(transaction.id);
                onClose();
              }}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs text-rose hover:border-rose/40")}
            >
              Issue Refund
            </button>
          )}

          <button
            onClick={onClose}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
          >
            Done
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
