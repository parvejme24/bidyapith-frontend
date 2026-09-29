"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useApp } from "@/lib/app-context";
import { CertificateView } from "@/components/dashboard/student/certificate/certificate-view";
import { GraduationAudit } from "@/components/dashboard/student/certificate/graduation-audit";

export default function StudentCertificatePage() {
  const { student, user, graduationCertificate, currentProgram, invoices } = useApp();
  const [activeTab, setActiveTab] = useState<"certificate" | "audit">("certificate");
  const [simulatedUnlocked, setSimulatedUnlocked] = useState<boolean>(false);

  // Criteria 1: All Semesters Completed (140 / 140 credits)
  const isSemestersComplete = simulatedUnlocked || student.creditsDone >= student.creditsNeeded;

  // Criteria 2: Total Payment Completed (No outstanding tuition dues)
  const unpaidInvoices = invoices?.filter((inv) => inv.status !== "paid") || [];
  const isPaymentComplete = simulatedUnlocked || unpaidInvoices.length === 0;
  const totalDue = simulatedUnlocked ? 0 : unpaidInvoices.reduce((sum, i) => sum + i.amount, 0);

  // Criteria 3: All Semester Marks Done & No Failed Courses (Passing threshold CGPA >= 2.00)
  const hasFailedCourse = student.enrolled?.some((c) => c.marks !== undefined && c.marks < 40);
  const isAcademicComplete = simulatedUnlocked || (student.cgpa >= 2.0 && !hasFailedCourse);

  // Certificate is unlocked only when all 3 conditions are satisfied
  const isEligible = isSemestersComplete && isPaymentComplete && isAcademicComplete;
  const isLocked = !isEligible;

  const cert = {
    certificateNumber: graduationCertificate?.certificateNumber || "BU-2026-DEG-884920",
    studentName: user.name,
    studentId: user.id,
    programTitle: user.program || currentProgram?.title || "Bachelor of Science in Computer Science & Engineering",
    degreeType: currentProgram?.degreeType || "Bachelor of Science",
    cgpa: student.cgpa,
    creditsCompleted: isSemestersComplete ? student.creditsNeeded : student.creditsDone,
    honors: student.cgpa >= 3.75 ? "Summa Cum Laude (Highest Distinction)" : "Good Standing",
    graduationDate: "September 25, 2026",
    issueDate: "September 28, 2026",
    chancellorName: "Prof. Dr. M. Shamsul Alam",
    registrarName: "Sabina Yeasmin",
    verificationHash: "0x8f2d4e7a91c3b5d2e0f81a74c6e93b1d5a7f2e4c",
  };

  const handleSimulateUnlock = () => {
    setSimulatedUnlocked(true);
    toast.success("Simulated full graduation clearance! Degree certificate is now unlocked and visible.");
  };

  return (
    <DashboardLayout
      requiredRole="student"
      title="Graduation & Degree Certificate"
      subtitle={
        isLocked
          ? `${cert.programTitle} · Degree Clearance in Progress (${[isSemestersComplete, isPaymentComplete, isAcademicComplete].filter(Boolean).length}/3 Criteria Met)`
          : `${cert.programTitle} · Graduated & Fully Cleared (${cert.graduationDate})`
      }
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
        <CertificateView
          certificate={cert}
          isLocked={isLocked}
          isSemestersComplete={isSemestersComplete}
          isPaymentComplete={isPaymentComplete}
          isAcademicComplete={isAcademicComplete}
          creditsDone={isSemestersComplete ? student.creditsNeeded : student.creditsDone}
          creditsNeeded={student.creditsNeeded}
          totalDue={totalDue}
          onViewAudit={() => setActiveTab("audit")}
          onSimulateUnlock={handleSimulateUnlock}
        />
      ) : (
        <GraduationAudit
          creditsDone={isSemestersComplete ? student.creditsNeeded : student.creditsDone}
          creditsNeeded={student.creditsNeeded}
          cgpa={student.cgpa}
          programTitle={cert.programTitle}
          isGraduated={!isLocked}
          onViewCertificate={() => setActiveTab("certificate")}
        />
      )}
    </DashboardLayout>
  );
}
