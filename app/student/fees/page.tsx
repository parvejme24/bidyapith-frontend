"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { PaymentModal } from "@/components/dashboard/student/payment-modal";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatShortDate, formatTaka } from "@/lib/app-data";
import type { Invoice } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function StudentFeesPage() {
  const { student, invoices, payInvoice, term, user } = useApp();
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);

  const dueInvoices = invoices.filter((i) => i.status === "due");
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const totalOutstanding = dueInvoices.reduce((s, i) => s + i.amount, 0);
  const totalPaidThisYear = paidInvoices.reduce((s, i) => s + i.amount, 0);

  const nextDue = dueInvoices[0];

  return (
    <DashboardLayout
      title="Fees & Payments"
      subtitle={`${user.program} · ${term.name}`}
      requiredRole="student"
      crumb="Student / Account"
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Outstanding"
          value={formatTaka(totalOutstanding)}
          detail={nextDue ? `Due ${formatShortDate(nextDue.due)}` : "All settled"}
          tone={totalOutstanding > 0 ? "down" : "up"}
        />
        <StatTile
          label="Paid This Year"
          value={formatTaka(totalPaidThisYear)}
          detail={`${paidInvoices.length} receipts generated`}
        />
        <StatTile
          label="Next Instalment"
          value={nextDue ? formatShortDate(nextDue.due) : "—"}
          detail="2% late fee after due date"
        />
        <StatTile
          label="Payment Methods"
          value="3"
          detail="bKash · Card · SSLCommerz"
        />
      </div>

      {/* Primary Outstanding Due Banner */}
      {nextDue && (
        <GlassCard className="p-6 border-marigold/30 bg-marigold/[0.06] flex flex-wrap gap-5 items-center justify-between">
          <div>
            <span className="font-mono text-xs text-ink-faint">{nextDue.id}</span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5">
              {nextDue.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              {formatTaka(nextDue.amount)} due by {formatShortDate(nextDue.due)}
            </p>
          </div>
          <button
            onClick={() => setActivePaymentInvoice(nextDue)}
            className={cn(buttonClass({ variant: "primary" }))}
          >
            Pay {formatTaka(nextDue.amount)}
          </button>
        </GlassCard>
      )}

      {/* Invoices Ledger Table */}
      <GlassCard className="overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <h3 className="font-display text-lg font-semibold text-ink">
            Invoice & Fee History
          </h3>
          <StatusPill tone="mute">{invoices.length} records</StatusPill>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.035] transition-colors">
                  <td className="px-4 py-3 text-jade font-bold">{inv.id}</td>
                  <td className="px-4 py-3 font-sans">
                    <span className="font-semibold text-ink block">{inv.title}</span>
                    {inv.txn && (
                      <span className="text-[0.72rem] text-ink-faint font-mono mt-0.5 block">
                        TXN: {inv.txn}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">
                    {formatTaka(inv.amount)}
                  </td>
                  <td className="px-4 py-3 font-sans text-ink-muted">
                    {inv.method || "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-faint">
                    {formatShortDate(inv.paid || inv.due)}
                  </td>
                  <td className="px-4 py-3 text-right font-sans">
                    <StatusPill tone={inv.status === "paid" ? "ok" : "warn"}>
                      {inv.status === "paid" ? "Paid" : "Due"}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 text-right font-sans">
                    {inv.status === "due" ? (
                      <button
                        onClick={() => setActivePaymentInvoice(inv)}
                        className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
                      >
                        Pay
                      </button>
                    ) : (
                      <button
                        onClick={() => setActivePaymentInvoice(inv)}
                        className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
                      >
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Payment Gateway Modal */}
      {activePaymentInvoice && (
        <PaymentModal
          invoice={activePaymentInvoice}
          isOpen={Boolean(activePaymentInvoice)}
          onClose={() => setActivePaymentInvoice(null)}
          onPay={(id, method) => payInvoice(id, method)}
        />
      )}
    </DashboardLayout>
  );
}
