"use client";

import React from "react";

interface HistoricalStudentItem {
  id: string;
  name: string;
  dept: string;
  cgpa: string;
  earned: string;
}

const SAMPLE_HISTORICAL_STUDENTS: HistoricalStudentItem[] = [
  { id: "2024-BSC-CSE-1001", name: "Rafiul Karim", dept: "CSE", cgpa: "3.82", earned: "96 Cr" },
  { id: "2024-BSC-CSE-1002", name: "Ayesha Ahmed", dept: "CSE", cgpa: "3.75", earned: "96 Cr" },
  { id: "2024-BSC-CSE-1004", name: "Sabina Hossain", dept: "CSE", cgpa: "3.90", earned: "96 Cr" },
  { id: "2024-BSC-EEE-1011", name: "Rezaul Karim", dept: "EEE", cgpa: "3.65", earned: "92 Cr" },
  { id: "2024-BBA-GEN-1020", name: "Anisur Rahman", dept: "BBA", cgpa: "3.88", earned: "90 Cr" },
];

interface ResultsHistoricalTabProps {
  onInspectStudent: (studentId: string, studentName: string) => void;
}

export function ResultsHistoricalTab({ onInspectStudent }: ResultsHistoricalTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
        <p className="text-xs font-semibold text-ink-muted mb-3">
          Select a student below to inspect their full multi-term CGPA transcript & academic record:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_HISTORICAL_STUDENTS.map((st) => (
            <div
              key={st.id}
              onClick={() => onInspectStudent(st.id, st.name)}
              className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-jade/40 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-sm text-ink">{st.name}</p>
                <p className="text-xs text-ink-faint font-mono">{st.id} · {st.dept}</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-jade">{st.cgpa}</span>
                <p className="text-[0.68rem] text-ink-muted">{st.earned}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
