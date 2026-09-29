"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AreaTrendChart } from "@/components/dashboard/charts/area-trend-chart";
import { CollectionsBarChart } from "@/components/dashboard/charts/collections-bar-chart";
import { DistributionDonut } from "@/components/dashboard/charts/distribution-donut";
import { AddInstructorModal } from "@/components/dashboard/admin/add-instructor-modal";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatTaka, formatTimeAgo } from "@/lib/format";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";

export default function AdminDashboardPage() {
  const { term, adminUsers, adminPayments, admissionApplications, auditLogs, role, addAuditLog } = useApp();
  const [addInstructorOpen, setAddInstructorOpen] = useState(false);

  const studentCount = adminUsers.filter((u) => u.role === "student").length || 9240;
  const facultyCount = adminUsers.filter((u) => u.role === "instructor").length || 312;
  const totalRevenue = adminPayments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);
  const pendingCount =
    adminPayments.filter((p) => p.status === "pending").length +
    admissionApplications.filter((a) => a.status === "PENDING_REVIEW").length;

  return (
    <DashboardLayout
      title="University Overview"
      subtitle={`${term.name} · Week ${term.week} of ${term.of}`}
      requiredRole="admin"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddInstructorOpen(true)}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs rounded-md flex items-center gap-1.5")}
          >
            <UserPlus className="size-3.5" />
            <span>Add Instructor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toast.success("Executive university report exported");
            }}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs cursor-pointer hover:border-jade/40 rounded-md")}
          >
            <DashboardIcon name="download" className="size-3.5 text-jade" />
            <span>Export report</span>
          </button>
        </div>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Active Students"
          value={studentCount.toLocaleString()}
          detail="Enrolled in university database"
          tone="up"
        />
        <StatTile
          label="Faculty Members"
          value={facultyCount}
          detail="Active teaching staff"
        />
        <StatTile
          label="Fees Collected"
          value={totalRevenue > 0 ? formatTaka(totalRevenue) : "৳1.24 cr"}
          detail="Verified payments"
          tone="up"
        />
        <StatTile
          label="Pending Actions"
          value={pendingCount || 4}
          detail="Payments & admissions review"
          tone={pendingCount > 0 ? "down" : "up"}
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
          <AreaTrendChart
            data={[
              { label: "Jun", value: 340 },
              { label: "Jul", value: 680 },
              { label: "Aug", value: 1420 },
              { label: "Sep", value: admissionApplications.length ? admissionApplications.length * 80 : 2480 },
            ]}
            color="#2ED3A7"
          />
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
            data={[
              { label: "Engineering", value: 4200, color: "#2ED3A7" },
              { label: "Business", value: 3100, color: "#9B8CFF" },
              { label: "Science", value: 2400, color: "#FFB454" },
              { label: "Arts & Law", value: 2700, color: "#6FD8FF" },
            ]}
            centerValue={`${(studentCount / 1000).toFixed(1)}k`}
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
          <CollectionsBarChart
            data={[
              { label: "Tuition", value: 8.4 },
              { label: "Admission", value: 2.1 },
              { label: "Exam Fee", value: 1.2 },
              { label: "Late Fees", value: 0.7 },
            ]}
            color="#FFB454"
          />
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

      <AddInstructorModal
        isOpen={addInstructorOpen}
        onClose={() => setAddInstructorOpen(false)}
        onCreated={() => {
          addAuditLog({
            actor: "Admin",
            role: "admin",
            action: "instructor.create",
            target: "Faculty",
            detail: "New faculty member onboarded to system",
            tone: "gold",
          });
        }}
      />
    </DashboardLayout>
  );
}
