"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle, ShieldCheck, Filter } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Meter } from "@/components/dashboard/meter";
import type { CourseSemesterAttendance } from "./attendance-types";

interface LectureHistoryModalProps {
  course: CourseSemesterAttendance | null;
  semesterTitle: string;
  onClose: () => void;
}

export function LectureHistoryModal({
  course,
  semesterTitle,
  onClose,
}: LectureHistoryModalProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  if (!course) return null;

  const filteredLogs = course.lectureLogs.filter((log) => {
    if (statusFilter === "ALL") return true;
    return log.status === statusFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#111927] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-start justify-between bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-jade font-bold text-sm px-2 py-0.5 rounded-md bg-jade/10 border border-jade/20">
                {course.code}
              </span>
              <span className="text-xs text-ink-faint font-mono">
                {semesterTitle} · {course.type} ({course.credits} Credits)
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {course.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-faint pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-jade" /> {course.instructor}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {course.room}
              </span>
              {course.schedule && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-marigold" /> {course.schedule}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ink-faint hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attendance Summary Bar inside modal */}
        <div className="px-5 py-4 bg-white/[0.03] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-ink-faint block">
                Attendance Rate
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-bold font-mono text-white">{course.pct}%</span>
                <StatusPill tone={course.isEligible ? "ok" : "bad"}>
                  {course.isEligible ? "Eligible" : "At Risk"}
                </StatusPill>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-ink-faint text-[10px] block font-sans">Classes Held</span>
                <span className="font-bold text-ink">{course.totalHeld}</span>
              </div>
              <div>
                <span className="text-ink-faint text-[10px] block font-sans">Present</span>
                <span className="font-bold text-jade">{course.totalPresent}</span>
              </div>
              <div>
                <span className="text-ink-faint text-[10px] block font-sans">Late</span>
                <span className="font-bold text-marigold">{course.totalLate}</span>
              </div>
              <div>
                <span className="text-ink-faint text-[10px] block font-sans">Absent</span>
                <span className="font-bold text-rose">{course.totalAbsent}</span>
              </div>
            </div>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
            {["ALL", "PRESENT", "LATE", "ABSENT"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? "bg-white/20 text-white font-bold"
                    : "text-ink-faint hover:text-ink hover:bg-white/5"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Lecture Logs List */}
        <div className="overflow-y-auto p-5 space-y-2.5 max-h-[50vh]">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-ink-faint text-sm">
              No lecture records found for status filter "{statusFilter}".
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.lectureNumber}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-ink-faint shrink-0 mt-0.5">
                    #{log.lectureNumber}
                  </span>

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-ink leading-snug">
                      {log.topic}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-faint font-mono mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-ink-faint" /> {log.date} ({log.dayOfWeek})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-ink-faint" /> {log.time}
                      </span>
                      <span>•</span>
                      <span className="text-ink-faint/80">{log.room}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center shrink-0">
                  <span className="text-[10px] text-ink-faint/70 font-mono hidden md:inline">
                    Verified by {log.verifiedBy.split(" ").slice(-1)[0]}
                  </span>

                  {log.status === "PRESENT" && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-jade/15 text-jade border border-jade/25 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </span>
                  )}
                  {log.status === "LATE" && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-amber-400/15 text-amber-300 border border-amber-400/25 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Late
                    </span>
                  )}
                  {log.status === "ABSENT" && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-rose/15 text-rose border border-rose/25 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Absent
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <span className="text-[11px] text-ink-faint flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-jade" /> Department of CSE Academic Attendance System
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
