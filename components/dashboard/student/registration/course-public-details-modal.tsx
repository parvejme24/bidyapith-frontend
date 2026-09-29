"use client";

import React from "react";
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  Layers,
  ArrowRight,
} from "lucide-react";
import { StatusPill } from "@/components/dashboard/status-pill";
import { formatTaka } from "@/lib/format";

export interface PublicCourseDetails {
  code: string;
  title: string;
  department: string;
  credits: number;
  type: "Core" | "Lab" | "General" | "Elective" | "Thesis";
  instructor: string;
  room: string;
  schedule: string;
  tuitionFee: number;
  prereq?: string;
  seats: number;
  taken: number;
  description: string;
  learningOutcomes: string[];
  modules: Array<{ week: string; topic: string; details: string }>;
}

interface CoursePublicDetailsModalProps {
  course: PublicCourseDetails | null;
  isEnrolled: boolean;
  onClose: () => void;
  onApply: (course: PublicCourseDetails) => void;
}

export function CoursePublicDetailsModal({
  course,
  isEnrolled,
  onClose,
  onApply,
}: CoursePublicDetailsModalProps) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#111927] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-start justify-between bg-white/[0.02]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-jade font-bold text-sm px-2.5 py-0.5 rounded-md bg-jade/10 border border-jade/25">
                {course.code}
              </span>
              <span className="text-xs text-ink-faint font-mono">
                {course.department} · {course.credits} Credits ({course.type})
              </span>
              {isEnrolled ? (
                <span className="text-xs font-bold font-mono text-jade bg-jade/15 border border-jade/30 px-2 py-0.5 rounded">
                  ✓ Enrolled
                </span>
              ) : (
                <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/25 px-2 py-0.5 rounded">
                  Registration Open
                </span>
              )}
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
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-marigold" /> {course.schedule}
              </span>
              <span className="flex items-center gap-1.5 text-jade font-semibold font-mono">
                Tuition: {formatTaka(course.tuitionFee)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ink-faint hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 md:p-6 space-y-6">
          {/* Overview Section */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-ink-faint flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-jade" /> Course Syllabus & Academic Overview
            </h4>
            <p className="text-xs sm:text-sm text-ink leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs">
            <div>
              <span className="text-[10px] text-ink-faint font-sans block">Prerequisite</span>
              <span className="font-bold text-ink">{course.prereq || "None"}</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-faint font-sans block">Seats Available</span>
              <span className="font-bold text-jade">
                {course.seats - course.taken} / {course.seats}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ink-faint font-sans block">Credit Hours</span>
              <span className="font-bold text-white">{course.credits} Credits</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-faint font-sans block">Course Fee</span>
              <span className="font-bold text-jade">{formatTaka(course.tuitionFee)}</span>
            </div>
          </div>

          {/* Key Learning Outcomes */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-ink-faint flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Learning Outcomes & Competencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.learningOutcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-ink leading-snug"
                >
                  <span className="text-jade font-bold font-mono mt-0.5">•</span>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Syllabus Modules Outline */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-ink-faint flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-marigold" /> Weekly Modular Breakdown
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {course.modules.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-jade">{m.week}</span>
                    <span className="text-ink-faint text-[11px]">{m.topic}</span>
                  </div>
                  <p className="text-ink-faint/80 text-[11px] leading-relaxed">
                    {m.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Registration CTA */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-ink-faint font-mono">
            <ShieldCheck className="w-4 h-4 text-jade shrink-0" />
            <span>Academic Committee Verification & Document Review Required</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
            >
              Close
            </button>

            {!isEnrolled && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApply(course);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-jade text-[#06121E] hover:bg-jade/90 text-xs font-bold transition-all shadow-sm"
              >
                <span>Apply & Register for Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
