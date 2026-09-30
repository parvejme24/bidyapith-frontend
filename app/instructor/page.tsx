"use client";

import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Meter } from "@/components/dashboard/meter";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function InstructorDashboardPage() {
  const { user, term, instructorSections, notifications, role } = useApp();

  const totalStudents = instructorSections.reduce((s, x) => s + (x.enrolled || 0), 0);
  const pendingGrades = instructorSections.filter((s) => !s.gradesSubmitted).length;
  const avgAtt = instructorSections.length
    ? Math.round(
        instructorSections.reduce((s, x) => s + x.avgAttendance, 0) / instructorSections.length
      )
    : 0;

  const today = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayClasses = instructorSections.flatMap((section) =>
    section.slots.flatMap((slot) => {
      const [weekday, timeRange] = slot.split(" ");
      if (weekday !== today || !timeRange) return [];
      const [startTime, endTime] = timeRange.split("-");
      if (!startTime || !endTime) return [];
      const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };
      const startMinutes = toMinutes(startTime);
      const endMinutes = toMinutes(endTime);
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const suffix = hours >= 12 ? "PM" : "AM";
        return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
      };
      return [{
        time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
        code: section.code,
        section: section.section,
        room: section.room || "Room not set",
        state: currentMinutes >= startMinutes && currentMinutes <= endMinutes
          ? "now" as const
          : currentMinutes < startMinutes
          ? "next" as const
          : "done" as const,
      }];
    }),
  );

  return (
    <DashboardLayout
      title={`Good morning, ${user.name.split(" ").slice(-1)[0]}`}
      subtitle={`${user.program} · ${term.name}`}
      requiredRole="instructor"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/instructor/attendance?role=${role}`}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
          >
            Take attendance
          </Link>
          <Link
            href={`/instructor/grades?role=${role}`}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
          >
            Enter grades
          </Link>
        </div>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Active Sections"
          value={instructorSections.length}
          detail="This semester"
        />
        <StatTile
          label="Total Students"
          value={totalStudents}
          detail="Across all sections"
        />
        <StatTile
          label="Average Attendance"
          value={`${avgAtt}%`}
          detail={avgAtt > 0 ? "Across assigned sections" : "No attendance recorded"}
          tone={avgAtt > 0 ? (avgAtt >= 75 ? "up" : "down") : ""}
        />
        <StatTile
          label="Pending Grade Sheets"
          value={pendingGrades}
          detail={pendingGrades ? "Submission pending" : "All submitted"}
          tone={pendingGrades ? "down" : "up"}
        />
      </div>

      {/* Row 2: Today's Schedule & Sections Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold text-ink">
            Today&apos;s Classes
          </h3>
          <div className="space-y-3 divide-y divide-white/5">
            {todayClasses.length > 0 ? (
              todayClasses.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex gap-3 text-xs">
                  <span
                    className={cn(
                      "size-2 rounded-full mt-1.5 shrink-0",
                      item.state === "now"
                        ? "bg-marigold animate-ping"
                        : item.state === "next"
                        ? "bg-orchid"
                        : "bg-jade"
                    )}
                  />
                  <div>
                    <p className="font-semibold text-ink">
                      <span className="font-mono text-jade">{item.time}</span> · {item.code} Sec {item.section}
                    </p>
                    <p className="text-ink-faint mt-0.5">
                      {item.room} ·{" "}
                      {item.state === "done"
                        ? "Attendance completed"
                        : item.state === "now"
                        ? "In progress now"
                        : "Upcoming slot"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink-muted">No scheduled classes for today.</p>
            )}
          </div>
        </GlassCard>

        {/* Assigned Sections */}
        <GlassCard className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">
              My Assigned Sections
            </h3>
            <span className="text-xs text-ink-faint">
              {term.name} Teaching Load
            </span>
          </div>

          <div className="grid gap-3">
            {instructorSections.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl sm:rounded-2xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all"
              >
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-jade">
                    {s.code} · Section {s.section}
                  </span>
                  <h4 className="font-display text-base font-semibold text-ink">
                    {s.title}
                  </h4>
                  <p className="text-xs text-ink-faint">
                    {s.room} · {s.slots.length > 0 ? s.slots.join(", ") : "Schedule not set"} · {s.enrolled}/{s.capacity} enrolled
                  </p>
                  <div className="max-w-[220px] pt-1">
                    <Meter value={s.enrolled} max={s.capacity} className="h-1.5" />
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <StatusPill tone={s.avgAttendance >= 85 ? "ok" : "warn"}>
                    {s.avgAttendance}% avg att
                  </StatusPill>
                  <StatusPill tone={s.gradesSubmitted ? "ok" : "warn"}>
                    {s.gradesSubmitted ? "Grades submitted" : "Grades pending"}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Action Items / Queue */}
      <GlassCard className="p-6 space-y-3">
        <h3 className="font-display text-lg font-semibold text-ink">
          Action Items & Reminders
        </h3>
        <div className="space-y-3 divide-y divide-white/5">
          {notifications.slice(0, 4).map((q, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex gap-3 text-xs">
              <span
                className={cn(
                  "size-2 rounded-full mt-1.5 shrink-0",
                  q.tone === "gold" && "bg-marigold",
                  q.tone === "rose" && "bg-rose",
                  q.tone === "orchid" && "bg-orchid",
                  !q.tone && "bg-jade"
                )}
              />
              <div>
                <p className="font-semibold text-ink leading-tight">{q.t}</p>
                <p className="text-ink-muted mt-0.5 leading-relaxed">{q.m}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
