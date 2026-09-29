"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { GlassCard } from "@/components/site/glass-card";
import { DataTable } from "@/components/dashboard/data-table";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle2, GraduationCap, Sparkles } from "lucide-react";

import { UNIVERSITY_GRADES_DATASET } from "@/components/dashboard/admin/results/results-dataset";
import { ResultsMetricCards } from "@/components/dashboard/admin/results/results-metric-cards";
import { getResultsColumns } from "@/components/dashboard/admin/results/results-columns";
import { ResultsStudentTranscriptModal } from "@/components/dashboard/admin/results/results-student-transcript-modal";
import { ResultsHistoricalTab } from "@/components/dashboard/admin/results/results-historical-tab";
import { ResultsAnalyticsTab } from "@/components/dashboard/admin/results/results-analytics-tab";

export default function AdminResultsPage() {
  const [activeTab, setActiveTab] = useState<"monitor" | "transcripts" | "analytics">("monitor");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");

  // Transcript inspection state
  const [inspectStudentModalOpen, setInspectStudentModalOpen] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<{ id: string; name: string } | null>(null);

  // Filtered Grade Records
  const filteredRecords = useMemo(() => {
    return UNIVERSITY_GRADES_DATASET.filter((record) => {
      const matchDept = selectedDept === "all" || record.department.toLowerCase() === selectedDept.toLowerCase();
      const matchStatus = selectedStatus === "all" || record.status === selectedStatus;
      const matchTerm = selectedTerm === "all" || record.term === selectedTerm;
      return matchDept && matchStatus && matchTerm;
    });
  }, [selectedDept, selectedStatus, selectedTerm]);

  // Overall Statistics
  const totalSubmissions = UNIVERSITY_GRADES_DATASET.length;
  const publishedCount = UNIVERSITY_GRADES_DATASET.filter((r) => r.status === "published").length;
  const avgGpa = (
    UNIVERSITY_GRADES_DATASET.reduce((acc, r) => acc + r.gradePoint, 0) / totalSubmissions
  ).toFixed(2);
  const passRate = (
    (UNIVERSITY_GRADES_DATASET.filter((r) => r.gradePoint >= 2.0).length / totalSubmissions) *
    100
  ).toFixed(1);

  const handlePublishAll = () => {
    toast.success("All submitted grade sheets approved and published to student portals!");
  };

  const handleInspectTranscript = (studentId: string, studentName: string) => {
    setInspectedStudent({ id: studentId, name: studentName });
    setInspectStudentModalOpen(true);
  };

  const columns = useMemo(() => {
    return getResultsColumns({ onInspectTranscript: handleInspectTranscript });
  }, []);

  return (
    <DashboardLayout
      requiredRole="admin"
      title="Results & Grade Monitoring Hub"
      subtitle="University-wide examination ledger, marks audit, and CGPA transcripts"
      crumb="Administrator / Academic Management"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePublishAll}
            className={cn(
              buttonClass({ variant: "primary", size: "sm" }),
              "text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            )}
          >
            <CheckCircle2 className="size-3.5" />
            <span>Approve & Publish Results</span>
          </button>
        </div>
      }
    >
      {/* Metric Overview Cards */}
      <ResultsMetricCards
        totalSubmissions={totalSubmissions}
        publishedCount={publishedCount}
        avgGpa={avgGpa}
        passRate={passRate}
      />

      {/* Main Tabbed Interface */}
      <GlassCard className="p-4 md:p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center p-0.5 rounded-xl border border-white/10 bg-white/[0.04] overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("monitor")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                activeTab === "monitor"
                  ? "bg-jade text-night-900 font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <BookOpen className="size-3.5" />
              <span>Section Marks Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("transcripts")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                activeTab === "transcripts"
                  ? "bg-jade text-night-900 font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <GraduationCap className="size-3.5" />
              <span>Historical Transcripts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                activeTab === "analytics"
                  ? "bg-jade text-night-900 font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Sparkles className="size-3.5" />
              <span>Grade Distributions</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1.5 text-xs text-ink outline-none cursor-pointer focus:border-jade"
            >
              <option value="all" className="bg-night-900">All Departments</option>
              <option value="cse" className="bg-night-900">Computer Science (CSE)</option>
              <option value="eee" className="bg-night-900">Electrical Eng (EEE)</option>
              <option value="bba" className="bg-night-900">Business (BBA)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1.5 text-xs text-ink outline-none cursor-pointer focus:border-jade"
            >
              <option value="all" className="bg-night-900">All Statuses</option>
              <option value="published" className="bg-night-900">Published</option>
              <option value="submitted" className="bg-night-900">Submitted</option>
            </select>
          </div>
        </div>

        {/* Tab 1: Live Marks Table */}
        {activeTab === "monitor" && (
          <DataTable
            columns={columns}
            data={filteredRecords}
            searchKeys={["studentName", "studentId", "courseCode", "instructorName"]}
            searchPlaceholder="Search by student, ID, course code, instructor..."
            pageSize={10}
          />
        )}

        {/* Tab 2: Historical Transcripts Explorer */}
        {activeTab === "transcripts" && (
          <ResultsHistoricalTab onInspectStudent={handleInspectTranscript} />
        )}

        {/* Tab 3: University Analytics & Grade Breakdown */}
        {activeTab === "analytics" && <ResultsAnalyticsTab />}
      </GlassCard>

      {/* Transcript Inspection Dialog */}
      <ResultsStudentTranscriptModal
        open={inspectStudentModalOpen}
        onOpenChange={setInspectStudentModalOpen}
        student={inspectedStudent}
      />
    </DashboardLayout>
  );
}
