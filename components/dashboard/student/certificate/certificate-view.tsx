"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import type { GraduationCertificate } from "@/lib/app-types";
import { generateCertificateHtml } from "./certificate-print-template";
import { downloadCertificatePng } from "./certificate-png-exporter";
import { CertificateStatusBanner } from "./certificate-status-banner";
import { CertificatePreviewCard } from "./certificate-preview-card";

interface CertificateViewProps {
  certificate: GraduationCertificate;
  isLocked?: boolean;
  isSemestersComplete?: boolean;
  isPaymentComplete?: boolean;
  isAcademicComplete?: boolean;
  creditsDone?: number;
  creditsNeeded?: number;
  totalDue?: number;
  onViewAudit?: () => void;
  onSimulateUnlock?: () => void;
}

export function CertificateView({
  certificate,
  isLocked = true,
  isSemestersComplete = false,
  isPaymentComplete = false,
  isAcademicComplete = false,
  creditsDone = 96,
  creditsNeeded = 140,
  totalDue = 0,
  onViewAudit,
  onSimulateUnlock,
}: CertificateViewProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (isLocked) {
      toast.error("Degree Certificate is locked until all semester requirements and payments are completed.");
      return;
    }
    try {
      await downloadCertificatePng(certificate);
      toast.success("Degree Certificate downloaded successfully in PNG format!");
    } catch {
      toast.error("Failed to generate PNG certificate image. Please try again.");
    }
  };

  const handleDownloadPdf = () => {
    if (isLocked) {
      toast.error("Degree Certificate is locked until all semester requirements and payments are completed.");
      return;
    }
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Please allow popups to download the official PDF certificate");
        return;
      }

      const certificateHtml = generateCertificateHtml(certificate);
      printWindow.document.open();
      printWindow.document.write(certificateHtml);
      printWindow.document.close();
    } catch {
      toast.error("Failed to generate printable certificate. Please try again.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Action and Download Banner */}
      <CertificateStatusBanner
        isLocked={isLocked}
        onDownloadPng={handleDownloadPng}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Official Certificate Paper Document */}
      <CertificatePreviewCard
        certificate={certificate}
        isLocked={isLocked}
        isSemestersComplete={isSemestersComplete}
        isPaymentComplete={isPaymentComplete}
        isAcademicComplete={isAcademicComplete}
        creditsDone={creditsDone}
        creditsNeeded={creditsNeeded}
        totalDue={totalDue}
        onViewAudit={onViewAudit}
        onSimulateUnlock={onSimulateUnlock}
        certRef={certRef}
      />
    </div>
  );
}
