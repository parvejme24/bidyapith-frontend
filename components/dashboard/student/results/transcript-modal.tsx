"use client";

import React from "react";
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Building2,
  Award,
  BookOpen,
} from "lucide-react";
import {
  exportTranscriptAsPdf,
  exportTranscriptAsPng,
  GRADING_SCALE_LEGEND,
  type OfficialTranscriptData,
} from "./transcript-exporter";

interface TranscriptModalProps {
  data: OfficialTranscriptData;
  onClose: () => void;
}

export function TranscriptModal({ data, onClose }: TranscriptModalProps) {
  const completedTerms = data.terms.filter((t) => t.status === "completed" || t.status === "current");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0F172A] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-jade/10 text-jade border border-jade/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Official Academic Transcript of Record
              </h2>
              <p className="text-xs text-ink-faint font-mono">
                Ref: {data.transcriptNumber} · {data.studentName} ({data.studentId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportTranscriptAsPdf(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-jade text-[#06121E] hover:bg-jade/90 text-xs font-bold transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={() => exportTranscriptAsPng(data)}
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

        {/* Live Official Transcript Document Preview */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="bg-[#0B1320] border-2 border-jade/30 rounded-xl p-5 sm:p-8 relative shadow-inner">
            {/* Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Building2 className="w-96 h-96 text-white" />
            </div>

            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-double border-jade/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-2xl text-white tracking-tight uppercase">
                    Bidyapith University
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-jade/10 text-jade border border-jade/25 font-bold font-mono">
                    AUTHENTICATED
                  </span>
                </div>
                <p className="text-xs text-jade font-semibold tracking-wider uppercase font-mono">
                  Office of the Registrar & Controller of Examinations
                </p>
                <p className="text-[11px] text-ink-faint">
                  Purbachal Academic Enclave, Dhaka 1229 · registrar@bidyapith.edu
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="inline-block px-3 py-1 rounded text-xs font-extrabold tracking-wide uppercase bg-jade/20 text-jade border border-jade/40">
                  OFFICIAL ACADEMIC TRANSCRIPT
                </div>
                <div className="text-xs text-ink font-mono font-bold">
                  Transcript Ref: {data.transcriptNumber}
                </div>
                <div className="text-[11px] text-ink-faint font-mono">Issued: {data.issueDate}</div>
              </div>
            </div>

            {/* Student & Degree Audit Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">
                  Student Identification
                </span>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Full Name:</span>
                  <span className="text-white font-semibold">{data.studentName}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-ink-faint">Student ID:</span>
                  <span className="text-jade font-bold">{data.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Program:</span>
                  <span className="text-white font-medium">{data.programTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Department:</span>
                  <span className="text-ink">{data.department}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">
                  Academic Degree Audit
                </span>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Cumulative CGPA:</span>
                  <span className="font-mono font-bold text-jade text-sm">{data.cgpa.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-ink-faint">Credits Completed:</span>
                  <span className="text-white font-bold">{data.creditsCompleted} / {data.totalDegreeCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Academic Standing:</span>
                  <span className="text-jade font-semibold">{data.academicStanding}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-ink-faint">Medium of Instruction:</span>
                  <span className="text-ink">{data.mediumOfInstruction}</span>
                </div>
              </div>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Cumulative CGPA
                </span>
                <span className="text-xl font-extrabold font-mono text-jade">
                  {data.cgpa.toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Earned Credits
                </span>
                <span className="text-xl font-extrabold font-mono text-white">
                  {data.creditsCompleted}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Completed Terms
                </span>
                <span className="text-xl font-extrabold font-mono text-marigold">
                  {data.terms.filter((t) => t.status === "completed").length}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 text-center">
                <span className="text-[10px] text-ink-faint uppercase font-bold block">
                  Status
                </span>
                <span className="text-xs font-extrabold text-jade mt-1 block">
                  REGULAR · IN GOOD STANDING
                </span>
              </div>
            </div>

            {/* Term-by-Term Course Tables */}
            <div className="space-y-4 my-6">
              {completedTerms.map((term) => (
                <div key={term.semesterNumber} className="border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-white/5 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white uppercase tracking-wider">
                        {term.semesterTitle}
                      </span>
                      <span className="text-[11px] text-ink-faint font-mono">
                        ({term.totalCredits} Credits)
                      </span>
                    </div>

                    <div className="text-xs font-mono font-bold text-jade">
                      {term.status === "completed" ? `Term GPA: ${term.gpa.toFixed(2)}` : "In Progress"}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                      <thead>
                        <tr className="bg-white/[0.02] text-[10px] uppercase font-bold text-ink-faint border-b border-white/5">
                          <th className="px-3.5 py-2">Code</th>
                          <th className="px-3.5 py-2">Course Title</th>
                          <th className="px-3 py-2 text-center">Credits</th>
                          <th className="px-3.5 py-2 text-center">Grade</th>
                          <th className="px-3.5 py-2 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-xs">
                        {term.courses.map((c) => (
                          <tr key={c.code} className="hover:bg-white/[0.015]">
                            <td className="px-3.5 py-2 font-bold text-jade">{c.code}</td>
                            <td className="px-3.5 py-2 font-sans font-medium text-ink">{c.title}</td>
                            <td className="px-3 py-2 text-center text-ink">{c.credits}</td>
                            <td className="px-3.5 py-2 text-center text-jade font-bold">{c.grade}</td>
                            <td className="px-3.5 py-2 text-right text-ink font-bold">{c.point.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Grading Scale Key Legend */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block">
                Standard Grading Scale Key (UGC Accredited 4.00 System)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                {GRADING_SCALE_LEGEND.map((l) => (
                  <div key={l.grade} className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex justify-between">
                    <span className="text-jade font-bold">{l.grade} ({l.point})</span>
                    <span className="text-ink-faint">{l.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Signatures Block */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="h-10 flex items-end justify-center font-mono text-[11px] text-ink-faint/60">
                  Digitally Verified
                </div>
                <div className="border-t border-white/20 pt-1 text-[11px] font-semibold text-ink-faint">
                  Prepared & Verified By
                </div>
              </div>

              <div>
                <div className="h-10 flex items-end justify-center font-mono text-[11px] text-jade font-bold">
                  ✓ SEAL CERTIFIED
                </div>
                <div className="border-t border-white/20 pt-1 text-[11px] font-semibold text-ink-faint">
                  Official University Seal
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
            <span>Cryptographic Digital Signature · 256-bit SHA Certified Transcript</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportTranscriptAsPdf(data)}
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
