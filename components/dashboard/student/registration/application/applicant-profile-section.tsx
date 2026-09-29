"use client";

import React from "react";
import { User, GraduationCap } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";

interface ApplicantProfileSectionProps {
  studentName: string;
  onStudentNameChange: (val: string) => void;
  studentId: string;
  onStudentIdChange: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  department: string;
  onDepartmentChange: (val: string) => void;
  cgpa: string;
  onCgpaChange: (val: string) => void;
  creditsDone: string;
  onCreditsDoneChange: (val: string) => void;
}

export function ApplicantProfileSection({
  studentName,
  onStudentNameChange,
  studentId,
  onStudentIdChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  department,
  onDepartmentChange,
  cgpa,
  onCgpaChange,
  creditsDone,
  onCreditsDoneChange,
}: ApplicantProfileSectionProps) {
  return (
    <>
      {/* Section 1: Applicant Profile */}
      <GlassCard className="p-6 md:p-7 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <User className="size-4 text-jade" />
          <h2 className="font-display text-base font-bold text-ink">
            1. Student Applicant Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-ink-faint font-medium mb-1.5">Full Student Name</label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => onStudentNameChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink focus:outline-none focus:border-jade/50"
            />
          </div>

          <div>
            <label className="block text-ink-faint font-medium mb-1.5">Student ID</label>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => onStudentIdChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
            />
          </div>

          <div>
            <label className="block text-ink-faint font-medium mb-1.5">Official University Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
            />
            <span className="text-[10px] text-ink-faint mt-1 block">
              Verification notice and payment link will be sent to this email.
            </span>
          </div>

          <div>
            <label className="block text-ink-faint font-medium mb-1.5">Contact Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
            />
          </div>
        </div>
      </GlassCard>

      {/* Section 2: Academic Standing & Prerequisites */}
      <GlassCard className="p-6 md:p-7 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <GraduationCap className="size-4 text-cyan-400" />
          <h2 className="font-display text-base font-bold text-ink">
            2. Academic Credentials & Prerequisite Eligibility
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-ink-faint font-medium mb-1.5">Department / Program</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
            />
          </div>

          <div>
            <label className="block text-ink-faint font-medium mb-1.5">Current Cumulative GPA (CGPA)</label>
            <input
              type="text"
              required
              value={cgpa}
              onChange={(e) => onCgpaChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono font-bold text-jade focus:outline-none focus:border-jade/50"
            />
          </div>

          <div>
            <label className="block text-ink-faint font-medium mb-1.5">Completed Credit Hours</label>
            <input
              type="text"
              required
              value={creditsDone}
              onChange={(e) => onCreditsDoneChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
            />
          </div>
        </div>
      </GlassCard>
    </>
  );
}
