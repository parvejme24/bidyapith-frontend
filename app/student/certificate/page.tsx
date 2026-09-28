"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useApp } from "@/lib/app-context";
import { CertificateView } from "@/components/dashboard/student/certificate/certificate-view";
import { GraduationAudit } from "@/components/dashboard/student/certificate/graduation-audit";

export default function StudentCertificatePage() {
  const { student, user, graduationCertificate, currentProgram } = useApp();
  const [activeTab, setActiveTab] = useState<"certificate" | "audit">("certificate");

  const cert = graduationCertificate || {
    certificateNumber: "BU-2026-DEG-884920",
    studentName: user.name,
    studentId: user.id,
    programTitle: user.program || currentProgram?.title || "Bachelor of Science in Computer Science & Engineering",
    degreeType: currentProgram?.degreeType || "Bachelor of Science",
    cgpa: student.cgpa,
    creditsCompleted: 140,
    honors: student.cgpa >= 3.75 ? "Summa Cum Laude (Highest Distinction)" : "Good Standing",
    graduationDate: "September 25, 2026",
    issueDate: "September 28, 2026",
    chancellorName: "Prof. Dr. M. Shamsul Alam",
    registrarName: "Sabina Yeasmin",
    verificationHash: "0x8f2d4e7a91c3b5d2e0f81a74c6e93b1d5a7f2e4c",
  };

  return (
    <DashboardLayout
      requiredRole="student"
      title="Graduation & Degree Certificate"
      subtitle={`${cert.programTitle} · Graduated ${cert.graduationDate}`}
      crumb="Student / Degree Certificate"
      actions={
        <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-white/[0.04] print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab("certificate")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "certificate"
                ? "bg-jade text-night-900 font-bold shadow-xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Digital Certificate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "audit"
                ? "bg-jade text-night-900 font-bold shadow-xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Graduation Audit
          </button>
        </div>
      }
    >
      {activeTab === "certificate" ? (
        <CertificateView certificate={cert} />
      ) : (
        <GraduationAudit
          creditsDone={student.creditsDone}
          creditsNeeded={student.creditsNeeded}
          cgpa={student.cgpa}
          programTitle={cert.programTitle}
          isGraduated={true}
          onViewCertificate={() => setActiveTab("certificate")}
        />
      )}
    </DashboardLayout>
  );
}
