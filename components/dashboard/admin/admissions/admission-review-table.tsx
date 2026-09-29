"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import {
  useGetAdmissionsQuery,
  useApproveAdmissionMutation,
  useRejectAdmissionMutation,
} from "@/lib/redux/api/admissionsApi";
import type { AdmissionApplication } from "@/lib/app-types";
import { AdmissionFilterTabs } from "./admission-filter-tabs";
import { AdmissionTableRow } from "./admission-table-row";
import { AdmissionDocumentModal } from "./admission-document-modal";

export function AdmissionReviewTable() {
  const { admissionApplications, approveAdmission, rejectAdmission } = useApp();
  const { data: dbAdmissionsRes } = useGetAdmissionsQuery();
  const [approveAdmissionApi] = useApproveAdmissionMutation();
  const [rejectAdmissionApi] = useRejectAdmissionMutation();

  const [selectedAppForDocs, setSelectedAppForDocs] = useState<AdmissionApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING_REVIEW" | "APPROVED" | "ENROLLED" | "REJECTED">("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "COURSE_REGISTRATION" | "DEGREE_ADMISSION">("ALL");

  const applicationsList: AdmissionApplication[] =
    dbAdmissionsRes?.data && dbAdmissionsRes.data.length > 0
      ? dbAdmissionsRes.data
      : admissionApplications;

  const filteredApps = applicationsList.filter((a) => {
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesType =
      typeFilter === "ALL" ||
      (typeFilter === "COURSE_REGISTRATION" && (a.applicationType === "COURSE_REGISTRATION" || Boolean(a.courseCode))) ||
      (typeFilter === "DEGREE_ADMISSION" && a.applicationType !== "COURSE_REGISTRATION" && !a.courseCode);
    return matchesStatus && matchesType;
  });

  const pendingCount = applicationsList.filter((a) => a.status === "PENDING_REVIEW").length;
  const approvedCount = applicationsList.filter((a) => a.status === "APPROVED").length;
  const enrolledCount = applicationsList.filter((a) => a.status === "ENROLLED").length;
  const courseAppsCount = applicationsList.filter((a) => a.applicationType === "COURSE_REGISTRATION" || Boolean(a.courseCode)).length;

  const handleApprove = async (app: AdmissionApplication) => {
    try {
      await approveAdmissionApi(app.id).unwrap();
    } catch {
      approveAdmission(app.id);
    }

    const targetName = app.courseCode || app.programTitle || "Course";
    const studentEmail = app.email || app.studentEmail || "student@bidyapith.edu.bd";

    toast.success(
      <div className="space-y-1">
        <p className="font-bold">✓ Application #{app.id} Verified & Approved</p>
        <p className="text-[11px] text-ink-muted">
          📧 Simulated Email sent to <b>{studentEmail}</b>: &ldquo;Your academic documents for {targetName} are verified. Proceed to pay tuition.&rdquo;
        </p>
      </div>,
      { duration: 6000 }
    );
  };

  const handleReject = async (app: AdmissionApplication) => {
    try {
      await rejectAdmissionApi(app.id).unwrap();
    } catch {
      rejectAdmission(app.id);
    }
    toast.error(`Application #${app.id} marked as Rejected.`);
  };

  return (
    <div className="space-y-5">
      {/* Filters Bar */}
      <AdmissionFilterTabs
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        totalCount={applicationsList.length}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        enrolledCount={enrolledCount}
        courseAppsCount={courseAppsCount}
      />

      {/* Applications Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">Applicant Profile</th>
                <th className="px-4 py-3">Target Offering / Course</th>
                <th className="px-4 py-3">Academic GPA & Standing</th>
                <th className="px-4 py-3">Documents</th>
                <th className="px-4 py-3">Tuition Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-faint font-sans">
                    No applications match the current filter selection.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <AdmissionTableRow
                    key={app.id}
                    app={app}
                    onOpenDocs={setSelectedAppForDocs}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Document Inspector Modal for Admin */}
      {selectedAppForDocs && (
        <AdmissionDocumentModal
          app={selectedAppForDocs}
          onClose={() => setSelectedAppForDocs(null)}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
}
