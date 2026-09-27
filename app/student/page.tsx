"use client";

import React from "react";
import Link from "next/link";
import { AreaTrendChart } from "@/components/dashboard/charts/area-trend-chart";
import { DegreeGauge } from "@/components/dashboard/charts/degree-gauge";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function StudentDashboardPage() {
  const { student, user, term, role } = useApp();

  const dueInvoice = student.invoices.find((i) => i.status === "due");
  const completionPct = Math.round((student.creditsDone / student.creditsNeeded) * 100);

  return (
    <DashboardLayout
      title={`Welcome back, ${user.name.split(" ")[0]}`}
      subtitle={`${user.program} · ${user.batch} · ${term.name}`}
      requiredRole="student"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/student/results?role=${role}`}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
          >
            Results
          </Link>
          <Link
            href={`/student/registration?role=${role}`}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
          >
            Register courses
          </Link>
        </div>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="CGPA"
          value={student.cgpa.toFixed(2)}
          detail="+0.06 since last term"
          tone="up"
        />
        <StatTile
          label="Credits Completed"
          value={
            <>
              {student.creditsDone}
              <span className="text-base text-ink-faint font-normal font-sans">
                /{student.creditsNeeded}
              </span>
            </>
          }
          detail={`${completionPct}% of the degree`}
        />
        <StatTile
          label="Attendance"
          value={`${student.attendance}%`}
          detail="Above the 75% bar"
          tone="up"
        />
        <StatTile
          label="Outstanding"
          value={dueInvoice ? formatTaka(dueInvoice.amount) : "৳0"}
          detail={dueInvoice ? `Due ${dueInvoice.due}` : "Nothing due"}
          tone={dueInvoice ? "down" : "up"}
        />
      </div>

      {/* Row 2: GPA Trend & Degree Progress Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-ink mb-1">
            GPA by Term
          </h3>
          <p className="text-xs text-ink-faint mb-4">
            Six terms, term GPA not cumulative.
          </p>
          <AreaTrendChart data={student.gpaHistory} color="#2ED3A7" />
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <h3 className="font-display text-lg font-semibold text-ink text-left mb-1">
              Degree Progress
            </h3>
            <p className="text-xs text-ink-faint text-left mb-4">
              Credits earned toward graduation.
            </p>
          </div>

          <DegreeGauge percentage={completionPct} color="#9B8CFF" />

          <p className="text-xs text-ink-muted mt-3">
            {student.creditsNeeded - student.creditsDone} credits left, roughly three terms.
          </p>
        </GlassCard>
      </div>

      {/* Row 3: This Term's Courses & Needs Attention Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-ink">
              This Term&apos;s Courses
            </h3>
            <Link
              href={`/student/courses?role=${role}`}
              className="text-xs text-jade hover:underline font-semibold"
            >
              All courses & routine →
            </Link>
          </div>

          <div className="grid gap-2.5">
            {student.enrolled.map((c) => (
              <div
                key={c.code}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all"
              >
                <div>
                  <p className="font-mono text-xs font-bold text-jade">
                    {c.code} · Section {c.section}
                  </p>
                  <p className="font-display text-base font-semibold text-ink mt-0.5 leading-tight">
                    {c.title}
                  </p>
                  <p className="text-xs text-ink-faint mt-1">
                    {c.instructor} · {c.room} · {c.slots.join(", ")}
                  </p>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <StatusPill
                    tone={c.attendance >= 90 ? "ok" : c.attendance >= 75 ? "warn" : "bad"}
                  >
                    {c.attendance}% present
                  </StatusPill>
                  <p className="text-xs text-ink-faint sm:mt-1.5 font-mono">{c.credits} credits</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">
            Needs Attention
          </h3>
          <div className="space-y-3 divide-y divide-white/5">
            {student.notices.map((n, i) => (
              <div key={i} className="pt-3 first:pt-0 flex gap-3 text-xs">
                <span
                  className={cn(
                    "size-2 rounded-full mt-1.5 shrink-0",
                    n.tone === "gold" && "bg-marigold",
                    n.tone === "rose" && "bg-rose",
                    n.tone === "orchid" && "bg-orchid",
                    !n.tone && "bg-jade"
                  )}
                />
                <div>
                  <p className="font-semibold text-ink leading-tight">{n.t}</p>
                  <p className="text-ink-muted mt-0.5 leading-relaxed">{n.m}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
