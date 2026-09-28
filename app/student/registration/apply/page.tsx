"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CourseApplicationForm } from "@/components/dashboard/student/registration/course-application-form";

function CourseApplyContent() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get("courseCode") || "CSE-4108";

  return <CourseApplicationForm courseCode={courseCode} />;
}

export default function CourseApplyPage() {
  return (
    <DashboardLayout
      title="Course Registration & Academic Admission"
      subtitle="Submit academic credentials & transcripts for faculty review and enrollment verification"
      requiredRole="student"
      crumb="Student / Registration / Apply"
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-jade/15 border border-jade/30 text-jade">
          <span className="size-2 rounded-full bg-jade animate-pulse" />
          Document Verification Mode
        </span>
      }
    >
      <Suspense
        fallback={
          <div className="py-20 text-center text-ink-faint text-xs font-mono">
            Loading Course Application Form...
          </div>
        }
      >
        <CourseApplyContent />
      </Suspense>
    </DashboardLayout>
  );
}
