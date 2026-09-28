"use client";

import React from "react";
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { StatusPill } from "@/components/dashboard/status-pill";
import {
  exportAttendanceSlipAsPdf,
  exportAttendanceSlipAsPng,
  type AttendanceSlipData,
} from "./attendance-slip-exporter";

interface AttendanceSlipModalProps {
  data: AttendanceSlipData;
  onClose: () => void;
}

export function AttendanceSlipModal({ data, onClose }: AttendanceSlipModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0F172A] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-jade/10 text-jade border border-jade/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Official Semester Attendance Record Slip
              </h2>
              <p className="text-xs text-ink-faint font-mono">
                Ref: {data.slipNumber} · {data.semesterTitle} ({data.termName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportAttendanceSlipAsPdf(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-jade text-[#06121E] hover:bg-jade/90 text-xs font-bold transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={() => exportAttendanceSlipAsPng(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Download</span> PNG
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-ink-faint hover:text-white rounded-md hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Beautiful Attendance Slip Preview (Certificate Grade) */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          <div className="bg-[#0B1320] border-2 border-jade/30 rounded-xl p-5 sm:p-7 relative shadow-inner">
            {/* Watermark Crest Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Building2 className="w-96 h-96 text-white" />
            </div>

            {/* Slip Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-double border-jade/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight uppercase">
                    Bidyapith University
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-jade/10 text-jade border border-jade/25 font-bold font-mono">
                    OFFICIAL
                  </span>
                </div>
                <p className="text-xs text-jade font-semibold tracking-wider uppercase font-mono">
                  Controller of Examinations · Attendance Verification Division
                </p>
                <p className="text-[11px] text-ink-faint">
                  Purbachal Academic Enclave, Dhaka 1229 · verification@bidyapith.edu
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div
                  className={`inline-block px-3 py-1 rounded text-xs font-extrabold tracking-wide uppercase ${
                    data.isFullyEligible
                      ? "bg-jade/20 text-jade border border-jade/40"
                      : "bg-rose/20 text-rose border border-rose/40"
                  }`}
                >
                  {data.isFullyEligible ? "CLEARED TO SIT FINALS (≥75%)" : "EXAMINATION AT RISK"}
                </div>
                <div className="text-xs text-ink font-mono font-bold">
                  Slip Ref: {data.slipNumber}
                </div>
                <div className="text-[11px] text-ink-faint font-mono">Issued: {data.issueDate}</div>
              </div>
            </div>

            {/* Student & Term Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">
                  Student Profile
                </span>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Name:</span>
                  <span className="text-white font-semibold">{data.studentName}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-ink-faint">ID:</span>
                  <span className="text-jade font-bold">{data.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Program:</span>
                  <span className="text-white font-medium">{data.programTitle}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">
                  Academic Term Audit
                </span>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Term:</span>
                  <span className="text-white font-semibold">
                    {data.semesterTitle} ({data.termName})
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-ink-faint">Overall Rate:</span>
                  <span
                    className={`font-bold ${data.overallPct >= 75 ? "text-jade" : "text-rose"}`}
                  >
                    {data.overallPct}%
                  </span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-ink-faint">Security Hash:</span>
                  <span className="text-ink-faint">{data.verificationHash}</span>
                </div>
              </div>
            </div>

            {/* 4 Summary Stat Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Attendance Rate
                </span>
                <span
                  className={`text-xl font-extrabold font-mono ${
                    data.overallPct >= 75 ? "text-jade" : "text-rose"
                  }`}
                >
                  {data.overallPct}%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Classes Held
                </span>
                <span className="text-xl font-extrabold font-mono text-white">
                  {data.totalHeld}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Present / Late
                </span>
                <span className="text-xl font-extrabold font-mono text-jade">
                  {data.totalPresent} / {data.totalLate}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Total Absences
                </span>
                <span className="text-xl font-extrabold font-mono text-rose">
                  {data.totalAbsent}
                </span>
              </div>
            </div>

            {/* Course Attendance Table */}
            <div className="overflow-x-auto my-4 border border-white/10 rounded-lg">
              <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-white/5 text-[10px] uppercase font-bold text-ink-faint border-b border-white/10 tracking-wider">
                    <th className="px-3.5 py-2.5">Course Code</th>
                    <th className="px-3.5 py-2.5">Course Title & Faculty</th>
                    <th className="px-3 py-2.5 text-center">Held</th>
                    <th className="px-3 py-2.5 text-center">Present</th>
                    <th className="px-3 py-2.5 text-center">Late</th>
                    <th className="px-3 py-2.5 text-center">Absent</th>
                    <th className="px-3.5 py-2.5 text-right">Rate</th>
                    <th className="px-3.5 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {data.courses.map((c) => (
                    <tr key={c.code} className="hover:bg-white/[0.02]">
                      <td className="px-3.5 py-2.5 font-bold text-jade">{c.code}</td>
                      <td className="px-3.5 py-2.5 font-sans">
                        <div className="font-semibold text-white">{c.title}</div>
                        <div className="text-[10px] text-ink-faint">
                          {c.instructor} · {c.room} ({c.credits} Cr)
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center text-ink">{c.held}</td>
                      <td className="px-3 py-2.5 text-center text-jade font-bold">{c.present}</td>
                      <td className="px-3 py-2.5 text-center text-amber-400">{c.late}</td>
                      <td className="px-3 py-2.5 text-center text-rose">{c.absent}</td>
                      <td
                        className={`px-3.5 py-2.5 text-right font-bold ${
                          c.pct >= 75 ? "text-jade" : "text-rose"
                        }`}
                      >
                        {c.pct}%
                      </td>
                      <td className="px-3.5 py-2.5 text-center font-sans">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.isEligible
                              ? "bg-jade/20 text-jade border border-jade/30"
                              : "bg-rose/20 text-rose border border-rose/30"
                          }`}
                        >
                          {c.isEligible ? "CLEARED" : "BARRED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ordinance Note */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-[11px] text-ink-faint leading-relaxed">
              <b className="text-white">Academic Ordinance Note:</b> As per University Academic Ordinance (Clause 4.2), a minimum of 75% attendance is mandatory in each enrolled course to be qualified for the Semester Final Examinations.
            </div>

            {/* Digital Signatures Block */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="h-10 flex items-end justify-center font-mono text-[11px] text-ink-faint/60">
                  Digitally Signed
                </div>
                <div className="border-t border-white/20 pt-1 text-[11px] font-semibold text-ink-faint">
                  Student Signature
                </div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center font-mono text-[11px] text-jade font-bold">
                  ✓ SEAL VERIFIED
                </div>
                <div className="border-t border-white/20 pt-1 text-[11px] font-semibold text-ink-faint">
                  Head of Department
                </div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center font-mono text-[11px] text-ink font-bold">
                  Controller of Exams
                </div>
                <div className="border-t border-white/20 pt-1 text-[11px] font-semibold text-ink-faint">
                  Controller of Examinations
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-ink-faint font-mono">
            <ShieldCheck className="w-4 h-4 text-jade shrink-0" />
            <span>Cryptographic Verification Seal Active · 256-bit SHA Certified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportAttendanceSlipAsPdf(data)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-jade text-[#06121E] hover:bg-jade/90 text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
