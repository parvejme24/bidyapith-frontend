"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RegistrationView } from "@/components/dashboard/student/registration-view";
import { useApp } from "@/lib/app-context";
import { formatShortDate } from "@/lib/format";

export default function StudentRegistrationPage() {
  const { term } = useApp();

  return (
    <DashboardLayout
      title="Course Registration"
      subtitle={`${term.name} · Window closes ${formatShortDate(term.regCloses)}`}
      requiredRole="student"
      crumb="Student / Registration"
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-marigold/15 border border-marigold/30 text-[#FFD9A6]">
          <span className="size-2 rounded-full bg-marigold animate-pulse" />
          Registration Open
        </span>
      }
    >
      <RegistrationView />
    </DashboardLayout>
  );
}
