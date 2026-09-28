"use client";

import React from "react";
import { ListFilter, ExternalLink, Calendar, CheckCircle2, Lock } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { Meter } from "@/components/dashboard/meter";
import { StatusPill } from "@/components/dashboard/status-pill";
import type { SemesterAttendanceRecord, CourseSemesterAttendance } from "./attendance-types";

interface MonthlyCourseAttendanceTableProps {
  record: SemesterAttendanceRecord;
  filteredMonthIndex: number; // 0 = all months, 1..4 = specific month
  onSelectCourse: (course: CourseSemesterAttendance) => void;
}

export function MonthlyCourseAttendanceTable({
  record,
  filteredMonthIndex,
  onSelectCourse,
}: MonthlyCourseAttendanceTableProps) {
  const isLocked = record.status === "locked";

  return (
    <GlassCard className="overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 md:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02]">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-jade" />
            {filteredMonthIndex === 0
              ? `${record.semesterTitle} · Complete Course Attendance Breakdown`
              : `${record.semesterTitle} · Month ${filteredMonthIndex} (${record.months[filteredMonthIndex - 1]?.monthName || ""}) Attendance`}
          </h3>
          <p className="text-xs text-ink-faint mt-0.5">
            Click on any course row to inspect the full lecture-by-lecture daily attendance log.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-ink-faint">
          <span className="w-2.5 h-2.5 rounded-full bg-jade inline-block" /> ≥75% (Eligible)
          <span className="w-2.5 h-2.5 rounded-full bg-rose inline-block ml-2" /> &lt;75% (Barred)
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-3.5">Course & Faculty</th>
              {filteredMonthIndex === 0 && (
                <th className="px-4 py-3.5 text-center min-w-[170px]">Monthly Progress</th>
              )}
              <th className="px-4 py-3.5 text-center">Held</th>
              <th className="px-4 py-3.5 text-center">Present</th>
              <th className="px-4 py-3.5 text-center">Late</th>
              <th className="px-4 py-3.5 text-center">Absent</th>
              <th className="px-4 py-3.5 min-w-[170px]">Attendance Rate</th>
              <th className="px-4 py-3.5 text-center">Clearance</th>
              <th className="px-4 py-3.5 text-right">Log Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 font-mono text-xs">
            {record.courses.map((course) => {
              // Calculate statistics based on filter
              let held = course.totalHeld;
              let present = course.totalPresent;
              let late = course.totalLate;
              let absent = course.totalAbsent;
              let pct = course.pct;

              if (filteredMonthIndex > 0) {
                const mStats = course.monthlyBreakdown[filteredMonthIndex - 1];
                if (mStats) {
                  held = mStats.held;
                  present = mStats.present;
                  late = mStats.late;
                  absent = mStats.absent;
                  pct = mStats.pct;
                }
              }

              const isEligible = pct >= 75;

              return (
                <tr
                  key={course.code}
                  onClick={() => !isLocked && onSelectCourse(course)}
                  className={`transition-colors ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-white/[0.04] cursor-pointer group"
                  }`}
                >
                  {/* Course info */}
                  <td className="px-4 py-3.5 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-jade font-bold text-xs bg-jade/10 px-2 py-0.5 rounded border border-jade/20">
                        {course.code}
                      </span>
                      <span className="text-[10px] text-ink-faint uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5">
                        {course.type}
                      </span>
                    </div>
                    <div className="font-medium text-ink text-xs mt-1 group-hover:text-white transition-colors">
                      {course.title}
                    </div>
                    <div className="text-ink-faint text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{course.instructor}</span>
                      <span>•</span>
                      <span className="font-mono">{course.room}</span>
                    </div>
                  </td>

                  {/* 4-Month Mini Badges (when all months is selected) */}
                  {filteredMonthIndex === 0 && (
                    <td className="px-4 py-3.5">
                      {isLocked ? (
                        <span className="text-ink-faint/60 text-[11px] italic block text-center">
                          Scheduled
                        </span>
                      ) : (
                        <div className="grid grid-cols-4 gap-1.5">
                          {course.monthlyBreakdown.map((mb) => (
                            <div
                              key={mb.monthIndex}
                              className={`p-1 rounded text-center border ${
                                mb.held === 0
                                  ? "bg-white/[0.02] border-white/5 opacity-40"
                                  : mb.pct >= 75
                                  ? "bg-jade/[0.08] border-jade/20 text-jade"
                                  : "bg-rose/[0.08] border-rose/20 text-rose"
                              }`}
                              title={`${mb.monthName}: ${mb.held > 0 ? `${mb.pct}% (${mb.present}/${mb.held})` : "No classes"}`}
                            >
                              <div className="text-[9px] font-mono text-ink-faint">M{mb.monthIndex}</div>
                              <div className="text-[10px] font-bold font-mono">
                                {mb.held > 0 ? `${mb.pct}%` : "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Counts */}
                  <td className="px-4 py-3.5 text-center text-ink font-bold">
                    {isLocked ? "—" : held}
                  </td>
                  <td className="px-4 py-3.5 text-center text-jade font-bold">
                    {isLocked ? "—" : present}
                  </td>
                  <td className="px-4 py-3.5 text-center text-marigold">
                    {isLocked ? "—" : late}
                  </td>
                  <td className="px-4 py-3.5 text-center text-rose font-bold">
                    {isLocked ? "—" : absent}
                  </td>

                  {/* Attendance Rate Meter */}
                  <td className="px-4 py-3.5">
                    {isLocked ? (
                      <span className="text-ink-faint text-xs italic">Upcoming</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Meter
                          value={pct}
                          max={100}
                          className="h-2 grow"
                          tone={pct < 75 ? "hot" : pct < 85 ? "warn" : "jade"}
                        />
                        <span
                          className={`w-10 text-right font-bold text-xs ${
                            pct >= 75 ? "text-ink" : "text-rose"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Exam Eligibility */}
                  <td className="px-4 py-3.5 text-center font-sans">
                    {isLocked ? (
                      <StatusPill tone="info">Locked</StatusPill>
                    ) : (
                      <StatusPill tone={isEligible ? "ok" : "bad"}>
                        {isEligible ? "Eligible" : "Barred"}
                      </StatusPill>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right font-sans">
                    {isLocked ? (
                      <span className="text-ink-faint text-xs flex items-center justify-end gap-1">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourse(course);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-ink hover:text-white border border-white/10 transition-all"
                      >
                        <span>Daily Log</span>
                        <ExternalLink className="w-3 h-3 text-jade" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
