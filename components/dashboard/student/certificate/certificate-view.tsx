"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import type { GraduationCertificate } from "@/lib/app-types";
import { generateCertificateHtml } from "./certificate-print-template";
import { CertificateStatusBanner } from "./certificate-status-banner";
import { CertificatePreviewCard } from "./certificate-preview-card";

interface CertificateViewProps {
  certificate: GraduationCertificate;
  isLocked?: boolean;
  onViewAudit?: () => void;
}

export function CertificateView({
  certificate,
  isLocked = true,
  onViewAudit,
}: CertificateViewProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (isLocked) {
      toast.error("Degree Certificate is locked until graduation and clearances are completed.");
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
    <div className="space-y-6">
      {/* Action and Download Banner */}
      <CertificateStatusBanner isLocked={isLocked} onDownload={handleDownload} />

      {/* Official Certificate Paper Document */}
      <CertificatePreviewCard
        certificate={certificate}
        isLocked={isLocked}
        onViewAudit={onViewAudit}
        certRef={certRef}
      />
    </div>
  );
}
