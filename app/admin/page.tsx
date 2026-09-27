"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AreaTrendChart } from "@/components/dashboard/charts/area-trend-chart";
import { CollectionsBarChart } from "@/components/dashboard/charts/collections-bar-chart";
import { DistributionDonut } from "@/components/dashboard/charts/distribution-donut";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { APP_DATA, formatTaka, formatTimeAgo } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { term, adminPayments, auditLogs, role } = useApp();
  const kpi = APP_DATA.admin.kpi;
  const pendingPayments = adminPayments.filter((p) => p.status === "pending");

  return (
    <DashboardLayout
      title="University Overview"
      subtitle={`${term.name} · Week ${term.week} of ${term.of}`}
      requiredRole="admin"
      actions={
        <button
          onClick={() => toast.success("Report queued — GET /admin/reports")}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          <DashboardIcon name="download" className="size-3.5" />
          <span>Export report</span>
        </button>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Active Students"
          value={kpi.students.toLocaleString()}
          detail="+312 this term"
          tone="up"
        />
        <StatTile
          label="Faculty Members"
          value={kpi.faculty}
          detail="18 on study leave"
        />
        <StatTile
          label="Fees Collected"
          value={`৳${(kpi.revenue / 10000000).toFixed(2)} cr`}
          detail="This academic year"
          tone="up"
        />
        <StatTile
          label="Pending Actions"
          value={kpi.pending}
          detail="Payments & role requests"
          tone="down"
        />
      </div>

      {/* Row 2: Admission Trend & Students by School */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-ink mb-1">
            Admission Applications
          </h3>
          <p className="text-xs text-ink-faint mb-4">
            Applications received per month over the current cycle.
          </p>
          <AreaTrendChart data={APP_DATA.admin.admissionsTrend} color="#2ED3A7" />
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink mb-1">
              Students by School
            </h3>
            <p className="text-xs text-ink-faint mb-4">
              Active student enrolment distribution.
            </p>
          </div>
          <DistributionDonut
            data={APP_DATA.admin.bySchool}
            centerValue="12.4k"
            centerLabel="students"
          />
        </GlassCard>
      </div>

      {/* Row 3: Fee Collections & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-1">
            Fee Collection
          </h3>
          <p className="text-xs text-ink-faint mb-4">
            In crore taka, current month partial.
          </p>
          <CollectionsBarChart data={APP_DATA.admin.collections} color="#FFB454" />
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">
              Recent System Activity
            </h3>
            <Link
              href={`/admin/audit?role=${role}`}
              className="text-xs text-jade hover:underline font-semibold"
            >
              Full audit log →
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-white/5">
            {auditLogs.slice(0, 5).map((a, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex gap-3 text-xs">
                <span
                  className={cn(
                    "size-2 rounded-full mt-1.5 shrink-0",
                    a.tone === "rose"
                      ? "bg-rose"
                      : a.tone === "gold"
                      ? "bg-marigold"
                      : a.tone === "orchid"
                      ? "bg-orchid"
                      : "bg-jade"
                  )}
                />
                <div>
                  <p className="font-semibold text-ink">
                    <span className="font-mono text-jade">{a.action}</span> · {a.target}
                  </p>
                  <p className="text-ink-faint mt-0.5">
                    {a.detail} — {a.actor}, {formatTimeAgo(a.at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 4: Pending Payments Awaiting Verification */}
      {pendingPayments.length > 0 && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                Payments Awaiting Verification ({pendingPayments.length})
              </h3>
              <p className="text-xs text-ink-faint mt-0.5">
                Gateway webhooks pending callback verification
              </p>
            </div>
            <Link
              href={`/admin/payments?role=${role}`}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
            >
              Open payments
            </Link>
          </div>

          <div className="grid gap-2.5">
            {pendingPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/8 bg-white/[0.025]"
              >
                <div>
                  <p className="font-mono text-xs font-bold text-jade">{p.id}</p>
                  <p className="text-sm font-semibold text-ink mt-0.5">
                    {p.student} · {formatTaka(p.amount)} via {p.method}
                  </p>
                  <p className="text-xs text-ink-faint mt-0.5 font-mono">
                    Ref: {p.ref} · {formatTimeAgo(p.at)}
                  </p>
                </div>
                <StatusPill tone="warn">Pending</StatusPill>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </DashboardLayout>
  );
}
