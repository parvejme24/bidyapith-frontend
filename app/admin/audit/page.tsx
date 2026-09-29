"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatTimeAgo } from "@/lib/format";
import type { AuditRecord } from "@/lib/app-types";
import { downloadCsv } from "@/lib/csv-export";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { Activity, BookOpen, CheckCircle2, ClipboardCheck, GraduationCap, ShieldCheck, UserCheck } from "lucide-react";

export default function AdminAuditPage() {
  const { auditLogs } = useApp();
  const [filterCategory, setFilterCategory] = useState<"all" | "teacher" | "attendance" | "marks" | "admin">("all");

  const filteredLogs = useMemo(() => {
    if (filterCategory === "teacher") {
      return auditLogs.filter(
        (a) =>
          a.role === "instructor" ||
          a.action.startsWith("attendance.") ||
          a.action.startsWith("marks.") ||
          a.action.startsWith("grades.") ||
          a.action.startsWith("grade.")
      );
    }
    if (filterCategory === "attendance") {
      return auditLogs.filter((a) => a.action.startsWith("attendance."));
    }
    if (filterCategory === "marks") {
      return auditLogs.filter(
        (a) =>
          a.action.startsWith("marks.") ||
          a.action.startsWith("grades.") ||
          a.action.startsWith("grade.") ||
          a.action.startsWith("results.")
      );
    }
    if (filterCategory === "admin") {
      return auditLogs.filter((a) => a.role === "admin");
    }
    return auditLogs;
  }, [auditLogs, filterCategory]);

  const teacherActivitiesCount = auditLogs.filter(
    (a) =>
      a.role === "instructor" ||
      a.action.startsWith("attendance.") ||
      a.action.startsWith("marks.") ||
      a.action.startsWith("grades.") ||
      a.action.startsWith("grade.")
  ).length;

  const attendanceCount = auditLogs.filter((a) => a.action.startsWith("attendance.")).length;
  const marksGradingCount = auditLogs.filter(
    (a) =>
      a.action.startsWith("marks.") ||
      a.action.startsWith("grades.") ||
      a.action.startsWith("grade.") ||
      a.action.startsWith("results.")
  ).length;

  const actions = Array.from(new Set(auditLogs.map((a) => a.action)));

  const handleExportCsv = () => {
    const headers = ["Timestamp", "Actor", "Role", "Action", "Target", "Detail"];
    const rows = filteredLogs.map((log) => [
      log.at,
      log.actor,
      log.role,
      log.action,
      log.target,
      log.detail,
    ]);
    downloadCsv("Bidyapith_Teacher_And_Audit_Logs.csv", [headers, ...rows]);
    toast.success("Activity log exported as CSV");
  };

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
      label: "Actor & Role",
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-semibold text-ink block leading-tight">{r.actor}</span>
          <span
            className={cn(
              "text-[0.68rem] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5",
              r.role === "instructor"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : r.role === "admin"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : "bg-white/5 text-ink-muted border-white/10"
            )}
          >
            {r.role}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action Type",
      sortable: true,
      render: (r) => (
        <span
          className={cn(
            "font-mono text-xs font-bold",
            r.action.startsWith("attendance.")
              ? "text-jade"
              : r.action.startsWith("marks.") || r.action.startsWith("grades.")
              ? "text-amber-400"
              : r.action.startsWith("results.")
              ? "text-sky-400"
              : "text-ink"
          )}
        >
          {r.action}
        </span>
      ),
    },
    {
      key: "target",
      label: "Target Section / Student",
      render: (r) => (
        <span className="font-mono text-xs text-ink">{r.target}</span>
      ),
    },
    {
      key: "detail",
      label: "Event Detail",
      render: (r) => <span className="text-xs text-ink-muted leading-relaxed">{r.detail}</span>,
    },
  ];

  return (
    <DashboardLayout
      title="Teacher Activity & System Audit Hub"
      subtitle="Real-time log stream of teacher attendance taking, marks assignments, grade submissions & admin publishing"
      requiredRole="admin"
      crumb="Admin / Activity & Audit"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/results"
            className={cn(
              buttonClass({ variant: "primary", size: "sm" }),
              "text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            )}
          >
            <CheckCircle2 className="size-3.5" />
            <span>Review & Publish Results</span>
          </Link>
          <button
            type="button"
            onClick={handleExportCsv}
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "text-xs cursor-pointer hover:border-jade/40"
            )}
          >
            <DashboardIcon name="download" className="size-3.5 text-jade" />
            <span>Export log</span>
          </button>
        </div>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Activity Logs"
          value={auditLogs.length}
          detail="Immutable university audit trail"
        />
        <StatTile
          label="Teacher Logs & Events"
          value={teacherActivitiesCount}
          detail="Attendance & mark submissions"
          tone="up"
        />
        <StatTile
          label="Attendance Records"
          value={attendanceCount}
          detail="Daily classroom attendance sessions"
        />
        <StatTile
          label="Marks & Results Operations"
          value={marksGradingCount}
          detail="Grading and publishing events"
          tone="up"
        />
      </div>

      {/* Activity Filter Tabs */}
      <GlassCard className="p-3 sm:p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              filterCategory === "all"
                ? "bg-jade text-night-900 font-bold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            <Activity className="size-3.5 shrink-0" />
            <span>All Activities ({auditLogs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("teacher")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              filterCategory === "teacher"
                ? "bg-jade text-night-900 font-bold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            <UserCheck className="size-3.5 shrink-0" />
            <span>Teacher Logs & Activity ({teacherActivitiesCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("attendance")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              filterCategory === "attendance"
                ? "bg-jade text-night-900 font-bold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            <ClipboardCheck className="size-3.5 shrink-0" />
            <span>Attendance Logs ({attendanceCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("marks")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              filterCategory === "marks"
                ? "bg-jade text-night-900 font-bold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            <GraduationCap className="size-3.5 shrink-0" />
            <span>Marks & Grading ({marksGradingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("admin")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              filterCategory === "admin"
                ? "bg-jade text-night-900 font-bold shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-white/5"
            )}
          >
            <ShieldCheck className="size-3.5 shrink-0" />
            <span>Admin Approvals</span>
          </button>
        </div>
      </GlassCard>

      {/* Audit Log Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchKeys={["actor", "action", "target", "detail"]}
        searchPlaceholder="Search teacher name, action, section code, or detail..."
        pageSize={10}
        initialSortKey="at"
        initialSortDir="desc"
        filters={[
          {
            id: "role",
            label: "All actors",
            options: [
              { value: "instructor", label: "Instructor" },
              { value: "admin", label: "Admin" },
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
