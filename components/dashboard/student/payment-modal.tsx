"use client";

import React, { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka } from "@/lib/format";
import type { Invoice } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onPay: (invoiceId: string, method: string) => void;
}

export function PaymentModal({ invoice, isOpen, onClose, onPay }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("bKash");

  if (!isOpen) return null;

  const methods = [
    {
      id: "bKash",
      name: "bKash Direct",
      desc: "Instant mobile banking payment via bKash gateway",
      badge: "Fastest",
    },
    {
      id: "Card",
      name: "Credit / Debit Card (Stripe)",
      desc: "Visa, Mastercard, AMEX with instant receipt",
      badge: "Global",
    },
    {
      id: "SSLCommerz",
      name: "SSLCommerz Local Gateway",
      desc: "Nagad, Rocket, Upay, Internet Banking & all local cards",
      badge: "Bangladesh",
    },
  ];

  const handleConfirm = () => {
    onPay(invoice.id, selectedMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <GlassCard className="w-full max-w-lg p-6 md:p-8 shadow-2xl border-white/20">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-ink">
              Pay {formatTaka(invoice.amount)}
            </h3>
            <p className="text-xs text-ink-muted font-mono mt-0.5">
              {invoice.id} · {invoice.title}
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

        {/* Payment Gateways */}
        <div className="space-y-2.5 my-6">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
            Select Payment Method
          </p>
          {methods.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={cn(
                "p-3.5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3",
                selectedMethod === m.id
                  ? "border-jade/60 bg-jade/10 shadow-sm"
                  : "border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink">{m.name}</span>
                  <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/10 text-ink-muted">
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5">{m.desc}</p>
              </div>

              <div
                className={cn(
                  "size-4 rounded-full border flex items-center justify-center shrink-0",
                  selectedMethod === m.id
                    ? "border-jade bg-jade text-night-900"
                    : "border-white/20"
                )}
              >
                {selectedMethod === m.id && (
                  <span className="size-1.5 rounded-full bg-night-900" />
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-faint leading-relaxed mb-6">
          🔒 Payments are end-to-end verified via secure webhooks. You will be redirected to the secure gateway for OTP / authentication.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }))}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={cn(buttonClass({ variant: "primary", size: "sm" }))}
          >
            Proceed with {selectedMethod}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
