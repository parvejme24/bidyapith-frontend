"use client";

import React from "react";
import { toast } from "sonner";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RoutineView } from "@/components/dashboard/student/routine-view";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function StudentCoursesPage() {
  const { student } = useApp();

  const totalCredits = student.enrolled.reduce((sum, c) => sum + c.credits, 0);

  return (
    <DashboardLayout
      title="My Courses"
      subtitle={`${student.enrolled.length} enrolled courses · ${totalCredits} credits this term`}
      requiredRole="student"
      crumb="Student / Study"
      actions={
        <button
          onClick={() => toast.success("Routine exported as PDF — GET /routine.pdf")}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          <DashboardIcon name="download" className="size-3.5" />
          <span>Export routine</span>
        </button>
      }
    >
      {/* Weekly Timetable Schedule */}
      <RoutineView enrolled={student.enrolled} />

      {/* Courses Detailed Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {student.enrolled.map((c) => (
          <GlassCard key={c.code} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/8">
                <div>
                  <span className="font-mono text-xs font-bold text-jade">
                    {c.code}
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink leading-tight mt-0.5">
                    {c.title}
                  </h3>
                </div>
                <StatusPill tone="mute">Section {c.section}</StatusPill>
              </div>

              <dl className="grid grid-cols-2 gap-y-3 gap-x-4 my-4 text-xs">
                <div>
                  <dt className="text-ink-faint">Instructor</dt>
                  <dd className="font-semibold text-ink mt-0.5">{c.instructor}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Room / Lab</dt>
                  <dd className="font-semibold text-ink font-mono mt-0.5">{c.room}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Class Slots</dt>
                  <dd className="font-semibold text-ink mt-0.5">{c.slots.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-ink-faint">Credits</dt>
                  <dd className="font-semibold text-ink font-mono mt-0.5">{c.credits} cr</dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/8 text-xs">
              <span className="text-ink-muted">Attendance Record</span>
              <StatusPill
                tone={c.attendance >= 90 ? "ok" : c.attendance >= 75 ? "warn" : "bad"}
              >
                {c.attendance}% present
              </StatusPill>
            </div>
          </GlassCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
