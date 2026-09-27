"use client";

import React from "react";
import { toast } from "sonner";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { useApp } from "@/lib/app-context";
import { formatTimeAgo } from "@/lib/app-data";
import type { AuditRecord } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function AdminAuditPage() {
  const { auditLogs } = useApp();

  const actions = Array.from(new Set(auditLogs.map((a) => a.action)));
  const staffCount = auditLogs.filter((a) => a.role !== "system").length;
  const systemCount = auditLogs.filter((a) => a.role === "system").length;

  const columns: ColumnDef<AuditRecord>[] = [
    {
      key: "at",
      label: "When",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs text-ink-faint">{formatTimeAgo(r.at)}</span>
      ),
    },
    {
      key: "actor",
      label: "Actor",
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-semibold text-ink block leading-tight">{r.actor}</span>
          <span className="text-[0.7rem] uppercase tracking-wider text-ink-faint font-mono font-bold">
            {r.role}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs font-bold text-jade">{r.action}</span>
      ),
    },
    {
      key: "target",
      label: "Target Entity",
      render: (r) => (
        <span className="font-mono text-xs text-ink">{r.target}</span>
      ),
    },
    {
      key: "detail",
      label: "Event Detail",
      render: (r) => <span className="text-xs text-ink-muted">{r.detail}</span>,
    },
  ];

  return (
    <DashboardLayout
      title="Audit Log"
      subtitle="Immutable event stream: every state change, actor, and timestamp"
      requiredRole="admin"
      crumb="Admin / System"
      actions={
        <button
          onClick={() => toast.success("Audit log exported as CSV")}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          <DashboardIcon name="download" className="size-3.5" />
          <span>Export log</span>
        </button>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Entries"
          value={auditLogs.length}
          detail="Immutable append-only ledger"
        />
        <StatTile
          label="By Staff"
          value={staffCount}
          detail="Admin and instructor actions"
        />
        <StatTile
          label="By System"
          value={systemCount}
          detail="Webhooks, background jobs, auth"
        />
        <StatTile
          label="Data Retention"
          value="5 Years"
          detail="Compliance requirement"
        />
      </div>

      {/* Audit Log Table */}
      <DataTable
        columns={columns}
        data={auditLogs}
        searchKeys={["actor", "action", "target", "detail"]}
        searchPlaceholder="Search actor, action, target entity, or detail..."
        pageSize={8}
        initialSortKey="at"
        initialSortDir="desc"
        filters={[
          {
            id: "role",
            label: "All actors",
            options: [
              { value: "admin", label: "Admin" },
              { value: "instructor", label: "Instructor" },
              { value: "system", label: "System" },
            ],
            match: (r, v) => r.role === v,
          },
          {
            id: "action",
            label: "All actions",
            options: actions.map((a) => ({ value: a, label: a })),
            match: (r, v) => r.action === v,
          },
        ]}
      />
    </DashboardLayout>
  );
}
