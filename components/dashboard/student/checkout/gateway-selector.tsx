"use client";

import React from "react";
import { CheckCircle2, CreditCard, ExternalLink, RefreshCw, Smartphone } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka } from "@/lib/format";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export type PaymentGatewayType = "SSLCOMMERZ" | "STRIPE";
export type SslChannel = "BKASH" | "NAGAD" | "ROCKET" | "CARDS" | "NET_BANKING";

interface GatewaySelectorProps {
  selectedGateway: PaymentGatewayType;
  onSelectGateway: (gw: PaymentGatewayType) => void;
  sslChannel: SslChannel;
  onSelectSslChannel: (ch: SslChannel) => void;
  mobileWalletNumber: string;
  onMobileWalletChange: (v: string) => void;
  walletPin: string;
  onWalletPinChange: (v: string) => void;
  cardNumber: string;
  onCardNumberChange: (v: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (v: string) => void;
  cardCvc: string;
  onCardCvcChange: (v: string) => void;
  isProcessing: boolean;
  processingStageIndex: number;
  stages: { title: string; desc: string }[];
  totalPayable: number;
  onProceed: () => void;
}

export function GatewaySelector({
  selectedGateway,
  onSelectGateway,
  sslChannel,
  onSelectSslChannel,
  mobileWalletNumber,
  onMobileWalletChange,
  walletPin,
  onWalletPinChange,
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvc,
  onCardCvcChange,
  isProcessing,
  processingStageIndex,
  stages,
  totalPayable,
  onProceed,
}: GatewaySelectorProps) {
  return (
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
          onClick={() => !isProcessing && onSelectGateway("SSLCOMMERZ")}
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
          onClick={() => !isProcessing && onSelectGateway("STRIPE")}
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
                onClick={() => onSelectSslChannel(ch.id as SslChannel)}
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
                onChange={(e) => onMobileWalletChange(e.target.value)}
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
                onChange={(e) => onWalletPinChange(e.target.value)}
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
                onChange={(e) => onCardNumberChange(e.target.value)}
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
                  onChange={(e) => onCardExpiryChange(e.target.value)}
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
                  onChange={(e) => onCardCvcChange(e.target.value)}
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
          onClick={onProceed}
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
  );
}
