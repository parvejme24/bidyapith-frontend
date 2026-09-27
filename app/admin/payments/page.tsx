"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { PaymentDetailsModal } from "@/components/dashboard/admin/payment-details-modal";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { useApp } from "@/lib/app-context";
import { formatTaka, formatTimeAgo } from "@/lib/app-data";
import type { PaymentTransaction } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const { adminPayments, verifyPayment, refundPayment } = useApp();
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);

  const capturedTotal = adminPayments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);

  const pendingTotal = adminPayments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);

  const failedCount = adminPayments.filter((p) => p.status === "failed").length;
  const refundedTotal = adminPayments
    .filter((p) => p.status === "refunded")
    .reduce((s, p) => s + p.amount, 0);

  const columns: ColumnDef<PaymentTransaction>[] = [
    {
      key: "id",
      label: "Transaction",
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-mono text-xs font-bold text-jade block">{r.id}</span>
          <span className="font-mono text-[0.7rem] text-ink-faint">ref: {r.ref}</span>
        </div>
      ),
    },
    {
      key: "student",
      label: "Student",
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-semibold text-ink block leading-tight">{r.student}</span>
          <span className="font-mono text-[0.7rem] text-ink-faint">{r.sid}</span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (r) => (
        <span className="font-mono font-bold text-ink">{formatTaka(r.amount)}</span>
      ),
    },
    {
      key: "method",
      label: "Gateway",
      render: (r) => <span className="font-medium text-ink-muted text-xs">{r.method}</span>,
    },
    {
      key: "at",
      label: "When",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs text-ink-faint">{formatTimeAgo(r.at)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <StatusPill
          tone={
            r.status === "success"
              ? "ok"
              : r.status === "pending"
              ? "warn"
              : r.status === "refunded"
              ? "info"
              : "bad"
          }
        >
          {r.status}
        </StatusPill>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r) => (
        <button
          onClick={() => setSelectedTxn(r)}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Payments Ledger"
      subtitle="Gateway transactions and their verified webhook statuses"
      requiredRole="admin"
      crumb="Admin / Operations"
      actions={
        <button
          onClick={() => toast.success("Statement exported as CSV")}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          <DashboardIcon name="download" className="size-3.5" />
          <span>Export statement</span>
        </button>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Captured Total"
          value={formatTaka(capturedTotal)}
          detail={`${adminPayments.filter((p) => p.status === "success").length} transactions`}
          tone="up"
        />
        <StatTile
          label="Pending Webhooks"
          value={formatTaka(pendingTotal)}
          detail="Awaiting verification"
          tone={pendingTotal > 0 ? "down" : "up"}
        />
        <StatTile
          label="Failed Payments"
          value={failedCount}
          detail="Gateway declined"
          tone={failedCount > 0 ? "down" : ""}
        />
        <StatTile
          label="Refunded"
          value={formatTaka(refundedTotal)}
          detail="Resolved cases"
        />
      </div>

      {/* Payment Transactions Table */}
      <DataTable
        columns={columns}
        data={adminPayments}
        searchKeys={["id", "student", "sid", "ref", "method"]}
        searchPlaceholder="Search transaction, student, SID or reference..."
        pageSize={8}
        initialSortKey="at"
        initialSortDir="desc"
        filters={[
          {
            id: "status",
            label: "All statuses",
            options: [
              { value: "success", label: "Success" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
              { value: "refunded", label: "Refunded" },
            ],
            match: (r, v) => r.status === v,
          },
          {
            id: "method",
            label: "All methods",
            options: [
              { value: "bKash", label: "bKash" },
              { value: "Card", label: "Card" },
              { value: "SSLCommerz", label: "SSLCommerz" },
            ],
            match: (r, v) => r.method === v,
          },
        ]}
      />

      {/* Details & Requery/Refund Modal */}
      {selectedTxn && (
        <PaymentDetailsModal
          transaction={selectedTxn}
          isOpen={Boolean(selectedTxn)}
          onClose={() => setSelectedTxn(null)}
          onVerify={verifyPayment}
          onRefund={refundPayment}
        />
      )}
    </DashboardLayout>
  );
}
